'use client'

import { useState, useTransition } from 'react'
import { KeyRound, Trash2, Loader2, CheckCircle2, Copy, RefreshCw, UserPlus } from 'lucide-react'
import { createPortalLogin, resetPortalPassword, deletePortalLogin } from '@/app/actions/portal-access'

interface LinkedProfile {
  id: string
  email: string
  full_name: string | null
}

interface Props {
  customerId: string
  customerEmail: string
  customerName: string
  profiles: LinkedProfile[]
}

const inputCls = 'w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 focus:outline-none transition'
const labelCls = 'block text-xs font-semibold text-gray-600 mb-1'

/** Readable password: Word-Word-1234 style, easy to read out over the phone. */
function generatePassword() {
  const words = ['Solig', 'Skog', 'Berg', 'Fjord', 'Norr', 'Väst', 'Bris', 'Kust', 'Älv', 'Dal', 'Klar', 'Snabb', 'Grön', 'Ljus', 'Stark']
  const pick = () => words[Math.floor(Math.random() * words.length)]
  const num = Math.floor(1000 + Math.random() * 9000)
  return `${pick()}-${pick()}-${num}`
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch {}
      }}
      className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
      title="Kopiera"
    >
      {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

export default function PortalAccessPanel({ customerId, customerEmail, customerName, profiles }: Props) {
  const [showCreate, setShowCreate] = useState(profiles.length === 0)
  const [password, setPassword] = useState(generatePassword)
  const [resetFor, setResetFor] = useState<string | null>(null)
  const [resetPw, setResetPw] = useState(generatePassword)
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null)
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleCreate(formData: FormData) {
    setMessage(null)
    const email = (formData.get('email') as string).trim().toLowerCase()
    const pw = formData.get('password') as string
    startTransition(async () => {
      const result = await createPortalLogin(customerId, formData)
      if (result?.error) setMessage({ type: 'error', text: result.error })
      else {
        setCreated({ email, password: pw })
        setShowCreate(false)
        setPassword(generatePassword())
      }
    })
  }

  function handleReset(profileId: string) {
    setMessage(null)
    const pw = resetPw
    const email = profiles.find((p) => p.id === profileId)?.email ?? ''
    startTransition(async () => {
      const result = await resetPortalPassword(profileId, customerId, pw)
      if (result?.error) setMessage({ type: 'error', text: result.error })
      else {
        setCreated({ email, password: pw })
        setResetFor(null)
        setResetPw(generatePassword())
      }
    })
  }

  function handleDelete(p: LinkedProfile) {
    if (!confirm(`Ta bort inloggningen för ${p.email}? Kunden kan inte längre logga in.`)) return
    setMessage(null)
    startTransition(async () => {
      const result = await deletePortalLogin(p.id, customerId)
      if (result?.error) setMessage({ type: 'error', text: result.error })
      else setMessage({ type: 'ok', text: 'Inloggningen är borttagen.' })
    })
  }

  return (
    <div>
      <p className="text-xs text-gray-500 mb-4 leading-relaxed">
        Kunden loggar in på <span className="font-mono text-gray-700">/login</span> med e-post och lösenord och ser
        sina tjänster i kundportalen. Skapa inloggningen här och skicka uppgifterna till kunden.
      </p>

      {/* Credentials to hand over, shown once */}
      {created && (
        <div className="mb-4 border border-brand-green/40 bg-brand-green/10 rounded-xl p-4">
          <p className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-2">Uppgifter att skicka till kunden</p>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-500 text-xs w-20">Adress</span>
              <span className="font-mono text-gray-900 flex-1 truncate">{typeof window !== 'undefined' ? window.location.origin : ''}/login</span>
              <CopyButton text={`${typeof window !== 'undefined' ? window.location.origin : ''}/login`} />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-500 text-xs w-20">E-post</span>
              <span className="font-mono text-gray-900 flex-1 truncate">{created.email}</span>
              <CopyButton text={created.email} />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-500 text-xs w-20">Lösenord</span>
              <span className="font-mono text-gray-900 flex-1">{created.password}</span>
              <CopyButton text={created.password} />
            </div>
          </div>
          <p className="text-[11px] text-gray-500 mt-3">Lösenordet visas bara nu. Behöver ni det igen, sätt ett nytt.</p>
          <button type="button" onClick={() => setCreated(null)} className="text-xs text-gray-500 hover:text-gray-800 mt-2">Stäng</button>
        </div>
      )}

      {/* Existing logins */}
      {profiles.length > 0 && (
        <ul className="mb-4 space-y-2">
          {profiles.map((p) => (
            <li key={p.id} className="border border-gray-200 rounded-xl px-3 py-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-900 truncate">{p.email}</p>
                    {p.full_name && <p className="text-xs text-gray-400 truncate">{p.full_name}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => { setResetFor(resetFor === p.id ? null : p.id); setResetPw(generatePassword()) }}
                    className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                    title="Nytt lösenord"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleDelete(p)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                    title="Ta bort inloggning"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {resetFor === p.id && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <label className={labelCls}>Nytt lösenord</label>
                  <div className="flex gap-2">
                    <input value={resetPw} onChange={(e) => setResetPw(e.target.value)} className={`${inputCls} font-mono`} />
                    <button type="button" onClick={() => setResetPw(generatePassword())} className="p-2 text-gray-400 hover:text-gray-700 rounded-lg border border-gray-200" title="Generera">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button type="button" disabled={isPending} onClick={() => handleReset(p.id)} className="bg-brand-green text-black px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-brand-green-dark disabled:opacity-50 transition-colors">
                      {isPending ? 'Sparar…' : 'Spara lösenord'}
                    </button>
                    <button type="button" onClick={() => setResetFor(null)} className="text-gray-500 hover:text-gray-700 text-xs px-2">Avbryt</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Create login */}
      {showCreate ? (
        <form action={handleCreate} className="border border-brand-green/30 bg-brand-green/5 rounded-xl p-4">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Ny inloggning</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="col-span-2">
              <label className={labelCls}>E-post (används som användarnamn)</label>
              <input name="email" type="email" required defaultValue={customerEmail} className={inputCls} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Namn (valfritt)</label>
              <input name="full_name" defaultValue={customerName} className={inputCls} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Lösenord (minst 8 tecken)</label>
              <div className="flex gap-2">
                <input name="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputCls} font-mono`} />
                <button type="button" onClick={() => setPassword(generatePassword())} className="p-2 text-gray-400 hover:text-gray-700 rounded-lg border border-gray-200 bg-white" title="Generera nytt">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={isPending} className="flex items-center gap-1.5 bg-brand-green text-black px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-brand-green-dark disabled:opacity-50 transition-colors">
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
              Skapa inloggning
            </button>
            {profiles.length > 0 && (
              <button type="button" onClick={() => setShowCreate(false)} className="text-gray-500 hover:text-gray-700 text-xs px-3 py-1.5">Avbryt</button>
            )}
          </div>
        </form>
      ) : (
        <button type="button" onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 text-brand-green hover:text-brand-green-dark text-xs font-semibold transition-colors">
          <UserPlus className="w-3.5 h-3.5" /> Lägg till ytterligare inloggning
        </button>
      )}

      {message && (
        <p className={`text-xs mt-3 ${message.type === 'ok' ? 'text-brand-green-dark' : 'text-red-500'}`}>{message.text}</p>
      )}
    </div>
  )
}
