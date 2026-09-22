'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Mail, Phone, Globe, Sparkles, Pencil, ExternalLink, Clock, MapPin, UserPlus, Loader2, AlertTriangle } from 'lucide-react'
import { updateOpportunityStage, convertOpportunityToCustomer } from '@/app/actions/sales'
import type { OpportunityKind, OpportunityStage, SalesOpportunity } from '@/lib/supabase/types'
import {
  opportunityColumns, opportunityKinds, opportunityKindLabels, opportunityKindBadge, priorityDot, priorityLabels,
  serviceLabel, gmailThreadUrl, isClosed, daysInStage, isStale, STALE_AFTER_DAYS, formatValue, describeValues,
} from '@/lib/sales'
import KanbanBoard, { type KanbanItem } from '@/app/(admin)/admin/pipeline/_components/KanbanBoard'
import OpportunityModal from './OpportunityModal'

export interface CustomerOption { id: string; name: string }

function OpportunityCard({ o, onOpen }: { o: SalesOpportunity; onOpen: () => void }) {
  const router = useRouter()
  const [converting, startConverting] = useTransition()
  const closed = isClosed(o.stage)
  const days = daysInStage(o)
  const stale = isStale(o)

  return (
    <div className="p-3.5 pb-8">
      <div className="flex items-start justify-between gap-2">
        <button type="button" onClick={onOpen} className="text-left font-semibold text-sm text-gray-900 hover:text-brand-green transition-colors leading-snug">
          {o.company}
        </button>
        <div className="flex items-center gap-1.5 shrink-0">
          <span title={`Prioritet: ${priorityLabels[o.priority]}`} className={`w-2 h-2 rounded-full ${priorityDot[o.priority]}`} />
          <button type="button" onClick={onOpen} aria-label="Öppna" className="text-gray-300 hover:text-gray-600 transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${opportunityKindBadge[o.kind]}`}>
          {opportunityKindLabels[o.kind]}
        </span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
          {serviceLabel(o.service_key, o.service_name)}
        </span>
        {o.source === 'agent' && (
          <span title="Hittad av säljagenten" className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-green-dark">
            <Sparkles className="w-3 h-3" /> Claude
          </span>
        )}
      </div>

      {(o.contact_name || o.city) && (
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
          {o.contact_name && <span className="truncate">{o.contact_name}</span>}
          {o.contact_name && o.city && <span className="text-gray-300">·</span>}
          {o.city && <span className="inline-flex items-center gap-0.5 text-gray-400"><MapPin className="w-3 h-3" />{o.city}</span>}
        </p>
      )}
      {o.summary && <p className="text-xs text-gray-500 mt-1.5 line-clamp-3 leading-relaxed">{o.summary}</p>}

      <div className="mt-3 flex items-center gap-3 text-gray-400">
        {o.phone && <a href={`tel:${o.phone}`} title={o.phone} className="hover:text-gray-900 transition-colors"><Phone className="w-3.5 h-3.5" /></a>}
        {o.email && <a href={`mailto:${o.email}`} title={o.email} className="hover:text-gray-900 transition-colors"><Mail className="w-3.5 h-3.5" /></a>}
        {o.website && (
          <a href={/^https?:\/\//.test(o.website) ? o.website : `https://${o.website}`} target="_blank" rel="noopener noreferrer" title={o.website} className="hover:text-gray-900 transition-colors">
            <Globe className="w-3.5 h-3.5" />
          </a>
        )}
        {o.gmail_thread_id && (
          <a href={gmailThreadUrl(o.gmail_thread_id)} target="_blank" rel="noopener noreferrer" title="Öppna mejltråden i Gmail" className="hover:text-gray-900 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
        {o.customer_id && (
          <Link href={`/admin/customers/${o.customer_id}`} title="Öppna kund" className="text-[10px] font-semibold text-gray-500 hover:text-gray-900 transition-colors">
            Kund
          </Link>
        )}
        {o.estimated_value != null && Number(o.estimated_value) > 0 && (
          <span className="ml-auto text-[11px] font-semibold text-gray-600">{formatValue(o)}</span>
        )}
      </div>

      {!closed && (
        <p
          title={stale ? 'Väntat länge utan rörelse. Skicka en påminnelse eller ring.' : 'Tid i kolumnen'}
          className={`mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-lg ${stale ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}
        >
          {stale ? <AlertTriangle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
          {days === 0 ? 'Idag' : days === 1 ? '1 dag' : `${days} dagar`}{stale ? ' utan rörelse' : ' här'}
        </p>
      )}

      {o.stage === 'won' && (
        <div className="mt-3">
          {o.customer_id ? (
            <Link href={`/admin/customers/${o.customer_id}`} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-green-dark hover:text-black transition-colors">
              <UserPlus className="w-3 h-3" /> Öppna kund
            </Link>
          ) : (
            <button
              type="button"
              disabled={converting}
              onClick={() => startConverting(async () => {
                const result = await convertOpportunityToCustomer(o.id)
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

const chipCls = (active: boolean) =>
  `text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-colors ${
    active ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
  }`

export default function SalesBoard({ opportunities, customers }: { opportunities: SalesOpportunity[]; customers: CustomerOption[] }) {
  const [modal, setModal] = useState<{ open: boolean; opportunity: SalesOpportunity | null }>({ open: false, opportunity: null })
  const [kindFilter, setKindFilter] = useState<OpportunityKind | 'all'>('all')
  const [sourceFilter, setSourceFilter] = useState<'all' | 'agent' | 'manual'>('all')
  const [showClosed, setShowClosed] = useState(false)

  const columns = opportunityColumns.filter((c) => showClosed || !isClosed(c.key))
  const visible = opportunities.filter(
    (o) => (kindFilter === 'all' || o.kind === kindFilter) && (sourceFilter === 'all' || o.source === sourceFilter),
  )

  // High priority first inside each column, then latest activity.
  const known = new Set(opportunityColumns.map((c) => c.key))
  const items: KanbanItem<OpportunityStage>[] = visible.map((o) => ({
    id: o.id,
    // A stage the board does not know (e.g. from an older migration) is shown
    // in the first column rather than silently hidden.
    column: known.has(o.stage) ? o.stage : 'identified',
    sortKey: `${4 - o.priority}${o.updated_at}`,
    node: <OpportunityCard o={o} onOpen={() => setModal({ open: true, opportunity: o })} />,
  }))

  const open = opportunities.filter((o) => !isClosed(o.stage))
  const openValue = describeValues(open)
  const staleCount = open.filter(isStale).length
  const closedCount = opportunities.length - open.length

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" onClick={() => setKindFilter('all')} className={chipCls(kindFilter === 'all')}>Alla</button>
          {opportunityKinds.map((k) => (
            <button key={k.key} type="button" onClick={() => setKindFilter(k.key)} className={chipCls(kindFilter === k.key)}>
              {k.label} <span className="text-gray-400 ml-1">{opportunities.filter((o) => o.kind === k.key && !isClosed(o.stage)).length}</span>
            </button>
          ))}
          <span className="w-px h-5 bg-gray-200 mx-1" />
          <button type="button" onClick={() => setSourceFilter(sourceFilter === 'agent' ? 'all' : 'agent')} className={chipCls(sourceFilter === 'agent')}>
            <Sparkles className="w-3 h-3 inline -mt-0.5 mr-1" />Claude
          </button>
          <button type="button" onClick={() => setSourceFilter(sourceFilter === 'manual' ? 'all' : 'manual')} className={chipCls(sourceFilter === 'manual')}>
            Manuella
          </button>
          <label className="ml-2 inline-flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
            <input type="checkbox" checked={showClosed} onChange={(e) => setShowClosed(e.target.checked)} className="accent-brand-green" />
            Visa avslutade ({closedCount})
          </label>
        </div>
        <button
          onClick={() => setModal({ open: true, opportunity: null })}
          className="inline-flex items-center gap-2 bg-brand-green text-black text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-brand-green-dark transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Ny möjlighet
        </button>
      </div>

      <p className="text-xs text-gray-500 mb-3">
        Öppen potential <span className="font-bold text-gray-900">{openValue ?? 'inget värde angivet'}</span>
        {staleCount > 0 && <span className="ml-3 text-red-600 font-semibold">{staleCount} utan rörelse i över {STALE_AFTER_DAYS} dagar</span>}
      </p>

      <KanbanBoard
        columns={columns}
        items={items}
        emptyText="Inget här ännu"
        onMove={async (id, to) => {
          const result = await updateOpportunityStage(id, to)
          return result?.error ? { error: result.error } : undefined
        }}
        footer={(key, colItems) => {
          const rows = colItems.map((i) => opportunities.find((o) => o.id === i.id)).filter((o): o is SalesOpportunity => Boolean(o))
          const text = describeValues(rows)
          return text ? <span>{text} {key === 'won' ? 'vunnet' : 'i potential'}</span> : <span>Inget värde angivet</span>
        }}
      />

      <OpportunityModal
        open={modal.open}
        opportunity={modal.opportunity}
        customers={customers}
        onClose={() => setModal({ open: false, opportunity: null })}
      />
    </div>
  )
}
