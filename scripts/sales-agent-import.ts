#!/usr/bin/env npx tsx
/**
 * JT Media — Import sales opportunities found by the Claude sales agent
 *
 * The agent (Claude Code, `/salj-agent`) reads the mailbox and writes a JSON
 * file with the opportunities it found. This script upserts them into
 * `sales_opportunities` and logs the run in `sales_agent_runs`.
 *
 *   npx tsx scripts/sales-agent-import.ts path/to/opportunities.json
 *
 * JSON shape:
 * {
 *   "run": { "summary": "…", "threads_scanned": 42 },
 *   "opportunities": [
 *     {
 *       "company": "Z-teknik", "contact_name": "Iza Hård", "email": "iza@z-teknik.se",
 *       "website": "z-teknik.se", "customer_name": "Z-teknik",
 *       "kind": "upsell", "service_key": "geo", "service_name": null,
 *       "priority": 1, "summary": "…", "evidence": "…", "gmail_thread_id": "…",
 *       "draft_subject": "…", "draft_body": "…", "estimated_value": 12000
 *     }
 *   ]
 * }
 *
 * Dedupe: an open opportunity (not won/lost) for the same company + service is
 * updated instead of duplicated, but only while it is still in "identified"
 * or "to_contact" so that edits made after sending are never overwritten.
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌  NEXT_PUBLIC_SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY måste finnas i .env.local')
  process.exit(1)
}

const file = process.argv[2]
if (!file) {
  console.error('Användning: npx tsx scripts/sales-agent-import.ts <fil.json>')
  process.exit(1)
}

interface OpportunityInput {
  company: string
  contact_name?: string | null
  email?: string | null
  website?: string | null
  customer_name?: string | null
  kind?: 'upsell' | 'new' | 'reactivation'
  service_key?: string | null
  service_name?: string | null
  priority?: 1 | 2 | 3
  summary?: string | null
  evidence?: string | null
  gmail_thread_id?: string | null
  draft_subject?: string | null
  draft_body?: string | null
  estimated_value?: number | null
  /** 'recurring' (kr/år, default) or 'one_time'. */
  value_type?: 'recurring' | 'one_time' | null
  lead_source?: string | null
  phone?: string | null
  city?: string | null
  /** Follow-up of an existing card: move it to this stage (e.g. "dialog" when the customer replied). */
  stage_update?: 'dialog' | 'proposal' | 'lost' | null
  /** Follow-up of an existing card: a reminder draft when nobody answered. */
  followup_draft?: { subject: string; body: string } | null
}

interface ImportFile {
  run?: { summary?: string; threads_scanned?: number }
  opportunities: OpportunityInput[]
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } })

async function findCustomerId(o: OpportunityInput): Promise<string | null> {
  const name = o.customer_name ?? o.company
  const { data: byName } = await admin.from('customers').select('id').ilike('name', name).limit(1).maybeSingle()
  if (byName) return byName.id
  if (o.email) {
    const { data: byEmail } = await admin.from('customers').select('id').ilike('email', o.email).limit(1).maybeSingle()
    if (byEmail) return byEmail.id
  }
  return null
}

async function main() {
  const input = JSON.parse(fs.readFileSync(path.resolve(file), 'utf-8')) as ImportFile
  if (!Array.isArray(input.opportunities)) throw new Error('JSON saknar "opportunities".')

  let created = 0
  let updated = 0
  let skipped = 0

  for (const o of input.opportunities) {
    if (!o.company?.trim()) { skipped++; continue }

    // ── Follow-ups on cards that are already on the board ──
    if (o.stage_update || o.followup_draft) {
      const { data: card } = await admin
        .from('sales_opportunities')
        .select('id, stage, evidence, replied_at')
        .ilike('company', o.company.trim())
        .not('stage', 'in', '("won","lost")')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (!card) { skipped++; console.log(`   · Hittar inget öppet kort för uppföljning: ${o.company}`); continue }
      const patch: Record<string, unknown> = {}
      if (o.stage_update) {
        patch.stage = o.stage_update
        if (o.stage_update === 'dialog' && !card.replied_at) patch.replied_at = new Date().toISOString()
        if (o.evidence) patch.evidence = [card.evidence, o.evidence].filter(Boolean).join('\n\n')
      }
      if (o.followup_draft) {
        patch.draft_subject = o.followup_draft.subject
        patch.draft_body = o.followup_draft.body
      }
      const { error } = await admin.from('sales_opportunities').update(patch).eq('id', card.id)
      if (error) throw error
      updated++
      console.log(`   ↻ Uppföljning: ${o.company}${o.stage_update ? ` → ${o.stage_update}` : ''}${o.followup_draft ? ' (påminnelseutkast)' : ''}`)
      continue
    }

    const customerId = await findCustomerId(o)
    const serviceKey = o.service_key ?? null

    const row = {
      company: o.company.trim(),
      contact_name: o.contact_name ?? null,
      email: o.email?.toLowerCase() ?? null,
      phone: o.phone ?? null,
      website: o.website ?? null,
      city: o.city ?? null,
      customer_id: customerId,
      kind: o.kind ?? (customerId ? 'upsell' : 'new'),
      service_key: serviceKey,
      service_name: o.service_name ?? null,
      priority: o.priority ?? 2,
      source: 'agent' as const,
      summary: o.summary ?? null,
      evidence: o.evidence ?? null,
      gmail_thread_id: o.gmail_thread_id ?? null,
      draft_subject: o.draft_subject ?? null,
      draft_body: o.draft_body ?? null,
      estimated_value: o.estimated_value ?? null,
      value_type: o.value_type === 'one_time' ? 'one_time' : 'recurring',
      lead_source: o.lead_source ?? 'Säljagenten',
      // A ready draft lands in "Att kontakta", otherwise "Identifierad".
      stage: o.draft_body ? 'to_contact' : 'identified',
    }

    let query = admin
      .from('sales_opportunities')
      .select('id, stage')
      .ilike('company', row.company)
      .not('stage', 'in', '("won","lost")')
    query = serviceKey ? query.eq('service_key', serviceKey) : query.is('service_key', null)
    const { data: existing } = await query.limit(1).maybeSingle()

    if (existing) {
      if (existing.stage === 'identified' || existing.stage === 'to_contact') {
        const { error } = await admin.from('sales_opportunities').update(row).eq('id', existing.id)
        if (error) throw error
        updated++
        console.log(`   ↻ Uppdaterad: ${row.company} (${serviceKey ?? row.service_name ?? 'okänd tjänst'})`)
      } else {
        skipped++
        console.log(`   · Hoppar över (redan ${existing.stage}): ${row.company}`)
      }
      continue
    }

    const { error } = await admin.from('sales_opportunities').insert(row)
    if (error) throw error
    created++
    console.log(`   ✓ Ny: ${row.company} (${serviceKey ?? row.service_name ?? 'okänd tjänst'})${customerId ? ' → kopplad till kund' : ''}`)
  }

  const { error: runErr } = await admin.from('sales_agent_runs').insert({
    threads_scanned: input.run?.threads_scanned ?? 0,
    opportunities_created: created,
    opportunities_updated: updated,
    summary: input.run?.summary ?? null,
  })
  if (runErr) throw runErr

  console.log(`\n✅  Klart: ${created} nya, ${updated} uppdaterade, ${skipped} överhoppade. Se /admin/salj.\n`)
}

main().catch((err) => {
  console.error('\n❌  Fel:', err?.message ?? err)
  process.exit(1)
})
