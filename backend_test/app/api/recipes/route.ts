import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title");
    const description = searchParams.get("description");
    const difficulty = searchParams.get("difficulty");
    const isPrivate = searchParams.get("is_private");
    const isVerified = searchParams.get("is_verified");
    const creatorId = searchParams.get("creator_id");
    const tagIds = searchParams.get("tag_ids")?.split(",");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sortBy = searchParams.get("sort_by") || "created_at";
    const order = searchParams.get("order") || "desc";
    
    // Get the current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = user?.id;
    
    // Build the query
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
        creator_id,
        creator:profiles (
          id,
          username,
          avatar_url
        ),
        tags:recipe_tags (
          tag:tags (
            id,
            name
          )
        )
      `, { count: "exact" });
    
    // Apply filters
    if (title) {
      query = query.ilike("title", `%${title}%`);
    }
    
    if (description) {
      query = query.ilike("description", `%${description}%`);
    }
    
    if (difficulty) {
      query = query.eq("difficulty", difficulty);
    }
    
    if (isPrivate !== null) {
      query = query.eq("is_private", isPrivate === "true");
    }
    
    if (isVerified !== null) {
      query = query.eq("is_verified", isVerified === "true");
    }
    
    if (creatorId) {
      query = query.eq("creator_id", creatorId);
    }
    
    if (tagIds && tagIds.length > 0) {
      // First get recipe IDs that have all the specified tags using raw SQL
      const { data: recipeIds } = await supabase.rpc('get_recipes_with_all_tags', {
        tag_ids: tagIds
      });
      
      if (recipeIds && recipeIds.length > 0) {
        query = query.in("id", recipeIds);
      } else {
        // If no recipes found with all tags, return empty result
        return NextResponse.json({
          recipes: [],
          total: 0,
          page: 1,
          limit,
          totalPages: 0
        });
      }
    }
    
    // Apply sorting and pagination
    query = query
      .order(sortBy, { ascending: order === "asc" })
      .range(offset, offset + limit - 1);
    
    // Execute the query
    const { data: recipes, error, count } = await query;
    
    if (error) {
      console.error("Error fetching recipes:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    // Filter out private recipes that don't belong to the current user
    const filteredRecipes = recipes?.filter(recipe => 
      !recipe.is_private || recipe.creator_id === currentUserId
    ) || [];
    
    // Transform the data to flatten the nested structure
    const transformedRecipes = filteredRecipes.map(recipe => ({
      ...recipe,
      tags: recipe.tags?.map(rt => rt.tag) || [],
      creator: recipe.creator || null
    }));
    
    return NextResponse.json({
      recipes: transformedRecipes,
      total: filteredRecipes.length,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(filteredRecipes.length / limit)
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
