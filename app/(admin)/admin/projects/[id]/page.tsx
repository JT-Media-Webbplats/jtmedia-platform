import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, Clock } from 'lucide-react'

export const metadata: Metadata = { title: 'Projektdetaljer' }

const statusBadge: Record<string, string> = {
  active:    'bg-brand-green/15 text-brand-green',
  completed: 'bg-blue-400/15 text-blue-400',
  paused:    'bg-yellow-400/15 text-yellow-400',
  cancelled: 'bg-red-400/15 text-red-400',
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
      <Link href="/admin/projects" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Tillbaka till projekt
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">{project.name}</h1>
          {customer && (
            <Link href={`/admin/customers/${customer.id}`} className="text-white/40 hover:text-brand-green transition-colors text-sm mt-1 inline-block">
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
        <div className="bg-white/4 border border-white/6 rounded-2xl p-5">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Timmar loggade</p>
          <p className="text-3xl font-black text-white">{totalHours.toFixed(1)}h</p>
        </div>
        <div className="bg-white/4 border border-white/6 rounded-2xl p-5">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Budget</p>
          <p className="text-3xl font-black text-white">{budget ? `${budget}h` : '—'}</p>
        </div>
        <div className={`rounded-2xl p-5 border ${pct !== null && pct >= 90 ? 'bg-red-400/10 border-red-400/20' : 'bg-brand-green/12 border-brand-green/20'}`}>
          <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Förbrukat</p>
          <p className={`text-3xl font-black ${pct !== null && pct >= 90 ? 'text-red-400' : 'text-brand-green'}`}>
            {pct !== null ? `${Math.round(pct)}%` : '—'}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      {pct !== null && (
        <div className="mb-8">
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${pct >= 90 ? 'bg-red-400' : 'bg-brand-green'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-white/30">
            <span>{totalHours.toFixed(1)}h loggat</span>
            <span>{budget}h budget</span>
          </div>
        </div>
      )}

      {project.description && (
        <div className="bg-white/4 border border-white/6 rounded-2xl p-5 mb-8">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Beskrivning</p>
          <p className="text-sm text-white/60 leading-relaxed">{project.description}</p>
        </div>
      )}

      {/* Time entries */}
      <div className="bg-white/4 border border-white/6 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/6 flex items-center gap-2">
          <Clock className="w-4 h-4 text-white/30" />
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">Tidslogg</h2>
        </div>

        {!entries || entries.length === 0 ? (
          <p className="px-6 py-8 text-white/30 text-sm text-center">
            Inga timmar loggade ännu.{' '}
            <Link href="/admin/time" className="text-brand-green hover:underline">Logga tid →</Link>
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Datum', 'Timmar', 'Beskrivning'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white/25">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {entries.map((e) => (
                <tr key={e.id} className="hover:bg-white/4 transition-colors">
                  <td className="px-6 py-3 text-white/50 text-xs">{e.logged_on}</td>
                  <td className="px-6 py-3">
                    <span className="font-bold text-white">{Number(e.hours).toFixed(1)}h</span>
                  </td>
                  <td className="px-6 py-3 text-white/45">{e.description ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
