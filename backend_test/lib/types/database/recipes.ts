import { z } from "zod";

export namespace Recipes {

  // --- Enums ---

  export const UnitSystemEnum = z.enum(['metric', 'imperial', 'universal']);
  export type UnitSystem = z.infer<typeof UnitSystemEnum>;

  export const UnitTypeEnum = z.enum(['volume', 'weight', 'length', 'temperature', 'count', 'time', 'other']);
  export type UnitType = z.infer<typeof UnitTypeEnum>;

  export const DifficultyLevelEnum = z.enum(['easy', 'medium', 'hard', 'expert']);
  export type DifficultyLevel = z.infer<typeof DifficultyLevelEnum>;

  // --- Base Table Schemas ---

  export const unitSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    abbreviation: z.string(),
    system: UnitSystemEnum.nullable(),
    type: UnitTypeEnum.nullable(),
    base_unit_id: z.string().uuid().nullable(),
    conversion_factor: z.number().nullable(),
    created_at: z.string().datetime(),
  });
  export type Unit = z.infer<typeof unitSchema>;

  export const tagSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
  });
  export type Tag = z.infer<typeof tagSchema>;

  export const recipeSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string().nullable(),
    image_url: z.string().url().nullable(),
    servings: z.number().int().nullable(),
    prep_time_minutes: z.number().int().nullable(),
    cook_time_minutes: z.number().int().nullable(),
    difficulty: DifficultyLevelEnum.nullable(),
    is_private: z.boolean(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    creator_id: z.string().uuid(),
    is_draft: z.boolean(),
    parent_id: z.string().uuid().nullable(),
    root_id: z.string().uuid().nullable(),
    version: z.number().int(),
    branch_name: z.string().nullable(),
    is_verified: z.boolean(),
  });
  export type Recipe = z.infer<typeof recipeSchema>;

  export const recipeIngredientSchema = z.object({
    id: z.string().uuid(),
    recipe_id: z.string().uuid(),
    name: z.string(),
    quantity: z.number().nullable(),
    unit_id: z.string().uuid().nullable(),
    notes: z.string().nullable(),
    is_optional: z.boolean(),
    display_order: z.number().int(),
    alternative_ingredient_id: z.string().uuid().nullable(),
  });
  export type RecipeIngredient = z.infer<typeof recipeIngredientSchema>;

  export const recipeStepSchema = z.object({
    id: z.string().uuid(),
    recipe_id: z.string().uuid(),
    step_number: z.number().int(),
    instruction: z.string(),
    image_url: z.string().url().nullable(),
    timer_minutes: z.number().int().nullable(),
  });
  export type RecipeStep = z.infer<typeof recipeStepSchema>;

  export const recipeTagSchema = z.object({
    recipe_id: z.string().uuid(),
    tag_id: z.string().uuid(),
  });
  export type RecipeTag = z.infer<typeof recipeTagSchema>;

  export const recipeStarSchema = z.object({
    user_id: z.string().uuid(),
    recipe_id: z.string().uuid(),
    created_at: z.string().datetime(),
  });
  export type RecipeStar = z.infer<typeof recipeStarSchema>;

  export const recipeCommentSchema = z.object({
    id: z.string().uuid(),
    recipe_id: z.string().uuid(),
    user_id: z.string().uuid(),
    parent_comment_id: z.string().uuid().nullable(),
    content: z.string(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
  });
  export type RecipeComment = z.infer<typeof recipeCommentSchema>;

  export const recipeVersionSchema = z.object({
    id: z.string().uuid(),
    recipe_id: z.string().uuid(),
    version_number: z.number().int(),
    changes: z.any(),
    created_at: z.string().datetime(),
    created_by: z.string().uuid(),
    commit_message: z.string().nullable(),
  });
  export type RecipeVersion = z.infer<typeof recipeVersionSchema>;

  // --- Schemas for API Operations (Insert/Update) ---

  export const unitInsertSchema = unitSchema.omit({
    id: true,
    created_at: true,
  });
  export type UnitInsert = z.infer<typeof unitInsertSchema>;

  export const tagInsertSchema = tagSchema.omit({ id: true });
  export type TagInsert = z.infer<typeof tagInsertSchema>;

  export const recipeInsertSchema = recipeSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
    parent_id: true,
    root_id: true,
    version: true,
    branch_name: true,
    is_verified: true
  }).extend({
    creator_id: z.string().uuid().optional(),
    is_draft: z.boolean().optional(),
    is_private: z.boolean().optional(),
  });
  export type RecipeInsert = z.infer<typeof recipeInsertSchema>;

  export const recipeUpdateSchema = z.object({
    id: z.string().uuid(),
    title: z.string().optional(),
    description: z.string().nullable().optional(),
    image_url: z.string().url().nullable().optional(),
    servings: z.number().int().nullable().optional(),
    prep_time_minutes: z.number().int().nullable().optional(),
    cook_time_minutes: z.number().int().nullable().optional(),
    difficulty: DifficultyLevelEnum.nullable().optional(),
    is_private: z.boolean().optional(),
    is_draft: z.boolean().optional(),
    parent_id: z.string().uuid().nullable().optional(),
    version: z.number().int().optional(),
    branch_name: z.string().nullable().optional(),
    is_verified: z.boolean().optional(),
  });
  export type RecipeUpdate = z.infer<typeof recipeUpdateSchema>;

  export const recipeIngredientInsertSchema = recipeIngredientSchema.omit({ id: true }).extend({
    recipe_id: z.string().uuid().optional(),
    is_optional: z.boolean().optional(),
  });
  export type RecipeIngredientInsert = z.infer<typeof recipeIngredientInsertSchema>;

  export const recipeIngredientUpdateSchema = recipeIngredientSchema.partial().required({ id: true });
  export type RecipeIngredientUpdate = z.infer<typeof recipeIngredientUpdateSchema>;

  export const recipeStepInsertSchema = recipeStepSchema.omit({ id: true }).extend({
     recipe_id: z.string().uuid().optional(),
  });
  export type RecipeStepInsert = z.infer<typeof recipeStepInsertSchema>;

  export const recipeStepUpdateSchema = recipeStepSchema.partial().required({ id: true });
  export type RecipeStepUpdate = z.infer<typeof recipeStepUpdateSchema>;

  export const recipeTagInsertSchema = recipeTagSchema;
  export type RecipeTagInsert = z.infer<typeof recipeTagInsertSchema>;

  export const recipeStarInsertSchema = recipeStarSchema.omit({ created_at: true });
  export type RecipeStarInsert = z.infer<typeof recipeStarInsertSchema>;

  export const recipeCommentInsertSchema = recipeCommentSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
  });
  export type RecipeCommentInsert = z.infer<typeof recipeCommentInsertSchema>;

  export const recipeCommentUpdateSchema = z.object({
    id: z.string().uuid(),
    content: z.string().optional(),
  });
  export type RecipeCommentUpdate = z.infer<typeof recipeCommentUpdateSchema>;

  export const recipeVersionInsertSchema = recipeVersionSchema.omit({
      id: true,
      created_at: true
  });
  export type RecipeVersionInsert = z.infer<typeof recipeVersionInsertSchema>;

}
