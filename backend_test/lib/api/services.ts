import { SupabaseClient } from '@supabase/supabase-js';

export class ProfileService {
  constructor(private supabase: SupabaseClient) {}

  async getProfile(id: string) {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("id, username, avatar_url, bio, created_at, updated_at, last_login_at, is_admin")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async updateProfile(id: string, data: { username?: string; bio?: string }) {
    const { data: profile, error } = await this.supabase
      .from("profiles")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return profile;
  }

  async listProfiles(options: {
    username?: string;
    isAdmin?: boolean;
    isPrivate?: boolean;
    limit: number;
    offset: number;
    sortBy: string;
    order: 'asc' | 'desc';
  }) {
    let query = this.supabase
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

    if (options.username) {
      query = query.ilike("username", `%${options.username}%`);
    }

    if (options.isAdmin !== undefined) {
      query = query.eq("is_admin", options.isAdmin);
    }

    if (options.isPrivate !== undefined) {
      query = query.eq("is_private", options.isPrivate);
    }

    const { data, error, count } = await query
      .order(options.sortBy, { ascending: options.order === "asc" })
      .range(options.offset, options.offset + options.limit - 1);

    if (error) throw error;
    return { data, count };
  }
}

export class RecipeService {
  constructor(private supabase: SupabaseClient) {}

  async getRecipe(id: string) {
    const { data, error } = await this.supabase
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
      `)
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async createRecipe(data: {
    title: string;
    description?: string;
    servings?: number;
    prep_time_minutes?: number;
    cook_time_minutes?: number;
    difficulty?: string;
    is_private?: boolean;
    is_verified?: boolean;
    tag_ids?: string[];
    recipe_ingredients?: any[];
    recipe_steps?: any[];
  }) {
    const { data: recipe, error: recipeError } = await this.supabase
      .from("recipes")
      .insert({
        title: data.title,
        description: data.description,
        servings: data.servings,
        prep_time_minutes: data.prep_time_minutes,
        cook_time_minutes: data.cook_time_minutes,
        difficulty: data.difficulty,
        is_private: data.is_private,
        is_verified: data.is_verified,
        version: 1,
      })
      .select()
      .single();

    if (recipeError) throw recipeError;

    if (data.tag_ids?.length) {
      const { error: tagError } = await this.supabase
        .from("recipe_tags")
        .insert(data.tag_ids.map(tag_id => ({
          recipe_id: recipe.id,
          tag_id,
        })));

      if (tagError) throw tagError;
    }

    if (data.recipe_ingredients?.length) {
      const { error: ingredientError } = await this.supabase
        .from("recipe_ingredients")
        .insert(data.recipe_ingredients.map(ingredient => ({
          recipe_id: recipe.id,
          ...ingredient,
        })));

      if (ingredientError) throw ingredientError;
    }

    if (data.recipe_steps?.length) {
      const { error: stepError } = await this.supabase
        .from("recipe_steps")
        .insert(data.recipe_steps.map(step => ({
          recipe_id: recipe.id,
          ...step,
        })));

      if (stepError) throw stepError;
    }

    return recipe;
  }

  async listRecipes(options: {
    title?: string;
    description?: string;
    difficulty?: string;
    isPrivate?: boolean;
    isVerified?: boolean;
    creatorId?: string;
    tagIds?: string[];
    limit: number;
    offset: number;
    sortBy: string;
    order: 'asc' | 'desc';
  }) {
    let query = this.supabase
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

    if (options.title) {
      query = query.ilike("title", `%${options.title}%`);
    }

    if (options.description) {
      query = query.ilike("description", `%${options.description}%`);
    }

    if (options.difficulty) {
      query = query.eq("difficulty", options.difficulty);
    }

    if (options.isPrivate !== undefined) {
      query = query.eq("is_private", options.isPrivate);
    }

    if (options.isVerified !== undefined) {
      query = query.eq("is_verified", options.isVerified);
    }

    if (options.creatorId) {
      query = query.eq("creator_id", options.creatorId);
    }

    if (options.tagIds?.length) {
      const { data: recipeIds } = await this.supabase.rpc('get_recipes_with_all_tags', {
        tag_ids: options.tagIds
      });
      
      if (recipeIds?.length) {
        query = query.in("id", recipeIds);
      } else {
        return { data: [], count: 0 };
      }
    }

    const { data, error, count } = await query
      .order(options.sortBy, { ascending: options.order === "asc" })
      .range(options.offset, options.offset + options.limit - 1);

    if (error) throw error;
    return { data, count };
  }
} 