-- =====================================================
-- Builddeck Database Schema for Supabase
-- Version: 2.0
-- Run this in the Supabase SQL Editor
-- =====================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- =====================================================
-- CUSTOM TYPES
-- =====================================================
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE product_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE submission_action AS ENUM ('submitted', 'approved', 'rejected', 'resubmitted', 'featured', 'unfeatured');

-- =====================================================
-- TABLES
-- =====================================================

-- 1. PROFILES TABLE (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  twitter_handle TEXT,
  role user_role DEFAULT 'user' NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth';
COMMENT ON COLUMN profiles.role IS 'User role: user or admin';

-- 2. CATEGORIES TABLE
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- Icon name or emoji
  color TEXT, -- Hex color for UI
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  product_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE categories IS 'Product categories for organization';

-- 3. PRODUCTS TABLE
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT NOT NULL,
  description TEXT,
  website_url TEXT NOT NULL,
  logo_url TEXT,
  screenshots TEXT[] DEFAULT '{}',
  
  -- Relationships
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Status & Features
  status product_status DEFAULT 'pending' NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  featured_at TIMESTAMPTZ,
  
  -- Metrics
  view_count INT DEFAULT 0,
  upvote_count INT DEFAULT 0,
  
  -- Moderation
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  
  -- Timestamps
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE products IS 'Products submitted to the platform';
COMMENT ON COLUMN products.status IS 'Moderation status: pending, approved, rejected';

-- 4. SUBMISSIONS TABLE (audit trail for product submissions)
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action submission_action NOT NULL,
  
  -- Action details
  previous_status product_status,
  new_status product_status,
  notes TEXT, -- Admin notes or rejection reason
  
  -- Actor info
  performed_by UUID REFERENCES profiles(id),
  
  -- Metadata
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE submissions IS 'Audit trail for product submission actions';

-- 5. NEWSLETTER_SUBSCRIBERS TABLE
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  confirmed BOOLEAN DEFAULT FALSE,
  confirmation_token TEXT UNIQUE,
  confirmed_at TIMESTAMPTZ,
  unsubscribed BOOLEAN DEFAULT FALSE,
  unsubscribed_at TIMESTAMPTZ,
  source TEXT DEFAULT 'website', -- where they signed up
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE newsletter_subscribers IS 'Newsletter subscription management';

-- =====================================================
-- INDEXES
-- =====================================================

-- Profiles indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);

-- Categories indexes
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_display_order ON categories(display_order);
CREATE INDEX idx_categories_is_active ON categories(is_active);

-- Products indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = TRUE;
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_user ON products(user_id);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_approved_at ON products(approved_at DESC) WHERE status = 'approved';
CREATE INDEX idx_products_view_count ON products(view_count DESC);
CREATE INDEX idx_products_upvote_count ON products(upvote_count DESC);

-- Composite indexes for common queries
CREATE INDEX idx_products_status_created ON products(status, created_at DESC);
CREATE INDEX idx_products_category_status ON products(category_id, status) WHERE status = 'approved';

-- Full-text search index
CREATE INDEX idx_products_search ON products USING gin(
  to_tsvector('english', coalesce(name, '') || ' ' || coalesce(tagline, '') || ' ' || coalesce(description, ''))
);

-- Submissions indexes
CREATE INDEX idx_submissions_product ON submissions(product_id);
CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_submissions_action ON submissions(action);
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);

