import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, Clock } from 'lucide-react'

export const metadata: Metadata = { title: 'Projektdetaljer' }

const statusBadge: Record<string, string> = {
  active:    'bg-brand-green/15 text-brand-green',
  completed: 'bg-blue-400/15 text-blue-500',
  paused:    'bg-yellow-400/15 text-yellow-600',
  cancelled: 'bg-red-400/15 text-red-500',
}
const statusLabel: Record<string, string> = {
  active: 'Aktiv', completed: 'Avslutad', paused: 'Pausad', cancelled: 'Avbruten',
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const [{ data: project }, { data: entries }] = await Promise.all([
    supabase
      .from('projects')
      .select('*, customers(id, name)')
      .eq('id', params.id)
      .single(),
    supabase
      .from('time_entries')
      .select('*')
      .eq('project_id', params.id)
      .order('logged_on', { ascending: false }),
  ])

  if (!project) notFound()

  const customer = project.customers as { id: string; name: string } | null
  const totalHours = (entries ?? []).reduce((s, t) => s + Number(t.hours), 0)
  const budget = project.budget_hours ? Number(project.budget_hours) : null
  const pct = budget && budget > 0 ? Math.min((totalHours / budget) * 100, 100) : null

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/admin/projects" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-900 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Tillbaka till projekt
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">{project.name}</h1>
          {customer && (
            <Link href={`/admin/customers/${customer.id}`} className="text-gray-500 hover:text-brand-green transition-colors text-sm mt-1 inline-block">
              {customer.name}
            </Link>
          )}
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusBadge[project.status]}`}>
          {statusLabel[project.status]}
        </span>
      </div>

      {/* Info cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Timmar loggade</p>
          <p className="text-3xl font-black text-gray-900">{totalHours.toFixed(1)}h</p>
        </div>
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Budget</p>
          <p className="text-3xl font-black text-gray-900">{budget ? `${budget}h` : '—'}</p>
        </div>
        <div className={`rounded-2xl p-5 border ${pct !== null && pct >= 90 ? 'bg-red-50 border-red-200' : 'bg-brand-green/8 border-brand-green/20'}`}>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Förbrukat</p>
          <p className={`text-3xl font-black ${pct !== null && pct >= 90 ? 'text-red-500' : 'text-brand-green'}`}>
            {pct !== null ? `${Math.round(pct)}%` : '—'}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      {pct !== null && (
        <div className="mb-8">
          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${pct >= 90 ? 'bg-red-400' : 'bg-brand-green'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>{totalHours.toFixed(1)}h loggat</span>
            <span>{budget}h budget</span>
          </div>
        </div>
      )}

      {project.description && (
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Beskrivning</p>
          <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
        </div>
      )}

      {/* Time entries */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Tidslogg</h2>
        </div>

        {!entries || entries.length === 0 ? (
          <p className="px-6 py-8 text-gray-400 text-sm text-center">
            Inga timmar loggade ännu.{' '}
            <Link href="/admin/time" className="text-brand-green hover:underline">Logga tid →</Link>
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Datum', 'Timmar', 'Beskrivning'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {entries.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-gray-500 text-xs">{e.logged_on}</td>
                  <td className="px-6 py-3">
                    <span className="font-bold text-gray-900">{Number(e.hours).toFixed(1)}h</span>
                  </td>
                  <td className="px-6 py-3 text-gray-500">{e.description ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
