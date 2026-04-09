#!/usr/bin/env npx tsx
/**
 * JT Media — Customer & Billing Import Script
 *
 * Imports customers from the billing schedule document into Supabase.
 * For full Fortnox customer data (org_number, postal_code, city, email, phone),
 * add those fields to the CUSTOMERS array below before running.
 *
 * Prerequisites:
 *   1. Run migration 20260409000002_customer_extra_fields.sql in Supabase SQL Editor
 *   2. Add SUPABASE_SERVICE_ROLE_KEY to .env.local
 *      → Supabase dashboard → Project Settings → API → service_role key
 *   3. Run: npx tsx scripts/import-data.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// ─── Load .env.local ─────────────────────────────────────────────────────────
function loadEnvFile(file: string) {
  const full = path.resolve(process.cwd(), file)
  if (!fs.existsSync(full)) return
  for (const line of fs.readFileSync(full, 'utf-8').split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/)
    if (!m) continue
    if (!process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
  }
}
loadEnvFile('.env.local')

const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('\n❌  Missing env vars. Add to .env.local:')
  if (!SUPABASE_URL)       console.error('   NEXT_PUBLIC_SUPABASE_URL=...')
  if (!SUPABASE_SERVICE_KEY) console.error('   SUPABASE_SERVICE_ROLE_KEY=...')
  console.error('\n   Get the service role key from:')
  console.error('   Supabase dashboard → Project Settings → API → service_role\n')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ─── Date helpers ─────────────────────────────────────────────────────────────
// Base date: script is calibrated from 2026-04-09
const TODAY = new Date('2026-04-09T00:00:00.000Z')

function fmt(d: Date): string {
  return d.toISOString().split('T')[0]
}

/** Next occurrence of a day-of-month for monthly billing */
function monthly(day: number): string {
  const d = new Date(Date.UTC(TODAY.getUTCFullYear(), TODAY.getUTCMonth(), day))
  if (d < TODAY) d.setUTCMonth(d.getUTCMonth() + 1)
  return fmt(d)
}

/** Next yearly occurrence of a specific day/month (both 1-indexed) */
function yearly(day: number, month: number): string {
  const d = new Date(Date.UTC(TODAY.getUTCFullYear(), month - 1, day))
  if (d < TODAY) d.setUTCFullYear(d.getUTCFullYear() + 1)
  return fmt(d)
}

