-- ============================================================
-- JT Media Platform — Engångs- eller återkommande värde på säljkort
-- Migration: 20260922120000_sales_value_type
-- ============================================================

ALTER TABLE sales_opportunities
  ADD COLUMN IF NOT EXISTS value_type text NOT NULL DEFAULT 'recurring'
    CHECK (value_type IN ('recurring', 'one_time'));
