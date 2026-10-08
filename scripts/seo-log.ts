/**
 * Saves one SEO session to seo_work_log, so it shows up in the customer's report e-mail.
 *
 *   npx tsx scripts/seo-log.ts <file.json>
 *
 * {
 *   "report_client_id": "…",            // from scripts/seo-context.ts
 *   "period": "2026-11-01",             // log_period from scripts/seo-context.ts
 *   "items": ["Vi har …", "…"],         // customer-facing Swedish bullets, no dashes
 *   "details": "Teknisk logg …",        // for JT Media: what changed where, before/after
 *   "pages": ["https://…/snickare-ljungby/"]
 * }
 */
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
}

async function main() {
  const file = process.argv[2]
  if (!file) throw new Error('Ange en JSON-fil: npx tsx scripts/seo-log.ts <fil.json>')
  const entry = JSON.parse(readFileSync(file, 'utf8'))

  if (!entry.report_client_id || !/^\d{4}-\d{2}-01$/.test(entry.period ?? '')) {
    throw new Error('report_client_id och period (YYYY-MM-01) krävs.')
  }
  const items: string[] = (entry.items ?? []).map((s: string) => s.trim()).filter(Boolean)
  if (!items.length) throw new Error('items får inte vara tom.')
  const dashed = items.filter((s) => /[–—]/.test(s))
  if (dashed.length) throw new Error(`Ta bort tankstreck i kundtexten: ${dashed.join(' | ')}`)

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  })
  const { error } = await supabase.from('seo_work_log').insert({
    report_client_id: entry.report_client_id,
    period: entry.period,
    items,
    details: entry.details ?? null,
    pages: entry.pages ?? [],
    source: entry.source === 'manual' ? 'manual' : 'agent',
  })
  if (error) throw error
  console.log(`✓ SEO-logg sparad (${items.length} punkter) för rapporten ${entry.period.slice(0, 7)}`)
}

main().catch((e) => {
  console.error(e.message ?? e)
  process.exit(1)
})
