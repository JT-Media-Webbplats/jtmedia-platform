'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2 } from 'lucide-react'
import Modal from '@/app/(admin)/_components/Modal'
import { addReportClient, deleteReportClient, updateReportClient } from '@/app/actions/reports'
import type { ReportClient } from '@/lib/supabase/types'

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-brand-green transition-colors'
const selectCls = inputCls + ' bg-[#1a1a1a]'
const labelCls = 'block text-xs font-semibold text-white/50 mb-1.5'

interface Props {
  open: boolean
  client: ReportClient | null
  customers: { id: string; name: string }[]
  onClose: () => void
}

export default function ReportClientModal({ open, client, customers, onClose }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [customerId, setCustomerId] = useState('')
  const editing = client !== null

  function close() {
    setError(null)
    setCustomerId('')
    onClose()
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = editing ? await updateReportClient(client.id, formData) : await addReportClient(formData)
      if (res.error) {
        setError(res.error)
        return
      }
      router.refresh()
      close()
    })
  }

  function handleDelete() {
    if (!client || !confirm(`Ta bort ${client.customer?.name ?? 'kunden'} från rapportlistan? Kunden finns kvar i kundregistret.`)) return
    startTransition(async () => {
      const res = await deleteReportClient(client.id)
      if (res.error) {
        setError(res.error)
        return
      }
      router.refresh()
      close()
    })
  }

  return (
    <Modal open={open} onClose={close} title={editing ? client.customer?.name ?? 'Rapportkund' : 'Lägg till rapportkund'}>
      <form onSubmit={handleSubmit} className="space-y-4" key={client?.id ?? 'new'}>
        {!editing && (
          <div>
            <label className={labelCls}>Kund *</label>
            <select name="customer_id" value={customerId} onChange={(e) => setCustomerId(e.target.value)} className={selectCls}>
              <option value="">Ny kund, skriv namnet nedan</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {!customerId && (
              <input name="company" placeholder="Företaget AB" className={inputCls + ' mt-2'} autoFocus />
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Dag i månaden</label>
            <input name="report_day" type="number" min="1" max="31" defaultValue={client?.report_day ?? ''} placeholder="T.ex. 4" className={inputCls} />
          </div>
          {editing ? (
            <div>
              <label className={labelCls}>Status</label>
              <select name="status" defaultValue={client.status} className={selectCls}>
                <option value="active">Aktiv</option>
                <option value="paused">Pausad</option>
              </select>
            </div>
          ) : <div />}
          <div className="col-span-2">
            <label className={labelCls}>Hemsida</label>
            <input name="website" defaultValue={client?.website ?? ''} placeholder="foretaget.se" className={inputCls} />
          </div>
          {editing && (
            <>
              <p className="col-span-2 text-[11px] font-bold uppercase tracking-widest text-brand-green pt-2">Datakällor för rapporten</p>
              <div className="col-span-2">
                <label className={labelCls}>Search Console</label>
                <input name="gsc_site" defaultValue={client.gsc_site ?? ''} placeholder="sc-domain:foretaget.se" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Analytics (GA4-egendom)</label>
                <input name="ga4_property_id" defaultValue={client.ga4_property_id ?? ''} placeholder="448608068" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Google Ads-konto</label>
                <input name="ads_customer_id" defaultValue={client.ads_customer_id ?? ''} placeholder="123-456-7890" className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Ads-kampanjer vars namn innehåller</label>
                <input name="ads_campaign_match" defaultValue={client.ads_campaign_match ?? ''} placeholder="T.ex. Z-teknik. Flera med komma. Tomt = alla kampanjer" className={inputCls} />
              </div>
            </>
          )}
          <div className="col-span-2">
            <label className={labelCls}>Anteckning</label>
            <textarea name="notes" rows={2} defaultValue={client?.notes ?? ''} placeholder="T.ex. mottagare eller vad rapporten ska fokusera på" className={inputCls + ' resize-none'} />
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex items-center justify-between pt-2">
          {editing ? (
            <button type="button" onClick={handleDelete} disabled={pending} className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50">
              <Trash2 className="w-3.5 h-3.5" /> Ta bort från listan
            </button>
          ) : <span />}
          <div className="flex gap-3">
            <button type="button" onClick={close} className="px-5 py-2.5 rounded-xl text-sm text-white/50 hover:text-white transition-colors">
              Avbryt
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 bg-brand-green text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-green-dark transition-colors disabled:opacity-60"
            >
              {pending && <Loader2 className="w-4 h-4 animate-spin" />}
              {editing ? 'Spara' : 'Lägg till'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
