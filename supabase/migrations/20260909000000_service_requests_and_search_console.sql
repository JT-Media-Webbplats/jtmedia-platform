-- ============================================================
-- JT Media Platform — Service requests from the customer portal
--                     + Google Search Console link per customer
-- Migration: 20260909000000_service_requests_and_search_console
-- ============================================================

-- ── Search Console property per customer ──────────────────────
-- Either "sc-domain:kundensforetag.se" (domain property) or
-- "https://kundensforetag.se/" (URL prefix property). The JT Media
-- service account must be added as a user on the property.
ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS search_console_site text;

-- ── service_requests ──────────────────────────────────────────
-- Requests a customer sends from the portal: "vi vill ha Google Ads",
-- "koppla på Search Console", or a free-text message to the team.
CREATE TABLE IF NOT EXISTS service_requests (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id  uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  profile_id   uuid REFERENCES profiles(id) ON DELETE SET NULL,
  kind         text NOT NULL DEFAULT 'service'
                 CHECK (kind IN ('service', 'message')),
  service_key  text,
  service_name text NOT NULL,
  message      text,
  status       text NOT NULL DEFAULT 'new'
                 CHECK (status IN ('new', 'in_progress', 'done', 'declined')),
  admin_note   text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS service_requests_customer_id_idx ON service_requests(customer_id);
CREATE INDEX IF NOT EXISTS service_requests_status_idx      ON service_requests(status);

DROP TRIGGER IF EXISTS service_requests_updated_at ON service_requests;
CREATE TRIGGER service_requests_updated_at
  BEFORE UPDATE ON service_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins full access to service_requests" ON service_requests;
CREATE POLICY "Admins full access to service_requests"
  ON service_requests FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Customers view own requests" ON service_requests;
CREATE POLICY "Customers view own requests"
  ON service_requests FOR SELECT TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM profiles
      WHERE id = auth.uid() AND role = 'customer'
    )
  );

DROP POLICY IF EXISTS "Customers create own requests" ON service_requests;
CREATE POLICY "Customers create own requests"
  ON service_requests FOR INSERT TO authenticated
  WITH CHECK (
    profile_id = auth.uid()
    AND customer_id IN (
      SELECT customer_id FROM profiles
      WHERE id = auth.uid() AND role = 'customer'
    )
  );
