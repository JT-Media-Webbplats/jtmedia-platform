-- ============================================================
-- JT Media Platform — Pipeline (kanban) for projects + prospects
-- Migration: 20260909100000_pipeline
-- ============================================================

-- ── Projects: add "väntar på godkännande" ─────────────────────
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;
ALTER TABLE projects
  ADD CONSTRAINT projects_status_check
  CHECK (status IN ('pending', 'active', 'paused', 'completed', 'cancelled'));

-- ── prospects ─────────────────────────────────────────────────
-- Companies we should contact or are in dialogue with, before they
-- become customers. Admin only.
CREATE TABLE IF NOT EXISTS prospects (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company         text NOT NULL,
  contact_name    text,
  email           text,
  phone           text,
  website         text,
  city            text,
  stage           text NOT NULL DEFAULT 'to_contact'
                    CHECK (stage IN ('to_contact', 'contacted', 'meeting', 'proposal', 'won', 'lost')),
  source          text,
  interest        text,
  estimated_value numeric(10,2),
  notes           text,
  next_action_at  date,
  customer_id     uuid REFERENCES customers(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS prospects_stage_idx          ON prospects(stage);
CREATE INDEX IF NOT EXISTS prospects_next_action_at_idx ON prospects(next_action_at);

DROP TRIGGER IF EXISTS prospects_updated_at ON prospects;
CREATE TRIGGER prospects_updated_at
  BEFORE UPDATE ON prospects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins full access to prospects" ON prospects;
CREATE POLICY "Admins full access to prospects"
  ON prospects FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());