/** Next quarterly date from a fixed set of day/month pairs */
function quarterly(dates: Array<[number, number]>): string {
  const candidates = dates.flatMap(([day, mon]) => [
    new Date(Date.UTC(TODAY.getUTCFullYear(),     mon - 1, day)),
    new Date(Date.UTC(TODAY.getUTCFullYear() + 1, mon - 1, day)),
  ])
  const future = candidates.filter(d => d >= TODAY).sort((a, b) => a.getTime() - b.getTime())
  return fmt(future[0])
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Interval = 'monthly' | 'quarterly' | 'yearly'

interface RawCustomer {
  name:            string
  customer_number?: string
  org_number?:      string
  email?:           string
  phone?:           string
  postal_code?:     string
  city?:            string
  country?:         string
}

interface RawBilling {
  customer:          string
  notes:             string
  amount:            number
  interval:          Interval
  next_billing_date: string
}

// ─── Customer data ─────────────────────────────────────────────────────────────
// Populate org_number / email / phone / postal_code / city from your Fortnox export
const CUSTOMERS: RawCustomer[] = [
  { name: 'AMS Sweden' },
  { name: 'Hårds Transport' },
  { name: 'ID Modeller' },
  { name: 'Laholm Stål' },
  { name: 'LBY Tech' },
  { name: 'Opido Plast' },
  { name: 'LPP' },
  { name: 'Clinic Charisma' },
  { name: 'Hotell Garvaren' },
  { name: 'Smefast' },
  { name: 'Lindblads' },
  { name: 'Expressmöbler' },
  { name: 'Ljungby Trädgårdsservice' },
  { name: 'WiMA Fritid' },
  { name: 'Feminett Trikå' },
  { name: 'Häst och Hälsa' },
  { name: 'Scandium Bil' },
  { name: 'Lastbilsstopp' },
  { name: 'Lagans GK' },
  { name: 'Locano' },
  { name: 'Stora Torget / BRF Loket' },
  { name: 'Kv Kvarnarna' },
  { name: 'Kvarteret Betlehem' },
  { name: 'Restaurangbolaget Ljungby' },
  { name: 'Restaurangbolaget Värnamo' },
  { name: 'Köpmansgatans fastighetsbolag' },
  { name: 'Ljungby Centrum' },
  { name: 'SK Redovisning' },
  { name: 'Michael Ströms Bygg' },
  { name: 'Swetec' },
  { name: 'Agunnarydsstiftelsen' },
  { name: 'Ljungby Schakt' },
  { name: 'Släggan' },
  { name: 'Ljungby Marksten' },
  { name: 'Ljungby Fordon' },
  { name: 'Ljungby Fiber' },
  { name: 'XL Bygg' },
  { name: 'Molico' },
  { name: 'Nycopac' },
  { name: 'Bolmsö Stuguthyrning' },
  { name: 'Konceptor' },
  { name: 'Agunnarydsgillet' },
  { name: 'Brandts Service' },
  { name: 'Autopartner' },
  { name: 'Emmegi Nordic' },
  { name: 'VBA Group' },
  { name: 'Grimslövs Skogstjänst' },
  { name: 'Ljungby Industriteknik' },
  { name: 'Pekuma' },
  { name: 'Euromirror' },
  { name: 'Mäklarhuset' },
  { name: 'Perssons Industrigolv' },
  { name: 'Z-teknik' },
  { name: 'Ljungby Flyttningsbyrå' },
  { name: 'Snickar Oden' },
  { name: 'Ljungby Gillar Olika' },
  { name: 'PT System / Pelltec' },
  { name: 'Baket i Ljungby' },
  { name: 'JB Utbildningar' },
  { name: 'Linds Skärteknik' },
  { name: 'Svenska Kyrkan / Begravningsmuseet' },
  { name: 'Hamneda Grus' },
  { name: 'Hotell Terraza / Ljungby Hotell' },
  { name: 'RH Dekor' },
  { name: 'Perssons VVS' },
  { name: 'Campus Ljungby' },
  { name: 'Sigvards Färghall' },
]

// ─── Billing schedule data ────────────────────────────────────────────────────
// Amounts with multipliers computed inline:
//   399×0.8  = 319.2     4788×0.8  = 3830.4    4788×0.85 = 4069.8
//   7188×0.8 = 5750.4    189×12    = 2268       299×12    = 3588
//
// Semi-annual billing (no 'semi-annual' interval in schema) is represented
// as two separate 'yearly' entries — one per billing date.
//
// Entries with amount=0 need amounts filled in from your pricing records.
const BILLING: RawBilling[] = [

  // ── AMS Sweden ───────────────────────────────────────────────────────────────
  { customer: 'AMS Sweden', notes: 'Social Media + Chatbot',    amount: 2000,   interval: 'monthly',  next_billing_date: monthly(15) },
  { customer: 'AMS Sweden', notes: 'Domain Renewal',            amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },
  { customer: 'AMS Sweden', notes: 'Website',                   amount: 3799,   interval: 'yearly',   next_billing_date: yearly(15, 10) },

  // ── Hårds Transport ──────────────────────────────────────────────────────────
  { customer: 'Hårds Transport', notes: 'Digital Boost',        amount: 0,      interval: 'monthly',  next_billing_date: monthly(28) },
  { customer: 'Hårds Transport', notes: 'LinkedIn Management',  amount: 1009.99,interval: 'monthly',  next_billing_date: monthly(28) },
  { customer: 'Hårds Transport', notes: 'Domain Renewal',       amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── ID Modeller ──────────────────────────────────────────────────────────────
  { customer: 'ID Modeller', notes: 'Website',                  amount: 3999,   interval: 'yearly',   next_billing_date: yearly(5, 4) },

  // ── Laholm Stål ──────────────────────────────────────────────────────────────
  { customer: 'Laholm Stål', notes: 'Google Ads',               amount: 1500,   interval: 'monthly',  next_billing_date: monthly(4) },
  { customer: 'Laholm Stål', notes: 'SEO',                      amount: 0,      interval: 'quarterly',next_billing_date: quarterly([[23,2],[23,5],[23,8],[23,11]]) },
  { customer: 'Laholm Stål', notes: 'Hosting',                  amount: 399,    interval: 'monthly',  next_billing_date: monthly(4) },

  // ── LBY Tech ─────────────────────────────────────────────────────────────────
  { customer: 'LBY Tech', notes: 'Social Media',                amount: 0,      interval: 'monthly',  next_billing_date: monthly(9) },
  { customer: 'LBY Tech', notes: 'Domain Renewal',              amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },
  { customer: 'LBY Tech', notes: 'Website (Apr renewal)',       amount: 1799,   interval: 'yearly',   next_billing_date: yearly(15, 4) },
  { customer: 'LBY Tech', notes: 'Website (Oct renewal)',       amount: 1799,   interval: 'yearly',   next_billing_date: yearly(15, 10) },

  // ── Opido Plast ──────────────────────────────────────────────────────────────
  { customer: 'Opido Plast', notes: 'Social Media',             amount: 3999,   interval: 'monthly',  next_billing_date: monthly(11) },

  // ── LPP ──────────────────────────────────────────────────────────────────────
  { customer: 'LPP', notes: 'Digital Boost',                    amount: 3000,   interval: 'monthly',  next_billing_date: monthly(18) },
  { customer: 'LPP', notes: 'Domain Renewal',                   amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── Clinic Charisma ──────────────────────────────────────────────────────────
  { customer: 'Clinic Charisma', notes: 'Website',              amount: 499,    interval: 'monthly',  next_billing_date: monthly(26) },
  { customer: 'Clinic Charisma', notes: 'Google Ads',           amount: 4000,   interval: 'monthly',  next_billing_date: monthly(26) },
  { customer: 'Clinic Charisma', notes: 'Domain Renewal',       amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── Hotell Garvaren ──────────────────────────────────────────────────────────
  // NOTE: "Digital Boost + 100kr" — base package price unknown, set amount when known
  { customer: 'Hotell Garvaren', notes: 'Digital Boost (+100kr surcharge)', amount: 100, interval: 'monthly', next_billing_date: monthly(22) },
  { customer: 'Hotell Garvaren', notes: 'Domain Renewal',       amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── Smefast ──────────────────────────────────────────────────────────────────
  { customer: 'Smefast', notes: 'Social Media',                 amount: 0,      interval: 'monthly',  next_billing_date: monthly(25) },
  { customer: 'Smefast', notes: 'Hosting',                      amount: 3699,   interval: 'yearly',   next_billing_date: yearly(5, 3) },
  { customer: 'Smefast', notes: 'License',                      amount: 2000,   interval: 'yearly',   next_billing_date: yearly(27, 3) },
  { customer: 'Smefast', notes: 'Domain Renewal',               amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── Lindblads ────────────────────────────────────────────────────────────────
  { customer: 'Lindblads', notes: 'Website',                    amount: 3599,   interval: 'yearly',   next_billing_date: yearly(18, 5) },
  { customer: 'Lindblads', notes: 'Domain Renewal',             amount: 0,      interval: 'yearly',   next_billing_date: yearly(18, 5) },

  // ── Expressmöbler ────────────────────────────────────────────────────────────
  // Semi-annual: two yearly entries
  { customer: 'Expressmöbler', notes: 'Website (Oct renewal)',  amount: 2700,   interval: 'yearly',   next_billing_date: yearly(1, 10) },
  { customer: 'Expressmöbler', notes: 'Website (Apr renewal)',  amount: 2700,   interval: 'yearly',   next_billing_date: yearly(1, 4) },

  // ── Ljungby Trädgårdsservice ─────────────────────────────────────────────────
  { customer: 'Ljungby Trädgårdsservice', notes: 'Website',     amount: 299,    interval: 'monthly',  next_billing_date: monthly(26) },
  { customer: 'Ljungby Trädgårdsservice', notes: 'Google Ads',  amount: 500,    interval: 'monthly',  next_billing_date: monthly(26) },
  { customer: 'Ljungby Trädgårdsservice', notes: 'Domain Renewal', amount: 0,   interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── WiMA Fritid ──────────────────────────────────────────────────────────────
  { customer: 'WiMA Fritid', notes: 'Website',                  amount: 499,    interval: 'monthly',  next_billing_date: monthly(26) },
  { customer: 'WiMA Fritid', notes: 'Social Media',             amount: 4999,   interval: 'monthly',  next_billing_date: monthly(26) },

  // ── Feminett Trikå ───────────────────────────────────────────────────────────
  { customer: 'Feminett Trikå', notes: 'Website',               amount: 399,    interval: 'monthly',  next_billing_date: monthly(18) },
  { customer: 'Feminett Trikå', notes: 'Domain Renewal',        amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── Häst och Hälsa ───────────────────────────────────────────────────────────
  { customer: 'Häst och Hälsa', notes: 'Website',               amount: 399,    interval: 'monthly',  next_billing_date: monthly(25) },

  // ── Scandium Bil ─────────────────────────────────────────────────────────────
  { customer: 'Scandium Bil', notes: 'Website',                 amount: 499,    interval: 'monthly',  next_billing_date: monthly(10) },
  { customer: 'Scandium Bil', notes: 'Domain Renewal',          amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── Lastbilsstopp ────────────────────────────────────────────────────────────
  { customer: 'Lastbilsstopp', notes: 'Website',                amount: 399,    interval: 'monthly',  next_billing_date: monthly(18) },
  { customer: 'Lastbilsstopp', notes: 'SEO',                    amount: 1000,   interval: 'monthly',  next_billing_date: monthly(18) },
  { customer: 'Lastbilsstopp', notes: 'Domain Renewal',         amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── Lagans GK ────────────────────────────────────────────────────────────────
  { customer: 'Lagans GK', notes: 'Hosting',                    amount: 1100,   interval: 'monthly',  next_billing_date: monthly(1) },

  // ── Locano ───────────────────────────────────────────────────────────────────
  { customer: 'Locano', notes: 'Hosting',                       amount: 299,    interval: 'monthly',  next_billing_date: monthly(27) },
  { customer: 'Locano', notes: 'Domain Renewal',                amount: 229,    interval: 'yearly',   next_billing_date: yearly(27, 5) },

  // ── Stora Torget / BRF Loket ─────────────────────────────────────────────────
  { customer: 'Stora Torget / BRF Loket', notes: 'Hosting',     amount: 299,    interval: 'monthly',  next_billing_date: monthly(27) },
  { customer: 'Stora Torget / BRF Loket', notes: 'Domain Renewal', amount: 229, interval: 'yearly',   next_billing_date: yearly(27, 5) },

  // ── Kv Kvarnarna ─────────────────────────────────────────────────────────────
  { customer: 'Kv Kvarnarna', notes: 'Hosting',                 amount: 299,    interval: 'monthly',  next_billing_date: monthly(27) },
  { customer: 'Kv Kvarnarna', notes: 'Domain Renewal',          amount: 229,    interval: 'yearly',   next_billing_date: yearly(27, 5) },

  // ── Kvarteret Betlehem ───────────────────────────────────────────────────────
  { customer: 'Kvarteret Betlehem', notes: 'Hosting',           amount: 299,    interval: 'monthly',  next_billing_date: monthly(27) },
  { customer: 'Kvarteret Betlehem', notes: 'Domain Renewal',    amount: 229,    interval: 'yearly',   next_billing_date: yearly(27, 5) },

  // ── Restaurangbolaget Ljungby ────────────────────────────────────────────────
  { customer: 'Restaurangbolaget Ljungby', notes: 'Hosting',    amount: 299,    interval: 'monthly',  next_billing_date: monthly(27) },
  { customer: 'Restaurangbolaget Ljungby', notes: 'Domain Renewal', amount: 229,interval: 'yearly',   next_billing_date: yearly(27, 5) },

  // ── Restaurangbolaget Värnamo ────────────────────────────────────────────────
  { customer: 'Restaurangbolaget Värnamo', notes: 'Hosting',    amount: 299,    interval: 'monthly',  next_billing_date: monthly(27) },
  { customer: 'Restaurangbolaget Värnamo', notes: 'Domain Renewal', amount: 229,interval: 'yearly',   next_billing_date: yearly(27, 5) },

  // ── Köpmansgatans fastighetsbolag ────────────────────────────────────────────
  { customer: 'Köpmansgatans fastighetsbolag', notes: 'Hosting', amount: 299,   interval: 'monthly',  next_billing_date: monthly(27) },
  { customer: 'Köpmansgatans fastighetsbolag', notes: 'Domain Renewal', amount: 229, interval: 'yearly', next_billing_date: yearly(27, 5) },

  // ── Ljungby Centrum ──────────────────────────────────────────────────────────
  { customer: 'Ljungby Centrum', notes: 'Hosting',              amount: 4788,   interval: 'yearly',   next_billing_date: yearly(18, 10) },
  { customer: 'Ljungby Centrum', notes: 'Domain Renewal',       amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── SK Redovisning ───────────────────────────────────────────────────────────
  { customer: 'SK Redovisning', notes: 'Hosting',               amount: 3598,   interval: 'yearly',   next_billing_date: yearly(15, 3) },
  { customer: 'SK Redovisning', notes: 'Domain Renewal',        amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── Michael Ströms Bygg ──────────────────────────────────────────────────────
  { customer: 'Michael Ströms Bygg', notes: 'Website',          amount: 3830,   interval: 'yearly',   next_billing_date: yearly(25, 1) },
  { customer: 'Michael Ströms Bygg', notes: 'Digital Boost',    amount: 0,      interval: 'monthly',  next_billing_date: monthly(4) },
  { customer: 'Michael Ströms Bygg', notes: 'Domain Renewal',   amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── Swetec ───────────────────────────────────────────────────────────────────
  // 189kr × 12 months = 2 268kr billed annually
  { customer: 'Swetec', notes: 'Hosting (189×12/year)',         amount: 2268,   interval: 'yearly',   next_billing_date: yearly(8, 2) },
  { customer: 'Swetec', notes: 'Translation',                   amount: 1600,   interval: 'yearly',   next_billing_date: yearly(8, 2) },

  // ── Agunnarydsstiftelsen ─────────────────────────────────────────────────────
  { customer: 'Agunnarydsstiftelsen', notes: 'Annual Package',  amount: 7188,   interval: 'yearly',   next_billing_date: yearly(26, 1) },
  { customer: 'Agunnarydsstiftelsen', notes: 'Domain Renewal',  amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── Ljungby Schakt (399×0.8 = 319.20 kr) ────────────────────────────────────
  { customer: 'Ljungby Schakt', notes: 'Hosting',               amount: 319.2,  interval: 'monthly',  next_billing_date: monthly(4) },
  { customer: 'Ljungby Schakt', notes: 'Domain Renewal',        amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── Släggan (399×0.8) ────────────────────────────────────────────────────────
  { customer: 'Släggan', notes: 'Hosting',                      amount: 319.2,  interval: 'monthly',  next_billing_date: monthly(4) },
  { customer: 'Släggan', notes: 'Domain Renewal',               amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── Ljungby Marksten (399×0.8) ───────────────────────────────────────────────
  { customer: 'Ljungby Marksten', notes: 'Hosting',             amount: 319.2,  interval: 'monthly',  next_billing_date: monthly(4) },
  { customer: 'Ljungby Marksten', notes: 'Domain Renewal',      amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── Ljungby Fordon (399×0.8) ─────────────────────────────────────────────────
  { customer: 'Ljungby Fordon', notes: 'Hosting',               amount: 319.2,  interval: 'monthly',  next_billing_date: monthly(4) },
  { customer: 'Ljungby Fordon', notes: 'Domain Renewal',        amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── Ljungby Fiber ────────────────────────────────────────────────────────────
  { customer: 'Ljungby Fiber', notes: 'Hosting',                amount: 399,    interval: 'monthly',  next_billing_date: monthly(16) },

  // ── XL Bygg ──────────────────────────────────────────────────────────────────
  { customer: 'XL Bygg', notes: 'Google My Business',           amount: 499.5,  interval: 'monthly',  next_billing_date: monthly(16) },

  // ── Molico ───────────────────────────────────────────────────────────────────
  { customer: 'Molico', notes: 'Digital Boost',                 amount: 2999,   interval: 'monthly',  next_billing_date: monthly(5) },
  { customer: 'Molico', notes: 'Google Ads',                    amount: 500,    interval: 'monthly',  next_billing_date: monthly(5) },
  { customer: 'Molico', notes: 'Domain Renewal',                amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── Nycopac ──────────────────────────────────────────────────────────────────
  { customer: 'Nycopac', notes: 'Social Media',                 amount: 3999,   interval: 'monthly',  next_billing_date: monthly(11) },

  // ── Bolmsö Stuguthyrning ─────────────────────────────────────────────────────
  { customer: 'Bolmsö Stuguthyrning', notes: 'Annual Package',  amount: 3599,   interval: 'yearly',   next_billing_date: yearly(6, 9) },
  { customer: 'Bolmsö Stuguthyrning', notes: 'Domain Renewal',  amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── Konceptor ────────────────────────────────────────────────────────────────
  { customer: 'Konceptor', notes: 'Website',                    amount: 4788,   interval: 'yearly',   next_billing_date: yearly(4, 9) },
  { customer: 'Konceptor', notes: 'Domain Renewal',             amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── Agunnarydsgillet ─────────────────────────────────────────────────────────
  { customer: 'Agunnarydsgillet', notes: 'Annual Package',      amount: 3780,   interval: 'yearly',   next_billing_date: yearly(25, 9) },
  { customer: 'Agunnarydsgillet', notes: 'Domain Renewal',      amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── Brandts Service ──────────────────────────────────────────────────────────
  { customer: 'Brandts Service', notes: 'Annual Package',       amount: 3599,   interval: 'yearly',   next_billing_date: yearly(18, 10) },
  { customer: 'Brandts Service', notes: 'Domain Renewal',       amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── Autopartner ──────────────────────────────────────────────────────────────
  { customer: 'Autopartner', notes: 'Service Package',          amount: 2999,   interval: 'monthly',  next_billing_date: monthly(4) },

  // ── Emmegi Nordic ────────────────────────────────────────────────────────────
  { customer: 'Emmegi Nordic', notes: 'Website',                amount: 4788,   interval: 'yearly',   next_billing_date: yearly(25, 11) },

  // ── VBA Group (189×12 = 2 268 kr) ───────────────────────────────────────────
  { customer: 'VBA Group', notes: 'Website (189×12/year)',      amount: 2268,   interval: 'yearly',   next_billing_date: yearly(14, 1) },

  // ── Grimslövs Skogstjänst ────────────────────────────────────────────────────
  // NOTE: "Digital Boost big" — amount unknown, set when known
  { customer: 'Grimslövs Skogstjänst', notes: 'Digital Boost (Big)', amount: 0, interval: 'monthly',  next_billing_date: monthly(4) },

  // ── Ljungby Industriteknik ───────────────────────────────────────────────────
  { customer: 'Ljungby Industriteknik', notes: 'Hosting',       amount: 399,    interval: 'monthly',  next_billing_date: monthly(20) },

  // ── Pekuma ───────────────────────────────────────────────────────────────────
  // NOTE: Digital Boost amount unknown
  { customer: 'Pekuma', notes: 'Digital Boost',                 amount: 0,      interval: 'monthly',  next_billing_date: monthly(25) },
  { customer: 'Pekuma', notes: 'Domain Renewal',                amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── Euromirror (399×0.9 = 359.10 kr) ────────────────────────────────────────
  { customer: 'Euromirror', notes: 'Service Package',           amount: 359.1,  interval: 'monthly',  next_billing_date: monthly(25) },
  { customer: 'Euromirror', notes: 'Domain Renewal',            amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── Mäklarhuset ──────────────────────────────────────────────────────────────
  { customer: 'Mäklarhuset', notes: 'Service Package',          amount: 1200,   interval: 'monthly',  next_billing_date: monthly(22) },

  // ── Perssons Industrigolv (7188×0.8 = 5 750.40 kr) ──────────────────────────
  { customer: 'Perssons Industrigolv', notes: 'Annual Package', amount: 5750.4, interval: 'yearly',   next_billing_date: yearly(5, 2) },
  { customer: 'Perssons Industrigolv', notes: 'Domain Renewal', amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── Z-teknik ─────────────────────────────────────────────────────────────────
  // NOTE: Digital Boost base amount unknown
  { customer: 'Z-teknik', notes: 'Digital Boost',               amount: 0,      interval: 'monthly',  next_billing_date: monthly(19) },
  { customer: 'Z-teknik', notes: 'Google Ads (extra)',          amount: 500,    interval: 'monthly',  next_billing_date: monthly(19) },

  // ── Ljungby Flyttningsbyrå (299×12 = 3 588 kr) ──────────────────────────────
  { customer: 'Ljungby Flyttningsbyrå', notes: 'Annual Package (299×12)', amount: 3588, interval: 'yearly', next_billing_date: yearly(24, 6) },

  // ── Snickar Oden ─────────────────────────────────────────────────────────────
  { customer: 'Snickar Oden', notes: 'Maintenance',             amount: 2990,   interval: 'yearly',   next_billing_date: yearly(18, 6) },

  // ── Ljungby Gillar Olika (1794kr semi-annual → two yearly entries) ────────────
  { customer: 'Ljungby Gillar Olika', notes: 'Hosting (semi-annual Sep)', amount: 1794, interval: 'yearly', next_billing_date: yearly(4, 9) },
  { customer: 'Ljungby Gillar Olika', notes: 'Hosting (semi-annual Mar)', amount: 1794, interval: 'yearly', next_billing_date: yearly(4, 3) },
  { customer: 'Ljungby Gillar Olika', notes: 'Domain Renewal',  amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── PT System / Pelltec ──────────────────────────────────────────────────────
  { customer: 'PT System / Pelltec', notes: 'Digital Boost',    amount: 2499,   interval: 'monthly',  next_billing_date: monthly(8) },
  { customer: 'PT System / Pelltec', notes: 'Domain Renewal',   amount: 0,      interval: 'yearly',   next_billing_date: yearly(4, 9) },

  // ── Baket i Ljungby ──────────────────────────────────────────────────────────
  { customer: 'Baket i Ljungby', notes: 'Annual Package',       amount: 2868,   interval: 'yearly',   next_billing_date: yearly(7, 11) },

  // ── JB Utbildningar (4788×0.8 = 3 830.40 kr) ────────────────────────────────
  { customer: 'JB Utbildningar', notes: 'Annual Package',       amount: 3830.4, interval: 'yearly',   next_billing_date: yearly(18, 9) },

  // ── Linds Skärteknik (4788×0.8 = 3 830.40 kr) ──────────────────────────────
  { customer: 'Linds Skärteknik', notes: 'Annual Package',      amount: 3830.4, interval: 'yearly',   next_billing_date: yearly(14, 7) },

  // ── Svenska Kyrkan / Begravningsmuseet ───────────────────────────────────────
  { customer: 'Svenska Kyrkan / Begravningsmuseet', notes: 'Website Maintenance', amount: 599, interval: 'monthly', next_billing_date: monthly(22) },

  // ── Hamneda Grus ─────────────────────────────────────────────────────────────
  { customer: 'Hamneda Grus', notes: 'Digital Boost',           amount: 2999,   interval: 'monthly',  next_billing_date: monthly(22) },

  // ── Hotell Terraza / Ljungby Hotell ──────────────────────────────────────────
  { customer: 'Hotell Terraza / Ljungby Hotell', notes: 'Hosting', amount: 299, interval: 'monthly',  next_billing_date: monthly(22) },

  // ── RH Dekor ─────────────────────────────────────────────────────────────────
  { customer: 'RH Dekor', notes: 'Service Package',             amount: 1499,   interval: 'monthly',  next_billing_date: monthly(22) },

  // ── Perssons VVS ─────────────────────────────────────────────────────────────
  { customer: 'Perssons VVS', notes: 'Annual Package',          amount: 3830,   interval: 'yearly',   next_billing_date: yearly(20, 3) },

  // ── Campus Ljungby ───────────────────────────────────────────────────────────
  // NOTE: amount unknown — fill in from your records
  { customer: 'Campus Ljungby', notes: 'Monthly Service',       amount: 0,      interval: 'monthly',  next_billing_date: monthly(1) },

  // ── Sigvards Färghall (4788×0.85 = 4 069.80 kr) ─────────────────────────────
  { customer: 'Sigvards Färghall', notes: 'Hosting',            amount: 4069.8, interval: 'yearly',   next_billing_date: yearly(19, 2) },
]

// ─── Import logic ─────────────────────────────────────────────────────────────

async function importCustomers(): Promise<Map<string, string>> {
  console.log(`\n📋  Importing ${CUSTOMERS.length} customers…`)
  const idMap = new Map<string, string>()

  for (const c of CUSTOMERS) {
    // Check if customer already exists by name
    const { data: existing } = await supabase
      .from('customers')
      .select('id, name')
      .eq('name', c.name)
      .maybeSingle()

    if (existing) {
      idMap.set(c.name, existing.id)
      // Update extra fields if they're being supplied
      const updates: Record<string, unknown> = {}
      if (c.customer_number) updates.customer_number = c.customer_number
      if (c.org_number)      updates.org_number      = c.org_number
      if (c.email)           updates.email           = c.email
      if (c.phone)           updates.phone           = c.phone
      if (c.postal_code)     updates.postal_code     = c.postal_code
      if (c.city)            updates.city            = c.city
      if (c.country)         updates.country         = c.country

      if (Object.keys(updates).length > 0) {
        await supabase.from('customers').update(updates).eq('id', existing.id)
        console.log(`  ↻  Updated: ${c.name}`)
      } else {
        console.log(`  ✓  Exists:  ${c.name}`)
      }
      continue
    }

    // Insert new customer
    const { data: inserted, error } = await supabase
      .from('customers')
      .insert({
        name:            c.name,
        customer_number: c.customer_number ?? null,
        org_number:      c.org_number      ?? null,
        email:           c.email           ?? '',
        phone:           c.phone           ?? null,
        postal_code:     c.postal_code     ?? null,
        city:            c.city            ?? null,
        country:         c.country         ?? 'SE',
        status:          'active',
      })
      .select('id')
      .single()

    if (error) {
      console.error(`  ✗  Failed to insert ${c.name}: ${error.message}`)
      continue
    }

    idMap.set(c.name, inserted.id)
    console.log(`  +  Created: ${c.name}`)
  }

  console.log(`    → ${idMap.size} customers ready\n`)
  return idMap
}

async function importBilling(idMap: Map<string, string>) {
  console.log(`📅  Importing ${BILLING.length} billing schedules…`)

  let created = 0
  let skipped = 0
  let errors  = 0

  for (const b of BILLING) {
    const customerId = idMap.get(b.customer)
    if (!customerId) {
      console.error(`  ✗  No customer ID for: ${b.customer}`)
      errors++
      continue
    }

    // Check for existing schedule (same customer + notes = same service)
    const { data: existing } = await supabase
      .from('billing_schedules')
      .select('id')
      .eq('customer_id', customerId)
      .eq('notes', b.notes)
      .maybeSingle()

    if (existing) {
      // Update next_billing_date and amount in case data changed
      await supabase
        .from('billing_schedules')
        .update({
          amount:            b.amount,
          billing_interval:  b.interval,
          next_billing_date: b.next_billing_date,
          is_active:         true,
        })
        .eq('id', existing.id)
      skipped++
      continue
    }

    const { error } = await supabase.from('billing_schedules').insert({
      customer_id:       customerId,
      notes:             b.notes,
      amount:            b.amount,
      currency:          'SEK',
      billing_interval:  b.interval,
      next_billing_date: b.next_billing_date,
      is_active:         true,
    })

    if (error) {
      console.error(`  ✗  ${b.customer} / ${b.notes}: ${error.message}`)
      errors++
    } else {
      console.log(`  +  ${b.customer.padEnd(38)} ${b.notes} → ${b.next_billing_date}`)
      created++
    }
  }

  console.log(`\n    → Created: ${created}  Updated: ${skipped}  Errors: ${errors}\n`)
}

async function main() {
  console.log('═══════════════════════════════════════════════')
  console.log('  JT Media — Data Import                       ')
  console.log('═══════════════════════════════════════════════')

  const idMap = await importCustomers()
  await importBilling(idMap)

  console.log('✅  Import complete.')
  console.log('   ⚠️  Entries with amount=0 need manual price updates in the admin portal.')
}

main().catch((err) => {
  console.error('\n❌  Unexpected error:', err)
  process.exit(1)
})
