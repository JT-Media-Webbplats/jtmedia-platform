import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AlertCircle, Clock, CalendarCheck } from 'lucide-react'
import BillingActions from './_components/BillingActions'

export const metadata: Metadata = { title: 'Fakturering' }

function classifyDate(dateStr: string): 'overdue' | 'this-week' | 'upcoming' {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dateStr)
  const diffDays = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return 'overdue'
  if (diffDays <= 7) return 'this-week'
  return 'upcoming'
}

const statusConfig = {
  overdue:     { label: 'Förfallen',    badge: 'bg-red-100 text-red-600',          row: 'border-l-2 border-red-400',    icon: AlertCircle,   iconCls: 'text-red-500' },
  'this-week': { label: 'Denna vecka',  badge: 'bg-yellow-100 text-yellow-700',    row: 'border-l-2 border-yellow-400', icon: Clock,         iconCls: 'text-yellow-600' },
  upcoming:    { label: 'Kommande',     badge: 'bg-brand-green/15 text-brand-green', row: 'border-l-2 border-transparent', icon: CalendarCheck, iconCls: 'text-brand-green' },
}

const intervalLabel: Record<string, string> = {
  monthly:      'Månadsvis',
  quarterly:    'Kvartalsvis',
  'semi-annual':'Halvårsvis',
  yearly:       'Årsvis',
}

export default async function BillingPage() {
  const supabase = await createClient()

  const { data: schedules, error } = await supabase
    .from('billing_schedules')
    .select('*, customers(id, name)')
    .order('next_billing_date', { ascending: true })

  if (error) {
    return <div className="p-8"><p className="text-red-500 text-sm">Fel: {error.message}</p></div>
  }

  const active   = schedules?.filter((s) => s.is_active) ?? []
  const inactive = schedules?.filter((s) => !s.is_active) ?? []

  const overdueCount  = active.filter((s) => classifyDate(s.next_billing_date) === 'overdue').length
  const thisWeekCount = active.filter((s) => classifyDate(s.next_billing_date) === 'this-week').length

  type S = { amount: number | string; billing_interval?: string | null }
  const mrr = active.reduce((sum, s: S) => {
    const amt = Number(s.amount)
    switch ((s as {billing_interval?: string}).billing_interval) {
      case 'monthly':       return sum + amt
      case 'quarterly':     return sum + amt / 3
      case 'semi-annual':   return sum + amt / 6
      case 'yearly':        return sum + amt / 12
      default:              return sum + amt
    }
  }, 0)
  const arr = mrr * 12
  const fmtKr = (n: number) => `${Math.round(n).toLocaleString('sv-SE')} kr`

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Fakturering</h1>
        <p className="text-gray-500 text-sm mt-1">{active.length} aktiva · {overdueCount > 0 ? `${overdueCount} förfallna` : 'inga förfallna'}</p>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div className={`rounded-2xl p-5 border shadow-sm ${overdueCount > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Förfallna</p>
          <p className={`text-3xl font-black ${overdueCount > 0 ? 'text-red-500' : 'text-gray-900'}`}>{overdueCount}</p>
        </div>
        <div className={`rounded-2xl p-5 border shadow-sm ${thisWeekCount > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'}`}>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Denna vecka</p>
          <p className={`text-3xl font-black ${thisWeekCount > 0 ? 'text-yellow-600' : 'text-gray-900'}`}>{thisWeekCount}</p>
        </div>
        <div className="bg-brand-green border border-brand-green rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-black/50 uppercase tracking-widest mb-2">MRR</p>
          <p className="text-3xl font-black text-black">{fmtKr(mrr)}</p>
          <p className="text-xs text-black/40 mt-1">Månadsintäkt</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">ARR</p>
          <p className="text-3xl font-black text-gray-900">{fmtKr(arr)}</p>
          <p className="text-xs text-gray-400 mt-1">Årsintäkt</p>
        </div>
      </div>

      {/* Active schedules */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Aktiva fakturor</h2>
        </div>

        {active.length === 0 ? (
          <p className="px-6 py-8 text-gray-400 text-sm text-center">Inga aktiva fakturor.</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Status', 'Kund', 'Belopp', 'Intervall', 'Nästa datum', 'Senast betald', ''].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {active.map((s) => {
                const cls = classifyDate(s.next_billing_date)
                const cfg = statusConfig[cls]
                const Icon = cfg.icon
                const customer = s.customers as { id: string; name: string } | null

                return (
                  <tr key={s.id} className={`hover:bg-gray-50 transition-colors ${cfg.row}`}>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.badge}`}>
                        <Icon className={`w-3 h-3 ${cfg.iconCls}`} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      {customer ? (
                        <Link href={`/admin/customers/${customer.id}`} className="font-medium text-gray-900 hover:text-brand-green transition-colors">
                          {customer.name}
                        </Link>
                      ) : '—'}
                      {s.notes && <p className="text-gray-400 text-xs mt-0.5 max-w-[180px] truncate">{s.notes}</p>}
                    </td>
                    <td className="px-6 py-3.5 font-bold text-gray-900">
                      {Number(s.amount).toLocaleString('sv-SE')} {s.currency}
                    </td>
                    <td className="px-6 py-3.5 text-gray-500">{intervalLabel[s.billing_interval] ?? s.billing_interval}</td>
                    <td className="px-6 py-3.5">
                      <span className={cls === 'overdue' ? 'text-red-500 font-semibold' : cls === 'this-week' ? 'text-yellow-600 font-semibold' : 'text-gray-700'}>
                        {s.next_billing_date}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-400 text-xs">{s.last_billed_date ?? '—'}</td>
                    <td className="px-6 py-3.5">
                      <BillingActions scheduleId={s.id} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Inactive schedules */}
      {inactive.length > 0 && (
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Pausade fakturor</h2>
          </div>
          <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Kund', 'Belopp', 'Intervall', 'Nästa datum'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inactive.map((s) => {
                const customer = s.customers as { id: string; name: string } | null
                return (
                  <tr key={s.id} className="opacity-50 hover:opacity-70 transition-opacity">
                    <td className="px-6 py-3 text-gray-600">
                      {customer ? (
                        <Link href={`/admin/customers/${customer.id}`} className="hover:text-gray-900 transition-colors">
                          {customer.name}
                        </Link>
                      ) : '—'}
                    </td>
                    <td className="px-6 py-3 text-gray-600">{Number(s.amount).toLocaleString('sv-SE')} {s.currency}</td>
                    <td className="px-6 py-3 text-gray-500">{intervalLabel[(s as {billing_interval?: string}).billing_interval ?? ''] ?? (s as {billing_interval?: string}).billing_interval ?? '—'}</td>
                    <td className="px-6 py-3 text-gray-500">{s.next_billing_date}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  )
}
