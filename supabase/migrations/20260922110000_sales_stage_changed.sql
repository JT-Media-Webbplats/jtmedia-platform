-- ============================================================
-- JT Media Platform — Spåra när ett säljkort bytte kolumn
-- Migration: 20260922110000_sales_stage_changed
--
-- Datumfälten (nästa åtgärd, möte) tas bort ur gränssnittet. Istället
-- visar tavlan hur länge ett kort legat i sin kolumn, helt automatiskt.
-- ============================================================

ALTER TABLE sales_opportunities
  ADD COLUMN IF NOT EXISTS stage_changed_at timestamptz NOT NULL DEFAULT now();

UPDATE sales_opportunities SET stage_changed_at = updated_at WHERE stage_changed_at IS NULL;

CREATE OR REPLACE FUNCTION sales_opportunities_stage_changed()
RETURNS trigger AS $$
BEGIN
  IF NEW.stage IS DISTINCT FROM OLD.stage THEN
    NEW.stage_changed_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sales_opportunities_stage_changed ON sales_opportunities;
CREATE TRIGGER sales_opportunities_stage_changed
  BEFORE UPDATE ON sales_opportunities
  FOR EACH ROW EXECUTE FUNCTION sales_opportunities_stage_changed();
