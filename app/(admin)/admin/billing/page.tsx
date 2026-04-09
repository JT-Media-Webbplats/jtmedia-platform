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
  overdue:    { label: 'Förfallen',   badge: 'bg-red-400/15 text-red-400',    row: 'border-l-2 border-red-400',    icon: AlertCircle,    iconCls: 'text-red-400' },
  'this-week': { label: 'Denna vecka', badge: 'bg-yellow-400/15 text-yellow-400', row: 'border-l-2 border-yellow-400', icon: Clock,          iconCls: 'text-yellow-400' },
  upcoming:   { label: 'Kommande',    badge: 'bg-brand-green/15 text-brand-green', row: 'border-l-2 border-transparent', icon: CalendarCheck, iconCls: 'text-brand-green' },
}

const intervalLabel: Record<string, string> = {
  monthly: 'Månadsvis', quarterly: 'Kvartalsvis', yearly: 'Årsvis',
}

export default async function BillingPage() {
  const supabase = await createClient()

  const { data: schedules, error } = await supabase
    .from('billing_schedules')
    .select('*, customers(id, name)')
    .order('next_billing_date', { ascending: true })

  if (error) {
    return <div className="p-8"><p className="text-red-400 text-sm">Fel: {error.message}</p></div>
  }

  const active   = schedules?.filter((s) => s.is_active) ?? []
  const inactive = schedules?.filter((s) => !s.is_active) ?? []

  const overdueCount   = active.filter((s) => classifyDate(s.next_billing_date) === 'overdue').length
  const thisWeekCount  = active.filter((s) => classifyDate(s.next_billing_date) === 'this-week').length
  const totalMonthly   = active
    .filter((s) => s.billing_interval === 'monthly')
    .reduce((sum, s) => sum + Number(s.amount), 0)

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Fakturering</h1>
        <p className="text-white/30 text-sm mt-1">{active.length} aktiva · {overdueCount > 0 ? `${overdueCount} förfallna` : 'inga förfallna'}</p>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className={`rounded-2xl p-5 border ${overdueCount > 0 ? 'bg-red-400/10 border-red-400/20' : 'bg-white/4 border-white/6'}`}>
          <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Förfallna</p>
          <p className={`text-3xl font-black ${overdueCount > 0 ? 'text-red-400' : 'text-white'}`}>{overdueCount}</p>
        </div>
        <div className={`rounded-2xl p-5 border ${thisWeekCount > 0 ? 'bg-yellow-400/10 border-yellow-400/20' : 'bg-white/4 border-white/6'}`}>
          <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Denna vecka</p>
          <p className={`text-3xl font-black ${thisWeekCount > 0 ? 'text-yellow-400' : 'text-white'}`}>{thisWeekCount}</p>
        </div>
        <div className="bg-brand-green/12 border border-brand-green/20 rounded-2xl p-5">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Månadsintäkt</p>
          <p className="text-3xl font-black text-brand-green">{totalMonthly.toLocaleString('sv-SE')} kr</p>
        </div>
      </div>

      {/* Active schedules */}
      <div className="bg-white/4 border border-white/6 rounded-2xl overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-white/6">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">Aktiva fakturor</h2>
        </div>

        {active.length === 0 ? (
          <p className="px-6 py-8 text-white/30 text-sm text-center">Inga aktiva fakturor.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Status', 'Kund', 'Belopp', 'Intervall', 'Nästa datum', 'Senast betald', ''].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white/25">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {active.map((s) => {
                const cls = classifyDate(s.next_billing_date)
                const cfg = statusConfig[cls]
                const Icon = cfg.icon
                const customer = s.customers as { id: string; name: string } | null

                return (
                  <tr key={s.id} className={`hover:bg-white/4 transition-colors ${cfg.row}`}>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.badge}`}>
                        <Icon className={`w-3 h-3 ${cfg.iconCls}`} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      {customer ? (
                        <Link href={`/admin/customers/${customer.id}`} className="font-medium text-white hover:text-brand-green transition-colors">
                          {customer.name}
                        </Link>
                      ) : '—'}
                      {s.notes && <p className="text-white/30 text-xs mt-0.5 max-w-[180px] truncate">{s.notes}</p>}
                    </td>
                    <td className="px-6 py-3.5 font-bold text-white">
                      {Number(s.amount).toLocaleString('sv-SE')} {s.currency}
                    </td>
                    <td className="px-6 py-3.5 text-white/45">{intervalLabel[s.billing_interval] ?? s.billing_interval}</td>
                    <td className="px-6 py-3.5">
                      <span className={cls === 'overdue' ? 'text-red-400 font-semibold' : cls === 'this-week' ? 'text-yellow-400 font-semibold' : 'text-white/65'}>
                        {s.next_billing_date}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-white/35 text-xs">{s.last_billed_date ?? '—'}</td>
                    <td className="px-6 py-3.5">
                      <BillingActions scheduleId={s.id} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Inactive schedules */}
      {inactive.length > 0 && (
        <div className="bg-white/4 border border-white/6 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/6">
            <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest">Pausade fakturor</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Kund', 'Belopp', 'Intervall', 'Nästa datum'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white/20">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {inactive.map((s) => {
                const customer = s.customers as { id: string; name: string } | null
                return (
                  <tr key={s.id} className="opacity-50 hover:opacity-70 transition-opacity">
                    <td className="px-6 py-3 text-white/50">
                      {customer ? (
                        <Link href={`/admin/customers/${customer.id}`} className="hover:text-white transition-colors">
                          {customer.name}
                        </Link>
                      ) : '—'}
                    </td>
                    <td className="px-6 py-3 text-white/50">{Number(s.amount).toLocaleString('sv-SE')} {s.currency}</td>
                    <td className="px-6 py-3 text-white/35">{intervalLabel[s.billing_interval] ?? s.billing_interval}</td>
                    <td className="px-6 py-3 text-white/35">{s.next_billing_date}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
