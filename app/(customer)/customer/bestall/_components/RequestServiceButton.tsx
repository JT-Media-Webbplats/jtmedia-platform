'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { X, Loader2, Send, Check } from 'lucide-react'
import { requestService } from '@/app/actions/requests'

interface Props {
  serviceKey: string
  serviceName: string
  owned: boolean
  hasOpenRequest: boolean
}

export default function RequestServiceButton({ serviceKey, serviceName, owned, hasOpenRequest }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [pending, startTransition] = useTransition()

  const disabled = hasOpenRequest

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await requestService(serviceKey, message)
      if (!result.success) {
        setError(result.error ?? 'Något gick fel.')
        return
      }
      setDone(true)
      router.refresh()
      setTimeout(() => {
        setOpen(false)
        setDone(false)
        setMessage('')
      }, 1600)
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
          disabled
            ? 'bg-black/5 text-black/35 cursor-default'
            : owned
              ? 'border-2 border-black/10 text-black/70 hover:border-brand-green hover:text-black'
              : 'text-black shadow-md hover:opacity-90'
        }`}
        style={!disabled && !owned ? { background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' } : undefined}
      >
        {disabled ? 'Förfrågan skickad' : owned ? 'Fråga om mer' : 'Skicka förfrågan'}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => !pending && setOpen(false)}>
          <div
            className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {done ? (
              <div className="py-8 text-center">
                <div className="w-14 h-14 rounded-full bg-brand-green/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-7 h-7 text-brand-green-dark" />
                </div>
                <p className="font-bold text-black text-lg">Tack! Förfrågan är skickad.</p>
                <p className="text-sm text-black/50 mt-1">Vi hör av oss inom en arbetsdag.</p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-black/35 mb-1">Förfrågan</p>
                    <h3 className="font-playfair font-black text-2xl text-black">{serviceName}</h3>
                  </div>
                  <button type="button" onClick={() => setOpen(false)} className="text-black/30 hover:text-black transition-colors" aria-label="Stäng">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-black/55 leading-relaxed mb-4">
                  Berätta gärna kort vad ni vill uppnå, så kommer vi förberedda. Det går lika bra att skicka utan text.
                </p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="T.ex. Vi vill synas bättre på Google i Ljungby och Växjö."
                  className="w-full border-2 border-black/8 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-green transition-colors placeholder-black/25 resize-none"
                />
                {error && (
                  <div className="mt-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
                )}
                <div className="mt-5 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setOpen(false)} disabled={pending} className="text-sm text-black/50 hover:text-black transition-colors px-3 py-2">
                    Avbryt
                  </button>
                  <button
                    type="submit"
                    disabled={pending}
                    className="inline-flex items-center gap-2 text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-60 shadow-md"
                    style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
                  >
                    {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Skicka förfrågan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
