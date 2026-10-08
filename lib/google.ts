// Server-only: Search Console + Google Ads (read-only) for the monthly reports.
// Credentials come from GOOGLE_OAUTH_CLIENT_ID / _CLIENT_SECRET / _REFRESH_TOKEN,
// created once with `npx tsx scripts/google-auth.ts`.

const ADS_API = 'https://googleads.googleapis.com/v25'

let cached: { token: string; expires: number } | null = null

export async function googleAccessToken(): Promise<string> {
  if (cached && cached.expires > Date.now() + 60_000) return cached.token
  const { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN } = process.env
  if (!GOOGLE_OAUTH_CLIENT_ID || !GOOGLE_OAUTH_CLIENT_SECRET || !GOOGLE_OAUTH_REFRESH_TOKEN) {
    throw new Error('Google-inloggning saknas. Kör npx tsx scripts/google-auth.ts')
  }
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GOOGLE_OAUTH_CLIENT_ID,
      client_secret: GOOGLE_OAUTH_CLIENT_SECRET,
      refresh_token: GOOGLE_OAUTH_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Google-inloggningen fungerar inte (${data.error ?? res.status}). Kör scripts/google-auth.ts igen.`)
  cached = { token: data.access_token, expires: Date.now() + data.expires_in * 1000 }
  return cached.token
}

async function googleFetch(url: string, init: RequestInit & { headers?: Record<string, string> } = {}) {
  const token = await googleAccessToken()
  const res = await fetch(url, { ...init, headers: { ...init.headers, Authorization: `Bearer ${token}` } })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`${url}: ${res.status} ${JSON.stringify(data.error ?? data).slice(0, 500)}`)
  return data
}

export interface TrafficStats {
  impressions: number
  clicks: number
  ctr: number // 0..1
}

function stats(impressions: number, clicks: number): TrafficStats {
  return { impressions, clicks, ctr: impressions ? clicks / impressions : 0 }
}

// ── Search Console ─────────────────────────────────────────────

/** Properties the logged-in account can read, e.g. "sc-domain:foretaget.se" or "https://foretaget.se/". */
export async function listSearchConsoleSites(): Promise<string[]> {
  const data = await googleFetch('https://www.googleapis.com/webmasters/v3/sites')
  return (data.siteEntry ?? [])
    .filter((s: { permissionLevel: string }) => s.permissionLevel !== 'siteUnverifiedUser')
    .map((s: { siteUrl: string }) => s.siteUrl)
}

/**
 * Organic impressions/clicks for a date range (YYYY-MM-DD, inclusive). Counted per page,
 * like Site Kit, so the numbers match what customers have seen in earlier reports.
 */
export async function searchConsoleStats(site: string, start: string, end: string): Promise<TrafficStats> {
  const data = await googleFetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate: start, endDate: end, aggregationType: 'byPage' }),
    },
  )
  const row = data.rows?.[0]
  return stats(row?.impressions ?? 0, row?.clicks ?? 0)
}

export interface SearchConsoleRow {
  keys: string[]
  clicks: number
  impressions: number
  ctr: number
  position: number
}

/** Rows broken down by dimensions, e.g. ['query'], ['page'] or ['page', 'query']. */
export async function searchConsoleRows(
  site: string,
  start: string,
  end: string,
  dimensions: string[],
  rowLimit = 250,
): Promise<SearchConsoleRow[]> {
  const data = await googleFetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate: start, endDate: end, dimensions, rowLimit }),
    },
  )
  return data.rows ?? []
}

// ── Google Ads ─────────────────────────────────────────────────

const digits = (id: string) => id.replace(/\D/g, '')

export interface AdsAccount {
  id: string
  name: string
}

/** Ads accounts the logged-in user can open directly. */
export async function listAdsAccounts(): Promise<AdsAccount[]> {
  const data = await googleFetch(`${ADS_API}/customers:listAccessibleCustomers`)
  const ids: string[] = (data.resourceNames ?? []).map((rn: string) => rn.split('/')[1])
  return Promise.all(
    ids.map(async (id) => {
      const res = await googleFetch(`${ADS_API}/customers/${id}/googleAds:search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'SELECT customer.descriptive_name FROM customer' }),
      })
      return { id, name: res.results?.[0]?.customer?.descriptiveName ?? '' }
    }),
  )
}

/**
 * Paid impressions/clicks for one Ads account and date range (YYYY-MM-DD, inclusive).
 * With `campaignMatch`, only campaigns whose name contains that text (case-insensitive)
 * are counted, since most customers share JT Media's own Ads account. Several texts can
 * be given separated by commas, e.g. "Performance Max, Campaign 2024-08-12".
 */
export async function adsStats(customerId: string, start: string, end: string, campaignMatch?: string | null): Promise<TrafficStats> {
  const data = await googleFetch(`${ADS_API}/customers/${digits(customerId)}/googleAds:search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `SELECT campaign.name, metrics.impressions, metrics.clicks FROM campaign
              WHERE segments.date BETWEEN '${start}' AND '${end}'`,
    }),
  })
  const needles = (campaignMatch ?? '').toLowerCase().split(',').map((n) => n.trim()).filter(Boolean)
  let impressions = 0
  let clicks = 0
  for (const r of data.results ?? []) {
    const name = String(r.campaign?.name ?? '').toLowerCase()
    if (needles.length && !needles.some((n) => name.includes(n))) continue
    impressions += Number(r.metrics?.impressions ?? 0)
    clicks += Number(r.metrics?.clicks ?? 0)
  }
  return stats(impressions, clicks)
}

// ── Google Analytics (GA4) ─────────────────────────────────────

export interface AnalyticsProperty {
  id: string // numeric property id, e.g. "123456789"
  name: string
  account: string
}

/** GA4 properties the logged-in account can read. */
export async function listAnalyticsProperties(): Promise<AnalyticsProperty[]> {
  const out: AnalyticsProperty[] = []
  let pageToken = ''
  do {
    const data = await googleFetch(
      `https://analyticsadmin.googleapis.com/v1beta/accountSummaries?pageSize=200${pageToken ? `&pageToken=${pageToken}` : ''}`,
    )
    for (const acc of data.accountSummaries ?? []) {
      for (const p of acc.propertySummaries ?? []) {
        out.push({ id: String(p.property).replace('properties/', ''), name: p.displayName, account: acc.displayName })
      }
    }
    pageToken = data.nextPageToken ?? ''
  } while (pageToken)
  return out
}

/**
 * All visitors (GA4 totalUsers, what Site Kit calls "Alla besökare") for a date range.
 * With `host`, only visits to that domain (with or without www) are counted: several of
 * JT Media's GA4 properties receive hits from many customer sites through a shared tag.
 */
export async function analyticsVisitors(propertyId: string, start: string, end: string, host?: string | null): Promise<number> {
  const domain = host?.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')
  const data = await googleFetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dateRanges: [{ startDate: start, endDate: end }],
      metrics: [{ name: 'totalUsers' }],
      ...(domain && {
        dimensionFilter: {
          filter: {
            fieldName: 'hostName',
            stringFilter: { matchType: 'FULL_REGEXP', value: `^(www\\.)?${domain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$` },
          },
        },
      }),
    }),
  })
  return Number(data.rows?.[0]?.metricValues?.[0]?.value ?? 0)
}
