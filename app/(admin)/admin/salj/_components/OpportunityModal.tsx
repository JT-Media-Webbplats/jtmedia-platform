'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2, ExternalLink, Copy, Check, Send, UserPlus, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import Modal from '@/app/(admin)/_components/Modal'
import { createOpportunity, updateOpportunity, deleteOpportunity, updateOpportunityStage, convertOpportunityToCustomer } from '@/app/actions/sales'
import type { OpportunityKind, OpportunityStage, SalesOpportunity } from '@/lib/supabase/types'
import { opportunityColumns, opportunityKinds, serviceOptions, valueTypes, gmailThreadUrl, gmailComposeUrl, formatDateTime } from '@/lib/sales'
import type { CustomerOption } from './SalesBoard'

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-brand-green transition-colors'
const selectCls = inputCls + ' bg-[#1a1a1a]'
const labelCls = 'block text-xs font-semibold text-white/50 mb-1.5'
const sectionCls = 'text-[11px] font-bold uppercase tracking-widest text-brand-green pt-2'
const ghostBtn = 'inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white border border-white/10 rounded-xl px-4 py-2.5 transition-colors disabled:opacity-50'

interface Props {
  open: boolean
  onClose: () => void
  opportunity?: SalesOpportunity | null
  customers: CustomerOption[]
}

/**
 * The form adapts to the stage: before contact you write the e-mail, after
 * contact you only track the dialogue. Agent-only fields (evidence, thread)
 * are shown as read-only info on cards the agent created.
 */