-- Newsletter indexes
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_confirmed ON newsletter_subscribers(confirmed) WHERE confirmed = TRUE;
CREATE INDEX idx_newsletter_created_at ON newsletter_subscribers(created_at DESC);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Generate unique slug from name
CREATE OR REPLACE FUNCTION generate_unique_slug(base_name TEXT, table_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  new_slug TEXT;
  counter INT := 0;
  slug_exists BOOLEAN;
BEGIN
  -- Convert to lowercase and replace spaces/special chars with hyphens
  base_slug := lower(regexp_replace(base_name, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  new_slug := base_slug;
  
  LOOP
    -- Check if slug exists
    IF table_name = 'products' THEN
      SELECT EXISTS(SELECT 1 FROM products WHERE slug = new_slug) INTO slug_exists;
    ELSIF table_name = 'categories' THEN
      SELECT EXISTS(SELECT 1 FROM categories WHERE slug = new_slug) INTO slug_exists;
    END IF;
    
    EXIT WHEN NOT slug_exists;
    
    counter := counter + 1;
    new_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN new_slug;
END;
$$ LANGUAGE plpgsql;

-- Update category product count
CREATE OR REPLACE FUNCTION update_category_product_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update old category count if category changed
  IF TG_OP = 'UPDATE' AND OLD.category_id IS DISTINCT FROM NEW.category_id THEN
    IF OLD.category_id IS NOT NULL THEN
      UPDATE categories SET product_count = (
        SELECT COUNT(*) FROM products WHERE category_id = OLD.category_id AND status = 'approved'
      ) WHERE id = OLD.category_id;
    END IF;
  END IF;
  
  -- Update new/current category count
  IF TG_OP IN ('INSERT', 'UPDATE') AND NEW.category_id IS NOT NULL THEN
    UPDATE categories SET product_count = (
      SELECT COUNT(*) FROM products WHERE category_id = NEW.category_id AND status = 'approved'
    ) WHERE id = NEW.category_id;
  END IF;
  
  -- Handle delete
  IF TG_OP = 'DELETE' AND OLD.category_id IS NOT NULL THEN
    UPDATE categories SET product_count = (
      SELECT COUNT(*) FROM products WHERE category_id = OLD.category_id AND status = 'approved'
    ) WHERE id = OLD.category_id;
    RETURN OLD;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Log submission action
CREATE OR REPLACE FUNCTION log_submission_action()
RETURNS TRIGGER AS $$
BEGIN
  -- Log status changes
  IF TG_OP = 'INSERT' THEN
    INSERT INTO submissions (product_id, user_id, action, new_status, performed_by)
    VALUES (NEW.id, NEW.user_id, 'submitted', NEW.status, NEW.user_id);
  ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO submissions (product_id, user_id, action, previous_status, new_status, notes, performed_by)
    VALUES (
      NEW.id,
      NEW.user_id,
      CASE 
        WHEN NEW.status = 'approved' THEN 'approved'::submission_action
        WHEN NEW.status = 'rejected' THEN 'rejected'::submission_action
        WHEN NEW.status = 'pending' AND OLD.status = 'rejected' THEN 'resubmitted'::submission_action
        ELSE 'submitted'::submission_action
      END,
      OLD.status,
      NEW.status,
      NEW.rejection_reason,
      NEW.reviewed_by
    );
  END IF;
  
  -- Log featured changes
  IF TG_OP = 'UPDATE' AND OLD.featured IS DISTINCT FROM NEW.featured THEN
    INSERT INTO submissions (product_id, user_id, action, performed_by)
    VALUES (
      NEW.id,
      NEW.user_id,
      CASE WHEN NEW.featured THEN 'featured'::submission_action ELSE 'unfeatured'::submission_action END,
      NEW.reviewed_by
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_updated_at
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- New user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Category product count
CREATE TRIGGER on_product_change_update_category_count
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW EXECUTE FUNCTION update_category_product_count();

-- Submission audit log
CREATE TRIGGER on_product_submission_log
  AFTER INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION log_submission_action();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES: PROFILES
-- =====================================================

-- Anyone can view profiles
CREATE POLICY "profiles_select_public"
  ON profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "profiles_update_admin"
  ON profiles FOR UPDATE
  USING (is_admin(auth.uid()));

-- =====================================================
-- RLS POLICIES: CATEGORIES
-- =====================================================

-- Anyone can view active categories
CREATE POLICY "categories_select_public"
  ON categories FOR SELECT
  USING (is_active = true OR is_admin(auth.uid()));

-- Only admins can insert categories
CREATE POLICY "categories_insert_admin"
  ON categories FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

-- Only admins can update categories
CREATE POLICY "categories_update_admin"
  ON categories FOR UPDATE
  USING (is_admin(auth.uid()));

-- Only admins can delete categories
CREATE POLICY "categories_delete_admin"
  ON categories FOR DELETE
  USING (is_admin(auth.uid()));

-- =====================================================
-- RLS POLICIES: PRODUCTS
-- =====================================================

-- Public can view approved products, users can view their own
CREATE POLICY "products_select_public"
  ON products FOR SELECT
  USING (
    status = 'approved' 
    OR auth.uid() = user_id 
    OR is_admin(auth.uid())
  );

-- Authenticated users can insert their own products
CREATE POLICY "products_insert_own"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending/rejected products
CREATE POLICY "products_update_own"
  ON products FOR UPDATE
  USING (auth.uid() = user_id AND status IN ('pending', 'rejected'))
  WITH CHECK (auth.uid() = user_id);

-- Admins can update any product
CREATE POLICY "products_update_admin"
  ON products FOR UPDATE
  USING (is_admin(auth.uid()));

-- Users can delete their own pending products
CREATE POLICY "products_delete_own"
  ON products FOR DELETE
  USING (auth.uid() = user_id AND status = 'pending');

-- Admins can delete any product
CREATE POLICY "products_delete_admin"
  ON products FOR DELETE
  USING (is_admin(auth.uid()));

-- =====================================================
-- RLS POLICIES: SUBMISSIONS
-- =====================================================

-- Users can view their own submission history
CREATE POLICY "submissions_select_own"
  ON submissions FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all submissions
CREATE POLICY "submissions_select_admin"
  ON submissions FOR SELECT
  USING (is_admin(auth.uid()));

-- System inserts via triggers (no direct insert policy needed)

-- =====================================================
-- RLS POLICIES: NEWSLETTER_SUBSCRIBERS
-- =====================================================

-- Anyone can subscribe (insert)
CREATE POLICY "newsletter_insert_public"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- Users can update their own subscription (for unsubscribe)
CREATE POLICY "newsletter_update_own"
  ON newsletter_subscribers FOR UPDATE
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Admins can view all subscribers
CREATE POLICY "newsletter_select_admin"
  ON newsletter_subscribers FOR SELECT
  USING (is_admin(auth.uid()));

-- Admins can delete subscribers
CREATE POLICY "newsletter_delete_admin"
  ON newsletter_subscribers FOR DELETE
  USING (is_admin(auth.uid()));

-- =====================================================
-- SEED DATA: CATEGORIES
-- =====================================================

INSERT INTO categories (name, slug, description, icon, color, display_order) VALUES
  ('AI & Machine Learning', 'ai-machine-learning', 'Artificial intelligence and ML tools', '🤖', '#8B5CF6', 1),
  ('Developer Tools', 'developer-tools', 'Tools for software developers', '🛠️', '#3B82F6', 2),
  ('Productivity', 'productivity', 'Apps to boost your productivity', '⚡', '#10B981', 3),
  ('Marketing', 'marketing', 'Marketing and growth tools', '📈', '#F59E0B', 4),
  ('Design', 'design', 'Design and creative tools', '🎨', '#EC4899', 5),
  ('Finance', 'finance', 'Financial tools and services', '💰', '#14B8A6', 6),
  ('Education', 'education', 'Learning and education platforms', '📚', '#6366F1', 7),
  ('Health & Fitness', 'health-fitness', 'Health and wellness apps', '🏃', '#EF4444', 8),
  ('E-commerce', 'ecommerce', 'Online selling and commerce', '🛒', '#F97316', 9),
  ('Communication', 'communication', 'Communication and collaboration', '💬', '#06B6D4', 10),
  ('Analytics', 'analytics', 'Data and analytics tools', '📊', '#8B5CF6', 11),
  ('No-Code', 'no-code', 'Build without coding', '🔧', '#84CC16', 12),
  ('Security', 'security', 'Security and privacy tools', '🔒', '#64748B', 13),
  ('Open Source', 'open-source', 'Open source projects', '🌐', '#22C55E', 14)
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  display_order = EXCLUDED.display_order;
  ('Open Source', 'open-source'),
  ('Other', 'other');

-- Storage bucket for product images
-- Run these in separate SQL statements or use the Supabase dashboard

-- Create storage bucket for product images (run in Supabase dashboard Storage section)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);

-- Storage policies (run after creating the bucket)
-- CREATE POLICY "Anyone can view product images"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'products');

-- CREATE POLICY "Authenticated users can upload product images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

-- CREATE POLICY "Users can update own product images"
--   ON storage.objects FOR UPDATE
--   USING (bucket_id = 'products' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can delete own product images"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'products' AND auth.uid()::text = (storage.foldername(name))[1]);
