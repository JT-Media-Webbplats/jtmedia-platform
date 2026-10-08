-- ============================================================
-- JT Media Platform — Datakällor för automatiska rapporter
-- Migration: 20261008100000_report_sources
-- ============================================================

ALTER TABLE report_clients
  ADD COLUMN IF NOT EXISTS gsc_site         text,  -- Search Console property, e.g. 'sc-domain:foretaget.se'
  ADD COLUMN IF NOT EXISTS ga4_property_id  text,  -- numeric GA4 property id
  ADD COLUMN IF NOT EXISTS ads_customer_id  text;  -- Google Ads account, e.g. '832-274-2435'

-- Store the figures used in each generated report so a month can be re-downloaded unchanged.
ALTER TABLE monthly_reports
  ADD COLUMN IF NOT EXISTS stats         jsonb,
  ADD COLUMN IF NOT EXISTS generated_at  timestamptz;
