// app/api/profiles/[id]/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    
    // Await the params as it's a Promise in Next.js 15
    const { id: profileId } = await params;

    if (!profileId) {
      return NextResponse.json(
        { error: "Profile ID is required" },
        { status: 400 }
      );
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, username, avatar_url, bio, created_at, updated_at, last_login_at, is_admin")
      .eq("id", profileId)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: error.code === "PGRST116" ? 404 : 500 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    
    // Await the params as it's a Promise in Next.js 15
    const { id: profileId } = await params;
    
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const requestBody = await request.json();
    
    // Validate and sanitize input
    const { username, bio } = requestBody;
    const updateData: { username?: string; bio?: string } = {};
    
    if (username !== undefined) {
      // Add username validation if needed
      updateData.username = username;
    }
    
    if (bio !== undefined) {
      updateData.bio = bio;
    }
    
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }
    
    // Update the profile - RLS will enforce that the user can only update their own profile
    const { data: updatedProfile, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", profileId)
      .select()
      .single();
    
    if (error) {
      // This will include permission errors already handled by RLS
      return NextResponse.json(
        { error: error.message },
        { status: error.code === "42501" ? 403 : 500 }
      );
    }
    
    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}