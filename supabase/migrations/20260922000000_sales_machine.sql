-- ============================================================
-- JT Media Platform — Säljmaskin (sales opportunities + agent runs)
-- Migration: 20260922000000_sales_machine
-- ============================================================

-- ── sales_opportunities ───────────────────────────────────────
-- One row per "here is something we could sell to X". Created by the
-- Claude sales agent (source = 'agent') or by hand in /admin/salj.
CREATE TABLE IF NOT EXISTS sales_opportunities (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company          text NOT NULL,
  contact_name     text,
  email            text,
  website          text,
  customer_id      uuid REFERENCES customers(id) ON DELETE SET NULL,
  prospect_id      uuid REFERENCES prospects(id) ON DELETE SET NULL,
  kind             text NOT NULL DEFAULT 'upsell'
                     CHECK (kind IN ('upsell', 'new', 'reactivation')),
  service_key      text,           -- key in lib/portal.ts serviceCatalog, or 'other'
  service_name     text,           -- free-text label when service_key is null/other
  stage            text NOT NULL DEFAULT 'identified'
                     CHECK (stage IN ('identified', 'review', 'sent', 'replied', 'won', 'lost')),
  priority         smallint NOT NULL DEFAULT 2 CHECK (priority BETWEEN 1 AND 3),  -- 1 = hög
  source           text NOT NULL DEFAULT 'manual' CHECK (source IN ('agent', 'manual')),
  summary          text,           -- why this is an opportunity (Swedish, 1-3 sentences)
  evidence         text,           -- quotes / summary from the e-mail thread
  gmail_thread_id  text,
  draft_subject    text,
  draft_body       text,
  estimated_value  numeric(10,2),  -- kr/år
  next_action_at   date,
  sent_at          timestamptz,
  replied_at       timestamptz,
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sales_opportunities_stage_idx       ON sales_opportunities(stage);
CREATE INDEX IF NOT EXISTS sales_opportunities_customer_id_idx ON sales_opportunities(customer_id);
CREATE INDEX IF NOT EXISTS sales_opportunities_company_idx     ON sales_opportunities(lower(company));

DROP TRIGGER IF EXISTS sales_opportunities_updated_at ON sales_opportunities;
CREATE TRIGGER sales_opportunities_updated_at
  BEFORE UPDATE ON sales_opportunities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE sales_opportunities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins full access to sales_opportunities" ON sales_opportunities;
CREATE POLICY "Admins full access to sales_opportunities"
  ON sales_opportunities FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ── sales_agent_runs ──────────────────────────────────────────
-- Log of each time the Claude sales agent scanned the mailbox.
CREATE TABLE IF NOT EXISTS sales_agent_runs (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ran_at                timestamptz NOT NULL DEFAULT now(),
  threads_scanned       integer NOT NULL DEFAULT 0,
  opportunities_created integer NOT NULL DEFAULT 0,
  opportunities_updated integer NOT NULL DEFAULT 0,
  summary               text,
  created_at            timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sales_agent_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins full access to sales_agent_runs" ON sales_agent_runs;
CREATE POLICY "Admins full access to sales_agent_runs"
  ON sales_agent_runs FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());
