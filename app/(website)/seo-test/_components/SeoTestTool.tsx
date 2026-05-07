'use client'

import { useState } from 'react'
import Link from 'next/link'
import { saveSeoLead } from '@/app/actions/seo-test'

type IssueCategory = 'Prestanda' | 'Tillgänglighet' | 'SEO' | 'Best Practices'

interface AuditIssue {
  id: string
  category: IssueCategory
  title: string
  tip: string
}

interface ScoreSet {
  performance: number
  accessibility: number
  seo: number
  bestPractices: number
  issues: AuditIssue[]
}

interface PageSpeedResult {
  mobile: ScoreSet
  desktop: ScoreSet
}

type DeviceTab = 'mobile' | 'desktop'

function buildScoreSet(lighthouseResult: any): ScoreSet {
  const cats = lighthouseResult?.categories ?? {}
  return {
    performance: Math.round((cats.performance?.score ?? 0) * 100),
    accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
    seo: Math.round((cats.seo?.score ?? 0) * 100),
    bestPractices: Math.round((cats['best-practices']?.score ?? 0) * 100),
    issues: extractIssues(lighthouseResult),
  }
}

const CATEGORY_LABELS: Record<string, IssueCategory> = {
  performance: 'Prestanda',
  accessibility: 'Tillgänglighet',
  seo: 'SEO',
  'best-practices': 'Best Practices',
}

const CATEGORY_COLORS: Record<IssueCategory, string> = {
  Prestanda: 'bg-amber-100 text-amber-700',
  Tillgänglighet: 'bg-blue-100 text-blue-700',
  SEO: 'bg-purple-100 text-purple-700',
  'Best Practices': 'bg-slate-100 text-slate-700',
}

