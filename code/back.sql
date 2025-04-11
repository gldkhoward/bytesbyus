

-- Profile table that extends Supabase auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  last_login_at TIMESTAMP WITH TIME ZONE,
  is_admin BOOLEAN DEFAULT false NOT NULL,
  is_private BOOLEAN DEFAULT true NOT NULL
);

-- Units table for standardized measurements
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  abbreviation TEXT NOT NULL UNIQUE,
  system VARCHAR(10) CHECK (system IN ('metric', 'imperial', 'universal')),
  type VARCHAR(20) CHECK (type IN ('volume', 'weight', 'length', 'temperature', 'count', 'time', 'other')),
  base_unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
  conversion_factor DECIMAL(20, 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Recipes table - core table for storing recipes
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  servings INTEGER,
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  difficulty VARCHAR(10) CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
  is_private BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  creator_id UUID NOT NULL REFERENCES auth.users(id) DEFAULT auth.uid() ON DELETE CASCADE,
  
  -- Version control related fields
  parent_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  root_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  version INTEGER DEFAULT 1 NOT NULL,
  branch_name TEXT DEFAULT NULL,
  
  -- For future features
  is_verified BOOLEAN DEFAULT false NOT NULL
);

-- Ingredients for recipes
CREATE TABLE recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity DECIMAL(10, 2),
  unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
  notes TEXT,
  is_optional BOOLEAN DEFAULT false NOT NULL,
  display_order INTEGER NOT NULL,
  
  -- For future features
  alternative_ingredient_id UUID REFERENCES recipe_ingredients(id) ON DELETE SET NULL
);

-- Steps to prepare the recipe
CREATE TABLE recipe_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  instruction TEXT NOT NULL,
  image_url TEXT,
  timer_minutes INTEGER
);

-- Tags for categorizing recipes
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE
);

-- Junction table for recipe-tag relationship
CREATE TABLE recipe_tags (
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, tag_id)
);

-- "Stars" (favorites) for recipes
CREATE TABLE recipe_stars (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, recipe_id)
);

-- Comments on recipes
CREATE TABLE recipe_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES recipe_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table to track recipe version history
CREATE TABLE recipe_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  changes JSONB NOT NULL, -- Stores diff from previous version
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  commit_message TEXT,
  
  UNIQUE (recipe_id, version_number)
);

-- Trigger function to create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, created_at, updated_at)
  VALUES (NEW.id, NEW.email, NOW(), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger function to update 'updated_at' timestamp on edits
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.is_user_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE id = auth.uid() AND is_admin = true
  );
$$;

create or replace function get_recipes_with_all_tags(tag_ids uuid[])
returns table (recipe_id uuid) as $$
begin
  return query
  select rt.recipe_id
  from recipe_tags rt
  where rt.tag_id = any(tag_ids)
  group by rt.recipe_id
  having count(*) = array_length(tag_ids, 1);
end;
$$ language plpgsql;

-- Recipe updated_at trigger
CREATE TRIGGER set_timestamp_recipes
BEFORE UPDATE ON recipes
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Profile updated_at trigger
CREATE TRIGGER set_timestamp_profiles
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Comments updated_at trigger
CREATE TRIGGER set_timestamp_comments
BEFORE UPDATE ON recipe_comments
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Indices for optimization
CREATE INDEX idx_recipes_creator ON recipes(creator_id);
CREATE INDEX idx_recipes_parent ON recipes(parent_id);
CREATE INDEX idx_recipes_root ON recipes(root_id);
CREATE INDEX idx_recipes_branch ON recipes(branch_name);
CREATE INDEX idx_recipe_created ON recipes(created_at DESC);
CREATE INDEX idx_recipes_root_parent_branch ON recipes(root_id, parent_id, branch_name);

CREATE INDEX idx_recipe_ingredients ON recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_ingredients_unit ON recipe_ingredients(unit_id);

CREATE INDEX idx_recipe_steps ON recipe_steps(recipe_id, step_number);

CREATE INDEX idx_recipe_stars_recipe ON recipe_stars(recipe_id);
CREATE INDEX idx_recipe_stars_user ON recipe_stars(user_id);
CREATE INDEX idx_recipe_comments_recipe ON recipe_comments(recipe_id);

CREATE INDEX idx_recipes_title_description ON recipes USING GIN (to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_units_system_type ON units(system, type);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_stars ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;

-- -- RLS Policies for profiles
--Deprecated 07/04/2025
-- CREATE POLICY "Profiles are viewable by everyone" 
-- ON profiles FOR SELECT USING (true);

CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT USING (is_private = false);

CREATE POLICY "Users can update own profile except admin status" 
ON "public"."profiles"
FOR UPDATE
TO public
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  (
    (is_admin IS NULL OR is_admin = false) 
    OR 
    public.is_user_admin()
  )
);
-- RLS Policies for recipes
CREATE POLICY "Public recipes are viewable by everyone"
ON recipes FOR SELECT USING (NOT is_private OR creator_id = auth.uid());

