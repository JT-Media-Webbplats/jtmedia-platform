import type { CustomerService, ServiceInterval, ServiceStatus, ServiceType } from '@/lib/supabase/types'

// Shared labels for customer services, used by both admin and the customer portal.

export const serviceTypeLabels: Record<ServiceType, string> = {
  website:     'Hemsida',
  hosting:     'Drift & hosting',
  domain:      'Domän',
  email:       'E-post',
  maintenance: 'Underhåll & support',
  seo:         'SEO',
  geo:         'GEO',
  google_ads:  'Google Ads',
  social:      'Sociala medier',
  ai:          'AI-lösning',
  design:      'Grafisk design',
  other:       'Övrigt',
}

export const serviceTypeOptions = (Object.keys(serviceTypeLabels) as ServiceType[]).map((value) => ({
  value,
  label: serviceTypeLabels[value],
}))

export const serviceIntervalLabels: Record<ServiceInterval, string> = {
  monthly:       'Månadsvis',
  quarterly:     'Kvartalsvis',
  'semi-annual': 'Halvårsvis',
  yearly:        'Årsvis',
  one_time:      'Engångs',
}

export const serviceIntervalOptions = (Object.keys(serviceIntervalLabels) as ServiceInterval[]).map((value) => ({
  value,
  label: serviceIntervalLabels[value],
}))

export const serviceStatusLabels: Record<ServiceStatus, string> = {
  active: 'Aktiv',
  paused: 'Pausad',
  ended:  'Avslutad',
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })
}

export const intervalShortLabels: Record<ServiceInterval, string> = {
  monthly:       'mån',
  quarterly:     'kvartal',
  'semi-annual': 'halvår',
  yearly:        'år',
  one_time:      'engång',
}

/** Number of times a service is billed per year. 0 for one-time or unset. */
export function billingsPerYear(interval: ServiceInterval | null | undefined): number {
  switch (interval) {
    case 'monthly':     return 12
    case 'quarterly':   return 4
    case 'semi-annual': return 2
    case 'yearly':      return 1
    default:            return 0
  }
}

export function yearlyCost(service: Pick<CustomerService, 'amount' | 'billing_interval'>): number {
  return Number(service.amount ?? 0) * billingsPerYear(service.billing_interval)
}

export function monthlyCost(service: Pick<CustomerService, 'amount' | 'billing_interval'>): number {
  return yearlyCost(service) / 12
}

export function formatAmount(amount: number | string | null | undefined, currency = 'SEK'): string {
  const value = Number(amount ?? 0)
  const formatted = value.toLocaleString('sv-SE', { minimumFractionDigits: 0, maximumFractionDigits: value % 1 === 0 ? 0 : 2 })
  return currency === 'SEK' ? `${formatted} kr` : `${formatted} ${currency}`
}
