import { z } from 'zod'

// Unit System and Type Enums
export const UnitSystemEnum = z.enum(['metric', 'imperial', 'universal'])
export const UnitTypeEnum = z.enum(['volume', 'weight', 'length', 'temperature', 'count', 'time', 'other'])
export const DifficultyLevelEnum = z.enum(['easy', 'medium', 'hard', 'expert'])

// Profile Schema
export const profileSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  avatar_url: z.string().nullable(),
  bio: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
  last_login_at: z.date().nullable(),
  is_admin: z.boolean(),
})


// Unit Schema
export const unitSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  abbreviation: z.string(),
  system: UnitSystemEnum,
  type: UnitTypeEnum,
  base_unit_id: z.string().uuid().nullable(),
  conversion_factor: z.number().nullable(),
  created_at: z.date(),
})

// Tag Schema
export const tagSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
})

// Recipe Schema
export const recipeSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  image_url: z.string().nullable(),
  servings: z.number().nullable(),
  prep_time_minutes: z.number().nullable(),
  cook_time_minutes: z.number().nullable(),
  difficulty: DifficultyLevelEnum.nullable(),
  is_private: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
  creator_id: z.string().uuid(),
  
  // Version control related fields
  parent_id: z.string().uuid().nullable(),
  root_id: z.string().uuid().nullable(),
  version: z.number(),
  branch_name: z.string().nullable(),
  
  is_verified: z.boolean(),
  
  // Optional fields for API responses
  tags: z.array(tagSchema).optional(),
})

// Recipe Ingredient Schema
export const recipeIngredientSchema = z.object({
  id: z.string().uuid(),
  recipe_id: z.string().uuid(),
  name: z.string(),
  quantity: z.number().nullable(),
  unit_id: z.string().uuid().nullable(),
  notes: z.string().nullable(),
  is_optional: z.boolean(),
  display_order: z.number(),
  alternative_ingredient_id: z.string().uuid().nullable(),
})

// Recipe Step Schema
export const recipeStepSchema = z.object({
  id: z.string().uuid(),
  recipe_id: z.string().uuid(),
  step_number: z.number(),
  instruction: z.string(),
  image_url: z.string().nullable(),
  timer_minutes: z.number().nullable(),
})

// Recipe Tag Schema
export const recipeTagSchema = z.object({
  recipe_id: z.string().uuid(),
  tag_id: z.string().uuid(),
})

// Recipe Star Schema
export const recipeStarSchema = z.object({
  user_id: z.string().uuid(),
  recipe_id: z.string().uuid(),
  created_at: z.date(),
})

// Recipe Comment Schema
export const recipeCommentSchema = z.object({
  id: z.string().uuid(),
  recipe_id: z.string().uuid(),
  user_id: z.string().uuid(),
  parent_comment_id: z.string().uuid().nullable(),
  content: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
})

// Recipe Version Schema
export const recipeVersionSchema = z.object({
  id: z.string().uuid(),
  recipe_id: z.string().uuid(),
  version_number: z.number(),
  changes: z.any(), // Consider replacing with a more specific schema based on your data structure
  created_at: z.date(),
  created_by: z.string().uuid(),
  commit_message: z.string().nullable(),
})

// Database Tables Schema
export const tablesSchema = z.object({
  profiles: profileSchema,
  units: unitSchema,
  recipes: recipeSchema,
  recipe_ingredients: recipeIngredientSchema,
  recipe_steps: recipeStepSchema,
  tags: tagSchema,
  recipe_tags: recipeTagSchema,
  recipe_stars: recipeStarSchema,
  recipe_comments: recipeCommentSchema,
  recipe_versions: recipeVersionSchema,
})

// Export inferred types
export type UnitSystem = z.infer<typeof UnitSystemEnum>
export type UnitType = z.infer<typeof UnitTypeEnum>
export type DifficultyLevel = z.infer<typeof DifficultyLevelEnum>

export type Profile = z.infer<typeof profileSchema>
export type Unit = z.infer<typeof unitSchema>
export type Tag = z.infer<typeof tagSchema>
export type Recipe = z.infer<typeof recipeSchema>
export type RecipeIngredient = z.infer<typeof recipeIngredientSchema>
export type RecipeStep = z.infer<typeof recipeStepSchema>
export type RecipeTag = z.infer<typeof recipeTagSchema>
export type RecipeStar = z.infer<typeof recipeStarSchema>
export type RecipeComment = z.infer<typeof recipeCommentSchema>
export type RecipeVersion = z.infer<typeof recipeVersionSchema>
export type Tables = z.infer<typeof tablesSchema> 