CREATE POLICY "Users can insert their own recipes"
ON recipes FOR INSERT WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update their own recipes"
ON recipes FOR UPDATE USING (creator_id = auth.uid());

CREATE POLICY "Users can delete their own recipes"
ON recipes FOR DELETE USING (creator_id = auth.uid());

-- RLS Policies for recipe ingredients
CREATE POLICY "Anyone can view ingredients of public recipes"
ON recipe_ingredients FOR SELECT
USING (EXISTS (
  SELECT 1 FROM recipes
  WHERE recipes.id = recipe_ingredients.recipe_id
  AND (NOT recipes.is_private OR recipes.creator_id = auth.uid())
));

CREATE POLICY "Users can manage ingredients of their recipes"
ON recipe_ingredients FOR ALL
USING (EXISTS (
  SELECT 1 FROM recipes
  WHERE recipes.id = recipe_ingredients.recipe_id
  AND recipes.creator_id = auth.uid()
));

-- RLS Policies for recipe steps
CREATE POLICY "Anyone can view steps of public recipes"
ON recipe_steps FOR SELECT
USING (EXISTS (
  SELECT 1 FROM recipes
  WHERE recipes.id = recipe_steps.recipe_id
  AND (NOT recipes.is_private OR recipes.creator_id = auth.uid())
));

CREATE POLICY "Users can manage steps of their recipes"
ON recipe_steps FOR ALL
USING (EXISTS (
  SELECT 1 FROM recipes
  WHERE recipes.id = recipe_steps.recipe_id
  AND recipes.creator_id = auth.uid()
));

-- RLS Policies for tags
CREATE POLICY "Tags are viewable by everyone"
ON tags FOR SELECT USING (true);

-- Only allow admins to manage tags
CREATE POLICY "Only admins can manage tags"
ON tags FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.is_admin = true
));

-- RLS Policies for recipe_tags
CREATE POLICY "Recipe tags are viewable if recipe is viewable"
ON recipe_tags FOR SELECT
USING (EXISTS (
  SELECT 1 FROM recipes
  WHERE recipes.id = recipe_tags.recipe_id
  AND (NOT recipes.is_private OR recipes.creator_id = auth.uid())
));

CREATE POLICY "Users can manage tags on their recipes"
ON recipe_tags FOR ALL
USING (EXISTS (
  SELECT 1 FROM recipes
  WHERE recipes.id = recipe_tags.recipe_id
  AND recipes.creator_id = auth.uid()
));

-- RLS Policies for stars
CREATE POLICY "Users can see who starred public recipes"
ON recipe_stars FOR SELECT
USING (EXISTS (
  SELECT 1 FROM recipes
  WHERE recipes.id = recipe_stars.recipe_id
  AND (NOT recipes.is_private OR recipes.creator_id = auth.uid())
));

CREATE POLICY "Users can star/unstar recipes"
ON recipe_stars FOR ALL
USING (user_id = auth.uid());

-- RLS Policies for comments
CREATE POLICY "Comments are viewable if recipe is viewable"
ON recipe_comments FOR SELECT
USING (EXISTS (
  SELECT 1 FROM recipes
  WHERE recipes.id = recipe_comments.recipe_id
  AND (NOT recipes.is_private OR recipes.creator_id = auth.uid())
));

CREATE POLICY "Users can add comments to viewable recipes"
ON recipe_comments FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.id = recipe_comments.recipe_id
    AND (NOT recipes.is_private OR recipes.creator_id = auth.uid())
  )
);

CREATE POLICY "Users can update their own comments"
ON recipe_comments FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments"
ON recipe_comments FOR DELETE
USING (user_id = auth.uid());

-- RLS Policies for recipe versions
CREATE POLICY "Version history is viewable if recipe is viewable"
ON recipe_versions FOR SELECT
USING (EXISTS (
  SELECT 1 FROM recipes
  WHERE recipes.id = recipe_versions.recipe_id
  AND (NOT recipes.is_private OR recipes.creator_id = auth.uid())
));

CREATE POLICY "Recipe creators can manage versions"
ON recipe_versions FOR ALL
USING (EXISTS (
  SELECT 1 FROM recipes
  WHERE recipes.id = recipe_versions.recipe_id
  AND recipes.creator_id = auth.uid()
));

-- RLS Policies for units
CREATE POLICY "Units are viewable by everyone"
ON units FOR SELECT USING (true);

-- Only allow admins to manage units
CREATE POLICY "Only admins can manage units"
ON units FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.is_admin = true
));