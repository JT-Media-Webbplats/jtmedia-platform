'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Copy, Download, Loader2, RefreshCw, Sparkles } from 'lucide-react'
import Modal from '@/app/(admin)/_components/Modal'
import { generateReport } from '@/app/actions/reports'
import type { ReportClient, ReportStats, SeoWorkLog } from '@/lib/supabase/types'
import { change, ctr, formatChange, formatInt, formatPct, periodLabel, reportEmail, shortDay } from '@/lib/reports'

interface Props {
  client: ReportClient | null
  period: string
  stats: ReportStats | null
  generatedAt: string | null
  seoLogs: SeoWorkLog[]
  onClose: () => void
}

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-brand-green transition-colors'
const labelCls = 'block text-xs font-semibold text-white/50 mb-1.5'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-brand-green" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Kopierat' : 'Kopiera'}
    </button>
  )
}

function Row({ label, previous, current, extra }: { label: string; previous: number; current: number; extra?: string }) {
  const ratio = change(previous, current)
  return (
    <tr className="border-t border-white/5">
      <td className="py-2 text-white/60">{label}</td>
      <td className="py-2 text-right text-white/60">{formatInt(previous)}</td>
      <td className="py-2 text-right font-semibold text-white">{formatInt(current)}</td>
      <td className={`py-2 text-right text-xs font-semibold ${ratio !== null && ratio < 0 ? 'text-white/40' : 'text-brand-green'}`}>
        {formatChange(ratio)}
      </td>
      <td className="py-2 pl-3 text-right text-xs text-white/40">{extra}</td>
    </tr>
  )
}

export default function ReportModal({ client, period, stats: savedStats, generatedAt, seoLogs, onClose }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [stats, setStats] = useState<ReportStats | null>(savedStats)
  const [error, setError] = useState<string | null>(null)

  const seoItems = seoLogs.flatMap((l) => l.items)
  const name = client?.customer?.name ?? 'Kund'
  const mail = client && stats ? reportEmail(name, client.website, stats, seoItems) : null
  // The body is editable before copying; it resets when the figures or the SEO log change.
  const [body, setBody] = useState(mail?.body ?? '')

  useEffect(() => {
    setStats(savedStats)
    setError(null)
  }, [client?.id, savedStats])

  useEffect(() => {
    setBody(mail?.body ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mail?.body])

  if (!client) return null
  const missingSources = !client.gsc_site && !client.ga4_property_id && !client.ads_customer_id

  function generate() {
    setError(null)
    startTransition(async () => {
      const res = await generateReport(client!.id, period)
      if (res.error) {
        setError(res.error)
        return
      }
      setStats(res.stats ?? null)
      router.refresh()
    })
  }

  return (
    <Modal open onClose={onClose} title={`Rapport ${name}, ${periodLabel(period).toLowerCase()}`} wide>
      {!stats ? (
        <div className="py-6 text-center space-y-4">
          <p className="text-sm text-white/60 max-w-md mx-auto">
            Hämtar de senaste 30 dagarna från{' '}
            {[client.gsc_site && 'Search Console', client.ads_customer_id && 'Google Ads', client.ga4_property_id && 'Analytics']
              .filter(Boolean)
              .join(', ') || 'kundens datakällor'}{' '}
            och jämför med 30 dagarna innan. Sedan kan du ladda ner PDF:en och kopiera ett mejlförslag.
          </p>
          {missingSources ? (
            <p className="text-sm text-amber-300">Kunden saknar datakällor. Stäng och klicka på kundnamnet för att fylla i dem.</p>
          ) : (
            <button
              onClick={generate}
              disabled={pending}
              className="inline-flex items-center gap-2 bg-brand-green text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-brand-green-dark transition-colors disabled:opacity-60"
            >
              {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {pending ? 'Hämtar siffror…' : 'Skapa rapport'}
            </button>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Figures */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-[11px] font-bold uppercase tracking-widest text-brand-green">
                {shortDay(stats.start)} till {shortDay(stats.end)}
              </p>
              {generatedAt && (
                <p className="text-[11px] text-white/30">
                  Hämtad {new Date(generatedAt).toLocaleString('sv-SE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-widest text-white/30">
                  <th className="text-left font-semibold pb-1" />
                  <th className="text-right font-semibold pb-1">Förra</th>
                  <th className="text-right font-semibold pb-1">Denna</th>
                  <th className="text-right font-semibold pb-1">Ändring</th>
                  <th className="text-right font-semibold pb-1 pl-3">CTR</th>
                </tr>
              </thead>
              <tbody>
                {stats.organic && (
                  <>
                    <Row label="Organiska exponeringar" previous={stats.organic.previous.impressions} current={stats.organic.current.impressions} />
                    <Row label="Organiska klick" previous={stats.organic.previous.clicks} current={stats.organic.current.clicks} extra={formatPct(ctr(stats.organic.current))} />
                  </>
                )}
                {stats.paid && (
                  <>
                    <Row label="Ads exponeringar" previous={stats.paid.previous.impressions} current={stats.paid.current.impressions} />
                    <Row label="Ads klick" previous={stats.paid.previous.clicks} current={stats.paid.current.clicks} extra={formatPct(ctr(stats.paid.current))} />
                  </>
                )}
                {stats.visitors && <Row label="Besökare totalt" previous={stats.visitors.previous} current={stats.visitors.current} />}
              </tbody>
            </table>
            {stats.errors.length > 0 && (
              <p className="mt-3 text-xs text-amber-300">
                Kunde inte hämta: {stats.errors.join(', ')}. Den delen saknas i rapporten.
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`/admin/rapporter/${client.id}/pdf?m=${period.slice(0, 7)}`}
              className="inline-flex items-center gap-2 bg-brand-green text-black px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-green-dark transition-colors"
            >
              <Download className="w-4 h-4" /> Ladda ner PDF
            </a>
            <button
              onClick={generate}
              disabled={pending}
              className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white border border-white/10 rounded-xl px-4 py-2.5 transition-colors disabled:opacity-50"
            >
              {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              Hämta nya siffror
            </button>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>

          {/* E-mail suggestion */}
          {mail && (
            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-brand-green">Mejlförslag</p>
              <div>
                <div className="flex items-center justify-between">
                  <label className={labelCls}>Ämne</label>
                  <CopyButton text={mail.subject} />
                </div>
                <input readOnly value={mail.subject} className={inputCls} />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className={labelCls}>
                    Text {seoItems.length ? <span className="text-brand-green">· SEO-arbetet är ifyllt från loggen</span> : <span className="text-white/30">· ingen SEO loggad denna månad, skriv in den själv</span>}
                  </label>
                  <CopyButton text={body} />
                </div>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={16} className={inputCls + ' resize-y leading-relaxed'} />
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
