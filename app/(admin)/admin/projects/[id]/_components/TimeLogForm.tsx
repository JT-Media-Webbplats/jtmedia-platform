'use client'

import { useState, useTransition } from 'react'
import { createTimeEntry } from '@/app/actions/time'

interface Props {
  projectId: string
}

export default function TimeLogForm({ projectId }: Props) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]

  function handleSubmit(formData: FormData) {
    formData.set('project_id', projectId)
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await createTimeEntry(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSaved(true)
        ;(document.getElementById('time-log-form') as HTMLFormElement)?.reset()
        setTimeout(() => setSaved(false), 3000)
      }
    })
  }

  const inputCls = 'w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 focus:outline-none transition'
  const labelCls = 'block text-xs font-semibold text-gray-600 mb-1.5'

  return (
    <form id="time-log-form" action={handleSubmit}>
      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className={labelCls}>Timmar *</label>
          <input
            name="hours"
            type="number"
            min="0.25"
            step="0.25"
            required
            className={inputCls}
            placeholder="1.5"
          />
        </div>
        <div>
          <label className={labelCls}>Datum</label>
          <input name="logged_on" type="date" defaultValue={today} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Beskrivning</label>
          <input name="description" className={inputCls} placeholder="Vad gjordes?" />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      {saved && <p className="text-brand-green text-sm mb-3 font-medium">Inloggat!</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-brand-green text-black px-5 py-2 rounded-xl text-sm font-bold hover:bg-brand-green-dark disabled:opacity-50 transition-colors"
      >
        {isPending ? 'Loggar…' : 'Logga tid'}
      </button>
    </form>
  )
}
