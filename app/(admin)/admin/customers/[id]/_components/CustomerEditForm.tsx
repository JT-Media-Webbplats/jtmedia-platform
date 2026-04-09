'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateCustomer, deleteCustomer } from '@/app/actions/customers'
import type { Customer } from '@/lib/supabase/types'

interface Props {
  customer: Customer
}

const statusOptions = [
  { value: 'active',   label: 'Aktiv' },
  { value: 'paused',   label: 'Pausad' },
  { value: 'inactive', label: 'Inaktiv' },
]

export default function CustomerEditForm({ customer }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDeleting] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSave(formData: FormData) {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await updateCustomer(customer.id, formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    })
  }

  function handleDelete() {
    if (!confirm(`Ta bort kund "${customer.name}"? Alla projekt och faktureringsscheman för kunden tas också bort. Det går inte att ångra.`)) return
    startDeleting(async () => {
      const result = await deleteCustomer(customer.id)
      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/admin/customers')
      }
    })
  }

  const inputCls = 'w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 focus:outline-none transition'
  const labelCls = 'block text-xs font-semibold text-gray-600 mb-1.5'

  return (
    <form action={handleSave}>
      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <div>
          <label className={labelCls}>Namn *</label>
          <input name="name" defaultValue={customer.name} required className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select name="status" defaultValue={customer.status} className={inputCls}>
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>E-post</label>
          <input name="email" type="email" defaultValue={customer.email ?? ''} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Telefon</label>
          <input name="phone" type="tel" defaultValue={customer.phone ?? ''} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Organisationsnummer</label>
          <input name="org_number" defaultValue={customer.org_number ?? ''} className={inputCls} placeholder="556xxx-xxxx" />
        </div>
        <div>
          <label className={labelCls}>Adress</label>
          <input name="address" defaultValue={customer.address ?? ''} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Postnummer</label>
          <input name="postal_code" defaultValue={(customer as Customer & { postal_code?: string }).postal_code ?? ''} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Stad</label>
          <input name="city" defaultValue={(customer as Customer & { city?: string }).city ?? ''} className={inputCls} />
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Anteckningar</label>
          <textarea name="notes" defaultValue={customer.notes ?? ''} rows={3} className={inputCls + ' resize-none'} />
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}
      {saved && (
        <p className="text-brand-green text-sm mb-4 font-medium">Sparad!</p>
      )}

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
          {isDeleting ? 'Tar bort…' : 'Ta bort kund'}
        </button>
      </div>
    </form>
  )
}
