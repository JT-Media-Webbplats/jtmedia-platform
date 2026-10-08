-- ============================================================
-- JT Media Platform — Månadsrapporter (Digital Boost)
-- Migration: 20261008000000_monthly_reports
-- ============================================================

-- ── report_clients ────────────────────────────────────────────
-- One row per customer that gets a statistics report every month.
CREATE TABLE IF NOT EXISTS report_clients (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id  uuid NOT NULL UNIQUE REFERENCES customers(id) ON DELETE CASCADE,
  report_day   smallint CHECK (report_day BETWEEN 1 AND 31),  -- day of month the report is due
  status       text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused')),
  website      text,
  notes        text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS report_clients_updated_at ON report_clients;
CREATE TRIGGER report_clients_updated_at
  BEFORE UPDATE ON report_clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE report_clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins full access to report_clients" ON report_clients;
CREATE POLICY "Admins full access to report_clients"
  ON report_clients FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ── monthly_reports ───────────────────────────────────────────
-- One row per client and month once the report has been sent.
CREATE TABLE IF NOT EXISTS monthly_reports (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_client_id  uuid NOT NULL REFERENCES report_clients(id) ON DELETE CASCADE,
  period            date NOT NULL,           -- first day of the month the report belongs to
  sent_at           timestamptz,
  file_url          text,
  notes             text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (report_client_id, period)
);

CREATE INDEX IF NOT EXISTS monthly_reports_period_idx ON monthly_reports(period);

ALTER TABLE monthly_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins full access to monthly_reports" ON monthly_reports;
CREATE POLICY "Admins full access to monthly_reports"
  ON monthly_reports FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());
