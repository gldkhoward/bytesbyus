import { SupabaseClient } from "@supabase/supabase-js";

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