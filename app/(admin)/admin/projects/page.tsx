import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import NewProjectModal from './_components/NewProjectModal'

export const metadata: Metadata = { title: 'Projekt' }

const statusStyles: Record<string, string> = {
  active:    'bg-brand-green/15 text-brand-green',
  completed: 'bg-blue-400/15 text-blue-500',
  paused:    'bg-yellow-400/15 text-yellow-600',
  cancelled: 'bg-red-400/15 text-red-500',
}
const statusLabels: Record<string, string> = {
  active: 'Aktiv', completed: 'Avslutad', paused: 'Pausad', cancelled: 'Avbruten',
}

export default async function ProjectsPage() {
  const supabase = await createClient()

  const [{ data: projects, error }, { data: customers }] = await Promise.all([
    supabase
      .from('projects')
      .select('*, customers(id, name), time_entries(hours)')
      .order('updated_at', { ascending: false }),
    supabase.from('customers').select('id, name').eq('status', 'active').order('name'),
  ])

  if (error) {
    return <div className="p-8"><p className="text-red-500 text-sm">Fel: {error.message}</p></div>
  }

  const activeCount    = projects?.filter((p) => p.status === 'active').length ?? 0
  const completedCount = projects?.filter((p) => p.status === 'completed').length ?? 0

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Projekt</h1>
          <p className="text-gray-500 text-sm mt-1">{activeCount} aktiva · {completedCount} avslutade</p>
        </div>
        <NewProjectModal customers={customers ?? []} />
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
        {!projects || projects.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-gray-400 text-sm">Inga projekt ännu.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {['Projekt', 'Kund', 'Status', 'Timmar', 'Uppdaterad'].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map((p) => {
                const logged = ((p.time_entries ?? []) as { hours: number }[])
                  .reduce((s, t) => s + Number(t.hours), 0)
                const budget = p.budget_hours ? Number(p.budget_hours) : null
                const pct    = budget && budget > 0 ? Math.min((logged / budget) * 100, 100) : null
                const customer = p.customers as { id: string; name: string } | null

                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/projects/${p.id}`} className="font-semibold text-gray-900 hover:text-brand-green transition-colors">
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      {customer ? (
                        <Link href={`/admin/customers/${customer.id}`} className="text-gray-600 hover:text-gray-900 transition-colors">
                          {customer.name}
                        </Link>
                      ) : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[p.status]}`}>
                        {statusLabels[p.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 min-w-[160px]">
                      {pct !== null ? (
                        <div className="flex items-center gap-2.5">
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden min-w-[60px]">
                            <div className="h-full bg-brand-green rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-gray-400 shrink-0">{logged}/{budget}h</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">{logged}h loggat</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {new Date(p.updated_at).toLocaleDateString('sv-SE')}
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
