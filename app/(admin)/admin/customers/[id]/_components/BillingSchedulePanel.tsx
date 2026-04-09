'use client'

import { useState, useTransition } from 'react'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import { createBillingSchedule, deleteBillingSchedule, updateBillingSchedule } from '@/app/actions/billing'
import type { BillingSchedule } from '@/lib/supabase/types'

interface Props {
  customerId: string
  schedules: BillingSchedule[]
}

const intervalOptions = [
  { value: 'monthly',     label: 'Månadsvis' },
  { value: 'quarterly',   label: 'Kvartalsvis' },
  { value: 'semi-annual', label: 'Halvårsvis' },
  { value: 'yearly',      label: 'Årsvis' },
]

const inputCls = 'w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 focus:outline-none transition'
const labelCls = 'block text-xs font-semibold text-gray-600 mb-1'

function AddForm({ customerId, onDone }: { customerId: string; onDone: () => void }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    formData.set('customer_id', customerId)
    setError(null)
    startTransition(async () => {
      const result = await createBillingSchedule(formData)
      if (result?.error) setError(result.error)
      else onDone()
    })
  }

  return (
    <form action={handleSubmit} className="border border-brand-green/30 bg-brand-green/5 rounded-xl p-4 mb-4">
      <p className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Nytt faktureringsschema</p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="col-span-2">
          <label className={labelCls}>Tjänst / beskrivning</label>
          <input name="notes" required className={inputCls} placeholder="t.ex. Hosting, Google Ads…" />
        </div>
        <div>
          <label className={labelCls}>Belopp (SEK)</label>
          <input name="amount" type="number" min="0" step="0.01" required className={inputCls} placeholder="0" />
        </div>
        <div>
          <label className={labelCls}>Intervall</label>
          <select name="billing_interval" className={inputCls}>
            {intervalOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Faktureringsdag (1–28)</label>
          <input name="billing_day" type="number" min="1" max="28" defaultValue="1" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Nästa fakturadatum</label>
          <input name="next_billing_date" type="date" required className={inputCls} />
        </div>
      </div>
      {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className="bg-brand-green text-black px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-brand-green-dark disabled:opacity-50 transition-colors">
          {isPending ? 'Sparar…' : 'Lägg till'}
        </button>
        <button type="button" onClick={onDone} className="text-gray-500 hover:text-gray-700 text-xs px-3 py-1.5 rounded-lg transition-colors">
          Avbryt
        </button>
      </div>
    </form>
  )
}

function EditRow({ schedule, customerId, onDone }: { schedule: BillingSchedule; customerId: string; onDone: () => void }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await updateBillingSchedule(schedule.id, customerId, formData)
      if (result?.error) setError(result.error)
      else onDone()
    })
  }

  return (
    <form action={handleSubmit} className="border border-blue-200 bg-blue-50 rounded-xl p-4 mb-2">
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="col-span-2">
          <label className={labelCls}>Tjänst / beskrivning</label>
          <input name="notes" defaultValue={schedule.notes ?? ''} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Belopp (SEK)</label>
          <input name="amount" type="number" min="0" step="0.01" defaultValue={schedule.amount} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Intervall</label>
          <select name="billing_interval" defaultValue={schedule.billing_interval} className={inputCls}>
            {intervalOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Faktureringsdag</label>
          <input name="billing_day" type="number" min="1" max="28" defaultValue={schedule.billing_day} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Nästa fakturadatum</label>
          <input name="next_billing_date" type="date" defaultValue={schedule.next_billing_date} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select name="is_active" defaultValue={schedule.is_active ? 'true' : 'false'} className={inputCls}>
            <option value="true">Aktiv</option>
            <option value="false">Pausad</option>
          </select>
        </div>
      </div>
      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className="flex items-center gap-1 bg-brand-green text-black px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-brand-green-dark disabled:opacity-50 transition-colors">
          <Check className="w-3 h-3" /> {isPending ? 'Sparar…' : 'Spara'}
        </button>
        <button type="button" onClick={onDone} className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-xs px-2 py-1.5 rounded-lg transition-colors">
          <X className="w-3 h-3" /> Avbryt
        </button>
      </div>
    </form>
  )
}

export default function BillingSchedulePanel({ customerId, schedules }: Props) {
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isDeleting, startDeleting] = useTransition()

  function handleDelete(id: string, notes: string | null) {
    if (!confirm(`Ta bort faktureringsschema "${notes ?? 'okänd tjänst'}"?`)) return
    startDeleting(async () => {
      await deleteBillingSchedule(id, customerId)
    })
  }

  return (
    <div>
      {showAdd && <AddForm customerId={customerId} onDone={() => setShowAdd(false)} />}

      {schedules.length === 0 && !showAdd && (
        <p className="text-gray-400 text-sm py-4 text-center">Inga faktureringsscheman.</p>
      )}

      <div className="divide-y divide-gray-100">
        {schedules.map((s) =>
          editingId === s.id ? (
            <div key={s.id} className="py-2">
              <EditRow schedule={s} customerId={customerId} onDone={() => setEditingId(null)} />
            </div>
          ) : (
            <div key={s.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{s.notes ?? '—'}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {Number(s.amount).toLocaleString('sv-SE')} kr · {intervalOptions.find(o => o.value === s.billing_interval)?.label ?? s.billing_interval} · {s.next_billing_date}
                  {!s.is_active && <span className="ml-2 text-yellow-600 font-semibold">Pausad</span>}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingId(s.id)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Redigera"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(s.id, s.notes)}
                  disabled={isDeleting}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                  title="Ta bort"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {!showAdd && (
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="mt-3 flex items-center gap-1.5 text-brand-green hover:text-brand-green-dark text-xs font-semibold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Lägg till faktureringsschema
        </button>
      )}
    </div>
  )
}
