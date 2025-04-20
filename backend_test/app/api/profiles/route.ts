// app/api/profiles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withProtectedRoute, parseQueryParams, createPaginatedResponse } from "@/lib/api/middleware";
import { ProfileService } from "@/lib/api/services";

export const GET = withProtectedRoute(async (req: NextRequest, { supabase, user }) => {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username") || undefined;
  const isAdmin = searchParams.get("is_admin") === "true";
  const isPrivate = searchParams.get("is_private") === "true";
  const { limit, offset, sortBy, order } = parseQueryParams(searchParams);

  const profileService = new ProfileService(supabase);
  const { data: profiles, count } = await profileService.listProfiles({
    username,
    isAdmin,
    isPrivate,
    limit,
    offset,
    sortBy,
    order: order as 'asc' | 'desc'
  });

  // Filter out private profiles that don't belong to the current user
  const filteredProfiles = profiles?.filter(profile => 
    !profile.is_private || profile.id === user?.id
  ) || [];

  return NextResponse.json(
    createPaginatedResponse(filteredProfiles, count || 0, { limit, offset })
  );
});
