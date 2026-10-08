'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, ExternalLink, FileBarChart, Loader2, Pencil, Plus } from 'lucide-react'
import { setReportSent } from '@/app/actions/reports'
import type { MonthlyReport, ReportClient, SeoWorkLog } from '@/lib/supabase/types'
import { reportState, reportStateLabels, type ReportState } from '@/lib/reports'
import ReportClientModal from './ReportClientModal'
import ReportModal from './ReportModal'

const stateCls: Record<ReportState, string> = {
  sent:     'bg-brand-green/15 text-[#5f8f2b] border-brand-green/30',
  overdue:  'bg-red-50 text-red-500 border-red-200',
  today:    'bg-amber-50 text-amber-600 border-amber-200',
  upcoming: 'bg-gray-50 text-gray-500 border-gray-200',
  no_day:   'bg-gray-50 text-gray-400 border-gray-200',
}

interface Props {
  period: string
  clients: ReportClient[]
  reports: Record<string, MonthlyReport>
  seoLogs: Record<string, SeoWorkLog[]>
  customers: { id: string; name: string }[]
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })
}

function websiteHref(site: string) {
  return /^https?:\/\//.test(site) ? site : `https://${site}`
}

function SentToggle({ clientId, period, sentAt }: { clientId: string; period: string; sentAt: string | null }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function toggle() {
    startTransition(async () => {
      await setReportSent(clientId, period, !sentAt)
      router.refresh()
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      title={sentAt ? 'Klicka för att ångra' : 'Markera rapporten som skickad'}
      className={`inline-flex items-center gap-2 text-xs font-bold rounded-lg border px-3 py-1.5 transition-colors disabled:opacity-50 ${
        sentAt
          ? 'bg-brand-green text-black border-brand-green hover:bg-brand-green-dark'
          : 'bg-white text-gray-600 border-gray-200 hover:border-brand-green hover:text-gray-900'
      }`}
    >
      {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
      {sentAt ? `Skickad ${shortDate(sentAt)}` : 'Markera skickad'}
    </button>
  )
}

export default function ReportList({ period, clients, reports, seoLogs, customers }: Props) {
  const [modal, setModal] = useState<{ client: ReportClient | null } | null>(null)
  const [reportFor, setReportFor] = useState<ReportClient | null>(null)

  const active = clients.filter((c) => c.status === 'active')
  const paused = clients.filter((c) => c.status === 'paused')

  function row(c: ReportClient, isPaused: boolean) {
    const sentAt = reports[c.id]?.sent_at ?? null
    const state = reportState(period, c.report_day, !!sentAt)
    return (
      <tr key={c.id} className={`align-middle transition-colors ${isPaused ? 'opacity-50' : 'hover:bg-gray-50'}`}>
        <td className="px-6 py-4">
          <button onClick={() => setModal({ client: c })} className="group inline-flex items-center gap-2 font-semibold text-gray-900 hover:text-brand-green transition-colors text-left">
            {c.customer?.name ?? 'Okänd kund'}
            <Pencil className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
          </button>
          {c.website && (
            <a href={websiteHref(c.website)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 mt-0.5 w-fit">
              {c.website.replace(/^https?:\/\//, '')}
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          )}
          {c.notes && <p className="text-xs text-gray-400 mt-0.5 max-w-md truncate">{c.notes}</p>}
          {seoLogs[c.id]?.length ? (
            <p className="text-xs text-[#5f8f2b] font-semibold mt-0.5">SEO gjord {shortDate(seoLogs[c.id][seoLogs[c.id].length - 1].done_at)}</p>
          ) : null}
        </td>
        <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
          {c.report_day ? `${c.report_day}:e` : <span className="text-gray-300">–</span>}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {isPaused ? (
            <span className="inline-block text-xs font-bold rounded-lg border px-2.5 py-1 bg-gray-50 text-gray-400 border-gray-200">Pausad</span>
          ) : (
            <span className={`inline-block text-xs font-bold rounded-lg border px-2.5 py-1 ${stateCls[state]}`}>{reportStateLabels[state]}</span>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right">
          <div className="inline-flex items-center gap-3">
            <Link href={`/admin/customers/${c.customer_id}`} className="text-xs text-gray-400 hover:text-gray-900 transition-colors">
              Kundkort
            </Link>
            {!isPaused && (
              <button
                onClick={() => setReportFor(c)}
                className={`inline-flex items-center gap-1.5 text-xs font-bold rounded-lg border px-3 py-1.5 transition-colors ${
                  reports[c.id]?.stats
                    ? 'bg-gray-900 text-white border-gray-900 hover:bg-gray-700'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-900 hover:text-gray-900'
                }`}
              >
                <FileBarChart className="w-3.5 h-3.5" />
                {reports[c.id]?.stats ? 'Rapport klar' : 'Skapa rapport'}
              </button>
            )}
            {!isPaused && <SentToggle clientId={c.id} period={period} sentAt={sentAt} />}
          </div>
        </td>
      </tr>
    )
  }

  return (
    <>
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Rapportkunder</h2>
          <p className="text-gray-500 text-xs mt-0.5">Sorterade på vilken dag i månaden rapporten ska skickas</p>
        </div>
        <button
          onClick={() => setModal({ client: null })}
          className="inline-flex items-center gap-2 bg-brand-green text-black px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-green-dark transition-colors"
        >
          <Plus className="w-4 h-4" /> Lägg till kund
        </button>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
        {clients.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-gray-400 text-sm">Inga rapportkunder ännu.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Kund', 'Dag', 'Status', ''].map((h, i) => (
                    <th key={i} className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-600">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {active.map((c) => row(c, false))}
                {paused.length > 0 && (
                  <tr className="bg-gray-50/60">
                    <td colSpan={4} className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                      Pausade ({paused.length})
                    </td>
                  </tr>
                )}
                {paused.map((c) => row(c, true))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ReportModal
        client={reportFor}
        period={period}
        stats={reportFor ? reports[reportFor.id]?.stats ?? null : null}
        generatedAt={reportFor ? reports[reportFor.id]?.generated_at ?? null : null}
        seoLogs={reportFor ? seoLogs[reportFor.id] ?? [] : []}
        onClose={() => setReportFor(null)}
      />

      <ReportClientModal
        open={modal !== null}
        client={modal?.client ?? null}
        customers={customers}
        onClose={() => setModal(null)}
      />
    </>
  )
}
