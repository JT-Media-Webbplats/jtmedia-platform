import type { OpportunityKind, OpportunityStage, OpportunityValueType, SalesOpportunity } from '@/lib/supabase/types'
import { formatKr } from '@/lib/pipeline'
import type { KanbanColumnDef } from '@/lib/pipeline'
import { serviceCatalog } from '@/lib/portal'

// Shared labels and helpers for the sales board (/admin/salj). This is the
// only place companies live before they become customers and projects.

export const opportunityColumns: KanbanColumnDef<OpportunityStage>[] = [
  { key: 'identified', label: 'Identifierad',   hint: 'Hittad, inget skrivet ännu',        dot: 'bg-gray-400',    badge: 'bg-gray-100 text-gray-600' },
  { key: 'to_contact', label: 'Att kontakta',   hint: 'Utkast klart, väntar på att skickas', dot: 'bg-violet-400',  badge: 'bg-violet-400/15 text-violet-700' },
  { key: 'contacted',  label: 'Kontaktad',      hint: 'Skickat, väntar på svar',           dot: 'bg-sky-400',     badge: 'bg-sky-400/15 text-sky-700' },
  { key: 'dialog',     label: 'Dialog',         hint: 'Svar mottaget eller möte bokat',    dot: 'bg-amber-400',   badge: 'bg-amber-400/15 text-amber-700' },
  { key: 'proposal',   label: 'Offert skickad', hint: 'Väntar på ja eller nej',            dot: 'bg-orange-400',  badge: 'bg-orange-400/15 text-orange-700' },
  { key: 'won',        label: 'Vunnen',         hint: 'Blev affär',                        dot: 'bg-brand-green', badge: 'bg-brand-green/15 text-brand-green-dark' },
  { key: 'lost',       label: 'Avböjd',         hint: 'Tackade nej eller tystnade',        dot: 'bg-red-400',     badge: 'bg-red-400/15 text-red-500' },
]

export const closedStages: OpportunityStage[] = ['won', 'lost']
/** Stages where we are waiting on the other side; cards here go red after STALE_AFTER_DAYS. */
export const waitingStages: OpportunityStage[] = ['contacted', 'dialog', 'proposal']
export function isClosed(stage: OpportunityStage): boolean {
  return closedStages.includes(stage)
}

export const opportunityStageLabels: Record<OpportunityStage, string> = Object.fromEntries(
  opportunityColumns.map((c) => [c.key, c.label]),
) as Record<OpportunityStage, string>

export const opportunityKinds: { key: OpportunityKind; label: string; hint: string; badge: string }[] = [
  { key: 'upsell',       label: 'Merförsäljning', hint: 'Befintlig kund som kan köpa mer',   badge: 'bg-brand-green/15 text-brand-green-dark' },
  { key: 'new',          label: 'Ny kund',        hint: 'Företag vi inte jobbar med ännu',  badge: 'bg-sky-400/15 text-sky-700' },
  { key: 'reactivation', label: 'Återaktivering', hint: 'Gammal kund eller tappad dialog',  badge: 'bg-amber-400/15 text-amber-700' },
]

export const opportunityKindLabels: Record<OpportunityKind, string> = Object.fromEntries(
  opportunityKinds.map((k) => [k.key, k.label]),
) as Record<OpportunityKind, string>

export const opportunityKindBadge: Record<OpportunityKind, string> = Object.fromEntries(
  opportunityKinds.map((k) => [k.key, k.badge]),
) as Record<OpportunityKind, string>

export const priorityLabels: Record<1 | 2 | 3, string> = { 1: 'Hög', 2: 'Medel', 3: 'Låg' }
export const priorityDot: Record<1 | 2 | 3, string> = { 1: 'bg-red-500', 2: 'bg-amber-400', 3: 'bg-gray-300' }

export const valueTypes: { key: OpportunityValueType; label: string; short: string }[] = [
  { key: 'recurring', label: 'Återkommande (kr/år)', short: '/år' },
  { key: 'one_time',  label: 'Engångskostnad',        short: '' },
]

/** "10 300 kr/år" or "10 300 kr" depending on value type. */
export function formatValue(o: Pick<SalesOpportunity, 'estimated_value' | 'value_type'>): string {
  return `${formatKr(o.estimated_value)}${o.value_type === 'one_time' ? '' : '/år'}`
}

/** Sums recurring and one-time values separately. */
export function sumValues(list: Pick<SalesOpportunity, 'estimated_value' | 'value_type'>[]): { recurring: number; oneTime: number } {
  return list.reduce(
    (acc, o) => {
      const v = Number(o.estimated_value ?? 0)
      if (o.value_type === 'one_time') acc.oneTime += v
      else acc.recurring += v
      return acc
    },
    { recurring: 0, oneTime: 0 },
  )
}

/** Human summary like "10 300 kr/år + 25 000 kr engångs", or null when both are zero. */
export function describeValues(list: Pick<SalesOpportunity, 'estimated_value' | 'value_type'>[]): string | null {
  const { recurring, oneTime } = sumValues(list)
  const parts: string[] = []
  if (recurring > 0) parts.push(`${formatKr(recurring)}/år`)
  if (oneTime > 0) parts.push(`${formatKr(oneTime)} engångs`)
  return parts.length ? parts.join(' + ') : null
}

export const leadSources = ['Säljagenten', 'Rekommendation', 'Hemsidan', 'SEO-testet', 'LinkedIn', 'Nätverk', 'Kallt utskick', 'Mässa/event', 'Befintlig kund', 'Annat']

/** Options for the "Tjänst att sälja" select: the public catalogue + a free-text fallback. */
export const serviceOptions: { key: string; name: string }[] = [
  ...serviceCatalog.map((s) => ({ key: s.key, name: s.name })),
  { key: 'other', name: 'Annat (ange nedan)' },
]

export function serviceLabel(serviceKey: string | null, serviceName: string | null): string {
  if (serviceName) return serviceName
  const hit = serviceCatalog.find((s) => s.key === serviceKey)
  return hit?.name ?? 'Tjänst ej angiven'
}

/** Whole days the card has been in its current column. */
export function daysInStage(o: Pick<SalesOpportunity, 'stage_changed_at' | 'updated_at'>): number {
  const since = o.stage_changed_at ?? o.updated_at
  return Math.max(0, Math.floor((Date.now() - new Date(since).getTime()) / 86400000))
}
export const STALE_AFTER_DAYS = 14
/** True when the card has been waiting on the other side for too long. */
export function isStale(o: Pick<SalesOpportunity, 'stage' | 'stage_changed_at' | 'updated_at'>): boolean {
  return waitingStages.includes(o.stage) && daysInStage(o) >= STALE_AFTER_DAYS
}

export function gmailThreadUrl(threadId: string): string {
  return `https://mail.google.com/mail/u/0/#all/${threadId}`
}

/** Opens Gmail's web compose window pre-filled with the draft. */
export function gmailComposeUrl(to: string | null, subject: string | null, body: string | null): string {
  const params = new URLSearchParams({ view: 'cm', fs: '1' })
  if (to) params.set('to', to)
  if (subject) params.set('su', subject)
  if (body) params.set('body', body)
  return `https://mail.google.com/mail/?${params.toString()}`
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Date(iso).toLocaleString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}
