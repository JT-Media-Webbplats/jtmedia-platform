'use client'

import { useState, useTransition } from 'react'
import { createCustomer } from '@/app/actions/customers'
import Modal from '@/app/(admin)/_components/Modal'
import { Loader2, Plus } from 'lucide-react'

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-brand-green transition-colors'
const labelCls = 'block text-xs font-semibold text-white/50 mb-1.5'

export default function NewCustomerModal() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await createCustomer(fd)
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
        <Plus className="w-3.5 h-3.5" /> Ny kund
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Lägg till ny kund">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Namn *</label>
              <input name="name" required placeholder="Anna Svensson" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Företag</label>
              <input name="company" placeholder="AB Företaget" className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>E-post *</label>
              <input name="email" type="email" required placeholder="anna@foretag.se" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Telefon</label>
              <input name="phone" placeholder="070-000 00 00" className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Org.nummer</label>
              <input name="org_number" placeholder="559123-4567" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Adress</label>
              <input name="address" placeholder="Storgatan 1, 123 45 Stad" className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Anteckningar</label>
            <textarea name="notes" rows={3} placeholder="Interna anteckningar…" className={inputCls + ' resize-none'} />
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
              Spara kund
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
