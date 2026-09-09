'use client'

import { useState, useTransition } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import Modal from '@/app/(admin)/_components/Modal'
import { createProspect, updateProspect, deleteProspect } from '@/app/actions/prospects'
import type { Prospect } from '@/lib/supabase/types'
import { prospectColumns, prospectSources } from '@/lib/pipeline'

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-brand-green transition-colors'
const selectCls = inputCls + ' bg-[#1a1a1a]'
const labelCls = 'block text-xs font-semibold text-white/50 mb-1.5'

interface Props {
  open: boolean
  onClose: () => void
  prospect?: Prospect | null
  defaultStage?: Prospect['stage']
}

export default function ProspectModal({ open, onClose, prospect, defaultStage = 'to_contact' }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [deleting, startDeleting] = useTransition()
  const editing = Boolean(prospect)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = prospect ? await updateProspect(prospect.id, fd) : await createProspect(fd)
      if (result.error) { setError(result.error); return }
      onClose()
    })
  }

  function handleDelete() {
    if (!prospect) return
    if (!confirm(`Ta bort ${prospect.company} från pipelinen?`)) return
    startDeleting(async () => {
      const result = await deleteProspect(prospect.id)
      if (result.error) { setError(result.error); return }
      onClose()
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Redigera prospekt' : 'Nytt prospekt'}>
      <form onSubmit={handleSubmit} className="space-y-4" key={prospect?.id ?? 'new'}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelCls}>Företag *</label>
            <input name="company" required defaultValue={prospect?.company ?? ''} placeholder="Företaget AB" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Kontaktperson</label>
            <input name="contact_name" defaultValue={prospect?.contact_name ?? ''} placeholder="Anna Andersson" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Stad</label>
            <input name="city" defaultValue={prospect?.city ?? ''} placeholder="Ljungby" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>E-post</label>
            <input name="email" type="email" defaultValue={prospect?.email ?? ''} placeholder="anna@foretaget.se" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Telefon</label>
            <input name="phone" type="tel" defaultValue={prospect?.phone ?? ''} placeholder="070-123 45 67" className={inputCls} />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Hemsida</label>
            <input name="website" defaultValue={prospect?.website ?? ''} placeholder="foretaget.se" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Steg</label>
            <select name="stage" defaultValue={prospect?.stage ?? defaultStage} className={selectCls}>
              {prospectColumns.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Källa</label>
            <select name="source" defaultValue={prospect?.source ?? ''} className={selectCls}>
              <option value="">Välj…</option>
              {prospectSources.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Intresserad av</label>
            <input name="interest" defaultValue={prospect?.interest ?? ''} placeholder="Hemsida, SEO…" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Uppskattat värde (kr/år)</label>
            <input name="estimated_value" type="number" min="0" step="100" defaultValue={prospect?.estimated_value ?? ''} placeholder="24000" className={inputCls} />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Nästa åtgärd, datum</label>
            <input name="next_action_at" type="date" defaultValue={prospect?.next_action_at ?? ''} className={inputCls} />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Anteckningar</label>
            <textarea name="notes" rows={3} defaultValue={prospect?.notes ?? ''} placeholder="Vad sa de? Vad är nästa steg?" className={inputCls + ' resize-none'} />
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{error}</p>
        )}

        <div className="flex items-center justify-between gap-3 pt-2">
          {editing ? (
            <button type="button" onClick={handleDelete} disabled={deleting} className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50">
              <Trash2 className="w-3.5 h-3.5" /> Ta bort
            </button>
          ) : <span />}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm text-white/50 hover:text-white transition-colors">
              Avbryt
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 bg-brand-green text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-green-dark transition-colors disabled:opacity-60"
            >
              {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {editing ? 'Spara' : 'Lägg till'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
