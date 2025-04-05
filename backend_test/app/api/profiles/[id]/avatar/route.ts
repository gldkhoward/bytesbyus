// app/api/profiles/[id]/avatar/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

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
    
    // Check if the user is updating their own profile
    if (user.id !== profileId) {
      return NextResponse.json(
        { error: "You can only update your own profile avatar" },
        { status: 403 }
      );
    }
    
    // Check if the request is a FormData with a file
    if (!request.headers.get("content-type")?.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Avatar upload requires a multipart form with an image file" },
        { status: 400 }
      );
    }
    
    // Parse the FormData
    const formData = await request.formData();
    const avatarFile = formData.get("avatar") as File;
    
    if (!avatarFile) {
      return NextResponse.json(
        { error: "No avatar file provided" },
        { status: 400 }
      );
    }
    
    // Validate the file
    if (!avatarFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Uploaded file is not an image" },
        { status: 400 }
      );
    }
    
    // Maximum file size (2MB)
    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    if (avatarFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Avatar image must be smaller than 2MB" },
        { status: 400 }
      );
    }
    
    // Convert the File to an ArrayBuffer for upload
    const fileBuffer = await avatarFile.arrayBuffer();
    
    // Upload to Supabase Storage
    const fileName = `avatar-${profileId}-${Date.now()}`;
    const fileExtension = avatarFile.name.split('.').pop();
    const filePath = `avatars/${fileName}.${fileExtension}`;
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from("user-content")
      .upload(filePath, fileBuffer, {
        contentType: avatarFile.type,
        upsert: false
      });
    
    if (uploadError) {
      console.error("Error uploading avatar:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload avatar image" },
        { status: 500 }
      );
    }
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase
      .storage
      .from("user-content")
      .getPublicUrl(filePath);
    
    // Update the user's profile with the new avatar URL
    const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", profileId)
      .select()
      .single();
    
    if (updateError) {
      console.error("Error updating profile with avatar:", updateError);
      return NextResponse.json(
        { error: "Failed to update profile with new avatar" },
        { status: 500 }
      );
    }
    
    // If there was a previous avatar, we could delete it here to save storage
    // This would require getting the old URL first and parsing it to get the path
    
    return NextResponse.json({ 
      profile: updatedProfile,
      message: "Avatar updated successfully"
    });
  } catch (error) {
    console.error("Error updating avatar:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
