import type { ServiceRequestStatus, ServiceType } from '@/lib/supabase/types'

// Shared data for the customer portal: the catalogue of services a customer
// can request, request status labels and the team contact card.

export interface CatalogService {
  key: string
  name: string
  /** Which customer_services.type counts as "already has this". */
  matchesType: ServiceType | null
  /** Fallback: match on the service name (case-insensitive) when type is ambiguous. */
  matchesName?: string
  tagline: string
  description: string
  bullets: string[]
  /** Public page on jtmediasweden.com with more info. */
  href: string
}

export const serviceCatalog: CatalogService[] = [
  {
    key: 'webb',
    name: 'Webb & Hemsidor',
    matchesType: 'website',
    tagline: 'En hemsida som säljer',
    description: 'Snabb, modern och byggd för att ranka högt. Från enkla landningssidor till kompletta webbplatser med bokning, formulär och integrationer.',
    bullets: ['Design och utveckling', 'Mobilanpassad och snabb', 'Drift, backup och SSL'],
    href: '/tjanster/webb',
  },
  {
    key: 'seo',
    name: 'SEO',
    matchesType: 'seo',
    tagline: 'Syns på Google',
    description: 'Teknisk optimering, innehåll och lokal sökmotoroptimering så att ni hittas när kunderna söker.',
    bullets: ['Teknisk SEO och struktur', 'Lokal SEO för er ort', 'Månadsrapport med resultat'],
    href: '/tjanster/seo',
  },
  {
    key: 'geo',
    name: 'GEO',
    matchesType: 'geo',
    tagline: 'Syns i AI-sökningar',
    description: 'Generative Engine Optimization gör att ert företag nämns när kunder frågar ChatGPT, Gemini och Google AI.',
    bullets: ['Optimering för AI-svar', 'Strukturerad data', 'Uppföljning av synlighet'],
    href: '/tjanster/geo',
  },
  {
    key: 'google-ads',
    name: 'Google Ads',
    matchesType: 'google_ads',
    tagline: 'Resultat från dag ett',
    description: 'Sökannonser, shoppingannonser och remarketing. Vi sköter strategi, budgivning och daglig optimering.',
    bullets: ['Kampanjuppsättning', 'Löpande optimering', 'Tydlig rapportering'],
    href: '/tjanster/google-ads',
  },
  {
    key: 'sociala-medier',
    name: 'Sociala medier',
    matchesType: 'social',
    tagline: 'Innehåll som engagerar',
    description: 'Strategi, content och hantering av Instagram, Facebook och LinkedIn så att ni bygger följarskara och förtroende.',
    bullets: ['Innehållsplan och publicering', 'Grafik och text', 'Annonsering vid behov'],
    href: '/tjanster/sociala-medier',
  },
  {
    key: 'ai',
    name: 'AI-lösningar',
    matchesType: 'ai',
    tagline: 'Spara tid med AI',
    description: 'Chatbots, automatiserade arbetsflöden och skräddarsydda AI-verktyg som jobbar åt er dygnet runt.',
    bullets: ['AI-chatbot på hemsidan', 'Automatisering av rutiner', 'Skräddarsydda verktyg'],
    href: '/tjanster/ai',
  },
  {
    key: 'grafisk-design',
    name: 'Grafisk design',
    matchesType: 'design',
    tagline: 'Ett varumärke som håller ihop',
    description: 'Logotyper, grafisk profil, trycksaker och digitalt material som kommunicerar vilka ni är.',
    bullets: ['Logotyp och profil', 'Trycksaker och skyltar', 'Material för sociala medier'],
    href: '/tjanster/grafisk-design',
  },
  {
    key: 'digital-boost',
    name: 'Digital Boost',
    matchesType: null,
    matchesName: 'digital boost',
    tagline: 'Hela paketet, en fast kostnad',
    description: 'Vår löpande tjänst där vi agerar er marknadsavdelning: hemsida, SEO, sociala medier och rådgivning i ett paket.',
    bullets: ['Fast månadskostnad', 'Hela teamet tillgängligt', 'Månatlig avstämning'],
    href: '/tjanster/digital-boost',
  },
]

// ── Recommendations ────────────────────────────────────────────
// Which extra service to suggest, based on what the customer already has.
// Rules are checked in order; lower priority number = shown first.

export interface OwnedService {
  type: ServiceType
  name: string
}

export interface Recommendation {
  service: CatalogService
  reason: string
  priority: number
}

interface RecommendationRule {
  recommend: string
  priority: number
  reason: string
  when: (has: (type: ServiceType) => boolean) => boolean
}

