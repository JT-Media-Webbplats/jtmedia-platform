-- ============================================================
-- JT Media Platform — Customer services + portal login linking
-- Migration: 20260903000000_customer_services_and_portal
-- ============================================================

-- ── customer_services ─────────────────────────────────────────
-- One row per service a customer has with us (hemsida, hosting,
-- domän, e-post, SEO, GEO, Google Ads ...). Shown in the customer
-- portal so the customer always sees exactly what they have.
CREATE TABLE IF NOT EXISTS customer_services (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id      uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  name             text NOT NULL,
  type             text NOT NULL DEFAULT 'other'
                     CHECK (type IN (
                       'website', 'hosting', 'domain', 'email', 'maintenance',
                       'seo', 'geo', 'google_ads', 'social', 'ai', 'design', 'other'
                     )),
  domain           text,
  description      text,
  status           text NOT NULL DEFAULT 'active'
                     CHECK (status IN ('active', 'paused', 'ended')),
  billing_interval text
                     CHECK (billing_interval IN ('monthly', 'quarterly', 'semi-annual', 'yearly', 'one_time')),
  amount           numeric(10,2),
  currency         text NOT NULL DEFAULT 'SEK',
  started_at       date NOT NULL DEFAULT current_date,
  renews_at        date,
  ended_at         date,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS customer_services_customer_id_idx ON customer_services(customer_id);
CREATE INDEX IF NOT EXISTS customer_services_status_idx      ON customer_services(status);

DROP TRIGGER IF EXISTS customer_services_updated_at ON customer_services;
CREATE TRIGGER customer_services_updated_at
  BEFORE UPDATE ON customer_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE customer_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access to customer_services"
  ON customer_services FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Customers view own services"
  ON customer_services FOR SELECT TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM profiles
      WHERE id = auth.uid() AND role = 'customer'
    )
  );

-- ── Admins may read and update all profiles ───────────────────
-- Needed so admin can see which login accounts belong to a customer
-- and link an account manually. is_admin() is SECURITY DEFINER so
-- this does not recurse.
DROP POLICY IF EXISTS "Admins full access to profiles" ON profiles;
CREATE POLICY "Admins full access to profiles"
  ON profiles FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ── Auto-link new logins to a customer by e-mail ──────────────
-- When a login is created, the profile is created and linked to the
-- customer with the same e-mail address. Admin can override the link.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, customer_id)
  VALUES (
    new.id,
    new.email,
    'customer',
    (SELECT c.id FROM public.customers c WHERE lower(c.email) = lower(new.email) LIMIT 1)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- Backfill: link existing customer profiles that match a customer e-mail
UPDATE profiles p
SET    customer_id = c.id
FROM   customers c
WHERE  p.customer_id IS NULL
  AND  p.role = 'customer'
  AND  lower(p.email) = lower(c.email);

-- ── INSTRUCTIONS ──────────────────────────────────────────────
-- 1. Run this file in the Supabase SQL Editor.
-- 2. Add SUPABASE_SERVICE_ROLE_KEY to .env.local (Project Settings → API).
--    Admin creates customer logins (e-mail + password) from the customer
--    page in /admin; that requires the service role key on the server.
-- 3. Create the first admin + customer accounts with:
--      npx tsx scripts/seed-portal-accounts.ts
