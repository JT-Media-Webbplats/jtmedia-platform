import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import type { Prospect, ProjectStatus } from '@/lib/supabase/types'
import NewProjectModal from '../projects/_components/NewProjectModal'
import PipelineView from './_components/PipelineView'
import type { BoardProject } from './_components/ProjectBoard'

export const metadata: Metadata = { title: 'Pipeline' }

export default async function PipelinePage({ searchParams }: { searchParams?: { tab?: string } }) {
  const supabase = await createClient()

  const [{ data: projects, error: projectsError }, { data: prospects, error: prospectsError }, { data: customers }] = await Promise.all([
    supabase
      .from('projects')
      .select('id, name, status, description, budget_hours, started_at, ended_at, updated_at, customers(id, name), time_entries(hours)')
      .order('updated_at', { ascending: false }),
    supabase.from('prospects').select('*').order('updated_at', { ascending: false }),
    supabase.from('customers').select('id, name').eq('status', 'active').order('name'),
  ])

  const boardProjects: BoardProject[] = (projects ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    status: p.status as ProjectStatus,
    description: p.description,
    budget_hours: p.budget_hours,
    started_at: p.started_at,
    ended_at: p.ended_at,
    updated_at: p.updated_at,
    customer: (p.customers as unknown as { id: string; name: string } | null) ?? null,
    loggedHours: ((p.time_entries ?? []) as { hours: number }[]).reduce((s, t) => s + Number(t.hours), 0),
  }))

  const initialTab = searchParams?.tab === 'prospekt' ? 'prospekt' : 'projekt'

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Pipeline</h1>
          <p className="text-gray-500 text-sm mt-1">
            Dra korten mellan kolumnerna. Projekt visar var i leveransen ni är, Prospekt visar företag på väg in.
          </p>
        </div>
        <NewProjectModal customers={customers ?? []} />
      </div>

      {projectsError && <p className="mb-4 text-sm text-red-600">Kunde inte läsa projekt: {projectsError.message}</p>}
      {prospectsError && (
        <p className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          Prospekt-tabellen finns inte ännu. Kör migrationen <code className="font-mono text-xs">20260909100000_pipeline.sql</code> i Supabase.
        </p>
      )}

      <PipelineView projects={boardProjects} prospects={(prospects ?? []) as Prospect[]} initialTab={initialTab} />
    </div>
  )
}
