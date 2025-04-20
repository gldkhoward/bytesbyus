import { SupabaseClient } from '@supabase/supabase-js';
import { IngredientService } from './IngredientService';
import { StepService } from './StepService';

export class RecipeService {
    constructor(
      private supabase: SupabaseClient,
      private ingredientService: IngredientService,
      private stepService: StepService
    ) {}
  
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
    
    async getFullRecipe(id: string) {
        const recipe = await this.getRecipe(id);
        const ingredients = await this.ingredientService.getIngredientsByRecipeId(id);
        const steps = await this.stepService.getStepsByRecipeId(id);
        return { ...recipe, ingredients, steps };
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
        await this.ingredientService.createIngredients(data.recipe_ingredients);
      }
  
      if (data.recipe_steps?.length) {
        await this.stepService.createSteps(data.recipe_steps);
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