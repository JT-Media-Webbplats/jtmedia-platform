-- ============================================================
-- JT Media Platform — Extra customer fields for Fortnox import
-- Migration: 20260409000002_customer_extra_fields
-- ============================================================

ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS customer_number text UNIQUE,
  ADD COLUMN IF NOT EXISTS postal_code     text,
  ADD COLUMN IF NOT EXISTS city            text,
  ADD COLUMN IF NOT EXISTS country         text DEFAULT 'SE';
