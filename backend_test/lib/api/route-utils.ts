import { NextResponse } from "next/server";
import { ApiContext } from "./middleware";

export async function validateRouteParams(params: ApiContext["params"]) {
  if (!params) {
    return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
  }

  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    return NextResponse.json({ error: "ID parameter is required" }, { status: 400 });
  }

  return { success: true, id };
}

export function validateOwnership(resourceId: string, userId?: string): NextResponse | null {
  if (resourceId !== userId) {
    return NextResponse.json(
      { error: "You can only modify your own resources" },
      { status: 403 }
    );
  }
  return null;
}

export async function parseRequestBody<T extends { [key: string]: any }>(
  request: Request,
  requiredFields: (keyof T)[] = []
): Promise<{ success: true; data: T } | NextResponse> {
  try {
    const body = await request.json() as T;
    
    // Check for required fields
    const missingFields = requiredFields.filter(field => !(field in body));
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    return { success: true, data: body };
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
} 