/**
 * Seeds the monthly report list (/admin/rapporter) with the Digital Boost
 * customers from the old spreadsheet, and marks the reports already sent
 * in October 2026.
 *
 *   npx tsx scripts/seed-report-clients.ts
 *
 * Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
 * Safe to re-run: existing rows are updated, missing customers are created.
 */
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
})

const PERIOD = '2026-10-01'

// name = customer name in the database (matched case-insensitively, created if missing)
const clients: { name: string; day: number | null; sent?: boolean; paused?: boolean }[] = [
  { name: 'Agunnaryd Sockenråd',     day: 1 },
  { name: 'Rethink Factory',         day: 1,  sent: true },
  { name: 'Grimslövs Skogstjänst',   day: 3,  sent: true },
  { name: 'Michael Ströms Bygg',     day: 4,  sent: true },
  { name: 'Campus Ljungby',          day: 4 },
  { name: 'Laholm Stål',             day: 4,  sent: true },
  { name: 'OptiTuning Ljungby',      day: 4,  sent: true },
  { name: 'Molico',                  day: 5,  sent: true },
  { name: 'PT System / Pelltec',     day: 8,  sent: true },
  { name: 'LBY Tech',                day: 9 },
  { name: 'XL Bygg',                 day: 16 },
  { name: 'Lastbilsstopp',           day: 17 },
  { name: 'Lagan Plåtprodukter',     day: 17 },
  { name: 'EPX Golvteknik',          day: 18 },
  { name: 'JB Utbildningar',         day: 20 },
  { name: 'Z-teknik',                day: 20 },
  { name: 'Hotell Garvaren',         day: 22 },
  { name: 'Hamneda Grus',            day: 22 },
  { name: 'Pekuma',                  day: 25 },
  { name: 'Smefast',                 day: 25 },
  { name: 'Ljungby Trädgårdsservice', day: 26 },  // Davids Trädgårdsservice
  { name: 'Clinic Charisma',         day: 26 },  // sent together with Davids
  { name: 'Hårds Transport',         day: 28 },
]

async function customerId(name: string): Promise<string> {
  const { data: existing } = await supabase.from('customers').select('id').ilike('name', name).limit(1).maybeSingle()
  if (existing) return existing.id

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const { data, error } = await supabase
    .from('customers')
    .insert({ name, company: name, email: `noemail-${slug}@import.jtmedia.se`, status: 'active' })
    .select('id')
    .single()
  if (error) throw new Error(`${name}: ${error.message}`)
  console.log(`   + Ny kund skapad: ${name}`)
  return data.id
}

async function main() {
  for (const c of clients) {
    const id = await customerId(c.name)
    const { data: rc, error } = await supabase
      .from('report_clients')
      .upsert(
        { customer_id: id, report_day: c.day, status: c.paused ? 'paused' : 'active' },
        { onConflict: 'customer_id' },
      )
      .select('id')
      .single()
    if (error) throw new Error(`${c.name}: ${error.message}`)

    if (c.sent) {
      const sentAt = `2026-10-${String(c.day ?? 1).padStart(2, '0')}T12:00:00+02:00`
      const { error: repErr } = await supabase
        .from('monthly_reports')
        .upsert({ report_client_id: rc.id, period: PERIOD, sent_at: sentAt }, { onConflict: 'report_client_id,period' })
      if (repErr) throw new Error(`${c.name}: ${repErr.message}`)
    }
    console.log(`✓ ${c.name}${c.sent ? ' (skickad oktober)' : ''}${c.paused ? ' (pausad)' : ''}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
