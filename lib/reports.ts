import type { ReportStats, TrafficPair } from '@/lib/supabase/types'

// Helpers for the monthly Digital Boost reports in /admin/rapporter.

export const monthNames = [
  'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
  'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December',
]

/** "2026-10" → first day of that month as "2026-10-01". Falls back to the current month. */
export function periodFromParam(param: string | undefined, today = new Date()): string {
  if (param && /^\d{4}-(0[1-9]|1[0-2])$/.test(param)) return `${param}-01`
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`
}

/** Shift a "YYYY-MM-01" period by n months and return "YYYY-MM". */
export function shiftPeriod(period: string, n: number): string {
  const [y, m] = period.split('-').map(Number)
  const d = new Date(y, m - 1 + n, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function periodLabel(period: string): string {
  const [y, m] = period.split('-').map(Number)
  return `${monthNames[m - 1]} ${y}`
}

export type ReportState = 'sent' | 'overdue' | 'today' | 'upcoming' | 'no_day'

/** Where a report stands in the given month, relative to today. */
export function reportState(period: string, reportDay: number | null, sent: boolean, today = new Date()): ReportState {
  if (sent) return 'sent'
  const [y, m] = period.split('-').map(Number)
  const lastDay = new Date(y, m, 0).getDate()
  const todayKey = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  if (reportDay == null) {
    // Without a set day the report is only late once the whole month has passed.
    return todayKey > y * 10000 + m * 100 + lastDay ? 'overdue' : 'no_day'
  }
  const dueKey = y * 10000 + m * 100 + Math.min(reportDay, lastDay)
  if (todayKey > dueKey) return 'overdue'
  if (todayKey === dueKey) return 'today'
  return 'upcoming'
}

export const reportStateLabels: Record<ReportState, string> = {
  sent:     'Skickad',
  overdue:  'Försenad',
  today:    'Idag',
  upcoming: 'Kommande',
  no_day:   'Ingen dag satt',
}

// ── Report figures ─────────────────────────────────────────────


export function formatInt(n: number): string {
  return Math.round(n).toLocaleString('sv-SE')
}

export function ctr({ impressions, clicks }: TrafficPair): number {
  return impressions ? clicks / impressions : 0
}

export function formatPct(ratio: number, decimals = 1): string {
  return `${(ratio * 100).toLocaleString('sv-SE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} %`
}

/** Change from previous to current as a ratio, or null when there is nothing to compare with. */
export function change(previous: number, current: number): number | null {
  return previous ? (current - previous) / previous : null
}

export function formatChange(ratio: number | null): string {
  if (ratio === null) return 'ny'
  return `${ratio >= 0 ? '+' : ''}${formatPct(ratio)}`
}

/** "2026-09-06" → "6 sep" */
export function shortDay(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' }).replace('.', '')
}

function changeWords(ratio: number | null): string {
  if (ratio === null) return ''
  if (Math.abs(ratio) < 0.005) return ', samma nivå som perioden innan'
  return `, ${ratio > 0 ? 'en ökning' : 'en minskning'} med ${formatPct(Math.abs(ratio), 0)} jämfört med perioden innan`
}

/** Suggested e-mail to the customer. Plain Swedish, no dashes, ready to paste. */
export function reportEmail(
  customerName: string,
  website: string | null,
  stats: ReportStats,
  seoItems: string[] = [],
): { subject: string; body: string } {
  const lines: string[] = []
  if (stats.organic) {
    const { current, previous } = stats.organic
    lines.push(`• Från Googles vanliga sökresultat fick ni ${formatInt(current.clicks)} klick och ${formatInt(current.impressions)} exponeringar${changeWords(change(previous.clicks, current.clicks))}.`)
  }
  if (stats.paid) {
    const { current, previous } = stats.paid
    lines.push(`• Era Google Ads-annonser gav ${formatInt(current.clicks)} klick${changeWords(change(previous.clicks, current.clicks))}.`)
  }
  if (stats.visitors) {
    const { current, previous } = stats.visitors
    lines.push(`• Totalt hade hemsidan ${formatInt(current)} besökare${changeWords(change(previous, current))}.`)
  }

  const site = website ? website.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'er hemsida'
  return {
    subject: `Statistikrapport ${site}, ${shortDay(stats.start)} till ${shortDay(stats.end)}`,
    body: [
      'Hej!',
      '',
      `Här kommer månadens statistikrapport för ${site}. Den visar de senaste 30 dagarna (${shortDay(stats.start)} till ${shortDay(stats.end)}) jämfört med 30 dagarna innan. Rapporten finns bifogad som PDF.`,
      '',
      'Kort sammanfattning:',
      ...lines,
      '',
      'Det här har vi gjort under månaden:',
      ...(seoItems.length ? seoItems.map((item) => `• ${item}`) : ['• [Fyll i SEO-arbetet]']),
      '',
      'Hör gärna av er om ni har några frågor!',
      '',
      'Med vänliga hälsningar',
      'JT Media',
    ].join('\n'),
  }
}
