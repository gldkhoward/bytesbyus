import { SupabaseClient } from "@supabase/supabase-js";
import { RecipeStep } from "../types";

export class StepService {
    constructor(private supabase: SupabaseClient) {}

    async getStep(id: string): Promise<RecipeStep | null> {
        const { data, error } = await this.supabase
            .from("recipe_steps")
            .select(`
                id,
                recipe_id,
                step_number,
                instruction,
                image_url,
                timer_minutes
            `)
            .eq("id", id)
            .single();

        if (error) throw error;
        return data;
    }

    async getStepsByRecipeId(recipeId: string): Promise<RecipeStep[]> {
        const { data, error } = await this.supabase
            .from("recipe_steps")
            .select(`
                id,
                recipe_id,
                step_number,
                instruction,
                image_url,
                timer_minutes
            `)
            .eq("recipe_id", recipeId)
            .order("step_number");

        if (error) throw error;
        return data || [];
    }

    async createStep(step: Omit<RecipeStep, 'id'>): Promise<RecipeStep> {
        const { data, error } = await this.supabase
            .from("recipe_steps")
            .insert(step)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async createSteps(steps: Omit<RecipeStep, 'id'>[]): Promise<RecipeStep[]> {
        const { data, error } = await this.supabase
            .from("recipe_steps")
            .insert(steps)
            .select()
            .order("step_number");

        if (error) throw error;
        return data;
    }

    async updateStep(id: string, step: Partial<Omit<RecipeStep, 'id' | 'recipe_id'>>): Promise<RecipeStep> {
        const { data, error } = await this.supabase
            .from("recipe_steps")
            .update(step)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async deleteStep(id: string): Promise<void> {
        const { error } = await this.supabase
            .from("recipe_steps")
            .delete()
            .eq("id", id);

        if (error) throw error;
    }

    async reorderSteps(recipeId: string, stepIds: string[]): Promise<RecipeStep[]> {
        const updates = stepIds.map((id, index) => ({
            id,
            step_number: index + 1
        }));

        const { data, error } = await this.supabase
            .from("recipe_steps")
            .upsert(updates)
            .eq("recipe_id", recipeId)
            .select()
            .order("step_number");

        if (error) throw error;
        return data;
    }
}
    
    
  
  