// app/api/profiles/[id]/stars/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    
    const { id: profileId } = await params;

    if (!profileId) {
      return NextResponse.json({ error: "Profile ID is required" }, { status: 400 });
    }
    
    // Verify the profile exists
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", profileId)
      .single();
      
    if (profileError) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }
    
    // Get the current authenticated user to handle visibility of private recipes
    const { data: { user } } = await supabase.auth.getUser();
    const isOwnProfile = user?.id === profileId;
    
    // Get URL parameters for pagination
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");
    
    // Fetch starred recipes
    const { data: starredRecipes, error, count } = await supabase
      .from("recipe_stars")
      .select(`
        recipe_id,
        created_at,
        recipes (
          id,
          title,
          description,
          image_url,
          servings,
          prep_time_minutes,
          cook_time_minutes,
          difficulty,
          is_private,
          created_at,
          updated_at,
          version,
          is_verified,
          creator_id
        )
      `)
      .eq("user_id", profileId)
      .order("created_at", { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching stars:", error);
      return NextResponse.json({ error: "Failed to fetch starred recipes" }, { status: 500 });
    }
    
    // Filter out private recipes that don't belong to the requesting user
    const filteredRecipes = starredRecipes
      .filter(item => {
        // Each item has a recipes property which is an object, not an array
        const recipe = item.recipes as any;
        return !recipe.is_private || 
               isOwnProfile || 
               (user && recipe.creator_id === user.id);
      })
      .map(item => ({
        ...item.recipes,
        starred_at: item.created_at
      }));
    
    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from("recipe_stars")
      .select("recipe_id", { count: "exact", head: true })
      .eq("user_id", profileId);
    
    if (countError) {
      console.error("Error getting count:", countError);
    }
    
    return NextResponse.json({
      recipes: filteredRecipes,
      total: totalCount || 0,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil((totalCount || 0) / limit)
    });
  } catch (error) {
    console.error("Error fetching starred recipes:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}


