import { NextRequest, NextResponse } from "next/server";
import { withProtectedRoute } from "@/lib/api/middleware";
import { ProfileService } from "@/lib/api/services";
import { validateRouteParams, validateOwnership, parseRequestBody } from "@/lib/api/route-utils";

export const GET = withProtectedRoute(async (
  req: NextRequest,
  { params, supabase }
) => {
  const paramsResult = await validateRouteParams(params);
  if (!('success' in paramsResult)) return paramsResult;

  const profileService = new ProfileService(supabase);
  const profile = await profileService.getProfile(paramsResult.id);
  return NextResponse.json({ profile });
});

type ProfileUpdateBody = {
  username?: string;
  bio?: string;
};

export const PUT = withProtectedRoute(async (
  req: NextRequest,
  { params, supabase, user }
) => {
  const paramsResult = await validateRouteParams(params);
  if (!('success' in paramsResult)) return paramsResult;

  const ownershipError = validateOwnership(paramsResult.id, user?.id);
  if (ownershipError) return ownershipError;

  const bodyResult = await parseRequestBody<ProfileUpdateBody>(req);
  if (!('success' in bodyResult)) return bodyResult;

  const { username, bio } = bodyResult.data;
  const updateData: ProfileUpdateBody = {};
  
  if (username !== undefined) updateData.username = username;
  if (bio !== undefined) updateData.bio = bio;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  const profileService = new ProfileService(supabase);
  const updatedProfile = await profileService.updateProfile(paramsResult.id, updateData);
  return NextResponse.json({ profile: updatedProfile });
});