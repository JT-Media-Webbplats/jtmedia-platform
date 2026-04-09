'use client'

import { useState, useTransition } from 'react'
import { createTimeEntry } from '@/app/actions/time'
import { Loader2 } from 'lucide-react'

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-brand-green transition-colors'
const labelCls = 'block text-xs font-semibold text-white/50 mb-1.5'

type Customer = { id: string; name: string }
type Project  = { id: string; name: string; customer_id: string }

export default function TimeEntryForm({
  customers,
  projects,
}: {
  customers: Customer[]
  projects:  Project[]
}) {
  const [customerId, setCustomerId] = useState('')
  const [error, setError]           = useState<string | null>(null)
  const [success, setSuccess]       = useState(false)
  const [pending, startTransition]  = useTransition()

  const filtered = customerId ? projects.filter((p) => p.customer_id === customerId) : projects

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    const fd = new FormData(e.currentTarget)
    const form = e.currentTarget
    startTransition(async () => {
      const result = await createTimeEntry(fd)
      if (result.error) { setError(result.error); return }
      setSuccess(true)
      form.reset()
      setCustomerId('')
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Kund</label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className={inputCls + ' bg-[#1a1a1a]'}
          >
            <option value="">Alla kunder</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Projekt *</label>
          <select name="project_id" required className={inputCls + ' bg-[#1a1a1a]'}>
            <option value="">Välj projekt…</option>
            {filtered.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Timmar *</label>
          <input
            name="hours"
            type="number"
            min="0.25"
            max="24"
            step="0.25"
            required
            placeholder="2.5"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Datum *</label>
          <input
            name="logged_on"
            type="date"
            required
            defaultValue={new Date().toISOString().split('T')[0]}
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Beskrivning</label>
        <input name="description" placeholder="Vad gjordes?" className={inputCls} />
      </div>

      {error && (
        <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{error}</p>
      )}
      {success && (
        <p className="text-brand-green text-xs bg-brand-green/10 border border-brand-green/20 rounded-xl px-4 py-3">Tid loggad!</p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 bg-brand-green text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-green-dark transition-colors disabled:opacity-60"
        >
          {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Logga tid
        </button>
      </div>
    </form>
  )
}
