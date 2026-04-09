-- ============================================================
-- JT Media Platform — Profiles, Policies & Schema Additions
-- Migration: 20260409000001_profiles_and_policies
-- Run this after 20260409000000_initial_schema.sql
-- ============================================================

-- ── Extra columns on existing tables ──────────────────────────
ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS org_number text,
  ADD COLUMN IF NOT EXISTS address    text;

ALTER TABLE billing_schedules
  ADD COLUMN IF NOT EXISTS billing_interval text NOT NULL DEFAULT 'monthly'
    CHECK (billing_interval IN ('monthly', 'quarterly', 'yearly'));

-- ── profiles ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text NOT NULL,
  full_name   text,
  role        text NOT NULL DEFAULT 'customer'
                CHECK (role IN ('admin', 'customer')),
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS profiles_role_idx        ON profiles(role);
CREATE INDEX IF NOT EXISTS profiles_customer_id_idx ON profiles(customer_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read & update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- ── Helper: is the current user an admin? ─────────────────────
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ── Admin: full access to all tables ──────────────────────────
CREATE POLICY "Admins full access to customers"
  ON customers FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins full access to packages"
  ON packages FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins full access to customer_packages"
  ON customer_packages FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins full access to projects"
  ON projects FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins full access to time_entries"
  ON time_entries FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admins full access to billing_schedules"
  ON billing_schedules FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ── Customer portal: read own data ────────────────────────────
CREATE POLICY "Customers view own record"
  ON customers FOR SELECT TO authenticated
  USING (
    id IN (
      SELECT customer_id FROM profiles
      WHERE id = auth.uid() AND role = 'customer'
    )
  );

CREATE POLICY "Customers view own projects"
  ON projects FOR SELECT TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM profiles
      WHERE id = auth.uid() AND role = 'customer'
    )
  );

CREATE POLICY "Customers view own time_entries"
  ON time_entries FOR SELECT TO authenticated
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN profiles pr ON p.customer_id = pr.customer_id
      WHERE pr.id = auth.uid() AND pr.role = 'customer'
    )
  );

CREATE POLICY "Customers view own billing"
  ON billing_schedules FOR SELECT TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM profiles
      WHERE id = auth.uid() AND role = 'customer'
    )
  );

-- ── Auto-create profile on signup ─────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'customer')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── INSTRUCTIONS ──────────────────────────────────────────────
-- Run this entire file in the Supabase SQL Editor:
--   Dashboard → SQL Editor → New query → paste → Run
--
-- To make yourself an admin after signing up:
--   UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
