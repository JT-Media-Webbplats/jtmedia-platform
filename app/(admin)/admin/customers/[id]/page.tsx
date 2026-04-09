import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, Mail, Phone, MapPin, Building2 } from 'lucide-react'

export const metadata: Metadata = { title: 'Kunddetaljer' }

const statusBadge: Record<string, string> = {
  active:    'bg-brand-green/15 text-brand-green',
  paused:    'bg-yellow-400/15 text-yellow-400',
  inactive:  'bg-white/8 text-white/30',
  completed: 'bg-blue-400/15 text-blue-400',
  cancelled: 'bg-red-400/15 text-red-400',
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
      <Link href="/admin/customers" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Tillbaka till kunder
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">{customer.name}</h1>
          {customer.company && <p className="text-white/40 mt-1">{customer.company}</p>}
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusBadge[customer.status]}`}>
          {statusLabel[customer.status]}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Contact card */}
        <div className="bg-white/4 border border-white/6 rounded-2xl p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Kontaktinfo</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-white/25 shrink-0" />
              <a href={`mailto:${customer.email}`} className="text-sm text-white/70 hover:text-brand-green transition-colors">
                {customer.email}
              </a>
            </div>
            {customer.phone && (
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-white/25 shrink-0" />
                <a href={`tel:${customer.phone}`} className="text-sm text-white/70 hover:text-brand-green transition-colors">
                  {customer.phone}
                </a>
              </div>
            )}
            {customer.address && (
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-white/25 shrink-0 mt-0.5" />
                <p className="text-sm text-white/50">{customer.address}</p>
              </div>
            )}
            {customer.org_number && (
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-white/25 shrink-0" />
                <p className="text-sm text-white/50">{customer.org_number}</p>
              </div>
            )}
          </div>
          {customer.notes && (
            <div className="mt-5 pt-4 border-t border-white/6">
              <p className="text-xs font-semibold text-white/25 uppercase tracking-widest mb-2">Anteckningar</p>
              <p className="text-sm text-white/45 leading-relaxed">{customer.notes}</p>
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
        <div className="bg-white/4 border border-white/6 rounded-2xl p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Projektstatus</h2>
          <div className="space-y-3">
            {(['active', 'completed', 'paused'] as const).map((s) => {
              const count = projects?.filter((p) => p.status === s).length ?? 0
              return (
                <div key={s} className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge[s]}`}>
                    {statusLabel[s]}
                  </span>
                  <span className="text-lg font-black text-white">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="bg-white/4 border border-white/6 rounded-2xl overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-white/6">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">Projekt</h2>
        </div>
        {!projects || projects.length === 0 ? (
          <p className="px-6 py-8 text-white/30 text-sm text-center">Inga projekt ännu.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Projektnamn', 'Status', 'Budgeterade timmar', 'Startdatum'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white/25">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-white/4 transition-colors">
                  <td className="px-6 py-3">
                    <Link href={`/admin/projects/${p.id}`} className="font-medium text-white hover:text-brand-green transition-colors">
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge[p.status]}`}>
                      {statusLabel[p.status]}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-white/45">{p.budget_hours ? `${p.budget_hours}h` : '—'}</td>
                  <td className="px-6 py-3 text-white/35 text-xs">{p.started_at ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Billing schedules */}
      <div className="bg-white/4 border border-white/6 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/6">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">Faktureringsschema</h2>
        </div>
        {!billing || billing.length === 0 ? (
          <p className="px-6 py-8 text-white/30 text-sm text-center">Inga fakturor registrerade.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Belopp', 'Intervall', 'Nästa datum', 'Senast betald', 'Status'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white/25">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {billing.map((b) => (
                <tr key={b.id} className="hover:bg-white/4 transition-colors">
                  <td className="px-6 py-3 font-semibold text-white">
                    {Number(b.amount).toLocaleString('sv-SE')} {b.currency}
                  </td>
                  <td className="px-6 py-3 text-white/45 capitalize">{b.billing_interval}</td>
                  <td className="px-6 py-3 text-white/65">{b.next_billing_date}</td>
                  <td className="px-6 py-3 text-white/35">{b.last_billed_date ?? '—'}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${b.is_active ? 'bg-brand-green/15 text-brand-green' : 'bg-white/8 text-white/30'}`}>
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