const SWEDISH_TIPS: Record<string, { title: string; tip: string }> = {
  'render-blocking-resources': {
    title: 'Resurser som blockerar visningen',
    tip: 'CSS och JavaScript hindrar sidan från att visas snabbt. Att ladda dem smartare gör att besökaren ser innehållet tidigare.',
  },
  'unused-css-rules': {
    title: 'Oanvänd CSS-kod',
    tip: 'Sidan laddar CSS som aldrig används. Att rensa bort den minskar laddningstiden.',
  },
  'unused-javascript': {
    title: 'Oanvänd JavaScript-kod',
    tip: 'Onödig JavaScript-kod laddas på sidan. Att ta bort den gör sidan snabbare.',
  },
  'modern-image-formats': {
    title: 'Använd moderna bildformat',
    tip: 'Bilder skulle laddas snabbare i moderna format som WebP eller AVIF istället för JPEG eller PNG.',
  },
  'uses-optimized-images': {
    title: 'Optimera bilder',
    tip: 'Bilderna på sidan är större än de behöver vara. Komprimering minskar storleken utan att försämra kvaliteten märkbart.',
  },
  'uses-responsive-images': {
    title: 'Bilder större än de behöver vara',
    tip: 'Sidan skickar bilder i högre upplösning än vad som visas. Anpassade storlekar laddar snabbare.',
  },
  'offscreen-images': {
    title: 'Ladda bilder vid behov',
    tip: 'Bilder som inte syns direkt laddas i förväg. Att ladda dem först när användaren scrollar dit gör startladdningen snabbare.',
  },
  'uses-text-compression': {
    title: 'Aktivera textkomprimering',
    tip: 'Servern skickar text utan komprimering. Att aktivera gzip eller brotli kan halvera storleken på överförd data.',
  },
  'uses-rel-preconnect': {
    title: 'Förbered externa anslutningar',
    tip: 'Sidan kan ladda snabbare om webbläsaren får veta i förväg vilka externa tjänster som kommer användas.',
  },
  'font-display': {
    title: 'Text osynlig under typsnittsladdning',
    tip: 'Text är osynlig medan typsnitt laddas. En enkel CSS-regel löser det och förbättrar upplevelsen.',
  },
  'efficient-animated-content': {
    title: 'Animerade GIF-bilder är tunga',
    tip: 'Animerade GIF-bilder skulle vara mycket mindre om de konverterades till video.',
  },
  'total-byte-weight': {
    title: 'Sidan är för tung',
    tip: 'Den totala storleken är hög, vilket gör att den laddas långsamt på mobila uppkopplingar.',
  },
  'dom-size': {
    title: 'För komplex HTML-struktur',
    tip: 'Sidan har många HTML-element som tillsammans gör webbläsaren långsammare.',
  },
  'server-response-time': {
    title: 'Långsam serversvarstid',
    tip: 'Servern tar för lång tid på sig att svara. Det påverkar både upplevelsen och Google-rankingen.',
  },
  'first-contentful-paint': {
    title: 'Innehåll syns för långsamt',
    tip: 'Det tar för lång tid innan något syns för besökaren. Risk för att de hoppar av innan sidan ens hunnit visas.',
  },
  'largest-contentful-paint-element': {
    title: 'Det viktigaste innehållet visas långsamt',
    tip: 'Sidans största visuella element tar för lång tid att rendera. Det är en av Googles viktigaste rankingfaktorer.',
  },
  'cumulative-layout-shift': {
    title: 'Sidan hoppar runt under laddning',
    tip: 'Element flyttar sig medan sidan laddas, vilket är frustrerande för besökaren och sänker Google-poängen.',
  },
  'image-alt': {
    title: 'Bilder saknar alt-text',
    tip: 'Bilder behöver beskrivande alt-text för både tillgänglighet och SEO.',
  },
  'meta-description': {
    title: 'Saknad meta-beskrivning',
    tip: 'Sidan saknar en meta-description, vilket gör att Google inte vet vad den ska visa i sökresultatet.',
  },
  'document-title': {
    title: 'Saknad eller dålig sidtitel',
    tip: 'Sidans titel är det som syns i Google. Den behöver vara tydlig och beskrivande.',
  },
  'link-name': {
    title: 'Länkar utan tydlig text',
    tip: 'Vissa länkar saknar beskrivande text, vilket försvårar både för sökmotorer och skärmläsare.',
  },
  'robots-txt': {
    title: 'Problem med robots.txt',
    tip: 'Filen robots.txt styr hur Google läser sidan. En korrekt fil hjälper Google att indexera rätt innehåll.',
  },
  viewport: {
    title: 'Saknad viewport-tagg',
    tip: 'Sidan saknar en viewport-meta-tagg, vilket gör att den inte anpassar sig korrekt till mobiler.',
  },
  'is-on-https': {
    title: 'Sidan körs inte på HTTPS',
    tip: 'En osäker anslutning skadar både trovärdigheten och Google-rankingen. Ett SSL-certifikat löser det.',
  },
  'tap-targets': {
    title: 'Knappar för små på mobil',
    tip: 'Knappar och länkar är för små eller ligger för tätt för att vara enkla att trycka på.',
  },
  'color-contrast': {
    title: 'Dålig kontrast i texten',
    tip: 'Vissa texter har för låg kontrast mot bakgrunden, vilket gör dem svårlästa.',
  },
  'heading-order': {
    title: 'Felaktig rubriknivå-ordning',
    tip: 'Rubriker (H1, H2 osv.) är inte i logisk ordning, vilket både skärmläsare och Google reagerar på.',
  },
  'crawlable-anchors': {
    title: 'Länkar går inte att läsa av',
    tip: 'Vissa länkar är byggda så att Google inte kan följa dem. Det skadar SEO.',
  },
  hreflang: {
    title: 'Felaktig hreflang-uppmärkning',
    tip: 'För flerspråkiga sidor hjälper hreflang Google att visa rätt språkversion till rätt användare.',
  },
  canonical: {
    title: 'Saknad eller felaktig canonical',
    tip: 'En canonical-tagg talar om för Google vilken som är den officiella versionen av sidan.',
  },
  'errors-in-console': {
    title: 'Felmeddelanden i konsolen',
    tip: 'Webbläsaren rapporterar fel som tyder på problem i koden. Det kan påverka funktionalitet.',
  },
  'no-vulnerable-libraries': {
    title: 'Sårbara bibliotek används',
    tip: 'Sidan använder JavaScript-bibliotek med kända säkerhetsbrister. De bör uppdateras.',
  },
  'button-name': {
    title: 'Knappar utan tillgänglig text',
    tip: 'Vissa knappar saknar beskrivande text, vilket gör dem oanvändbara med skärmläsare.',
  },
  label: {
    title: 'Formulärfält saknar etikett',
    tip: 'Formulärfält behöver tydliga etiketter så att alla användare förstår vad de ska fylla i.',
  },
  'html-has-lang': {
    title: 'Saknad språkangivelse',
    tip: 'Sidan saknar lang-attribut på html-elementet, vilket är viktigt för både SEO och tillgänglighet.',
  },
}

