'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, Building2, CalendarDays } from 'lucide-react'
import { updateProjectStatus } from '@/app/actions/projects'
import type { ProjectStatus } from '@/lib/supabase/types'
import { projectColumns } from '@/lib/pipeline'
import KanbanBoard, { type KanbanItem } from './KanbanBoard'

export interface BoardProject {
  id: string
  name: string
  status: ProjectStatus
  description: string | null
  budget_hours: number | null
  started_at: string | null
  ended_at: string | null
  updated_at: string
  customer: { id: string; name: string } | null
  loggedHours: number
}

function ProjectCard({ p }: { p: BoardProject }) {
  const budget = p.budget_hours ? Number(p.budget_hours) : null
  const pct = budget && budget > 0 ? Math.min((p.loggedHours / budget) * 100, 100) : null
  const overBudget = budget !== null && p.loggedHours > budget
  return (
    <div className="p-3.5 pb-8">
      <Link href={`/admin/projects/${p.id}`} className="font-semibold text-sm text-gray-900 hover:text-brand-green transition-colors leading-snug block">
        {p.name}
      </Link>
      {p.customer && (
        <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-1.5">
          <Building2 className="w-3 h-3 shrink-0" />
          <span className="truncate">{p.customer.name}</span>
        </p>
      )}
      {p.description && <p className="text-xs text-gray-400 mt-2 line-clamp-2">{p.description}</p>}

      <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-500">
        <Clock className="w-3 h-3 shrink-0" />
        {pct !== null ? (
          <>
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${overBudget ? 'bg-red-400' : 'bg-brand-green'}`} style={{ width: `${pct}%` }} />
            </div>
            <span className={`shrink-0 ${overBudget ? 'text-red-500 font-semibold' : ''}`}>{p.loggedHours}/{budget}h</span>
          </>
        ) : (
          <span>{p.loggedHours}h loggat</span>
        )}
      </div>

      {(p.started_at || p.ended_at) && (
        <p className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-2">
          <CalendarDays className="w-3 h-3 shrink-0" />
          {p.status === 'completed' && p.ended_at
            ? `Klart ${new Date(p.ended_at).toLocaleDateString('sv-SE')}`
            : p.started_at
              ? `Start ${new Date(p.started_at).toLocaleDateString('sv-SE')}`
              : ''}
        </p>
      )}
    </div>
  )
}

export default function ProjectBoard({ projects }: { projects: BoardProject[] }) {
  const [showCancelled, setShowCancelled] = useState(false)
  const columns = projectColumns.filter((c) => showCancelled || c.key !== 'cancelled')
  const cancelledCount = projects.filter((p) => p.status === 'cancelled').length

  const items: KanbanItem<ProjectStatus>[] = projects.map((p) => ({
    id: p.id,
    column: p.status,
    sortKey: p.updated_at,
    node: <ProjectCard p={p} />,
  }))

  return (
    <div>
      <div className="flex items-center justify-end mb-3">
        <label className="inline-flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
          <input type="checkbox" checked={showCancelled} onChange={(e) => setShowCancelled(e.target.checked)} className="accent-brand-green" />
          Visa avbrutna ({cancelledCount})
        </label>
      </div>
      <KanbanBoard
        columns={columns}
        items={items}
        emptyText="Inga projekt här"
        onMove={async (id, to) => {
          const result = await updateProjectStatus(id, to)
          return result?.error ? { error: result.error } : undefined
        }}
        footer={(key, colItems) => {
          const hours = colItems.reduce((s, i) => s + (projects.find((p) => p.id === i.id)?.loggedHours ?? 0), 0)
          return <span>{hours.toLocaleString('sv-SE')} h loggade i {key === 'completed' ? 'klara' : 'dessa'} projekt</span>
        }}
      />
    </div>
  )
}