const recommendationRules: RecommendationRule[] = [
  {
    recommend: 'webb', priority: 0,
    reason: 'Ni har domänen hos oss. En modern, snabb hemsida är nästa naturliga steg för att göra något av den.',
    when: (has) => !has('website') && (has('domain') || has('hosting')),
  },
  {
    recommend: 'seo', priority: 1,
    reason: 'Ni har en hemsida. Med SEO ser vi till att den också hittas av de som söker efter era tjänster på Google.',
    when: (has) => has('website') && !has('seo'),
  },
  {
    recommend: 'google-ads', priority: 1,
    reason: 'SEO bygger långsiktigt. Google Ads ger er klick redan i dag på samma sökord, medan SEO-arbetet växer till sig.',
    when: (has) => has('seo') && !has('google_ads'),
  },
  {
    recommend: 'seo', priority: 1,
    reason: 'Ni betalar för varje klick i dag. Med SEO bygger ni trafik som inte kostar per klick och som håller över tid.',
    when: (has) => has('google_ads') && !has('seo'),
  },
  {
    recommend: 'google-ads', priority: 2,
    reason: 'Ni bygger följare i sociala medier. Google Ads fångar dessutom de som redan letar efter det ni erbjuder.',
    when: (has) => has('social') && !has('google_ads'),
  },
  {
    recommend: 'geo', priority: 2,
    reason: 'Allt fler söker via AI. GEO ser till att ert företag nämns när kunder frågar ChatGPT, Gemini och Google AI.',
    when: (has) => (has('seo') || has('website')) && !has('geo'),
  },
  {
    recommend: 'sociala-medier', priority: 2,
    reason: 'Ni syns på Google. Sociala medier bygger förtroende och håller er kvar i kundernas medvetande mellan köpen.',
    when: (has) => (has('website') || has('seo')) && !has('social'),
  },
  {
    recommend: 'grafisk-design', priority: 3,
    reason: 'En tydlig grafisk profil gör era inlägg och annonser mer igenkännbara och stärker varumärket över tid.',
    when: (has) => (has('social') || has('google_ads')) && !has('design'),
  },
  {
    recommend: 'ai', priority: 3,
    reason: 'En AI-chatbot på hemsidan svarar på kundernas frågor dygnet runt och tar emot bokningar även när ni är upptagna.',
    when: (has) => has('website') && !has('ai'),
  },
]

const fallbackRecommendations: { key: string; reason: string }[] = [
  { key: 'webb', reason: 'En modern hemsida är grunden för all digital närvaro. Vi bygger den snabb, säljande och lätt att hitta.' },
  { key: 'seo', reason: 'Syns när kunderna söker. Vi optimerar tekniskt och lokalt så att ni rankar högt i er region.' },
  { key: 'sociala-medier', reason: 'Bygg förtroende där kunderna redan är. Vi sköter innehåll och publicering åt er.' },
]

/** Whether the customer already has a catalogue service, by type or by name. */
export function ownsCatalogService(item: CatalogService, owned: OwnedService[]): boolean {
  return owned.some((s) =>
    (item.matchesType !== null && s.type === item.matchesType) ||
    (item.matchesName !== undefined && s.name.toLowerCase().includes(item.matchesName)),
  )
}

/** Up to `limit` services the customer does not have, with a customer-specific reason. */
export function recommendServices(owned: OwnedService[], limit = 3): Recommendation[] {
  const has = (type: ServiceType) => owned.some((s) => s.type === type)
  const picked = new Map<string, Recommendation>()

  for (const rule of recommendationRules) {
    if (!rule.when(has)) continue
    const service = serviceCatalog.find((s) => s.key === rule.recommend)
    if (!service || ownsCatalogService(service, owned)) continue
    const existing = picked.get(service.key)
    if (!existing || rule.priority < existing.priority) {
      picked.set(service.key, { service, reason: rule.reason, priority: rule.priority })
    }
  }

  for (const fb of fallbackRecommendations) {
    if (picked.size >= limit) break
    const service = serviceCatalog.find((s) => s.key === fb.key)
    if (!service || picked.has(service.key) || ownsCatalogService(service, owned)) continue
    picked.set(service.key, { service, reason: fb.reason, priority: 9 })
  }

  return Array.from(picked.values()).sort((a, b) => a.priority - b.priority).slice(0, limit)
}

export const requestStatusLabels: Record<ServiceRequestStatus, string> = {
  new:         'Ny',
  in_progress: 'Pågår',
  done:        'Klar',
  declined:    'Avböjd',
}

export const requestStatusBadge: Record<ServiceRequestStatus, string> = {
  new:         'bg-brand-green/20 text-brand-green-dark',
  in_progress: 'bg-blue-400/15 text-blue-600',
  done:        'bg-black/5 text-black/45',
  declined:    'bg-red-400/15 text-red-500',
}

export const team = [
  { name: 'Theo Brandt',    role: 'Grundare & Webb',              phone: '076-768 02 02', tel: '+46767680202', img: '/images/team/theo.webp' },
  { name: 'Jakob Jolheden', role: 'Grundare & Digital strategi',  phone: '073-698 01 31', tel: '+46736980131', img: '/images/team/jakob.webp' },
]

export const contactEmail = 'info@jtmediasweden.com'
