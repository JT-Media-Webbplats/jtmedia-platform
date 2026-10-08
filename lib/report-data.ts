// Server-only: collects the figures for one monthly report.
import type { ReportClient, ReportStats } from '@/lib/supabase/types'
import { adsStats, analyticsVisitors, searchConsoleStats } from '@/lib/google'

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

  const [organic, paid, visitors] = await Promise.all([
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
  ])

  return { ...range, organic, paid, visitors, errors }
}
