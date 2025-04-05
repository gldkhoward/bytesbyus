// app/api/profiles/[id]/recipes/route.ts
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
    
    // Get the current authenticated user to handle visibility of private recipes
    const { data: { user } } = await supabase.auth.getUser();
    const isOwnProfile = user?.id === profileId;
    
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sort = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") || "desc";
    
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
    
    // Build the query - select recipes where creator_id equals the profileId
    let query = supabase
      .from("recipes")
      .select(`
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
      `)
      .eq("creator_id", profileId)
      .order(sort, { ascending: order === "asc" })
      .limit(limit)
      .range(offset, offset + limit - 1);
    
    // Only show non-private recipes unless user is viewing their own profile
    if (!isOwnProfile) {
      query = query.eq("is_private", false);
    }
    
    const { data: recipes, error, count } = await query;
    
    if (error) {
      console.error("Error fetching recipes:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    // Get tags for each recipe
    if (recipes && recipes.length > 0) {
      // Get all recipe IDs
      const recipeIds = recipes.map(recipe => recipe.id);
      
      // Fetch tags for all recipes in one query
      const { data: recipeTags, error: tagsError } = await supabase
        .from("recipe_tags")
        .select(`
          recipe_id,
          tag_id,
          tags (
            id,
            name
          )
        `)
        .in("recipe_id", recipeIds);
      
      if (tagsError) {
        console.error("Error fetching tags:", tagsError);
      } else if (recipeTags) {
        // Group tags by recipe_id
        const tagsByRecipe: Record<string, any[]> = {};
        
        recipeTags.forEach(tagRelation => {
          const recipeId = tagRelation.recipe_id;
          if (!tagsByRecipe[recipeId]) {
            tagsByRecipe[recipeId] = [];
          }
          
          if (tagRelation.tags) {
            tagsByRecipe[recipeId].push(tagRelation.tags);
          }
        });
        
        // Add tags to each recipe
        recipes.forEach(recipe => {
          (recipe as any).tags = tagsByRecipe[recipe.id] || [];
        });
      }
    }
    
    // Also get the total count for pagination - fixed logic
    const countQuery = supabase
      .from("recipes")
      .select("id", { count: "exact", head: true })
      .eq("creator_id", profileId);

    // Only apply the privacy filter if not viewing own profile
    if (!isOwnProfile) {
      countQuery.eq("is_private", false);
    }

    const { count: totalCount, error: countError } = await countQuery;
    
    if (countError) {
      console.error("Error getting count:", countError);
    }
    
    return NextResponse.json({
      recipes,
      total: totalCount || 0,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil((totalCount || 0) / limit)
    });
  } catch (error) {
    console.error("Error fetching user recipes:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}