-- ============================================================
-- JT Media Platform — SEO-logg per rapportkund
-- Migration: 20261008300000_seo_work_log
-- ============================================================

-- One row per SEO session (usually one per customer and month), written by the /seo
-- skill or by hand. The report's e-mail suggestion lists the customer-facing items.
CREATE TABLE IF NOT EXISTS seo_work_log (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_client_id  uuid NOT NULL REFERENCES report_clients(id) ON DELETE CASCADE,
  period            date NOT NULL,                 -- first day of the report month it belongs to
  done_at           timestamptz NOT NULL DEFAULT now(),
  items             text[] NOT NULL DEFAULT '{}',  -- customer-facing Swedish bullets for the e-mail
  details           text,                          -- technical notes for us (what changed, where, before/after)
  pages             text[] NOT NULL DEFAULT '{}',  -- URLs that were changed, used to measure the effect next month
  source            text NOT NULL DEFAULT 'agent' CHECK (source IN ('agent', 'manual')),
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS seo_work_log_client_period_idx ON seo_work_log(report_client_id, period);

ALTER TABLE seo_work_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins full access to seo_work_log" ON seo_work_log;
CREATE POLICY "Admins full access to seo_work_log"
  ON seo_work_log FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());
