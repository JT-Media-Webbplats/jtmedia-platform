import type { ProjectStatus } from '@/lib/supabase/types'

// Shared labels and column definitions for the admin kanban boards (projects in
// /admin/pipeline, sales opportunities in /admin/salj via lib/sales.ts).

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

export function formatKr(n: number | string | null | undefined): string {
  const value = Number(n ?? 0)
  return `${Math.round(value).toLocaleString('sv-SE')} kr`
}

export function isOverdue(date: string | null | undefined): boolean {
  if (!date) return false
  return new Date(date) < new Date(new Date().toDateString())
}
