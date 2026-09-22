#!/usr/bin/env npx tsx
/**
 * JT Media — Snabbanalys av hemsidor för prospektering
 *
 * Tar en lista med domäner (argument eller en textfil med en per rad) och
 * hämtar varje sida, läser av tekniska signaler och (om nyckel finns) kör
 * Google PageSpeed Insights. Skriver en JSON-rapport och en tabell i terminalen.
 *
 *   npx tsx scripts/analyze-sites.ts foretag.se annat.se
 *   npx tsx scripts/analyze-sites.ts --file domaner.txt --out rapport.json
 *   npx tsx scripts/analyze-sites.ts --no-pagespeed foretag.se   (snabbare)
 *
 * Behovspoängen (0 till 100) är ett grovt mått på hur mycket hjälp sajten
 * behöver. Högre = bättre prospekt för oss. Ingen hemsida alls ger 100.
 */

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

const PAGESPEED_KEY = process.env.GOOGLE_PAGESPEED_API_KEY

export interface SiteReport {
  domain: string
  url: string | null
  reachable: boolean
  status: number | null
  https: boolean
  title: string | null
  metaDescription: string | null
  hasViewport: boolean
  generator: string | null
  copyrightYear: number | null
  hasGoogleAdsTag: boolean
  hasAnalytics: boolean
  hasFacebookPixel: boolean
  hasJsonLd: boolean
  h1Count: number
  imagesWithoutAlt: number
  imageCount: number
  htmlKb: number
  pagespeed: { performance: number | null; seo: number | null; accessibility: number | null } | null
  needScore: number
  findings: string[]
  error: string | null
}

async function fetchWithTimeout(url: string, ms = 15000): Promise<Response> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try {
    return await fetch(url, {
      signal: ctrl.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; JTMediaSiteCheck/1.0; +https://jtmediasweden.com)' },
    })
  } finally {
    clearTimeout(t)
  }
}

function pick(html: string, re: RegExp): string | null {
  const m = html.match(re)
  return m ? m[1].trim().replace(/\s+/g, ' ') : null
}

async function pagespeed(url: string) {
  if (!PAGESPEED_KEY) return null
  const api = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed')
  api.searchParams.set('url', url)
  api.searchParams.set('strategy', 'mobile')
  api.searchParams.set('key', PAGESPEED_KEY)
  for (const c of ['performance', 'seo', 'accessibility']) api.searchParams.append('category', c)
  try {
    const res = await fetchWithTimeout(api.toString(), 60000)
    if (!res.ok) return null
    const json = await res.json()
    const cats = json.lighthouseResult?.categories ?? {}
    const score = (k: string) => (typeof cats[k]?.score === 'number' ? Math.round(cats[k].score * 100) : null)
    return { performance: score('performance'), seo: score('seo'), accessibility: score('accessibility') }
  } catch {
    return null
  }
}

