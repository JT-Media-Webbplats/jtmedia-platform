'use client'

import { useState } from 'react'
import { FolderKanban, Target } from 'lucide-react'
import type { Prospect } from '@/lib/supabase/types'
import ProjectBoard, { type BoardProject } from './ProjectBoard'
import ProspectBoard from './ProspectBoard'

interface Props {
  projects: BoardProject[]
  prospects: Prospect[]
  initialTab?: 'projekt' | 'prospekt'
}

export default function PipelineView({ projects, prospects, initialTab = 'projekt' }: Props) {
  const [tab, setTab] = useState<'projekt' | 'prospekt'>(initialTab)

  const activeProjects = projects.filter((p) => p.status === 'active' || p.status === 'pending').length
  const openProspects = prospects.filter((p) => p.stage !== 'won' && p.stage !== 'lost').length

  const tabs = [
    { key: 'projekt' as const, label: 'Projekt', count: activeProjects, Icon: FolderKanban },
    { key: 'prospekt' as const, label: 'Prospekt', count: openProspects, Icon: Target },
  ]

  return (
    <div>
      <div className="inline-flex bg-gray-100 border border-gray-200 rounded-full p-1 mb-6">
        {tabs.map(({ key, label, count, Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${
              tab === key ? 'bg-black text-white shadow' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab === key ? 'bg-brand-green text-black' : 'bg-white text-gray-500 border border-gray-200'}`}>{count}</span>
          </button>
        ))}
      </div>

      {tab === 'projekt' ? <ProjectBoard projects={projects} /> : <ProspectBoard prospects={prospects} />}
    </div>
  )
}
