/**
 * TypeScript types for database schema
 */

export interface Profile {
    id: string; // UUID from auth.users
    username: string;
    avatar_url: string | null;
    bio: string | null;
    created_at: Date;
    updated_at: Date;
    last_login_at: Date | null;
    is_admin: boolean;
  }
  
  export type UnitSystem = 'metric' | 'imperial' | 'universal';
  export type UnitType = 'volume' | 'weight' | 'length' | 'temperature' | 'count' | 'time' | 'other';
  
  export interface Unit {
    id: string; // UUID
    name: string;
    abbreviation: string;
    system: UnitSystem;
    type: UnitType;
    base_unit_id: string | null; // UUID reference to units.id
    conversion_factor: number | null;
    created_at: Date;
  }
  
  export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';
  
  export interface Recipe {
    id: string; // UUID
    title: string;
    description: string | null;
    image_url: string | null;
    servings: number | null;
    prep_time_minutes: number | null;
    cook_time_minutes: number | null;
    difficulty: DifficultyLevel | null;
    is_private: boolean;
    created_at: Date;
    updated_at: Date;
    creator_id: string; // UUID reference to auth.users.id
    
    // Version control related fields
    parent_id: string | null; // UUID reference to recipes.id
    root_id: string | null; // UUID reference to recipes.id
    version: number;
    branch_name: string | null;
    
    is_verified: boolean;
    
    // Added for API response
    tags?: Tag[]; // Tags associated with this recipe
  }
  
  export interface RecipeIngredient {
    id: string; // UUID
    recipe_id: string; // UUID reference to recipes.id
    name: string;
    quantity: number | null;
    unit_id: string | null; // UUID reference to units.id
    notes: string | null;
    is_optional: boolean;
    display_order: number;
    alternative_ingredient_id: string | null; // UUID reference to recipe_ingredients.id
  }
  
  export interface RecipeStep {
    id: string; // UUID
    recipe_id: string; // UUID reference to recipes.id
    step_number: number;
    instruction: string;
    image_url: string | null;
    timer_minutes: number | null;
  }
  
  export interface Tag {
    id: string; // UUID
    name: string;
  }
  
  export interface RecipeTag {
    recipe_id: string; // UUID reference to recipes.id
    tag_id: string; // UUID reference to tags.id
  }
  
  export interface RecipeStar {
    user_id: string; // UUID reference to auth.users.id
    recipe_id: string; // UUID reference to recipes.id
    created_at: Date;
  }
  
  export interface RecipeComment {
    id: string; // UUID
    recipe_id: string; // UUID reference to recipes.id
    user_id: string; // UUID reference to auth.users.id
    parent_comment_id: string | null; // UUID reference to recipe_comments.id
    content: string;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface RecipeVersion {
    id: string; // UUID
    recipe_id: string; // UUID reference to recipes.id
    version_number: number;
    changes: any; // JSONB type, consider using a more specific type based on your data structure
    created_at: Date;
    created_by: string; // UUID reference to auth.users.id
    commit_message: string | null;
  }
  
  // Database tables as a union of all types
  export type Tables = {
    profiles: Profile;
    units: Unit;
    recipes: Recipe;
    recipe_ingredients: RecipeIngredient;
    recipe_steps: RecipeStep;
    tags: Tag;
    recipe_tags: RecipeTag;
    recipe_stars: RecipeStar;
    recipe_comments: RecipeComment;
    recipe_versions: RecipeVersion;
  }