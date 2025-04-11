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
    
    // Get creator profiles
    const creatorIds = Array.from(new Set(filteredRecipes.map(recipe => recipe.creator_id)));
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .in('id', creatorIds);
    
    // Create a map of creator profiles
    const creatorMap = new Map(profiles?.map(profile => [profile.id, profile]) || []);
    
    // Transform the data to flatten the nested structure and add creator info
    const transformedRecipes = filteredRecipes.map(recipe => ({
      ...recipe,
      tags: recipe.tags?.map(rt => rt.tag) || [],
      creator: creatorMap.get(recipe.creator_id) || null
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

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const currentUserId = user?.id;

        //If user is not authenticated, return error
        if (!currentUserId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, description, servings, prep_time_minutes, cook_time_minutes, difficulty, is_private, is_verified, tag_ids, recipe_ingredients, recipe_steps } = await request.json();
        
        const { data: recipeData, error: recipeError } = await supabase
            .from("recipes")
            .insert({
                title,
                description,
                servings,
                prep_time_minutes,
                cook_time_minutes,
                difficulty,
                is_private,
                is_verified,
                //user_id is automatically added by the schema, using auth.uid()
                image_url: null,
                version: 1,
                branch_name: null, //Null is default for new recipies and is equivalent to 'main'
            })
            .select()
            .single();

        if (recipeError) {
            throw recipeError;
        }

        const recipeId = recipeData.id;

        //Inserting Recipe Tags
        if (tag_ids && tag_ids.length > 0) {
            const { error: tagError } = await supabase
                .from("recipe_tags")
                .insert(tag_ids.map((tag_id: string) => ({
                    recipe_id: recipeId,
                    tag_id,
                    })));

            if (tagError) {
                throw tagError;
            }
        }

        //Inserting Recipe Ingredients
        if (recipe_ingredients && recipe_ingredients.length > 0) {
            const { error: ingredientError } = await supabase
                .from("recipe_ingredients")
                .insert(recipe_ingredients.map((ingredient: any) => ({
                    recipe_id: recipeId,
                    name: ingredient.name,
                    quantity: ingredient.quantity,
                    unit_id: ingredient.unit_id,
                    notes: ingredient.notes,
                    is_optional: ingredient.is_optional,
                    display_order: ingredient.display_order || null,
                    ingredient_url: ingredient.ingredient_url || null,
                    alternative_ingredient_id: ingredient.alternative_ingredient_id || null,
                    })));

            if (ingredientError) {
                throw ingredientError;
            }
        }

        //Inserting Recipe Steps
        if (recipe_steps && recipe_steps.length > 0) {
            const { error: stepError } = await supabase
                .from("recipe_steps")
                .insert(recipe_steps.map((step: any) => ({
                    recipe_id: recipeId,
                    step_number: step.step_number,
                    instruction: step.instruction,
                    image_url: step.image_url || null,
                    timer_minutes: step.timer_minutes || null,
                    })));
            
            if (stepError) {
                throw stepError;
            }
        }




        return NextResponse.json({
            message: "Recipe created successfully",
            recipe_id: recipeId,
        }, { status: 201 });    
    } catch (error) {
        console.error("Error creating recipe:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred during recipe creation via API" },
            { status: 500 }
        );
    }
}
