/**
 * Links each report client to its Search Console property, GA4 property and
 * Google Ads campaigns (matched by hand from scripts/google-check.ts output, 2026-10-08).
 * Most campaigns live in JT Media's shared Ads account and are picked out by name.
 *
 *   npx tsx scripts/map-report-sources.ts
 *
 * Only fills empty fields, so changes made in /admin/rapporter are kept.
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

type Sources = { website?: string; gsc?: string; ga4?: string; ads?: string; adsMatch?: string }

const SHARED_ADS = '767-093-0819'
const shared = (adsMatch: string) => ({ ads: SHARED_ADS, adsMatch })

const sources: Record<string, Sources> = {
  'Rethink Factory':          { website: 'rethinkfactory.se',        gsc: 'https://rethinkfactory.se/' },
  'Grimslövs Skogstjänst':    { website: 'grimslovsskogstjanst.se',  gsc: 'https://grimslovsskogstjanst.se/', ga4: '475596981', ...shared('Grimslöv') },
  'Michael Ströms Bygg':      { website: 'michaelstromsbygg.se',     gsc: 'sc-domain:michaelstromsbygg.se',   ga4: '448608068', ...shared('Michael Ströms') },
  'Campus Ljungby':           { website: 'campusljungby.se',         gsc: 'sc-domain:campusljungby.se',       ga4: '367887905', ads: '832-274-2435' },
  'Laholm Stål':              { website: 'laholmstal.se',            gsc: 'sc-domain:laholmstal.se', ...shared('Laholm Stål') },
  'OptiTuning Ljungby':       { website: 'optituning-ljungby.se',    gsc: 'sc-domain:optituning-ljungby.se', ga4: '353133393' /* hits land in Molico's property */, ...shared('Optituning') },
  'Molico':                   { website: 'molico.se',                gsc: 'https://molico.se/',               ga4: '353133393', ...shared('Performance Max, Campaign 2024-08-12') },
  'PT System / Pelltec':      { website: 'ptsystem.se',              gsc: 'sc-domain:ptsystem.se',            ga4: '382908997', ads: '202-012-6923' },
  'LBY Tech':                 { website: 'lbytech.se',               gsc: 'https://lbytech.se/', ...shared('LBY Tech') },
  'XL Bygg':                  { website: 'xlbygg-lagan.se',                                                   ga4: '436694710' },
  'Lastbilsstopp':            { website: 'lastbilsstopp.se',         gsc: 'sc-domain:lastbilsstopp.se',       ga4: '430617386', ...shared('Lastbilsstopp') },
  'Lagan Plåtprodukter':      { website: 'lpp.se',                   gsc: 'sc-domain:lpp.se',                 ga4: '437065625', ...shared('Lagan Plåt') },
  'EPX Golvteknik':           { website: 'epxgolvteknik.se',         gsc: 'sc-domain:epxgolvteknik.se',       ga4: '538168138', ...shared('EPX') },
  'Z-teknik':                 { website: 'z-teknik.se',              gsc: 'https://z-teknik.se/',             ga4: '482753114', ...shared('Z-teknik') },
  'Hotell Garvaren':          { website: 'hotellgarvaren.se',        gsc: 'sc-domain:hotellgarvaren.se',      ga4: '475596981' /* own property 453260364 is empty; its hits land in the shared tag group */, ...shared('Garvaren') },
  'Hamneda Grus':             { website: 'hamnedagrus.se',           gsc: 'https://hamnedagrus.se/',          ga4: '521073500', ...shared('Hamneda') },
  'Pekuma':                   { website: 'pekuma.se',                gsc: 'https://pekuma.se/',               ga4: '479093248', ...shared('Pekuma') },
  'Smefast':                  { website: 'smefast.se',               gsc: 'sc-domain:smefast.se',             ga4: '443713967', ...shared('Smefast') },
  'Ljungby Trädgårdsservice': { ...shared('Trädgårdsservice') },  // Davids Trädgårdsservice
  'Clinic Charisma':          { website: 'cliniccharisma.se',        gsc: 'sc-domain:cliniccharisma.se',      ga4: '443702338', ...shared('Clinic Charisma') },
  'JB Utbildningar':          { website: 'jbutbildningar.se',        gsc: 'sc-domain:jbutbildningar.se',      ga4: '446550989', ...shared('JB Utbildningar') },
  'Hårds Transport':          { website: 'hardstransport.se',        gsc: 'sc-domain:hardstransport.se',      ga4: '429388478', ...shared('Hårds') },
}

async function main() {
  const { data: clients, error } = await supabase
    .from('report_clients')
    .select('id, website, gsc_site, ga4_property_id, ads_customer_id, ads_campaign_match, customer:customers(name)')
  if (error) throw error

  for (const c of clients ?? []) {
    const name = (c.customer as unknown as { name: string } | null)?.name ?? ''
    const s = sources[name]
    if (!s) {
      console.log(`– ${name}: ingen källa hittad`)
      continue
    }
    const patch: Record<string, string> = {}
    if (!c.website && s.website) patch.website = s.website
    if (!c.gsc_site && s.gsc) patch.gsc_site = s.gsc
    if (!c.ga4_property_id && s.ga4) patch.ga4_property_id = s.ga4
    if (!c.ads_customer_id && s.ads) patch.ads_customer_id = s.ads
    if (!c.ads_campaign_match && s.adsMatch) patch.ads_campaign_match = s.adsMatch
    if (Object.keys(patch).length) {
      const { error: upErr } = await supabase.from('report_clients').update(patch).eq('id', c.id)
      if (upErr) throw upErr
    }
    console.log(`✓ ${name}: ${[s.gsc && 'GSC', s.ga4 && 'GA4', s.ads && `Ads${s.adsMatch ? ` ("${s.adsMatch}")` : ''}`].filter(Boolean).join(' + ')}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
