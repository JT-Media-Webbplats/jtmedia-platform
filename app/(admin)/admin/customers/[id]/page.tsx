import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'
import CustomerEditForm from './_components/CustomerEditForm'
import BillingSchedulePanel from './_components/BillingSchedulePanel'
import type { BillingSchedule } from '@/lib/supabase/types'

export const metadata: Metadata = { title: 'Redigera kund' }

const statusBadge: Record<string, string> = {
  active:    'bg-brand-green/15 text-brand-green',
  paused:    'bg-yellow-400/15 text-yellow-600',
  inactive:  'bg-gray-100 text-gray-500',
  completed: 'bg-blue-400/15 text-blue-500',
  cancelled: 'bg-red-400/15 text-red-500',
}
const statusLabel: Record<string, string> = {
  active: 'Aktiv', paused: 'Pausad', inactive: 'Inaktiv',
  completed: 'Avslutad', cancelled: 'Avbruten',
}
const intervalLabel: Record<string, string> = {
  monthly: 'Månadsvis', quarterly: 'Kvartalsvis', 'semi-annual': 'Halvårsvis', yearly: 'Årsvis',
}

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [
    { data: customer },
    { data: projects },
    { data: billing },
    { data: timeEntries },
  ] = await Promise.all([
    supabase.from('customers').select('*').eq('id', id).single(),
    supabase.from('projects')
      .select('id, name, status, budget_hours, started_at, updated_at, time_entries(hours)')
      .eq('customer_id', id)
      .order('updated_at', { ascending: false }),
    supabase.from('billing_schedules')
      .select('*')
      .eq('customer_id', id)
      .order('next_billing_date'),
    supabase.from('time_entries')
      .select('id, hours, description, logged_on, projects(name)')
      .eq('projects.customer_id', id)
      .order('logged_on', { ascending: false })
      .limit(20),
  ])

  if (!customer) notFound()

  const activeBilling = (billing ?? []).filter((b) => b.is_active)
  const totalMRR = activeBilling.reduce((sum, b) => {
    const amt = Number(b.amount)
    const interval = (b as BillingSchedule & { billing_interval?: string }).billing_interval
    switch (interval) {
      case 'monthly':     return sum + amt
      case 'quarterly':   return sum + amt / 3
      case 'semi-annual': return sum + amt / 6
      case 'yearly':      return sum + amt / 12
      default:            return sum + amt
    }
  }, 0)

  return (
    <div className="p-8">
      <Link href="/admin/customers" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-900 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Tillbaka till kunder
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">{customer.name}</h1>
          <p className="text-gray-500 text-sm mt-1">Kund sedan {new Date(customer.created_at).toLocaleDateString('sv-SE')}</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusBadge[customer.status]}`}>
          {statusLabel[customer.status]}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* MRR card */}
        <div className="bg-brand-green border border-brand-green rounded-2xl p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-black/50 mb-3">Månatlig intäkt (MRR)</h2>
          <p className="text-4xl font-black text-black">
            {Math.round(totalMRR).toLocaleString('sv-SE')} kr
          </p>
          <p className="text-xs text-black/45 mt-1">{activeBilling.length} aktiva scheman</p>
        </div>

        {/* Project stats */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Projektstatus</h2>
          <div className="space-y-3">
            {(['active', 'completed', 'paused'] as const).map((s) => {
              const count = projects?.filter((p) => p.status === s).length ?? 0
              return (
                <div key={s} className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge[s]}`}>
                    {statusLabel[s]}
                  </span>
                  <span className="text-lg font-black text-gray-900">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Time summary */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Tid loggad</h2>
          {projects?.length ? (
            <div className="space-y-2">
              {projects.slice(0, 4).map((p) => {
                const hrs = ((p.time_entries ?? []) as { hours: number }[]).reduce((s, t) => s + Number(t.hours), 0)
                return (
                  <div key={p.id} className="flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-600 truncate">{p.name}</span>
                    <span className="text-xs font-bold text-gray-900 shrink-0">{hrs.toFixed(1)}h</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Inga timmar loggade.</p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Edit form */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-5">Redigera kundinfo</h2>
          <CustomerEditForm customer={customer} />
        </div>

        {/* Billing schedules */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Faktureringsscheman</h2>
          <BillingSchedulePanel
            customerId={id}
            schedules={(billing ?? []) as BillingSchedule[]}
          />
        </div>
      </div>

      {/* Projects table */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden mt-6">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Projekt</h2>
          <span className="text-xs text-gray-400">{projects?.length ?? 0} totalt</span>
        </div>
        {!projects || projects.length === 0 ? (
          <p className="px-6 py-8 text-gray-400 text-sm text-center">Inga projekt ännu.</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Projektnamn', 'Status', 'Timmar', 'Startdatum', 'Uppdaterad'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map((p) => {
                const hrs = ((p.time_entries ?? []) as { hours: number }[]).reduce((s, t) => s + Number(t.hours), 0)
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <Link href={`/admin/projects/${p.id}`} className="font-medium text-gray-900 hover:text-brand-green transition-colors">
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge[p.status]}`}>
                        {statusLabel[p.status]}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600 text-xs">
                      {hrs.toFixed(1)}h{p.budget_hours ? ` / ${p.budget_hours}h` : ''}
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-xs">{p.started_at ?? '—'}</td>
                    <td className="px-6 py-3 text-gray-400 text-xs">{new Date(p.updated_at).toLocaleDateString('sv-SE')}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Recent billing schedules full list */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden mt-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Alla faktureringsscheman</h2>
        </div>
        {!billing || billing.length === 0 ? (
          <p className="px-6 py-8 text-gray-400 text-sm text-center">Inga fakturor registrerade.</p>
        ) : (
          <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Tjänst', 'Belopp', 'Intervall', 'Faktureringsdag', 'Nästa datum', 'Status'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {billing.map((b) => {
                const bSchedule = b as BillingSchedule & { billing_interval?: string }
                return (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-gray-700 font-medium">{b.notes ?? '—'}</td>
                    <td className="px-6 py-3 font-semibold text-gray-900">
                      {Number(b.amount).toLocaleString('sv-SE')} {b.currency}
                    </td>
                    <td className="px-6 py-3 text-gray-500">
                      {bSchedule.billing_interval ? (intervalLabel[bSchedule.billing_interval] ?? bSchedule.billing_interval) : '—'}
                    </td>
                    <td className="px-6 py-3 text-gray-500">{b.billing_day}</td>
                    <td className="px-6 py-3 text-gray-700">{b.next_billing_date}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${b.is_active ? 'bg-brand-green/15 text-brand-green' : 'bg-gray-100 text-gray-500'}`}>
                        {b.is_active ? 'Aktiv' : 'Pausad'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  )
}
