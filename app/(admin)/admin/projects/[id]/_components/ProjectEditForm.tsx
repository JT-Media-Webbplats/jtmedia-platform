'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateProject, deleteProject } from '@/app/actions/projects'
import type { Project } from '@/lib/supabase/types'

interface Props {
  project: Project
}

const statusOptions = [
  { value: 'active',    label: 'Aktiv' },
  { value: 'paused',    label: 'Pausad' },
  { value: 'completed', label: 'Avslutad' },
  { value: 'cancelled', label: 'Avbruten' },
]

export default function ProjectEditForm({ project }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDeleting] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSave(formData: FormData) {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await updateProject(project.id, formData)
      if (result?.error) setError(result.error)
      else { setSaved(true); setTimeout(() => setSaved(false), 3000) }
    })
  }

  function handleDelete() {
    if (!confirm(`Ta bort projekt "${project.name}"? Alla tidsloggningar tas också bort.`)) return
    startDeleting(async () => {
      const result = await deleteProject(project.id)
      if (result?.error) setError(result.error)
      else router.push('/admin/projects')
    })
  }

  const inputCls = 'w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 focus:outline-none transition'
  const labelCls = 'block text-xs font-semibold text-gray-600 mb-1.5'

  return (
    <form action={handleSave}>
      <div className="space-y-4 mb-6">
        <div>
          <label className={labelCls}>Projektnamn *</label>
          <input name="name" defaultValue={project.name} required className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select name="status" defaultValue={project.status} className={inputCls}>
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Budgeterade timmar</label>
            <input name="budget_hours" type="number" min="0" step="0.5" defaultValue={project.budget_hours ?? ''} className={inputCls} placeholder="—" />
          </div>
          <div>
            <label className={labelCls}>Startdatum</label>
            <input name="started_at" type="date" defaultValue={project.started_at ?? ''} className={inputCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Slutdatum</label>
          <input name="ended_at" type="date" defaultValue={project.ended_at ?? ''} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Beskrivning / anteckningar</label>
          <textarea name="description" defaultValue={project.description ?? ''} rows={4} className={inputCls + ' resize-none'} />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {saved && <p className="text-brand-green text-sm mb-4 font-medium">Sparad!</p>}

      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={isPending}
          className="bg-brand-green text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-green-dark disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Sparar…' : 'Spara ändringar'}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {isDeleting ? 'Tar bort…' : 'Ta bort projekt'}
        </button>
      </div>
    </form>
  )
}
