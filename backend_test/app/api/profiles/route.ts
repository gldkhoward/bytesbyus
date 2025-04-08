// app/api/profiles/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const isAdmin = searchParams.get("is_admin");
    const isPrivate = searchParams.get("is_private");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sortBy = searchParams.get("sort_by") || "created_at";
    const order = searchParams.get("order") || "desc";
    
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = user?.id;
    
    // Build the query
    let query = supabase
      .from("profiles")
      .select(`
        id,
        username,
        avatar_url,
        bio,
        created_at,
        updated_at,
        last_login_at,
        is_admin,
        is_private
      `, { count: "exact" });
    
    // Apply filters
    if (username) {
      query = query.ilike("username", `%${username}%`);
    }
    
    if (isAdmin !== null) {
      query = query.eq("is_admin", isAdmin === "true");
    }
    
    if (isPrivate !== null) {
      query = query.eq("is_private", isPrivate === "true");
    }
    
    // Apply sorting and pagination
    query = query
      .order(sortBy, { ascending: order === "asc" })
      .range(offset, offset + limit - 1);
    
    // Execute the query
    const { data: profiles, error, count } = await query;
    
    if (error) {
      console.error("Error fetching profiles:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    // Filter out private profiles that don't belong to the current user
    const filteredProfiles = profiles?.filter(profile => 
      !profile.is_private || profile.id === currentUserId
    ) || [];
    
    return NextResponse.json({
      profiles: filteredProfiles,
      total: filteredProfiles.length,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(filteredProfiles.length / limit)
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