function extractIssues(lighthouseResult: any): AuditIssue[] {
  const audits = lighthouseResult?.audits
  const categories = lighthouseResult?.categories
  if (!audits || !categories) return []

  type Candidate = { id: string; category: IssueCategory; weight: number }
  const candidates: Candidate[] = []

  for (const [catKey, catLabel] of Object.entries(CATEGORY_LABELS)) {
    const cat = categories[catKey]
    if (!cat?.auditRefs) continue
    for (const ref of cat.auditRefs) {
      const audit = audits[ref.id]
      if (!audit || audit.score === null || audit.score === undefined) continue
      if (audit.score >= 0.9) continue
      candidates.push({ id: ref.id, category: catLabel, weight: ref.weight ?? 0 })
    }
  }

  candidates.sort((a, b) => b.weight - a.weight)

  const seen = new Set<string>()
  const issues: AuditIssue[] = []
  for (const c of candidates) {
    if (seen.has(c.id)) continue
    seen.add(c.id)
    if (issues.length >= 5) break

    const swedish = SWEDISH_TIPS[c.id]
    if (!swedish) continue

    issues.push({
      id: c.id,
      category: c.category,
      title: swedish.title,
      tip: swedish.tip,
    })
  }

  return issues
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
  const [activeTab, setActiveTab] = useState<DeviceTab>('mobile')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !url) return

    setStatus('loading')
    setErrorMsg('')

    let targetUrl = url.trim()
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl
    }

    saveSeoLead(email, targetUrl).catch(() => {})

    try {
      const [mobileRes, desktopRes] = await Promise.all([
        fetch(`/api/seo-test?url=${encodeURIComponent(targetUrl)}&strategy=mobile`),
        fetch(`/api/seo-test?url=${encodeURIComponent(targetUrl)}&strategy=desktop`),
      ])

      const [mobileData, desktopData] = await Promise.all([
        mobileRes.json(),
        desktopRes.json(),
      ])

      if (!mobileRes.ok) {
        throw new Error(mobileData?.error ?? 'Kunde inte analysera sidan. Försök igen om en stund.')
      }
      if (!desktopRes.ok) {
        throw new Error(desktopData?.error ?? 'Kunde inte analysera sidan. Försök igen om en stund.')
      }

      if (!mobileData.lighthouseResult?.categories || !desktopData.lighthouseResult?.categories) {
        throw new Error('Fick inget svar från analysverktyget. Försök med en annan URL.')
      }

      setResults({
        mobile: buildScoreSet(mobileData.lighthouseResult),
        desktop: buildScoreSet(desktopData.lighthouseResult),
      })
      setActiveTab('mobile')
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
              Din e-postadress <span className="text-black/40 font-normal">(om ni vill att vi hör av oss med en personlig genomgång)</span>
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
            Gratis analys av er hemsida. Vi skickar ingen spam.
          </p>
        </form>
      ) : null}

      {/* Loading */}
      {status === 'loading' && (
        <div className="text-center py-16">
          <div className="inline-block w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin mb-6" />
          <h3 className="font-playfair font-black text-2xl text-black mb-2">Analyserar er hemsida...</h3>
          <p className="text-black/50">Vi analyserar prestanda, SEO och tillgänglighet. Det tar cirka 15-30 sekunder.</p>
        </div>
      )}

      {/* Results */}
      {status === 'done' && results && (() => {
        const active = results[activeTab]
        return (
        <div>
          <div className="text-center mb-8">
            <h3 className="font-playfair font-black text-3xl text-black mb-2">Här är resultatet!</h3>
            <p className="text-black/55">Poängen visas på en skala från 0 till 100. 90+ är bra, 50-89 kan förbättras, under 50 behöver åtgärdas.</p>
          </div>

          {/* Mobile/Desktop tabs */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex bg-[#F8F8F8] rounded-full p-1">
              <button
                onClick={() => setActiveTab('mobile')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === 'mobile'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-black/50 hover:text-black/80'
                }`}
              >
                Mobil
              </button>
              <button
                onClick={() => setActiveTab('desktop')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === 'desktop'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-black/50 hover:text-black/80'
                }`}
              >
                Dator
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <ScoreCircle score={active.performance} label="Prestanda" />
            <ScoreCircle score={active.accessibility} label="Tillgänglighet" />
            <ScoreCircle score={active.seo} label="SEO" />
            <ScoreCircle score={active.bestPractices} label="Best Practices" />
          </div>

          {/* Interpret */}
          <div className="bg-[#F8F8F8] rounded-2xl p-6 mb-6">
            <h4 className="font-bold text-black mb-3">Vad betyder det här?</h4>
            <ul className="space-y-2 text-sm text-black/60">
              <li className="flex items-start gap-2">
                <span className="text-green-500 shrink-0 mt-0.5">●</span>
                <span><strong className="text-black">90-100:</strong> Utmärkt, er sida presterar bra på detta område</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 shrink-0 mt-0.5">●</span>
                <span><strong className="text-black">50-89:</strong> Kan förbättras, det finns tydliga möjligheter</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 shrink-0 mt-0.5">●</span>
                <span><strong className="text-black">0-49:</strong> Behöver åtgärdas, detta påverkar er synlighet och upplevelse negativt</span>
              </li>
            </ul>
          </div>

          {/* Top issues */}
          {active.issues.length > 0 && (
            <div className="bg-white border border-black/8 rounded-2xl p-6 mb-6">
              <h4 className="font-playfair font-black text-xl text-black mb-1">
                Vad bör ni åtgärda först?
              </h4>
              <p className="text-sm text-black/55 mb-5">
                De här områdena har störst påverkan på er sidas poäng på {activeTab === 'mobile' ? 'mobil' : 'dator'} just nu.
              </p>
              <ul className="space-y-3">
                {active.issues.map((issue) => (
                  <li
                    key={issue.id}
                    className="border border-black/6 rounded-xl p-4 hover:border-brand-green/40 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[issue.category]}`}
                      >
                        {issue.category}
                      </span>
                      <h5 className="font-bold text-black text-sm">{issue.title}</h5>
                    </div>
                    <p className="text-sm text-black/60 leading-relaxed">{issue.tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <div className="bg-black rounded-2xl p-6 text-center">
            <h4 className="font-playfair font-black text-xl text-white mb-2">
              Vill ni att vi tar hand om det?
            </h4>
            <p className="text-white/55 text-sm mb-5">
              {active.issues.length > 0
                ? `Vi går igenom alla ${active.issues.length} punkterna ovan tillsammans med er och tar fram en konkret plan för hur ni når högre poäng och bättre synlighet på Google.`
                : 'Vi hjälper er att hålla sidan i toppskick och stärka er synlighet på Google ytterligare.'}
            </p>
            <Link
              href="/kontakt"
              className="inline-flex items-center font-bold py-3 px-7 rounded-full text-black text-sm"
              style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
            >
              Boka en personlig genomgång →
            </Link>
          </div>

          <button
            onClick={() => { setStatus('idle'); setResults(null); setUrl(''); setEmail('') }}
            className="w-full mt-4 text-sm text-black/45 hover:text-black transition-colors py-2"
          >
            Testa en annan hemsida
          </button>
        </div>
      )})()}
    </div>
  )
}
