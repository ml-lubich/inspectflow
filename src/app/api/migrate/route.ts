import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const migrations = [
    // Profiles table
    `CREATE TABLE IF NOT EXISTS profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
      company_name TEXT DEFAULT '',
      company_logo_url TEXT,
      phone TEXT DEFAULT '',
      email TEXT DEFAULT '',
      license_number TEXT DEFAULT '',
      full_name TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    // Inspections table
    `CREATE TABLE IF NOT EXISTS inspections (
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
      share_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(12), 'hex')
    )`,
    // Inspection items table
    `CREATE TABLE IF NOT EXISTS inspection_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      inspection_id UUID REFERENCES inspections(id) ON DELETE CASCADE NOT NULL,
      category TEXT NOT NULL,
      item_name TEXT NOT NULL,
      rating TEXT DEFAULT 'Not Inspected' CHECK (rating IN ('Good', 'Fair', 'Poor', 'Not Inspected')),
      notes TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0
    )`,
    // Inspection photos table
    `CREATE TABLE IF NOT EXISTS inspection_photos (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      inspection_item_id UUID REFERENCES inspection_items(id) ON DELETE CASCADE NOT NULL,
      photo_url TEXT NOT NULL,
      caption TEXT DEFAULT ''
    )`,
    // Templates table
    `CREATE TABLE IF NOT EXISTS templates (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      name TEXT NOT NULL,
      is_default BOOLEAN DEFAULT FALSE,
      categories JSONB NOT NULL DEFAULT '{}'
    )`,
    // RLS Policies
    `ALTER TABLE profiles ENABLE ROW LEVEL SECURITY`,
    `ALTER TABLE inspections ENABLE ROW LEVEL SECURITY`,
    `ALTER TABLE inspection_items ENABLE ROW LEVEL SECURITY`,
    `ALTER TABLE inspection_photos ENABLE ROW LEVEL SECURITY`,
    `ALTER TABLE templates ENABLE ROW LEVEL SECURITY`,
    // Profiles policies
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'profiles_select_own') THEN
        CREATE POLICY profiles_select_own ON profiles FOR SELECT USING (auth.uid() = user_id);
      END IF;
    END $$`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'profiles_insert_own') THEN
        CREATE POLICY profiles_insert_own ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
      END IF;
    END $$`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'profiles_update_own') THEN
        CREATE POLICY profiles_update_own ON profiles FOR UPDATE USING (auth.uid() = user_id);
      END IF;
    END $$`,
    // Inspections policies
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'inspections_select_own') THEN
        CREATE POLICY inspections_select_own ON inspections FOR SELECT USING (auth.uid() = user_id);
      END IF;
    END $$`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'inspections_insert_own') THEN
        CREATE POLICY inspections_insert_own ON inspections FOR INSERT WITH CHECK (auth.uid() = user_id);
      END IF;
    END $$`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'inspections_update_own') THEN
        CREATE POLICY inspections_update_own ON inspections FOR UPDATE USING (auth.uid() = user_id);
      END IF;
    END $$`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'inspections_delete_own') THEN
        CREATE POLICY inspections_delete_own ON inspections FOR DELETE USING (auth.uid() = user_id);
      END IF;
    END $$`,
    // Inspection items policies (via inspection ownership)
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'items_select_own') THEN
        CREATE POLICY items_select_own ON inspection_items FOR SELECT
          USING (EXISTS (SELECT 1 FROM inspections WHERE inspections.id = inspection_items.inspection_id AND inspections.user_id = auth.uid()));
      END IF;
    END $$`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'items_insert_own') THEN
        CREATE POLICY items_insert_own ON inspection_items FOR INSERT
          WITH CHECK (EXISTS (SELECT 1 FROM inspections WHERE inspections.id = inspection_items.inspection_id AND inspections.user_id = auth.uid()));
      END IF;
    END $$`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'items_update_own') THEN
        CREATE POLICY items_update_own ON inspection_items FOR UPDATE
          USING (EXISTS (SELECT 1 FROM inspections WHERE inspections.id = inspection_items.inspection_id AND inspections.user_id = auth.uid()));
      END IF;
    END $$`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'items_delete_own') THEN
        CREATE POLICY items_delete_own ON inspection_items FOR DELETE
          USING (EXISTS (SELECT 1 FROM inspections WHERE inspections.id = inspection_items.inspection_id AND inspections.user_id = auth.uid()));
      END IF;
    END $$`,
    // Photos policies (via item -> inspection ownership)
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'photos_select_own') THEN
        CREATE POLICY photos_select_own ON inspection_photos FOR SELECT
          USING (EXISTS (
            SELECT 1 FROM inspection_items
            JOIN inspections ON inspections.id = inspection_items.inspection_id
            WHERE inspection_items.id = inspection_photos.inspection_item_id
            AND inspections.user_id = auth.uid()
          ));
      END IF;
    END $$`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'photos_insert_own') THEN
        CREATE POLICY photos_insert_own ON inspection_photos FOR INSERT
          WITH CHECK (EXISTS (
            SELECT 1 FROM inspection_items
            JOIN inspections ON inspections.id = inspection_items.inspection_id
            WHERE inspection_items.id = inspection_photos.inspection_item_id
            AND inspections.user_id = auth.uid()
          ));
      END IF;
    END $$`,
    // Templates policies
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'templates_select_own') THEN
        CREATE POLICY templates_select_own ON templates FOR SELECT USING (auth.uid() = user_id);
      END IF;
    END $$`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'templates_insert_own') THEN
        CREATE POLICY templates_insert_own ON templates FOR INSERT WITH CHECK (auth.uid() = user_id);
      END IF;
    END $$`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'templates_update_own') THEN
        CREATE POLICY templates_update_own ON templates FOR UPDATE USING (auth.uid() = user_id);
      END IF;
    END $$`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'templates_delete_own') THEN
        CREATE POLICY templates_delete_own ON templates FOR DELETE USING (auth.uid() = user_id);
      END IF;
    END $$`,
    // Public read access for shared reports (by share_token)
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'inspections_public_share') THEN
        CREATE POLICY inspections_public_share ON inspections FOR SELECT
          USING (share_token IS NOT NULL AND status = 'completed');
      END IF;
    END $$`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'items_public_share') THEN
        CREATE POLICY items_public_share ON inspection_items FOR SELECT
          USING (EXISTS (
            SELECT 1 FROM inspections
            WHERE inspections.id = inspection_items.inspection_id
            AND inspections.share_token IS NOT NULL
            AND inspections.status = 'completed'
          ));
      END IF;
    END $$`,
    // Create profile automatically on signup
    `CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger AS $$
    BEGIN
      INSERT INTO public.profiles (user_id, email, full_name)
      VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
      END IF;
    END $$`,
  ];

  const results: { step: number; ok: boolean; error?: string }[] = [];

  for (let i = 0; i < migrations.length; i++) {
    const { error } = await supabase.rpc("exec_sql", { sql: migrations[i] }).maybeSingle();
    if (error) {
      // Try direct query approach
      const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseServiceKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({ sql: migrations[i] }),
      });
      if (!res.ok) {
        results.push({ step: i, ok: false, error: error.message });
      } else {
        results.push({ step: i, ok: true });
      }
    } else {
      results.push({ step: i, ok: true });
    }
  }

  const failed = results.filter((r) => !r.ok);
  return NextResponse.json({
    success: failed.length === 0,
    total: migrations.length,
    failed: failed.length,
    errors: failed,
  });
}
