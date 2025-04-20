import { type Recipe, type RecipeIngredient, type Unit } from '@/lib/types/databaseZod';

// Re-export the types we need
export type {
  Profile,
  Unit,
  Tag,
  RecipeIngredient,
  RecipeStep,
  RecipeTag,
  RecipeStar,
  RecipeComment,
  RecipeVersion,
  UnitSystem,
  UnitType,
  DifficultyLevel
} from '@/lib/types/databaseZod';

// Additional types for API responses
export type RecipeWithRelations = Recipe & {
  tags?: { id: string; name: string }[];
  steps?: {
    id: string;
    recipe_id: string;
    step_number: number;
    instruction: string;
    image_url: string | null;
    timer_minutes: number | null;
  }[];
  ingredients?: (RecipeIngredient & { unit?: Unit })[];
  creator?: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
};

export type IngredientWithUnit = RecipeIngredient & {
  unit?: Unit;
}; 