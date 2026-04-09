'use client'

import { useState, useTransition } from 'react'
import { createProject } from '@/app/actions/projects'
import Modal from '@/app/(admin)/_components/Modal'
import { Loader2, Plus } from 'lucide-react'
import type { Customer } from '@/lib/supabase/types'

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-brand-green transition-colors'
const labelCls = 'block text-xs font-semibold text-white/50 mb-1.5'

export default function NewProjectModal({ customers }: { customers: Pick<Customer, 'id' | 'name'>[] }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await createProject(fd)
      if (result.error) { setError(result.error); return }
      setOpen(false)
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-brand-green text-black text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-brand-green-dark transition-colors"
      >
        <Plus className="w-3.5 h-3.5" /> Nytt projekt
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Lägg till nytt projekt">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Kund *</label>
            <select name="customer_id" required className={inputCls + ' bg-[#1a1a1a]'}>
              <option value="">Välj kund…</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Projektnamn *</label>
            <input name="name" required placeholder="Hemsida Q3 2026" className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Status</label>
              <select name="status" className={inputCls + ' bg-[#1a1a1a]'}>
                <option value="active">Aktiv</option>
                <option value="paused">Pausad</option>
                <option value="completed">Avslutad</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Budgeterade timmar</label>
              <input name="budget_hours" type="number" min="0" step="0.5" placeholder="40" className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Startdatum</label>
            <input name="started_at" type="date" className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Beskrivning</label>
            <textarea name="description" rows={3} placeholder="Kort beskrivning av projektet…" className={inputCls + ' resize-none'} />
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="px-5 py-2.5 rounded-xl text-sm text-white/50 hover:text-white transition-colors">
              Avbryt
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 bg-brand-green text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-green-dark transition-colors disabled:opacity-60"
            >
              {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Spara projekt
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
