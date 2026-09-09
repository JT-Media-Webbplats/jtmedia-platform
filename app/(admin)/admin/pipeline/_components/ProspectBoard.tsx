'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Phone, Mail, Globe, CalendarClock, UserPlus, Loader2, Pencil, MapPin } from 'lucide-react'
import { updateProspectStage, convertProspectToCustomer } from '@/app/actions/prospects'
import type { Prospect, ProspectStage } from '@/lib/supabase/types'
import { prospectColumns, formatKr, isOverdue } from '@/lib/pipeline'
import KanbanBoard, { type KanbanItem } from './KanbanBoard'
import ProspectModal from './ProspectModal'

function ProspectCard({ p, onEdit }: { p: Prospect; onEdit: () => void }) {
  const router = useRouter()
  const [converting, startConverting] = useTransition()
  const overdue = isOverdue(p.next_action_at)

  return (
    <div className="p-4 pb-8">
      <div className="flex items-start justify-between gap-2">
        <button type="button" onClick={onEdit} className="text-left font-semibold text-sm text-gray-900 hover:text-brand-green transition-colors leading-snug">
          {p.company}
        </button>
        <button type="button" onClick={onEdit} aria-label="Redigera" className="text-gray-300 hover:text-gray-600 transition-colors shrink-0">
          <Pencil className="w-3.5 h-3.5" />
        </button>
      </div>
      {(p.contact_name || p.city) && (
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
          {p.contact_name && <span className="truncate">{p.contact_name}</span>}
          {p.contact_name && p.city && <span className="text-gray-300">·</span>}
          {p.city && <span className="inline-flex items-center gap-0.5 text-gray-400"><MapPin className="w-3 h-3" />{p.city}</span>}
        </p>
      )}
      {p.interest && <p className="text-xs text-brand-green-dark font-medium mt-1.5">{p.interest}</p>}
      {p.notes && <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{p.notes}</p>}

      <div className="mt-3 flex items-center gap-3 text-gray-400">
        {p.phone && <a href={`tel:${p.phone}`} title={p.phone} className="hover:text-gray-900 transition-colors"><Phone className="w-3.5 h-3.5" /></a>}
        {p.email && <a href={`mailto:${p.email}`} title={p.email} className="hover:text-gray-900 transition-colors"><Mail className="w-3.5 h-3.5" /></a>}
        {p.website && (
          <a href={/^https?:\/\//.test(p.website) ? p.website : `https://${p.website}`} target="_blank" rel="noopener noreferrer" title={p.website} className="hover:text-gray-900 transition-colors">
            <Globe className="w-3.5 h-3.5" />
          </a>
        )}
        {p.estimated_value != null && Number(p.estimated_value) > 0 && (
          <span className="ml-auto text-[11px] font-semibold text-gray-600">{formatKr(p.estimated_value)}/år</span>
        )}
      </div>

      {p.next_action_at && p.stage !== 'won' && p.stage !== 'lost' && (
        <p className={`mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-lg ${overdue ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
          <CalendarClock className="w-3 h-3" />
          {overdue ? 'Försenad: ' : 'Nästa: '}{new Date(p.next_action_at).toLocaleDateString('sv-SE')}
        </p>
      )}

      {p.stage === 'won' && (
        <div className="mt-3">
          {p.customer_id ? (
            <Link href={`/admin/customers/${p.customer_id}`} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-green-dark hover:text-black transition-colors">
              <UserPlus className="w-3 h-3" /> Öppna kund
            </Link>
          ) : (
            <button
              type="button"
              disabled={converting}
              onClick={() => startConverting(async () => {
                const result = await convertProspectToCustomer(p.id)
                if (result?.customerId) router.push(`/admin/customers/${result.customerId}`)
                else router.refresh()
              })}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest bg-brand-green text-black px-3 py-1.5 rounded-lg hover:bg-brand-green-dark transition-colors disabled:opacity-60"
            >
              {converting ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserPlus className="w-3 h-3" />}
              Gör till kund
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function ProspectBoard({ prospects }: { prospects: Prospect[] }) {
  const [modal, setModal] = useState<{ open: boolean; prospect: Prospect | null }>({ open: false, prospect: null })

  // Sort key is compared descending: prospects with a planned next action come
  // first (soonest at the top), then the rest by latest activity.
  const items: KanbanItem<ProspectStage>[] = prospects.map((p) => ({
    id: p.id,
    column: p.stage,
    sortKey: p.next_action_at
      ? `B${String(1e13 - Date.parse(p.next_action_at)).padStart(14, '0')}`
      : `A${p.updated_at}`,
    node: <ProspectCard p={p} onEdit={() => setModal({ open: true, prospect: p })} />,
  }))

  const openValue = prospects
    .filter((p) => p.stage !== 'won' && p.stage !== 'lost')
    .reduce((s, p) => s + Number(p.estimated_value ?? 0), 0)
  const overdueCount = prospects.filter((p) => p.stage !== 'won' && p.stage !== 'lost' && isOverdue(p.next_action_at)).length

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
        <p className="text-xs text-gray-500">
          Öppet pipelinevärde <span className="font-bold text-gray-900">{formatKr(openValue)}/år</span>
          {overdueCount > 0 && <span className="ml-3 text-red-600 font-semibold">{overdueCount} försenade åtgärder</span>}
        </p>
        <button
          onClick={() => setModal({ open: true, prospect: null })}
          className="inline-flex items-center gap-2 bg-brand-green text-black text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-brand-green-dark transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Nytt prospekt
        </button>
      </div>

      <KanbanBoard
        columns={prospectColumns}
        items={items}
        emptyText="Inga företag här"
        onMove={async (id, to) => {
          const result = await updateProspectStage(id, to)
          return result?.error ? { error: result.error } : undefined
        }}
        footer={(key, colItems) => {
          const value = colItems.reduce((s, i) => s + Number(prospects.find((p) => p.id === i.id)?.estimated_value ?? 0), 0)
          return value > 0 ? <span>{formatKr(value)}/år {key === 'won' ? 'vunnet' : 'i potential'}</span> : <span>Inget värde angivet</span>
        }}
      />

      <ProspectModal
        open={modal.open}
        prospect={modal.prospect}
        onClose={() => setModal({ open: false, prospect: null })}
      />
    </div>
  )
}
