-- Enable extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop existing tables (from previous project)
DROP TABLE IF EXISTS inspection_photos CASCADE;
DROP TABLE IF EXISTS inspection_items CASCADE;
DROP TABLE IF EXISTS inspections CASCADE;
DROP TABLE IF EXISTS templates CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
-- Drop any other leftover tables
DROP TABLE IF EXISTS permits CASCADE;
DROP TABLE IF EXISTS contractors CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS scrape_results CASCADE;

-- Drop existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  company_name TEXT DEFAULT '',
  company_logo_url TEXT,
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  license_number TEXT DEFAULT '',
  full_name TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inspections table
CREATE TABLE inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_address TEXT NOT NULL,
  property_type TEXT DEFAULT 'Single Family',
  year_built TEXT DEFAULT '',
  sq_ft TEXT DEFAULT '',
  bedrooms TEXT DEFAULT '',
  bathrooms TEXT DEFAULT '',
  client_name TEXT DEFAULT '',
  client_email TEXT DEFAULT '',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in-progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  scheduled_date TIMESTAMPTZ,
  share_token TEXT UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', '')
);

-- Inspection items table
CREATE TABLE inspection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID REFERENCES inspections(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  item_name TEXT NOT NULL,
  rating TEXT DEFAULT 'Not Inspected' CHECK (rating IN ('Good', 'Fair', 'Poor', 'Not Inspected')),
  notes TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0
);

-- Inspection photos table
CREATE TABLE inspection_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_item_id UUID REFERENCES inspection_items(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  caption TEXT DEFAULT ''
);

-- Templates table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  categories JSONB NOT NULL DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY profiles_select_own ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY profiles_insert_own ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY profiles_update_own ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- Inspections policies (user's own)
CREATE POLICY inspections_select_own ON inspections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY inspections_insert_own ON inspections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY inspections_update_own ON inspections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY inspections_delete_own ON inspections FOR DELETE USING (auth.uid() = user_id);

-- Public read for shared reports (unauthenticated visitors)
CREATE POLICY inspections_public_share ON inspections FOR SELECT
  USING (share_token IS NOT NULL AND status = 'completed');

-- Inspection items policies
CREATE POLICY items_select_own ON inspection_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM inspections WHERE inspections.id = inspection_items.inspection_id AND inspections.user_id = auth.uid()));
CREATE POLICY items_insert_own ON inspection_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM inspections WHERE inspections.id = inspection_items.inspection_id AND inspections.user_id = auth.uid()));
CREATE POLICY items_update_own ON inspection_items FOR UPDATE
  USING (EXISTS (SELECT 1 FROM inspections WHERE inspections.id = inspection_items.inspection_id AND inspections.user_id = auth.uid()));
CREATE POLICY items_delete_own ON inspection_items FOR DELETE
  USING (EXISTS (SELECT 1 FROM inspections WHERE inspections.id = inspection_items.inspection_id AND inspections.user_id = auth.uid()));

-- Public read for items on shared reports
CREATE POLICY items_public_share ON inspection_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM inspections
    WHERE inspections.id = inspection_items.inspection_id
    AND inspections.share_token IS NOT NULL
    AND inspections.status = 'completed'
  ));

-- Photos policies
CREATE POLICY photos_select_own ON inspection_photos FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM inspection_items
    JOIN inspections ON inspections.id = inspection_items.inspection_id
    WHERE inspection_items.id = inspection_photos.inspection_item_id
    AND inspections.user_id = auth.uid()
  ));
CREATE POLICY photos_insert_own ON inspection_photos FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM inspection_items
    JOIN inspections ON inspections.id = inspection_items.inspection_id
    WHERE inspection_items.id = inspection_photos.inspection_item_id
    AND inspections.user_id = auth.uid()
  ));

-- Templates policies
CREATE POLICY templates_select_own ON templates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY templates_insert_own ON templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY templates_update_own ON templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY templates_delete_own ON templates FOR DELETE USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
