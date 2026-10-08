/**
 * Everything the /seo skill needs before planning a month's SEO work for one customer:
 * the report client, how to reach the site (SSH from the Claude app's connections,
 * Elementor MCP from ~/.claude.json), earlier SEO logs, and Search Console insights.
 *
 *   npx tsx scripts/seo-context.ts "Michael Ströms"
 *   npx tsx scripts/seo-context.ts --due      # which customers are up next
 *
 * Prints JSON. Read-only: changes nothing anywhere.
 */
import { existsSync, readFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
})

const DAY = 86_400_000
const iso = (d: Date) => d.toISOString().slice(0, 10)
const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '')
const domainOf = (s: string | null | undefined) =>
  (s ?? '').replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '').toLowerCase()

/** SSH connection saved in the Claude desktop app, matched on customer name. */
function findSsh(customerName: string) {
  const file = path.join(os.homedir(), 'Library/Application Support/Claude/ssh_configs.json')
  if (!existsSync(file)) return null
  const raw = JSON.parse(readFileSync(file, 'utf8'))
  const list: { name: string; sshHost: string; sshIdentityFile?: string }[] = Array.isArray(raw)
    ? raw
    : Object.values(raw.configs ?? raw)
  const want = norm(customerName.split('/')[0])
  const hit = list.find((c) => norm(c.name) === want) ?? list.find((c) => norm(c.name).includes(want) || want.includes(norm(c.name)))
  if (!hit) return null
  return {
    app_name: hit.name,
    target: hit.sshHost,
    identity_file: hit.sshIdentityFile ?? null,
    example: `ssh -o BatchMode=yes -o IdentitiesOnly=yes${hit.sshIdentityFile ? ` -i ${hit.sshIdentityFile}` : ''} ${hit.sshHost} 'cd ~/public_html && wp option get home'`,
  }
}

/** Elementor MCP server in ~/.claude.json whose URL is on the customer's domain. */
function findElementorMcp(website: string | null) {
  const file = path.join(os.homedir(), '.claude.json')
  if (!website || !existsSync(file)) return null
  const servers: Record<string, { url?: string }> = JSON.parse(readFileSync(file, 'utf8')).mcpServers ?? {}
  const domain = domainOf(website)
  for (const [name, cfg] of Object.entries(servers)) {
    const host = domainOf(cfg.url)
    if (name.includes('elementor') && (host === domain || host.endsWith(`.${domain}`))) {
      return { server: name, tool_prefix: `mcp__${name}__`, url: cfg.url, staging: host !== domain }
    }
  }
  return null
}

/** Active customers whose report is due within 10 days (or overdue) and have no SEO logged for it yet. */
async function listDue() {
  const now = new Date()
  const thisPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  const [{ data: clients }, { data: reports }, { data: logs, error: logErr }] = await Promise.all([
    supabase.from('report_clients').select('id, report_day, gsc_site, customer:customers(name)').eq('status', 'active'),
    supabase.from('monthly_reports').select('report_client_id, sent_at').eq('period', thisPeriod),
    supabase.from('seo_work_log').select('report_client_id, period').gte('period', thisPeriod),
  ])
  if (logErr) throw new Error(`seo_work_log saknas? Kör migrationen 20261008300000_seo_work_log.sql (${logErr.message})`)
  const sent = new Set((reports ?? []).filter((r) => r.sent_at).map((r) => r.report_client_id))
  const rows = (clients ?? [])
    .filter((c) => c.report_day && c.gsc_site)
    .map((c) => {
      // Next report: this month unless already sent, then next month
      const due = sent.has(c.id)
        ? new Date(now.getFullYear(), now.getMonth() + 1, c.report_day!)
        : new Date(now.getFullYear(), now.getMonth(), c.report_day!)
      const period = `${due.getFullYear()}-${String(due.getMonth() + 1).padStart(2, '0')}-01`
      const done = (logs ?? []).some((l) => l.report_client_id === c.id && l.period === period)
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const days = Math.round((due.getTime() - today.getTime()) / DAY)
      const dueStr = `${due.getFullYear()}-${String(due.getMonth() + 1).padStart(2, '0')}-${String(due.getDate()).padStart(2, '0')}`
      return { customer: (c.customer as unknown as { name: string }).name, report_due: dueStr, days_left: days, seo_done: done }
    })
    .filter((r) => !r.seo_done && r.days_left <= 10)
    .sort((a, b) => a.days_left - b.days_left)
  console.log(JSON.stringify(rows, null, 2))
}

