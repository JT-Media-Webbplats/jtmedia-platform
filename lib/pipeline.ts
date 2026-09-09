import type { ProjectStatus, ProspectStage } from '@/lib/supabase/types'

// Shared labels and column definitions for the admin pipeline (kanban).

export interface KanbanColumnDef<K extends string> {
  key: K
  label: string
  hint?: string
  /** Tailwind classes for the column header dot + badge. */
  dot: string
  badge: string
}

export const projectColumns: KanbanColumnDef<ProjectStatus>[] = [
  { key: 'pending',   label: 'Väntar på godkännande', hint: 'Offert skickad, inväntar kundens ja', dot: 'bg-amber-400',  badge: 'bg-amber-400/15 text-amber-700' },
  { key: 'active',    label: 'Pågående',              hint: 'Arbete pågår',                         dot: 'bg-brand-green', badge: 'bg-brand-green/15 text-brand-green-dark' },
  { key: 'paused',    label: 'Pausat',                hint: 'Väntar på kund eller material',        dot: 'bg-gray-400',   badge: 'bg-gray-100 text-gray-600' },
  { key: 'completed', label: 'Klart',                 hint: 'Levererat och avslutat',               dot: 'bg-blue-500',   badge: 'bg-blue-400/15 text-blue-600' },
  { key: 'cancelled', label: 'Avbrutet',              hint: 'Blev inte av',                         dot: 'bg-red-400',    badge: 'bg-red-400/15 text-red-500' },
]

export const projectStatusLabels: Record<string, string> = {
  pending:   'Väntar på godkännande',
  active:    'Pågående',
  paused:    'Pausat',
  completed: 'Klart',
  cancelled: 'Avbrutet',
}

export const projectStatusBadge: Record<string, string> = Object.fromEntries(
  projectColumns.map((c) => [c.key, c.badge]),
)

export const prospectColumns: KanbanColumnDef<ProspectStage>[] = [
  { key: 'to_contact', label: 'Att kontakta',   hint: 'Företag vi borde höra av oss till', dot: 'bg-gray-400',    badge: 'bg-gray-100 text-gray-600' },
  { key: 'contacted',  label: 'Kontaktad',      hint: 'Första kontakt tagen',              dot: 'bg-sky-400',     badge: 'bg-sky-400/15 text-sky-700' },
  { key: 'meeting',    label: 'Möte bokat',     hint: 'Möte inbokat eller genomfört',      dot: 'bg-violet-400',  badge: 'bg-violet-400/15 text-violet-700' },
  { key: 'proposal',   label: 'Offert skickad', hint: 'Väntar på svar',                    dot: 'bg-amber-400',   badge: 'bg-amber-400/15 text-amber-700' },
  { key: 'won',        label: 'Vunnen',         hint: 'Blev kund',                         dot: 'bg-brand-green', badge: 'bg-brand-green/15 text-brand-green-dark' },
  { key: 'lost',       label: 'Förlorad',       hint: 'Tackade nej eller tystnade',        dot: 'bg-red-400',     badge: 'bg-red-400/15 text-red-500' },
]

export const prospectStageLabels: Record<ProspectStage, string> = Object.fromEntries(
  prospectColumns.map((c) => [c.key, c.label]),
) as Record<ProspectStage, string>

export const prospectSources = ['Rekommendation', 'Hemsidan', 'SEO-testet', 'LinkedIn', 'Nätverk', 'Kallt utskick', 'Mässa/event', 'Annat']

export function formatKr(n: number | string | null | undefined): string {
  const value = Number(n ?? 0)
  return `${Math.round(value).toLocaleString('sv-SE')} kr`
}

export function isOverdue(date: string | null | undefined): boolean {
  if (!date) return false
  return new Date(date) < new Date(new Date().toDateString())
}