export default function OpportunityModal({ open, onClose, opportunity, customers }: Props) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [deleting, startDeleting] = useTransition()
  const [acting, startActing] = useTransition()
  const [copied, setCopied] = useState(false)
  const [stage, setStage] = useState<OpportunityStage>(opportunity?.stage ?? 'identified')
  const [kind, setKind] = useState<OpportunityKind>(opportunity?.kind ?? 'new')
  const [serviceKey, setServiceKey] = useState<string>(opportunity?.service_key ?? '')
  const [draftSubject, setDraftSubject] = useState(opportunity?.draft_subject ?? '')
  const [draftBody, setDraftBody] = useState(opportunity?.draft_body ?? '')
  const [showSentDraft, setShowSentDraft] = useState(false)
  const editing = Boolean(opportunity)
  const fromAgent = opportunity?.source === 'agent'

  // Reset local state whenever a different card is opened.
  const [seenId, setSeenId] = useState(opportunity?.id ?? 'new')
  if ((opportunity?.id ?? 'new') !== seenId) {
    setSeenId(opportunity?.id ?? 'new')
    setStage(opportunity?.stage ?? 'identified')
    setKind(opportunity?.kind ?? 'new')
    setServiceKey(opportunity?.service_key ?? '')
    setDraftSubject(opportunity?.draft_subject ?? '')
    setDraftBody(opportunity?.draft_body ?? '')
    setShowSentDraft(false)
    setError(null)
  }

  const beforeContact = stage === 'identified' || stage === 'to_contact'
  const inDialogue = stage === 'dialog' || stage === 'proposal'
  const closed = stage === 'won' || stage === 'lost'
  const hasDraft = Boolean(draftSubject || draftBody)
  const showCustomerLink = kind !== 'new'

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = opportunity ? await updateOpportunity(opportunity.id, fd) : await createOpportunity(fd)
      if (result.error) { setError(result.error); return }
      onClose()
    })
  }

  function handleDelete() {
    if (!opportunity) return
    if (!confirm(`Ta bort ${opportunity.company} från säljtavlan?`)) return
    startDeleting(async () => {
      const result = await deleteOpportunity(opportunity.id)
      if (result.error) { setError(result.error); return }
      onClose()
    })
  }

  async function copyDraft() {
    const text = draftSubject ? `Ämne: ${draftSubject}\n\n${draftBody}` : draftBody
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function markSent() {
    if (!opportunity) return
    startActing(async () => {
      const result = await updateOpportunityStage(opportunity.id, 'contacted')
      if (result.error) { setError(result.error); return }
      router.refresh()
      onClose()
    })
  }

  function toCustomer() {
    if (!opportunity) return
    if (!confirm(`Markera ${opportunity.company} som vunnen och skapa kund + projekt?`)) return
    startActing(async () => {
      const result = await convertOpportunityToCustomer(opportunity.id)
      if (result.error) { setError(result.error); return }
      router.push(`/admin/customers/${result.customerId}`)
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? opportunity!.company : 'Ny säljmöjlighet'} wide>
      <form onSubmit={handleSubmit} className="space-y-4" key={opportunity?.id ?? 'new'}>
        {fromAgent && (
          <p className="inline-flex items-center gap-2 text-xs text-brand-green bg-brand-green/10 border border-brand-green/20 rounded-xl px-3 py-2">
            <Sparkles className="w-3.5 h-3.5" /> Hittad av säljagenten {formatDateTime(opportunity!.created_at)}
          </p>
        )}

        {/* Hidden fields keep values the visible form does not edit in this stage. */}
        {!beforeContact && (
          <>
            <input type="hidden" name="draft_subject" value={draftSubject} />
            <input type="hidden" name="draft_body" value={draftBody} />
          </>
        )}
        <input type="hidden" name="evidence" value={opportunity?.evidence ?? ''} />
        <input type="hidden" name="gmail_thread_id" value={opportunity?.gmail_thread_id ?? ''} />
        <input type="hidden" name="lead_source" value={opportunity?.lead_source ?? (editing ? '' : 'Manuell')} />
        {!showCustomerLink && <input type="hidden" name="customer_id" value="" />}

        <div className="grid grid-cols-2 gap-4">
          {/* ── Steg och typ först, resten anpassar sig ── */}
          <div>
            <label className={labelCls}>Steg</label>
            <select name="stage" value={stage} onChange={(e) => setStage(e.target.value as OpportunityStage)} className={selectCls}>
              {opportunityColumns.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Typ</label>
            <select name="kind" value={kind} onChange={(e) => setKind(e.target.value as OpportunityKind)} className={selectCls}>
              {opportunityKinds.map((k) => <option key={k.key} value={k.key}>{k.label}</option>)}
            </select>
          </div>

          {/* ── Företag ── */}
          <p className={sectionCls + ' col-span-2'}>Företag</p>
          <div>
            <label className={labelCls}>Företag *</label>
            <input name="company" required defaultValue={opportunity?.company ?? ''} placeholder="Företaget AB" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Kontaktperson</label>
            <input name="contact_name" defaultValue={opportunity?.contact_name ?? ''} placeholder="Anna Andersson" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>E-post</label>
            <input name="email" type="email" defaultValue={opportunity?.email ?? ''} placeholder="anna@foretaget.se" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Telefon</label>
            <input name="phone" type="tel" defaultValue={opportunity?.phone ?? ''} placeholder="070-123 45 67" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Stad</label>
            <input name="city" defaultValue={opportunity?.city ?? ''} placeholder="Ljungby" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Hemsida</label>
            <input name="website" defaultValue={opportunity?.website ?? ''} placeholder="foretaget.se" className={inputCls} />
          </div>
          {showCustomerLink && (
            <div className="col-span-2">
              <label className={labelCls}>Befintlig kund</label>
              <select name="customer_id" defaultValue={opportunity?.customer_id ?? ''} className={selectCls}>
                <option value="">Ingen koppling</option>
                {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}

          {/* ── Affären ── */}
          <p className={sectionCls + ' col-span-2'}>Affären</p>
          <div>
            <label className={labelCls}>Tjänst</label>
            <select name="service_key" value={serviceKey} onChange={(e) => setServiceKey(e.target.value)} className={selectCls}>
              <option value="">Välj…</option>
              {serviceOptions.map((s) => <option key={s.key} value={s.key}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Prioritet</label>
            <select name="priority" defaultValue={String(opportunity?.priority ?? 2)} className={selectCls}>
              <option value="1">Hög</option>
              <option value="2">Medel</option>
              <option value="3">Låg</option>
            </select>
          </div>
          {(serviceKey === 'other' || serviceKey === '') && (
            <div className="col-span-2">
              <label className={labelCls}>Tjänst, fritext</label>
              <input name="service_name" defaultValue={opportunity?.service_name ?? ''} placeholder="T.ex. Reklamfilm" className={inputCls} />
            </div>
          )}
          {(inDialogue || closed) ? (
            <>
              <div>
                <label className={labelCls}>Uppskattat värde (kr)</label>
                <input name="estimated_value" type="number" min="0" step="100" defaultValue={opportunity?.estimated_value ?? ''} placeholder="24000" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Typ av kostnad</label>
                <select name="value_type" defaultValue={opportunity?.value_type ?? 'recurring'} className={selectCls}>
                  {valueTypes.map((v) => <option key={v.key} value={v.key}>{v.label}</option>)}
                </select>
              </div>
            </>
          ) : (
            <>
              <input type="hidden" name="estimated_value" value={opportunity?.estimated_value ?? ''} />
              <input type="hidden" name="value_type" value={opportunity?.value_type ?? 'recurring'} />
            </>
          )}

          {beforeContact ? (
            <div className="col-span-2">
              <label className={labelCls}>Varför är detta en möjlighet?</label>
              <textarea name="summary" rows={3} defaultValue={opportunity?.summary ?? ''} placeholder="Kunden har SEO men ingen annonsering, trafiken ökar…" className={inputCls + ' resize-none'} />
            </div>
          ) : (
            <input type="hidden" name="summary" value={opportunity?.summary ?? ''} />
          )}

          {/* ── Agentens underlag, bara läsbart ── */}
          {fromAgent && (opportunity!.evidence || opportunity!.gmail_thread_id) && (
            <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 space-y-2">
              {opportunity!.evidence && (
                <p className="text-xs text-white/60 leading-relaxed whitespace-pre-line">{opportunity!.evidence}</p>
              )}
              {opportunity!.gmail_thread_id && (
                <a href={gmailThreadUrl(opportunity!.gmail_thread_id)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-green hover:text-white transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> Öppna mejltråden i Gmail
                </a>
              )}
            </div>
          )}

          {/* ── Mejlutkast: bara innan kontakt ── */}
          {beforeContact && (
            <>
              <p className={sectionCls + ' col-span-2'}>Mejlutkast</p>
              <div className="col-span-2">
                <label className={labelCls}>Ämne</label>
                <input name="draft_subject" value={draftSubject} onChange={(e) => setDraftSubject(e.target.value)} placeholder="Nästa steg för er synlighet" className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Text</label>
                <textarea name="draft_body" rows={10} value={draftBody} onChange={(e) => setDraftBody(e.target.value)} placeholder="Hej …" className={inputCls + ' resize-y leading-relaxed'} />
              </div>
              <div className="col-span-2 flex flex-wrap gap-2">
                <a
                  href={gmailComposeUrl(opportunity?.email ?? null, draftSubject, draftBody)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-black px-4 py-2.5 rounded-xl hover:bg-brand-green transition-colors"
                >
                  <Send className="w-3.5 h-3.5" /> Öppna i Gmail
                </a>
                <button type="button" onClick={copyDraft} className={ghostBtn}>
                  {copied ? <Check className="w-3.5 h-3.5 text-brand-green" /> : <Copy className="w-3.5 h-3.5" />} {copied ? 'Kopierat' : 'Kopiera text'}
                </button>
                {editing && (
                  <button type="button" onClick={markSent} disabled={acting} className={ghostBtn}>
                    {acting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Skickat, flytta till Kontaktad
                  </button>
                )}
              </div>
              <p className="col-span-2 text-[11px] text-white/30">
                Öppna i Gmail fyller i mottagare, ämne och text i ett nytt mejl. Spara först om du ändrat texten och vill behålla den här.
              </p>
            </>
          )}

          {/* ── Efter kontakt: det skickade mejlet hopfällt ── */}
          {stage === 'contacted' && hasDraft && (
            <div className="col-span-2">
              <button type="button" onClick={() => setShowSentDraft((v) => !v)} className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors">
                {showSentDraft ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {showSentDraft ? 'Dölj skickat mejl' : 'Visa skickat mejl'}
              </button>
              {showSentDraft && (
                <div className="mt-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  {draftSubject && <p className="text-xs font-semibold text-white/80 mb-2">{draftSubject}</p>}
                  <p className="text-xs text-white/60 leading-relaxed whitespace-pre-line">{draftBody}</p>
                </div>
              )}
            </div>
          )}

          {/* ── Anteckningar, alltid ── */}
          <div className="col-span-2">
            <label className={labelCls}>Anteckningar</label>
            <textarea
              name="notes"
              rows={inDialogue ? 4 : 2}
              defaultValue={opportunity?.notes ?? ''}
              placeholder={inDialogue ? 'Vad sa de? Vad ingår i offerten? Nästa steg?' : 'Egna anteckningar'}
              className={inputCls + ' resize-none'}
            />
          </div>

          {editing && !closed && (
            <div className="col-span-2 flex flex-wrap items-center gap-2">
              <button type="button" onClick={toCustomer} disabled={acting} className={ghostBtn}>
                <UserPlus className="w-3.5 h-3.5" /> Vunnen, gör till kund
              </button>
              <span className="text-[11px] text-white/30">Skapar kunden och ett projekt i Väntar på godkännande.</span>
            </div>
          )}
        </div>

        {error && (
          <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{error}</p>
        )}

        <div className="flex items-center justify-between gap-3 pt-2">
          {editing ? (
            <button type="button" onClick={handleDelete} disabled={deleting} className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50">
              <Trash2 className="w-3.5 h-3.5" /> Ta bort
            </button>
          ) : <span />}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm text-white/50 hover:text-white transition-colors">
              Avbryt
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 bg-brand-green text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-green-dark transition-colors disabled:opacity-60"
            >
              {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {editing ? 'Spara' : 'Lägg till'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