async function analyze(domainInput: string, usePagespeed: boolean): Promise<SiteReport> {
  const domain = domainInput.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase()
  const report: SiteReport = {
    domain, url: null, reachable: false, status: null, https: false, title: null, metaDescription: null,
    hasViewport: false, generator: null, copyrightYear: null, hasGoogleAdsTag: false, hasAnalytics: false,
    hasFacebookPixel: false, hasJsonLd: false, h1Count: 0, imagesWithoutAlt: 0, imageCount: 0, htmlKb: 0,
    pagespeed: null, needScore: 0, findings: [], error: null,
  }

  let html = ''
  for (const candidate of [`https://${domain}`, `https://www.${domain}`, `http://${domain}`]) {
    try {
      const res = await fetchWithTimeout(candidate)
      report.status = res.status
      if (res.ok) {
        html = await res.text()
        report.url = res.url
        report.reachable = true
        report.https = res.url.startsWith('https://')
        break
      }
    } catch (err) {
      report.error = err instanceof Error ? err.message : String(err)
    }
  }

  if (!report.reachable) {
    report.needScore = 100
    report.findings.push('Ingen fungerande hemsida hittades på domänen.')
    return report
  }

  report.htmlKb = Math.round(Buffer.byteLength(html, 'utf-8') / 1024)
  report.title = pick(html, /<title[^>]*>([^<]*)<\/title>/i)
  report.metaDescription = pick(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
    ?? pick(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i)
  report.hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html)
  report.generator = pick(html, /<meta[^>]+name=["']generator["'][^>]+content=["']([^"']*)["']/i)
    ?? (/wp-content|wp-includes/i.test(html) ? 'WordPress' : null)
    ?? (/static\.wixstatic\.com|wix\.com/i.test(html) ? 'Wix' : null)
    ?? (/squarespace/i.test(html) ? 'Squarespace' : null)
    ?? (/cdn\.shopify\.com/i.test(html) ? 'Shopify' : null)
    ?? (/one\.com|onecom/i.test(html) ? 'One.com' : null)
  const years = Array.from(html.matchAll(/(?:©|&copy;|copyright)\s*(?:\d{4}\s*[-–]\s*)?(20\d{2})/gi)).map((m) => Number(m[1]))
  report.copyrightYear = years.length ? Math.max(...years) : null
  report.hasGoogleAdsTag = /AW-\d{6,}|googleadservices|google_conversion_id|gtag\(['"]config['"],\s*['"]AW-/i.test(html)
  report.hasAnalytics = /G-[A-Z0-9]{6,}|UA-\d{4,}-\d|googletagmanager\.com\/gtm\.js|GTM-[A-Z0-9]+/i.test(html)
  report.hasFacebookPixel = /fbq\(|connect\.facebook\.net\/[a-z_]+\/fbevents/i.test(html)
  report.hasJsonLd = /application\/ld\+json/i.test(html)
  report.h1Count = (html.match(/<h1[\s>]/gi) ?? []).length
  const imgs = html.match(/<img[^>]*>/gi) ?? []
  report.imageCount = imgs.length
  report.imagesWithoutAlt = imgs.filter((tag) => !/\salt=["'][^"']+["']/i.test(tag)).length

  if (usePagespeed && report.url) report.pagespeed = await pagespeed(report.url)

  // ── Scoring ────────────────────────────────────────────────
  let score = 0
  const add = (points: number, text: string) => { score += points; report.findings.push(text) }
  if (!report.https) add(15, 'Saknar HTTPS.')
  if (!report.hasViewport) add(15, 'Inte mobilanpassad (saknar viewport).')
  if (!report.title || report.title.length < 10) add(8, 'Saknar eller har mycket kort sidtitel.')
  if (!report.metaDescription) add(8, 'Saknar meta-beskrivning.')
  if (report.h1Count === 0) add(5, 'Saknar H1-rubrik.')
  if (report.h1Count > 1) add(2, `Flera H1-rubriker (${report.h1Count}).`)
  if (report.imageCount > 0 && report.imagesWithoutAlt / report.imageCount > 0.5) add(5, `${report.imagesWithoutAlt} av ${report.imageCount} bilder saknar alt-text.`)
  if (!report.hasJsonLd) add(5, 'Ingen strukturerad data (schema.org).')
  if (!report.hasGoogleAdsTag) add(8, 'Ingen Google Ads-konverteringstagg hittad.')
  if (!report.hasAnalytics) add(4, 'Ingen Google Analytics/Tag Manager.')
  if (report.copyrightYear && report.copyrightYear <= new Date().getFullYear() - 2) add(8, `Copyright-år ${report.copyrightYear}, sidan verkar inte underhållas.`)
  if (report.generator && /wix|one\.com|squarespace/i.test(report.generator)) add(4, `Byggd i ${report.generator}.`)
  if (report.pagespeed?.performance != null && report.pagespeed.performance < 50) add(10, `PageSpeed mobil ${report.pagespeed.performance}/100.`)
  if (report.pagespeed?.seo != null && report.pagespeed.seo < 80) add(8, `PageSpeed SEO ${report.pagespeed.seo}/100.`)
  report.needScore = Math.min(100, score)
  return report
}

async function main() {
  const args = process.argv.slice(2)
  let domains: string[] = []
  let out: string | null = null
  let usePagespeed = true
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file') domains.push(...fs.readFileSync(path.resolve(args[++i]), 'utf-8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')))
    else if (args[i] === '--out') out = args[++i]
    else if (args[i] === '--no-pagespeed') usePagespeed = false
    else domains.push(args[i])
  }
  domains = Array.from(new Set(domains))
  if (domains.length === 0) {
    console.error('Användning: npx tsx scripts/analyze-sites.ts [--file lista.txt] [--out rapport.json] [--no-pagespeed] domän …')
    process.exit(1)
  }
  if (usePagespeed && !PAGESPEED_KEY) console.warn('⚠  GOOGLE_PAGESPEED_API_KEY saknas, hoppar över PageSpeed.\n')

  const reports: SiteReport[] = []
  for (const d of domains) {
    process.stdout.write(`▶ ${d} … `)
    const r = await analyze(d, usePagespeed)
    reports.push(r)
    console.log(r.reachable ? `${r.needScore}/100 behov` : 'ingen sida')
  }

  reports.sort((a, b) => b.needScore - a.needScore)
  console.log('\nDomän'.padEnd(32) + 'Behov  HTTPS Mobil Ads  PS-perf PS-seo  Plattform')
  for (const r of reports) {
    console.log(
      r.domain.padEnd(31) +
      String(r.needScore).padStart(5) + '  ' +
      (r.reachable ? (r.https ? 'ja   ' : 'nej  ') : '-    ') + ' ' +
      (r.reachable ? (r.hasViewport ? 'ja   ' : 'nej  ') : '-    ') + ' ' +
      (r.reachable ? (r.hasGoogleAdsTag ? 'ja ' : 'nej') : '-  ') + '  ' +
      String(r.pagespeed?.performance ?? '-').padStart(6) + '  ' +
      String(r.pagespeed?.seo ?? '-').padStart(5) + '  ' +
      (r.generator ?? (r.reachable ? 'okänd' : 'ingen hemsida')),
    )
  }
  if (out) {
    fs.writeFileSync(path.resolve(out), JSON.stringify(reports, null, 2))
    console.log(`\nRapport sparad: ${out}`)
  }
}

main().catch((err) => { console.error('❌', err?.message ?? err); process.exit(1) })
