import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import NewCustomerModal from './_components/NewCustomerModal'
import type { Customer } from '@/lib/supabase/types'

export const metadata: Metadata = { title: 'Kunder' }

const statusStyles: Record<string, string> = {
  active:   'bg-brand-green/15 text-brand-green',
  paused:   'bg-yellow-400/15 text-yellow-400',
  inactive: 'bg-white/8 text-white/30',
}
const statusLabels: Record<string, string> = {
  active: 'Aktiv', paused: 'Pausad', inactive: 'Inaktiv',
}

export default async function CustomersPage() {
  const supabase = await createClient()

  const { data: customers, error } = await supabase
    .from('customers')
    .select('*, billing_schedules(next_billing_date, is_active)')
    .order('name')

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-400 text-sm">Fel: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Kunder</h1>
          <p className="text-white/30 text-sm mt-1">{customers?.length ?? 0} kunder totalt</p>
        </div>
        <NewCustomerModal />
      </div>

      <div className="bg-white/4 border border-white/6 rounded-2xl overflow-hidden">
        {!customers || customers.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-white/30 text-sm mb-3">Inga kunder ännu.</p>
            <p className="text-white/15 text-xs">Klicka &quot;Ny kund&quot; för att lägga till din första kund.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/6">
                {['Namn', 'Kontakt', 'Adress', 'Nästa faktura', 'Status'].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white/25">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {customers.map((c: Customer & { billing_schedules: { next_billing_date: string; is_active: boolean }[] }) => {
                const nextBilling = c.billing_schedules
                  ?.filter((b) => b.is_active)
                  .sort((a, b) => a.next_billing_date.localeCompare(b.next_billing_date))[0]

                return (
                  <tr key={c.id} className="hover:bg-white/4 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/customers/${c.id}`} className="font-semibold text-white hover:text-brand-green transition-colors">
                        {c.name}
                      </Link>
                      {c.company && <p className="text-white/35 text-xs mt-0.5">{c.company}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white/65">{c.email}</p>
                      {c.phone && <p className="text-white/30 text-xs mt-0.5">{c.phone}</p>}
                    </td>
                    <td className="px-6 py-4 text-white/35 text-xs">{c.address ?? '—'}</td>
                    <td className="px-6 py-4 text-white/45 text-xs">
                      {nextBilling?.next_billing_date ?? '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[c.status]}`}>
                        {statusLabels[c.status]}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
