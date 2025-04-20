-- Locations table for restaurant/food establishment visits
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  country TEXT,
  postal_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  type VARCHAR(50), -- Restaurant, Cafe, Food Truck, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_verified BOOLEAN DEFAULT false NOT NULL
);

--Post Types Table
CREATE TABLE post_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(20) NOT NULL UNIQUE,
  description TEXT
);

-- Posts table - core table for social media posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  type_id UUID NOT NULL REFERENCES post_types(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  is_private BOOLEAN DEFAULT false NOT NULL,
  is_draft BOOLEAN DEFAULT true NOT NULL,

  -- For moderation
  is_archived BOOLEAN DEFAULT false NOT NULL
);

-- Post images table
CREATE TABLE post_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Post tags table for hashtags
CREATE TABLE post_tags (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Post likes
CREATE TABLE post_likes (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, post_id)
);

-- Post bookmarks (saves)
CREATE TABLE post_bookmarks (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, post_id)
);

-- Post comments
CREATE TABLE post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  is_deleted BOOLEAN DEFAULT false NOT NULL
);

--Post Recipies Junction Table
CREATE TABLE post_recipies (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, recipe_id)
);

--Post User Tags Junction Table
CREATE TABLE post_user_tags (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, user_id)
);

-- User follows to support feed generation
CREATE TABLE user_follows (
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (follower_id, following_id)
);

-- Updated trigger for timestamp on new tables
CREATE TRIGGER set_timestamp_posts
BEFORE UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_locations
BEFORE UPDATE ON locations
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_post_comments
BEFORE UPDATE ON post_comments
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Indexes for optimization
CREATE INDEX idx_posts_creator ON posts(creator_id);
CREATE INDEX idx_posts_recipe ON posts(recipe_id);
CREATE INDEX idx_posts_location ON posts(location_id);
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_post_likes_post ON post_likes(post_id);
CREATE INDEX idx_post_bookmarks_user ON post_bookmarks(user_id);
CREATE INDEX idx_post_comments_post ON post_comments(post_id);
CREATE INDEX idx_locations_city ON locations(city);
CREATE INDEX idx_locations_type ON locations(type);
CREATE INDEX idx_post_images_post ON post_images(post_id, display_order);
CREATE INDEX idx_posts_content ON posts USING GIN (to_tsvector('english', content));
CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON user_follows(following_id);
CREATE INDEX idx_post_recipies_post ON post_recipies(post_id);
CREATE INDEX idx_post_recipies_recipe ON post_recipies(recipe_id);
CREATE INDEX idx_post_user_tags_post ON post_user_tags(post_id);
CREATE INDEX idx_post_user_tags_user ON post_user_tags(user_id);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

-- RLS policies for posts
CREATE POLICY "Public posts are viewable by everyone"
ON posts FOR SELECT USING (
  NOT is_private AND NOT is_archived AND NOT is_draft
);

CREATE POLICY "Private posts are viewable by creator"
ON posts FOR SELECT USING (
  creator_id = auth.uid()
);

CREATE POLICY "Users can insert their own posts"
ON posts FOR INSERT WITH CHECK (
  creator_id = auth.uid()
);

CREATE POLICY "Users can update their own posts"
ON posts FOR UPDATE USING (
  creator_id = auth.uid()
);

CREATE POLICY "Users can delete their own posts"
ON posts FOR DELETE USING (
  creator_id = auth.uid()
);


-- RLS policies for locations
CREATE POLICY "Locations are viewable by everyone"
ON locations FOR SELECT USING (true);

CREATE POLICY "Users can create new locations"
ON locations FOR INSERT WITH CHECK (
  created_by = auth.uid()
);

CREATE POLICY "Only admins or creators can update locations"
ON locations FOR UPDATE USING (
  created_by = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- RLS policies for post images
CREATE POLICY "Post images are viewable if post is viewable"
ON post_images FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = post_images.post_id
    AND (NOT posts.is_private OR posts.creator_id = auth.uid())
    AND NOT posts.is_archived AND NOT posts.is_draft
  )
);

CREATE POLICY "Users can manage images of their posts"
ON post_images FOR ALL USING (
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = post_images.post_id
    AND posts.creator_id = auth.uid()
  )
);

