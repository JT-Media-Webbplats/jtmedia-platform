'use client'

import { useState, useRef } from 'react'
import { submitContact } from '@/app/actions/contact'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const formData = new FormData(e.currentTarget)
    const result = await submitContact(formData)

    if (result.success) {
      setStatus('success')
      formRef.current?.reset()
    } else {
      setStatus('error')
      setErrorMsg(result.error ?? 'Något gick fel.')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-brand-green/15 border border-brand-green rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="font-playfair font-black text-xl text-black mb-2">Tack för ditt meddelande!</h3>
        <p className="text-black/60">Vi återkommer till dig så snart som möjligt — vanligtvis samma dag.</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm font-semibold text-black/60 hover:text-black transition-colors"
        >
          Skicka ett till meddelande
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-black mb-2">
          Namn <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Ert namn"
          className="w-full px-4 py-3 rounded-xl border border-black/15 text-black placeholder-black/35 focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
          E-post <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="er@foretag.se"
          className="w-full px-4 py-3 rounded-xl border border-black/15 text-black placeholder-black/35 focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-black mb-2">
          Telefon <span className="text-black/40 font-normal">(valfritt)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="070-000 00 00"
          className="w-full px-4 py-3 rounded-xl border border-black/15 text-black placeholder-black/35 focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-black mb-2">
          Meddelande <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Berätta om ert projekt eller vad ni behöver hjälp med..."
          className="w-full px-4 py-3 rounded-xl border border-black/15 text-black placeholder-black/35 focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all resize-none"
        />
      </div>

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-4 rounded-xl font-bold text-black disabled:opacity-60 transition-opacity"
        style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
      >
        {status === 'loading' ? 'Skickar...' : 'Skicka meddelande →'}
      </button>
    </form>
  )
}
