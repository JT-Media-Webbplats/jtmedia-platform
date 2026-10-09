/**
 * Builds one report PDF locally, for checking the template.
 *
 *   npx tsx scripts/report-preview.tsx "Michael Ströms Bygg" [out.pdf]
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
}

async function main() {
  const name = process.argv[2] ?? 'Michael Ströms Bygg'
  const out = process.argv[3] ?? 'rapport-preview.pdf'
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } })
  const { data: customer } = await supabase.from('customers').select('id, name').ilike('name', name).single()
  const { data: client } = await supabase.from('report_clients').select('*').eq('customer_id', customer!.id).single()

  const { collectReportStats } = await import('../lib/report-data')
  const { renderReportPdf } = await import('../lib/report-pdf')
  const { reportEmail } = await import('../lib/reports')

  const stats = await collectReportStats({ ...client, customer })
  console.log(JSON.stringify(stats, null, 2))
  writeFileSync(out, await renderReportPdf(customer!.name, stats))
  console.log(`\n✓ ${out}\n`)
  const mail = reportEmail(customer!.name, client.website, stats)
  console.log(`Ämne: ${mail.subject}\n\n${mail.body}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
