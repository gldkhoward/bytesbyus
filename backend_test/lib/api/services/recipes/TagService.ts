import { SupabaseClient } from "@supabase/supabase-js";
import { Tag } from "../types";

export class TagService {
    constructor(private supabase: SupabaseClient) {}

    async getTag(id: string): Promise<Tag | null> {
        const { data, error } = await this.supabase
            .from("tags")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data;
    }

    async listTags(): Promise<Tag[]> {
        const { data, error } = await this.supabase
            .from("tags")
            .select("*")
            .order("name", { ascending: true });

        if (error) throw error;
        return data || [];
    }

    async createTag(name: string): Promise<Tag> {
        const { data, error } = await this.supabase
            .from("tags")
            .insert({ name })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async updateTag(id: string, name: string): Promise<Tag> {
        const { data, error } = await this.supabase
            .from("tags")
            .update({ name })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async deleteTag(id: string): Promise<void> {
        const { error } = await this.supabase
            .from("tags")
            .delete()
            .eq("id", id);

        if (error) throw error;
    }

    async getRecipeTags(recipeId: string): Promise<Tag[]> {
        const { data, error } = await this.supabase
            .from("recipe_tags")
            .select(`
                tags (
                    id,
                    name
                )
            `)
            .eq("recipe_id", recipeId);

        if (error) throw error;
        return (data || []).map(rt => rt.tags[0]);
    }

    async setRecipeTags(recipeId: string, tagIds: string[]): Promise<void> {
        // First delete existing tags
        await this.supabase
            .from("recipe_tags")
            .delete()
            .eq("recipe_id", recipeId);

        // Then insert new ones if any
        if (tagIds.length > 0) {
            const { error } = await this.supabase
                .from("recipe_tags")
                .insert(tagIds.map(tagId => ({
                    recipe_id: recipeId,
                    tag_id: tagId
                })));

            if (error) throw error;
        }
    }

    async addRecipeTag(recipeId: string, tagId: string): Promise<void> {
        const { error } = await this.supabase
            .from("recipe_tags")
            .insert({
                recipe_id: recipeId,
                tag_id: tagId
            });

        if (error) throw error;
    }

    async removeRecipeTag(recipeId: string, tagId: string): Promise<void> {
        const { error } = await this.supabase
            .from("recipe_tags")
            .delete()
            .eq("recipe_id", recipeId)
            .eq("tag_id", tagId);

        if (error) throw error;
    }
} 