// Server-only: collects the figures for one monthly report.
import type { ReportClient, ReportStats } from '@/lib/supabase/types'
import { adsStats, analyticsVisitors, searchConsoleRows, searchConsoleStats } from '@/lib/google'

const DAY = 86_400_000
const iso = (d: Date) => d.toISOString().slice(0, 10)

/**
 * "Denna period" = the 30 days ending 3 days ago (Search Console needs ~3 days to settle),
 * "Föregående period" = the 30 days before that.
 */
export function reportRange(today = new Date()) {
  const end = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - 3 * DAY)
  const start = new Date(end.getTime() - 29 * DAY)
  const prevEnd = new Date(start.getTime() - DAY)
  const prevStart = new Date(prevEnd.getTime() - 29 * DAY)
  return { start: iso(start), end: iso(end), prevStart: iso(prevStart), prevEnd: iso(prevEnd) }
}

const pair = ({ impressions, clicks }: { impressions: number; clicks: number }) => ({ impressions, clicks })

const compact = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')

/**
 * The period's best search queries: most clicks first, impressions break ties. Searches for
 * the company itself ("lby tech", "lby tech ab", "lby") collapse into one row with the
 * customer's name, so the rest of the list shows what they are found for.
 */
async function topQueries(client: ReportClient, start: string, end: string, count = 4): Promise<string[]> {
  const rows = await searchConsoleRows(client.gsc_site!, start, end, ['query'], 50)
  const brands = [client.website?.replace(/^https?:\/\//, '').replace(/^www\./, '').split('.')[0], client.customer?.name]
    .map((b) => compact(b ?? ''))
    .filter((b) => b.length >= 3)
  const isBrand = (q: string) => {
    const c = compact(q)
    return c.length >= 3 && brands.some((b) => b.includes(c) || c.includes(b))
  }

  const out: string[] = []
  let brandShown = false
  for (const r of rows.sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions)) {
    const q = r.keys[0]
    if (isBrand(q)) {
      if (brandShown) continue
      brandShown = true
      out.push(client.customer?.name ?? q)
    } else out.push(q)
    if (out.length === count) break
  }
  return out
}

export async function collectReportStats(client: ReportClient, today = new Date()): Promise<ReportStats> {
  const range = reportRange(today)
  const errors: string[] = []

  async function attempt<T>(label: string, fn: () => Promise<T>): Promise<T | null> {
    try {
      return await fn()
    } catch (e) {
      console.error(`[rapport] ${label}:`, e)
      errors.push(label)
      return null
    }
  }

  const [organic, paid, visitors, queries] = await Promise.all([
    client.gsc_site
      ? attempt('Search Console', async () => ({
          current: pair(await searchConsoleStats(client.gsc_site!, range.start, range.end)),
          previous: pair(await searchConsoleStats(client.gsc_site!, range.prevStart, range.prevEnd)),
        }))
      : null,
    client.ads_customer_id
      ? attempt('Google Ads', async () => {
          const current = pair(await adsStats(client.ads_customer_id!, range.start, range.end, client.ads_campaign_match))
          const previous = pair(await adsStats(client.ads_customer_id!, range.prevStart, range.prevEnd, client.ads_campaign_match))
          // No ads running in either period: leave the paid section out of the report.
          return current.impressions || previous.impressions ? { current, previous } : null
        })
      : null,
    client.ga4_property_id
      ? attempt('Google Analytics', async () => {
          const current = await analyticsVisitors(client.ga4_property_id!, range.start, range.end, client.website)
          const previous = await analyticsVisitors(client.ga4_property_id!, range.prevStart, range.prevEnd, client.website)
          // An empty property usually means the tracking tag is gone: leave the section out instead of showing 0.
          return current || previous ? { current, previous } : null
        })
      : null,
    client.gsc_site
      ? attempt('Search Console sökord', async () => {
          const current = await topQueries(client, range.start, range.end)
          const previous = await topQueries(client, range.prevStart, range.prevEnd)
          return current.length || previous.length ? { current, previous } : null
        })
      : null,
  ])

  return { ...range, organic, paid, visitors, topQueries: queries, errors }
}
