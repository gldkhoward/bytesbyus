import { SupabaseClient } from "@supabase/supabase-js";
import { IngredientWithUnit } from "../types";

export class IngredientService {
    constructor(private supabase: SupabaseClient) {}

    async getIngredient(id: string): Promise<IngredientWithUnit | null> {
        const { data, error } = await this.supabase
            .from("recipe_ingredients")
            .select(`
                *,
                unit:units!unit_id (*)
            `)
            .eq("id", id)
            .single();

        if (error) throw error;
        return data;
    }

    async getIngredientsByRecipeId(recipeId: string): Promise<IngredientWithUnit[]> {
        const { data, error } = await this.supabase
            .from("recipe_ingredients")
            .select(`
                *,
                unit:units!unit_id (*)
            `)
            .eq("recipe_id", recipeId)
            .order("display_order", { ascending: true });

        if (error) throw error;
        return data || [];
    }

    async createIngredient(ingredient: Omit<IngredientWithUnit, 'id'>): Promise<IngredientWithUnit> {
        const { data, error } = await this.supabase
            .from("recipe_ingredients")
            .insert(ingredient)
            .select(`
                *,
                unit:units!unit_id (*)
            `)
            .single();

        if (error) throw error;
        return data;
    }

    async createIngredients(ingredients: Omit<IngredientWithUnit, 'id'>[]): Promise<IngredientWithUnit[]> {
        const { data, error } = await this.supabase
            .from("recipe_ingredients")
            .insert(ingredients)
            .select(`
                *,
                unit:units!unit_id (*)
            `)
            .order("display_order", { ascending: true });

        if (error) throw error;
        return data;
    }

    async updateIngredient(
        id: string, 
        ingredient: Partial<Omit<IngredientWithUnit, 'id' | 'recipe_id'>>
    ): Promise<IngredientWithUnit> {
        const { data, error } = await this.supabase
            .from("recipe_ingredients")
            .update(ingredient)
            .eq("id", id)
            .select(`
                *,
                unit:units!unit_id (*)
            `)
            .single();

        if (error) throw error;
        return data;
    }

    async deleteIngredient(id: string): Promise<void> {
        const { error } = await this.supabase
            .from("recipe_ingredients")
            .delete()
            .eq("id", id);

        if (error) throw error;
    }

    async reorderIngredients(recipeId: string, ingredientIds: string[]): Promise<IngredientWithUnit[]> {
        const updates = ingredientIds.map((id, index) => ({
            id,
            display_order: index + 1
        }));

        const { data, error } = await this.supabase
            .from("recipe_ingredients")
            .upsert(updates)
            .eq("recipe_id", recipeId)
            .select(`
                *,
                unit:units!unit_id (*)
            `)
            .order("display_order", { ascending: true });

        if (error) throw error;
        return data;
    }
}
    
    
  
  