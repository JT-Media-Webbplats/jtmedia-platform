import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, Mail, Phone, MapPin, Building2 } from 'lucide-react'

export const metadata: Metadata = { title: 'Kunddetaljer' }

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

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const [
    { data: customer },
    { data: projects },
    { data: billing },
  ] = await Promise.all([
    supabase.from('customers').select('*').eq('id', params.id).single(),
    supabase.from('projects')
      .select('id, name, status, budget_hours, started_at, updated_at')
      .eq('customer_id', params.id)
      .order('updated_at', { ascending: false }),
    supabase.from('billing_schedules')
      .select('id, amount, currency, billing_interval, next_billing_date, last_billed_date, is_active, notes')
      .eq('customer_id', params.id)
      .order('next_billing_date'),
  ])

  if (!customer) notFound()

  const totalMonthlyRevenue = billing
    ?.filter((b) => b.is_active && b.billing_interval === 'monthly')
    .reduce((s, b) => s + Number(b.amount), 0) ?? 0

  return (
    <div className="p-8 max-w-5xl">
      {/* Back */}
      <Link href="/admin/customers" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-900 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Tillbaka till kunder
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">{customer.name}</h1>
          {customer.company && <p className="text-gray-500 mt-1">{customer.company}</p>}
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusBadge[customer.status]}`}>
          {statusLabel[customer.status]}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Contact card */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Kontaktinfo</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-gray-300 shrink-0" />
              <a href={`mailto:${customer.email}`} className="text-sm text-gray-700 hover:text-brand-green transition-colors">
                {customer.email}
              </a>
            </div>
            {customer.phone && (
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gray-300 shrink-0" />
                <a href={`tel:${customer.phone}`} className="text-sm text-gray-700 hover:text-brand-green transition-colors">
                  {customer.phone}
                </a>
              </div>
            )}
            {customer.address && (
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">{customer.address}</p>
              </div>
            )}
            {customer.org_number && (
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-gray-300 shrink-0" />
                <p className="text-sm text-gray-600">{customer.org_number}</p>
              </div>
            )}
          </div>
          {customer.notes && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Anteckningar</p>
              <p className="text-sm text-gray-600 leading-relaxed">{customer.notes}</p>
            </div>
          )}
        </div>

        {/* Revenue summary */}
        <div className="bg-brand-green border border-brand-green rounded-2xl p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-black/50 mb-4">Månatlig intäkt</h2>
          <p className="text-4xl font-black text-black mb-1">
            {totalMonthlyRevenue.toLocaleString('sv-SE')} kr
          </p>
          <p className="text-xs text-black/45">{billing?.filter((b) => b.is_active).length ?? 0} aktiva fakturor</p>
        </div>

        {/* Quick stats */}
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
      </div>

      {/* Projects */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Projekt</h2>
        </div>
        {!projects || projects.length === 0 ? (
          <p className="px-6 py-8 text-gray-400 text-sm text-center">Inga projekt ännu.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Projektnamn', 'Status', 'Budgeterade timmar', 'Startdatum'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map((p) => (
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
                  <td className="px-6 py-3 text-gray-500">{p.budget_hours ? `${p.budget_hours}h` : '—'}</td>
                  <td className="px-6 py-3 text-gray-400 text-xs">{p.started_at ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Billing schedules */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Faktureringsschema</h2>
        </div>
        {!billing || billing.length === 0 ? (
          <p className="px-6 py-8 text-gray-400 text-sm text-center">Inga fakturor registrerade.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Tjänst', 'Belopp', 'Intervall', 'Nästa datum', 'Senast betald', 'Status'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {billing.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-gray-700 text-xs">{b.notes ?? '—'}</td>
                  <td className="px-6 py-3 font-semibold text-gray-900">
                    {Number(b.amount).toLocaleString('sv-SE')} {b.currency}
                  </td>
                  <td className="px-6 py-3 text-gray-500 capitalize">{b.billing_interval}</td>
                  <td className="px-6 py-3 text-gray-700">{b.next_billing_date}</td>
                  <td className="px-6 py-3 text-gray-400">{b.last_billed_date ?? '—'}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${b.is_active ? 'bg-brand-green/15 text-brand-green' : 'bg-gray-100 text-gray-500'}`}>
                      {b.is_active ? 'Aktiv' : 'Pausad'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
