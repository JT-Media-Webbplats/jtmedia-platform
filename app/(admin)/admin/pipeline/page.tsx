import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { ProjectStatus } from '@/lib/supabase/types'
import NewProjectModal from '../projects/_components/NewProjectModal'
import ProjectBoard, { type BoardProject } from './_components/ProjectBoard'

export const metadata: Metadata = { title: 'Pipeline' }

export default async function PipelinePage() {
  const supabase = await createClient()

  const [{ data: projects, error: projectsError }, { data: customers }] = await Promise.all([
    supabase
      .from('projects')
      .select('id, name, status, description, budget_hours, started_at, ended_at, updated_at, customers(id, name), time_entries(hours)')
      .order('updated_at', { ascending: false }),
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

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Pipeline</h1>
          <p className="text-gray-500 text-sm mt-1">
            Leveransen: var varje projekt är just nu. Allt som ännu inte är en affär ligger under{' '}
            <Link href="/admin/salj" className="inline-flex items-center gap-1 font-semibold text-gray-900 hover:text-brand-green-dark transition-colors">
              <Sparkles className="w-3.5 h-3.5" /> Sälj
            </Link>.
          </p>
        </div>
        <NewProjectModal customers={customers ?? []} />
      </div>

      {projectsError && <p className="mb-4 text-sm text-red-600">Kunde inte läsa projekt: {projectsError.message}</p>}

      <ProjectBoard projects={boardProjects} />
    </div>
  )
}
