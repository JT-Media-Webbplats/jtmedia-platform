'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Send, Check } from 'lucide-react'
import { sendPortalMessage } from '@/app/actions/requests'

const inputCls =
  'w-full border-2 border-black/8 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-green transition-colors placeholder-black/25 bg-white'

const subjects = [
  'Fråga om en tjänst',
  'Ändring på hemsidan',
  'Fakturafråga',
  'Boka ett möte',
  'Annat',
]

export default function MessageForm() {
  const router = useRouter()
  const [subject, setSubject] = useState(subjects[0])
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [pending, startTransition] = useTransition()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await sendPortalMessage(subject, message)
      if (!result.success) {
        setError(result.error ?? 'Något gick fel.')
        return
      }
      setSent(true)
      setMessage('')
      router.refresh()
    })
  }

  if (sent) {
    return (
      <div className="bg-white rounded-2xl border border-black/6 shadow-sm p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-brand-green/20 flex items-center justify-center mx-auto mb-4">
          <Check className="w-7 h-7 text-brand-green-dark" />
        </div>
        <p className="font-bold text-black text-lg">Tack, meddelandet är skickat.</p>
        <p className="text-sm text-black/50 mt-1 mb-5">Vi svarar normalt samma arbetsdag.</p>
        <button type="button" onClick={() => setSent(false)} className="text-sm font-semibold text-brand-green-dark hover:text-black transition-colors">
          Skicka ett till
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl border border-black/6 shadow-sm p-6 flex flex-col gap-4">
      <div>
        <label htmlFor="subject" className="block text-xs font-semibold text-black/60 mb-1.5">Vad gäller det?</label>
        <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls}>
          {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-xs font-semibold text-black/60 mb-1.5">Meddelande</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          required
          placeholder="Skriv vad du behöver hjälp med, så återkommer vi."
          className={`${inputCls} resize-none`}
        />
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-60 shadow-md"
          style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
        >
          {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Skicka
        </button>
      </div>
    </form>
  )
}
