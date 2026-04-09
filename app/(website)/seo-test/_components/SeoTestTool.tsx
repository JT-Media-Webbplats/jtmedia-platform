'use client'

import { useState } from 'react'
import Link from 'next/link'
import { saveSeoLead } from '@/app/actions/seo-test'

interface PageSpeedResult {
  performance: number
  accessibility: number
  seo: number
  bestPractices: number
}

function ScoreCircle({ score, label }: { score: number; label: string }) {
  const color =
    score >= 90
      ? 'text-green-500'
      : score >= 50
      ? 'text-orange-400'
      : 'text-red-500'

  const bgColor =
    score >= 90
      ? 'bg-green-50'
      : score >= 50
      ? 'bg-orange-50'
      : 'bg-red-50'

  const strokeColor =
    score >= 90
      ? '#22c55e'
      : score >= 50
      ? '#fb923c'
      : '#ef4444'

  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className={`${bgColor} rounded-2xl p-6 flex flex-col items-center`}>
      <div className="relative w-24 h-24 mb-3">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center font-black text-2xl ${color}`}>
          {score}
        </div>
      </div>
      <p className="text-sm font-semibold text-black/70 text-center">{label}</p>
    </div>
  )
}

export default function SeoTestTool() {
  const [email, setEmail] = useState('')
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [results, setResults] = useState<PageSpeedResult | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !url) return

    setStatus('loading')
    setErrorMsg('')

    // Normalize URL
    let targetUrl = url.trim()
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl
    }

    // Save lead (non-blocking)
    saveSeoLead(email, targetUrl).catch(() => {})

    try {
      const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=mobile`
      const res = await fetch(apiUrl)

      if (!res.ok) {
        throw new Error('Kunde inte analysera sidan. Kontrollera att URL:en är korrekt.')
      }

      const data = await res.json()
      const cats = data.lighthouseResult?.categories

      if (!cats) {
        throw new Error('Fick inget svar från Google PageSpeed. Försök med en annan URL.')
      }

      setResults({
        performance: Math.round((cats.performance?.score ?? 0) * 100),
        accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
        seo: Math.round((cats.seo?.score ?? 0) * 100),
        bestPractices: Math.round((cats['best-practices']?.score ?? 0) * 100),
      })
      setStatus('done')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Något gick fel. Försök igen.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step 1: Form */}
      {status === 'idle' || status === 'error' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-semibold text-black mb-2">
              Hemsidans adress
            </label>
            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              placeholder="www.erhemsida.se"
              className="w-full px-4 py-3.5 rounded-xl border border-black/15 text-black placeholder-black/35 focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all text-lg"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
              Din e-postadress <span className="text-black/40 font-normal">(för att skicka rapporten)</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="din@epost.se"
              className="w-full px-4 py-3.5 rounded-xl border border-black/15 text-black placeholder-black/35 focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all"
            />
          </div>

          {status === 'error' && errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-bold text-black text-lg"
            style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
          >
            Analysera min hemsida →
          </button>
          <p className="text-xs text-black/35 text-center">
            Gratis analys via Google PageSpeed Insights. Vi skickar ingen spam.
          </p>
        </form>
      ) : null}

      {/* Loading */}
      {status === 'loading' && (
        <div className="text-center py-16">
          <div className="inline-block w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin mb-6" />
          <h3 className="font-playfair font-black text-2xl text-black mb-2">Analyserar er hemsida...</h3>
          <p className="text-black/50">Google PageSpeed Insights analyserar prestanda, SEO och tillgänglighet. Det tar cirka 15–30 sekunder.</p>
        </div>
      )}

      {/* Results */}
      {status === 'done' && results && (
        <div>
          <div className="text-center mb-8">
            <h3 className="font-playfair font-black text-3xl text-black mb-2">Här är resultatet!</h3>
            <p className="text-black/55">Poängen är från Googles egna mätverktyg. 90+ är bra, 50–89 kan förbättras, under 50 behöver åtgärdas.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <ScoreCircle score={results.performance} label="Prestanda" />
            <ScoreCircle score={results.accessibility} label="Tillgänglighet" />
            <ScoreCircle score={results.seo} label="SEO" />
            <ScoreCircle score={results.bestPractices} label="Best Practices" />
          </div>

          {/* Interpret */}
          <div className="bg-[#F8F8F8] rounded-2xl p-6 mb-6">
            <h4 className="font-bold text-black mb-3">Vad betyder det här?</h4>
            <ul className="space-y-2 text-sm text-black/60">
              <li className="flex items-start gap-2">
                <span className="text-green-500 shrink-0 mt-0.5">●</span>
                <span><strong className="text-black">90–100:</strong> Utmärkt — er sida presterar bra på detta område</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 shrink-0 mt-0.5">●</span>
                <span><strong className="text-black">50–89:</strong> Kan förbättras — det finns tydliga möjligheter</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 shrink-0 mt-0.5">●</span>
                <span><strong className="text-black">0–49:</strong> Behöver åtgärdas — detta påverkar er synlighet och upplevelse negativt</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="bg-black rounded-2xl p-6 text-center">
            <h4 className="font-playfair font-black text-xl text-white mb-2">
              Vill ni förbättra er hemsida?
            </h4>
            <p className="text-white/55 text-sm mb-5">
              Vi kan hjälpa er att förbättra alla dessa poäng — och därmed er synlighet på Google och upplevelse för besökarna.
            </p>
            <Link
              href="/kontakt"
              className="inline-flex items-center font-bold py-3 px-7 rounded-full text-black text-sm"
              style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
            >
              Kontakta oss →
            </Link>
          </div>

          <button
            onClick={() => { setStatus('idle'); setResults(null); setUrl(''); setEmail('') }}
            className="w-full mt-4 text-sm text-black/45 hover:text-black transition-colors py-2"
          >
            Testa en annan hemsida
          </button>
        </div>
      )}
    </div>
  )
}