async function main() {
  if (process.argv[2] === '--due') return listDue()
  const query = process.argv[2]
  if (!query) throw new Error('Ange kundnamn, t.ex. npx tsx scripts/seo-context.ts "Michael Ströms"')

  const { data: matches } = await supabase
    .from('report_clients')
    .select('*, customer:customers(id, name)')
  const client = (matches ?? []).find((c) => norm(c.customer?.name ?? '').includes(norm(query)))
  if (!client) throw new Error(`Hittade ingen rapportkund som matchar "${query}"`)
  const name: string = client.customer.name

  // The report this month's work should show up in: this month, unless it is already sent.
  const now = new Date()
  const thisPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  const { data: thisReport } = await supabase
    .from('monthly_reports')
    .select('sent_at')
    .eq('report_client_id', client.id)
    .eq('period', thisPeriod)
    .maybeSingle()
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const period = thisReport?.sent_at
    ? `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-01`
    : thisPeriod

  const { data: logs, error: logErr } = await supabase
    .from('seo_work_log')
    .select('period, done_at, items, details, pages, source')
    .eq('report_client_id', client.id)
    .order('done_at', { ascending: false })
    .limit(6)
  if (logErr) throw new Error(`seo_work_log saknas? Kör migrationen 20261008300000_seo_work_log.sql (${logErr.message})`)

  const out: Record<string, unknown> = {
    customer: name,
    report_client_id: client.id,
    website: client.website,
    report_day: client.report_day,
    notes: client.notes,
    log_period: period,
    ssh: findSsh(name),
    elementor_mcp: findElementorMcp(client.website),
    previous_logs: logs ?? [],
  }

  if (client.gsc_site) {
    const { searchConsoleRows } = await import('../lib/google')
    const end = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - 3 * DAY)
    const start = new Date(end.getTime() - 27 * DAY)
    const prevEnd = new Date(start.getTime() - DAY)
    const prevStart = new Date(prevEnd.getTime() - 27 * DAY)
    const [queries, pages, prevPages, pageQueries] = await Promise.all([
      searchConsoleRows(client.gsc_site, iso(start), iso(end), ['query'], 500),
      searchConsoleRows(client.gsc_site, iso(start), iso(end), ['page'], 200),
      searchConsoleRows(client.gsc_site, iso(prevStart), iso(prevEnd), ['page'], 200),
      searchConsoleRows(client.gsc_site, iso(start), iso(end), ['page', 'query'], 1000),
    ])
    const r = (x: { clicks: number; impressions: number; ctr: number; position: number }) => ({
      clicks: x.clicks,
      impressions: x.impressions,
      ctr: Math.round(x.ctr * 1000) / 10,
      position: Math.round(x.position * 10) / 10,
    })
    const prevByPage = Object.fromEntries(prevPages.map((p) => [p.keys[0], p]))
    const topQueriesFor = (page: string) =>
      pageQueries.filter((q) => q.keys[0] === page).sort((a, b) => b.impressions - a.impressions).slice(0, 5).map((q) => q.keys[1])

    out.search_console = {
      range: `${iso(start)} till ${iso(end)} (28 dagar), jämfört med ${iso(prevStart)} till ${iso(prevEnd)}`,
      // Ranking just below the top: the quickest wins
      striking_distance_queries: queries
        .filter((q) => q.position >= 4 && q.position <= 20 && q.impressions >= 20)
        .sort((a, b) => b.impressions - a.impressions)
        .slice(0, 20)
        .map((q) => ({ query: q.keys[0], ...r(q) })),
      // Seen a lot but rarely clicked: title/meta description candidates
      low_ctr_pages: pages
        .filter((p) => p.impressions >= 100 && p.ctr < 0.02)
        .sort((a, b) => b.impressions - a.impressions)
        .slice(0, 10)
        .map((p) => ({ page: p.keys[0], ...r(p), top_queries: topQueriesFor(p.keys[0]) })),
      losing_pages: pages
        .map((p) => ({ p, prev: prevByPage[p.keys[0]] }))
        .filter(({ p, prev }) => prev && prev.clicks >= 5 && p.clicks < prev.clicks * 0.75)
        .sort((a, b) => b.prev.clicks - b.p.clicks - (a.prev.clicks - a.p.clicks))
        .slice(0, 10)
        .map(({ p, prev }) => ({ page: p.keys[0], clicks_now: p.clicks, clicks_before: prev.clicks, position_now: r(p).position, position_before: r(prev).position })),
      top_pages: pages.slice(0, 10).map((p) => ({ page: p.keys[0], ...r(p) })),
      // How the pages changed in earlier SEO sessions are doing now
      effect_of_previous_work: (logs ?? [])
        .flatMap((l) => (l.pages ?? []).map((pg: string) => ({ page: pg, worked_on: l.done_at.slice(0, 10) })))
        .map((w) => {
          const now_ = pages.find((p) => p.keys[0] === w.page)
          const before = prevByPage[w.page]
          return { ...w, clicks_now: now_?.clicks ?? 0, clicks_before: before?.clicks ?? 0, position_now: now_ ? r(now_).position : null }
        }),
    }
  } else {
    out.search_console = null
  }

  console.log(JSON.stringify(out, null, 2))
}

main().catch((e) => {
  console.error(e.message ?? e)
  process.exit(1)
})
