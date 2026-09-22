-- ============================================================
-- JT Media Platform — En enda säljtavla
-- Migration: 20260922100000_sales_single_board
--
-- Prospekt-fliken i pipelinen tas bort. /admin/salj blir det enda stället
-- för företag vi säljer till, så sales_opportunities får prospektens fält
-- och tydligare steg. Befintliga prospekt flyttas över. Tabellen prospects
-- lämnas kvar tom som säkerhet och kan tas bort senare.
-- ============================================================

-- ── Nya fält ──────────────────────────────────────────────────
ALTER TABLE sales_opportunities
  ADD COLUMN IF NOT EXISTS phone       text,
  ADD COLUMN IF NOT EXISTS city        text,
  ADD COLUMN IF NOT EXISTS lead_source text,   -- Rekommendation, Hemsidan, Säljagenten …
  ADD COLUMN IF NOT EXISTS meeting_at  date;

-- ── Nya steg ──────────────────────────────────────────────────
-- identified  Identifierad      (hittad, inget skrivet)
-- to_contact  Att kontakta      (utkast klart, väntar på att skickas)
-- contacted   Kontaktad         (mejl skickat, väntar på svar)
-- dialog      Dialog            (svar mottaget eller möte bokat)
-- proposal    Offert skickad
-- won / lost  Vunnen / Avböjd
ALTER TABLE sales_opportunities DROP CONSTRAINT IF EXISTS sales_opportunities_stage_check;

UPDATE sales_opportunities SET stage = 'to_contact' WHERE stage = 'review';
UPDATE sales_opportunities SET stage = 'contacted'  WHERE stage = 'sent';
UPDATE sales_opportunities SET stage = 'dialog'     WHERE stage = 'replied';

ALTER TABLE sales_opportunities
  ADD CONSTRAINT sales_opportunities_stage_check
  CHECK (stage IN ('identified', 'to_contact', 'contacted', 'dialog', 'proposal', 'won', 'lost'));

ALTER TABLE sales_opportunities ALTER COLUMN stage SET DEFAULT 'identified';

-- ── Flytta över prospekt ──────────────────────────────────────
-- Exempelraderna från pipeline-migrationen hoppas över.
INSERT INTO sales_opportunities
  (company, contact_name, email, phone, website, city, customer_id, kind, service_name, stage,
   priority, source, lead_source, summary, estimated_value, next_action_at, notes, created_at, updated_at)
SELECT
  p.company, p.contact_name, p.email, p.phone, p.website, p.city, p.customer_id,
  CASE WHEN p.customer_id IS NULL THEN 'new' ELSE 'upsell' END,
  p.interest,
  CASE p.stage
    WHEN 'meeting' THEN 'dialog'
    ELSE p.stage
  END,
  2, 'manual', p.source, p.notes, p.estimated_value, p.next_action_at, NULL, p.created_at, p.updated_at
FROM prospects p
WHERE p.company NOT ILIKE '%(exempel)%'
  AND NOT EXISTS (
    SELECT 1 FROM sales_opportunities s WHERE lower(s.company) = lower(p.company)
  );

-- Koppling till prospects behövs inte längre.
ALTER TABLE sales_opportunities DROP COLUMN IF EXISTS prospect_id;

DELETE FROM prospects;