-- RLS policies for post tags
CREATE POLICY "Post tags are viewable if post is viewable"
ON post_tags FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = post_tags.post_id
    AND (NOT posts.is_private OR posts.creator_id = auth.uid())
    AND NOT posts.is_archived AND NOT posts.is_draft
  )
);

CREATE POLICY "Users can manage tags on their posts"
ON post_tags FOR ALL USING (
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = post_tags.post_id
    AND posts.creator_id = auth.uid()
  )
);

-- RLS policies for likes
CREATE POLICY "Post likes are viewable if post is viewable"
ON post_likes FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = post_likes.post_id
    AND (NOT posts.is_private OR posts.creator_id = auth.uid())
    AND NOT posts.is_archived AND NOT posts.is_draft
  )
);

CREATE POLICY "Users can like/unlike posts"
ON post_likes FOR ALL USING (
  user_id = auth.uid()
);

-- RLS policies for bookmarks
CREATE POLICY "Users can only view their own bookmarks"
ON post_bookmarks FOR SELECT USING (
  user_id = auth.uid()
);

CREATE POLICY "Users can bookmark/unbookmark posts"
ON post_bookmarks FOR ALL USING (
  user_id = auth.uid()
);

-- RLS policies for comments
CREATE POLICY "Comments are viewable if post is viewable"
ON post_comments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = post_comments.post_id
    AND (NOT posts.is_private OR posts.creator_id = auth.uid())
    AND NOT posts.is_archived AND NOT posts.is_draft
  )
);

CREATE POLICY "Users can add comments to viewable posts"
ON post_comments FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = post_comments.post_id
    AND (NOT posts.is_private OR posts.creator_id = auth.uid())
    AND NOT posts.is_archived AND NOT posts.is_draft
  )
);

CREATE POLICY "Users can update their own comments"
ON post_comments FOR UPDATE USING (
  user_id = auth.uid() AND NOT is_deleted
);


-- RLS policies for follows
CREATE POLICY "Follow relationships are viewable by everyone"
ON user_follows FOR SELECT USING (true);

CREATE POLICY "Users can manage their own follows"
ON user_follows FOR ALL USING (
  follower_id = auth.uid()
);

-- RLS for post_recipies
CREATE POLICY "Post recipies are viewable if post is viewable"
ON post_recipies FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = post_recipies.post_id
    AND (NOT posts.is_private OR posts.creator_id = auth.uid())
    AND NOT posts.is_archived AND NOT posts.is_draft
  )
);

CREATE POLICY "Users can manage their own post recipies"
ON post_recipies FOR ALL USING (
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = post_recipies.post_id
    AND posts.creator_id = auth.uid()
  )
);

-- RLS for post_user_tags
CREATE POLICY "Post user tags are viewable if post is viewable"
ON post_user_tags FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = post_user_tags.post_id
    AND (NOT posts.is_private OR posts.creator_id = auth.uid()) 
    AND NOT posts.is_archived AND NOT posts.is_draft
  )
);

CREATE POLICY "Users can manage user tags on their posts"
ON post_user_tags FOR ALL USING (
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = post_user_tags.post_id
    AND posts.creator_id = auth.uid()
  )
);

-- Helper functions for feeds
CREATE OR REPLACE FUNCTION get_following_feed(user_uuid UUID, limit_count INTEGER DEFAULT 20, offset_count INTEGER DEFAULT 0)
RETURNS SETOF posts AS $$
BEGIN
  RETURN QUERY
  SELECT p.*
  FROM posts p
  WHERE p.creator_id IN (
    SELECT following_id 
    FROM user_follows 
    WHERE follower_id = user_uuid
  )
  AND NOT p.is_private
  AND NOT p.is_archived
  ORDER BY p.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_trending_posts(limit_count INTEGER DEFAULT 20, hours_back INTEGER DEFAULT 48)
RETURNS SETOF posts AS $$
BEGIN
  RETURN QUERY
  SELECT p.*
  FROM posts p
  LEFT JOIN post_likes pl ON p.id = pl.post_id
  WHERE p.created_at >= NOW() - (hours_back * INTERVAL '1 hour')
  AND NOT p.is_private
  AND NOT p.is_archived
  GROUP BY p.id
  ORDER BY COUNT(pl.post_id) DESC, p.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;