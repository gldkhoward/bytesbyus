import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { SupabaseClient } from "@supabase/supabase-js";

export type ApiContext = {
  supabase: SupabaseClient;
  user?: { id: string };
  params?: Promise<{ [key: string]: string }>;
};

export type ApiHandler = (
  req: NextRequest,
  context: ApiContext
) => Promise<NextResponse>;

export type ApiMiddleware = (handler: ApiHandler) => ApiHandler;

// Middleware to handle errors and consistent response formatting
export const withErrorHandling: ApiMiddleware = (handler) => {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error(`API Error [${req.method} ${req.url}]:`, error);
      
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation error", details: error.errors },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  };
};

// Middleware to inject Supabase client
export const withSupabase: ApiMiddleware = (handler) => {
  return async (req, context) => {
    const supabase = await createClient();
    return handler(req, { ...context, supabase });
  };
};

// Middleware to require authentication
export const withAuth: ApiMiddleware = (handler) => {
  return async (req, context) => {
    if (!context.supabase) {
      throw new Error("withAuth must be used after withSupabase");
    }

    const { data: { user } } = await context.supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return handler(req, { ...context, user: { id: user.id } });
  };
};

// Combine multiple middleware functions
export const composeMiddleware = (...middleware: ApiMiddleware[]) => {
  return (handler: ApiHandler): ApiHandler => {
    return middleware.reduceRight((next, mid) => mid(next), handler);
  };
};

// Common middleware composition for protected routes
export const withProtectedRoute = composeMiddleware(
  withErrorHandling,
  withSupabase,
  withAuth
);

// Helper for parsing query parameters
export const parseQueryParams = (searchParams: URLSearchParams) => {
  return {
    limit: parseInt(searchParams.get("limit") || "10"),
    offset: parseInt(searchParams.get("offset") || "0"),
    sortBy: searchParams.get("sort_by") || "created_at",
    order: searchParams.get("order") || "desc",
  };
};

// Helper for pagination response
export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  { limit, offset }: { limit: number; offset: number }
) => {
  return {
    data,
    total,
    page: Math.floor(offset / limit) + 1,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}; 