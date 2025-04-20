import { z } from "zod";

export namespace User {

  // --- Base Table Schema ---

  // Based on the 'profiles' table in back.sql
  export const profileSchema = z.object({
    id: z.string().uuid(), // PK, references auth.users(id)
    username: z.string(),
    avatar_url: z.string().url().nullable(),
    bio: z.string().nullable(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    last_login_at: z.string().datetime().nullable(),
    is_admin: z.boolean(),
    is_private: z.boolean(),
  });
  export type Profile = z.infer<typeof profileSchema>;

  // --- Schemas for API Operations ---

  // Profile is created by trigger, only updates are relevant via API
  // Note: Trigger uses email as initial username, update might be needed

  export const profileUpdateSchema = z.object({
    id: z.string().uuid(), // Required for update
    username: z.string().optional(),
    avatar_url: z.string().url().nullable().optional(),
    bio: z.string().nullable().optional(),
    // created_at, updated_at, last_login_at managed by DB/triggers
    // is_admin update likely restricted by RLS
    is_private: z.boolean().optional(),
  });
  export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;

}
