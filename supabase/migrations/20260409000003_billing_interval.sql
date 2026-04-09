-- ============================================================
-- JT Media Platform — Add billing_interval to billing_schedules
-- Migration: 20260409000003_billing_interval
-- ============================================================

ALTER TABLE billing_schedules
  ADD COLUMN IF NOT EXISTS billing_interval text NOT NULL DEFAULT 'monthly'
    CHECK (billing_interval IN ('monthly', 'quarterly', 'semi-annual', 'yearly'));
