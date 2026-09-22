import { Sparkles, Mail, Search, Send, MessageSquareReply } from 'lucide-react'
import type { SalesAgentRun, SalesOpportunity } from '@/lib/supabase/types'
import { formatDateTime } from '@/lib/sales'

interface Props {
  runs: SalesAgentRun[]
  opportunities: SalesOpportunity[]
}

/**
 * Status strip above the board: what the agent did last, and a few counters.
 * The agent itself runs from Claude Code (`/salj-agent`), this panel only
 * shows the result.
 */
export default function AgentPanel({ runs, opportunities }: Props) {
  const last = runs[0] ?? null
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()

  const stats = [
    { label: 'Identifierade', value: opportunities.filter((o) => o.stage === 'identified').length, Icon: Search },
    { label: 'Att kontakta',  value: opportunities.filter((o) => o.stage === 'to_contact').length, Icon: Mail },
    { label: 'Skickade i månaden', value: opportunities.filter((o) => o.sent_at && o.sent_at >= monthStart).length, Icon: Send },
    { label: 'I dialog',      value: opportunities.filter((o) => o.stage === 'dialog' || o.stage === 'proposal').length, Icon: MessageSquareReply },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)] gap-4 mb-8">
      <section className="bg-black text-white rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-brand-green/20 blur-3xl" />
        <div className="flex items-center gap-2 text-brand-green text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-4 h-4" /> Säljagenten
        </div>
        {last ? (
          <>
            <p className="text-sm text-white/60 mt-3">Senaste körning {formatDateTime(last.ran_at)}</p>
            <p className="text-sm text-white mt-2 leading-relaxed">{last.summary ?? 'Ingen sammanfattning.'}</p>
            <p className="text-xs text-white/40 mt-3">
              {last.threads_scanned} trådar lästa · {last.opportunities_created} nya · {last.opportunities_updated} uppdaterade
            </p>
          </>
        ) : (
          <p className="text-sm text-white/60 mt-3 leading-relaxed">
            Agenten har inte körts ännu. Öppna Claude Code i projektet och skriv <code className="font-mono text-brand-green">/salj-agent</code> så läser den igenom mejlen och fyller på tavlan.
          </p>
        )}
        <p className="text-[11px] text-white/30 mt-4">
          Kör igen med <code className="font-mono">/salj-agent</code> i Claude Code. Inget skickas automatiskt, du godkänner varje mejl.
        </p>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ label, value, Icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-black/6 shadow-sm p-5 flex flex-col justify-between">
            <Icon className="w-4 h-4 text-gray-400" />
            <div className="mt-4">
              <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mt-1">{label}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
