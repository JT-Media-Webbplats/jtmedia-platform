-- ============================================================
-- JT Media Platform — Google Ads-kampanjer per rapportkund
-- Migration: 20261008200000_report_ads_campaigns
-- ============================================================

-- Most customers' campaigns live in JT Media's shared Ads account (767-093-0819),
-- named after the customer. The report sums the campaigns whose name contains this text.
-- Empty = every campaign in the account (customers with their own Ads account).
ALTER TABLE report_clients
  ADD COLUMN IF NOT EXISTS ads_campaign_match text;
