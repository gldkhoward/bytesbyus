import { z } from "zod";
import { User } from "./user";

export namespace Posts {

  // --- Base Table Schemas ---

  export const locationSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    address: z.string().nullable(),
    city: z.string().nullable(),
    country: z.string().nullable(),
    postal_code: z.string().nullable(),
    latitude: z.number().nullable(), // DECIMAL(10, 8)
    longitude: z.number().nullable(), // DECIMAL(11, 8)
    type: z.string().max(50).nullable(),
    created_at: z.string().datetime(),
    created_by: z.string().uuid(),
    is_verified: z.boolean(),
  });
  export type Location = z.infer<typeof locationSchema>;

  export const postTypeSchema = z.object({
    id: z.string().uuid(),
    name: z.string().max(20),
    description: z.string().nullable(),
  });
  export type PostType = z.infer<typeof postTypeSchema>;

  export const postSchema = z.object({
    id: z.string().uuid(),
    creator_id: z.string().uuid(),
    content: z.string().nullable(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    type_id: z.string().uuid(),
    location_id: z.string().uuid().nullable(),
    is_private: z.boolean(),
    is_draft: z.boolean(),
    is_archived: z.boolean(),
  });
  export type Post = z.infer<typeof postSchema>;

  export const postImageSchema = z.object({
    id: z.string().uuid(),
    post_id: z.string().uuid(),
    image_url: z.string().url(),
    display_order: z.number().int(),
    created_at: z.string().datetime(),
  });
  export type PostImage = z.infer<typeof postImageSchema>;

  export const postTagSchema = z.object({
    post_id: z.string().uuid(),
    tag_id: z.string().uuid(), // Assumes tags table exists (from recipes)
  });
  export type PostTag = z.infer<typeof postTagSchema>;

  export const postLikeSchema = z.object({
    user_id: z.string().uuid(),
    post_id: z.string().uuid(),
    created_at: z.string().datetime(),
  });
  export type PostLike = z.infer<typeof postLikeSchema>;

  export const postBookmarkSchema = z.object({
    user_id: z.string().uuid(),
    post_id: z.string().uuid(),
    created_at: z.string().datetime(),
  });
  export type PostBookmark = z.infer<typeof postBookmarkSchema>;

  export const postCommentSchema = z.object({
    id: z.string().uuid(),
    post_id: z.string().uuid(),
    user_id: z.string().uuid(),
    parent_comment_id: z.string().uuid().nullable(),
    content: z.string(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    is_deleted: z.boolean(),
  });
  export type PostComment = z.infer<typeof postCommentSchema>;

  export const postRecipeSchema = z.object({
    post_id: z.string().uuid(),
    recipe_id: z.string().uuid(), // Assumes recipes table exists
  });
  export type PostRecipe = z.infer<typeof postRecipeSchema>;

  export const postUserTagSchema = z.object({
    post_id: z.string().uuid(),
    user_id: z.string().uuid(), // References profiles table
  });
  export type PostUserTag = z.infer<typeof postUserTagSchema>;

  export const userFollowSchema = z.object({
    follower_id: z.string().uuid(),
    following_id: z.string().uuid(),
    created_at: z.string().datetime(),
  });
  export type UserFollow = z.infer<typeof userFollowSchema>;

  // --- Schemas for API Operations ---

  export const locationInsertSchema = locationSchema.omit({
    id: true,
    created_at: true,
    is_verified: true, // Defaulted
  });
  export type LocationInsert = z.infer<typeof locationInsertSchema>;

  export const locationUpdateSchema = locationSchema.partial().required({ id: true });
  export type LocationUpdate = z.infer<typeof locationUpdateSchema>;

  // Post types likely managed by admin
  export const postTypeInsertSchema = postTypeSchema.omit({ id: true });
  export type PostTypeInsert = z.infer<typeof postTypeInsertSchema>;

  export const postInsertSchema = postSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
    is_archived: true, // Defaulted
  }).extend({
    is_private: z.boolean().optional(), // Defaulted
    is_draft: z.boolean().optional(),   // Defaulted
  });
  export type PostInsert = z.infer<typeof postInsertSchema>;

  export const postUpdateSchema = postSchema.omit({
    created_at: true,
    creator_id: true, // Cannot change creator
  }).partial().required({ id: true });
  export type PostUpdate = z.infer<typeof postUpdateSchema>;

  export const postImageInsertSchema = postImageSchema.omit({
    id: true,
    created_at: true,
  });
  export type PostImageInsert = z.infer<typeof postImageInsertSchema>;

  // Junction tables, likes, bookmarks, follows usually direct insert/delete
  export const postTagInsertSchema = postTagSchema;
  export type PostTagInsert = z.infer<typeof postTagInsertSchema>;

  export const postLikeInsertSchema = postLikeSchema.omit({ created_at: true });
  export type PostLikeInsert = z.infer<typeof postLikeInsertSchema>;

  export const postBookmarkInsertSchema = postBookmarkSchema.omit({ created_at: true });
  export type PostBookmarkInsert = z.infer<typeof postBookmarkInsertSchema>;

  export const postCommentInsertSchema = postCommentSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
    is_deleted: true, // Defaulted
  });
  export type PostCommentInsert = z.infer<typeof postCommentInsertSchema>;

  export const postCommentUpdateSchema = z.object({
    id: z.string().uuid(), // Required
    content: z.string().optional(),
    is_deleted: z.boolean().optional(), // For soft delete
  });
  export type PostCommentUpdate = z.infer<typeof postCommentUpdateSchema>;

  export const postRecipeInsertSchema = postRecipeSchema;
  export type PostRecipeInsert = z.infer<typeof postRecipeInsertSchema>;

  export const postUserTagInsertSchema = postUserTagSchema;
  export type PostUserTagInsert = z.infer<typeof postUserTagInsertSchema>;

  export const userFollowInsertSchema = userFollowSchema.omit({ created_at: true });
  export type UserFollowInsert = z.infer<typeof userFollowInsertSchema>;


  namespace Display {

    //A schema for all of the data needed to display posts
    //Todo: Implement this
    export const postDisplaySchema = postSchema.extend({
      creator: User.profileSchema.omit({
        id: true,
        created_at: true,
        updated_at: true,
        last_login_at: true,
        is_admin: true,
        is_private: true,
      }),
      location: locationSchema.nullable(),
      type: postTypeSchema,
      images: postImageSchema.array(),
      tags: postTagSchema.array(),
      likes: postLikeSchema.array(),
      comments: postCommentSchema.array(),
      recipes: postRecipeSchema.array(),
      userTags: postUserTagSchema.array(),
    });
    export type PostDisplay = z.infer<typeof postDisplaySchema>;
  }
}
