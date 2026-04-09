import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '../../_components/ScrollReveal'

const cases = {
  'ams-sweden': {
    client: 'AMS Sweden',
    site: 'amssweden.com',
    image: '/images/cases/AMS-AI-chat.webp',
    tags: ['AI', 'Chatbot', 'Automation'],
    tagline: 'AI-chatbot för servicetekniker i fält',
    challenge:
      'AMS Sveriges servicetekniker arbetar i fält och behöver snabba, exakta svar på tekniska frågor. Tidigare var de tvungna att ringa supportavdelningen — vilket skapade långa väntetider, avbrutna arbeten och frustrerade kunder. Manualer fanns men var svåra att söka i på mobilen.',
    solution:
      'Vi byggde en anpassad AI-chatbot tränad på AMS Sveriges kompletta bibliotek av tekniska manualer, felkodslista och FAQ. Chatboten integrerades i ett mobilvänligt gränssnitt som teknikerna kan komma åt direkt i fält. AI:n förstår kontextuella frågor och svarar på klarspråk — inte i manualsidor.',
    results: [
      '40% färre supportsamtal till kontoret',
      'Omedelbara svar 24/7 — tekniker slipper vänta',
      'Tränad på befintliga manualer utan extra arbete för personalen',
    ],
  },
  'hards-transport': {
    client: 'Hårds Transport',
    site: 'hardstransport.se',
    image: '/images/cases/hards-transport.webp',
    tags: ['Webb', 'Sociala medier'],
    tagline: 'Professionell digital närvaro för transportföretag',
    challenge:
      'Hårds Transport hade ingen digital närvaro alls. Potentiella kunder och chaufförer kunde inte hitta dem online, och utan hemsida eller sociala medier gick affärsmöjligheter förlorade. Behovet var tydligt: etablera en trovärdig och professionell närvaro snabbt.',
    solution:
      'Vi byggde en professionell hemsida som kommunicerar Hårds Transports tjänster, flottan och kontaktinformation tydligt. Parallellt satte vi upp och aktiverade Instagram och Facebook — med en innehållsstrategi som visar upp flottan, teamet och vardagen på ett sätt som attraherar både kunder och förare.',
    results: [
      '3× fler leads per månad jämfört med period utan digital närvaro',
      '500+ följare på sociala medier inom sex månader',
      'Etablerad digital närvaro som fungerar som digital CV',
    ],
  },
  'ljungby-fiber': {
    client: 'Ljungby Fiber',
    site: 'ljungbyfiber.se',
    image: '/images/cases/Ljungby-fiber.webp',
    tags: ['Webb', 'E-handel'],
    tagline: 'Digitalt beställningssystem för fiberanslutning',
    challenge:
      'Ljungby Fiber hade en föråldrad hemsida som inte stödde onlinebeställningar. Kunder som ville beställa fiber var tvungna att ringa eller besöka ett kontor — en friktion som ledde till uppgivna potentiella kunder och ökad arbetsbelastning på kundtjänst.',
    solution:
      'Vi skapade en modern, snabb hemsida med ett integrerat beställningssystem för fiberanslutning. Besökare kan nu kolla täckning, välja tjänst och beställa helt online. Systemet skickar automatiska bekräftelsemejl och hanterar kommunikation med kunden fram till installation.',
    results: [
      '80% av alla beställningar genomförs nu online',
      'Dramatiskt minskad belastning på kundtjänst',
      'Kortare ledtid från intresse till beställning',
    ],
  },
  molico: {
    client: 'Molico',
    site: 'molico.se',
    image: '/images/cases/molico-webbshop.webp',
    tags: ['Webb', 'Design', 'SEO', 'Sociala medier'],
    tagline: 'Komplett digital transformation',
    challenge:
      'Molico behövde en genomgripande digital transformation. De hade en föråldrad hemsida utan e-handelsfunktion, saknade en konsekvent grafisk identitet och hade ingen aktiv närvaro på sociala medier. Konkurrenterna vann marknadsandelar digitalt.',
    solution:
      'Vi tog ett helhetsgrepp: ny varumärkesprofil med logotyp, färgpalett och typografi. En modern webbshop byggdes från grunden med produktkatalog och integrerad betalning. Vi producerade produktkataloger i print och digitalt, startade och hanterade Instagram och Facebook, och lade en SEO-grundstrategi.',
    results: [
      'Dubbelt så hög onlineförsäljning inom ett år',
      '+120% organisk trafik via sökmotorer',
      'Konsekvent varumärkesupplevelse i alla kanaler',
    ],
  },
  pekuma: {
    client: 'Pekuma',
    site: 'pekuma.se',
    image: '/images/cases/Pekuma.webp',
    tags: ['Webb'],
    tagline: 'Professionell hemsida från grunden',
    challenge:
      'Pekuma hade ingen webbnärvaro alls. Potentiella kunder som sökte på deras namn eller tjänster online hittade ingenting — vilket underminerade trovärdigheten och ledde till missade affärsmöjligheter. Den lokala synligheten på Google var noll.',
    solution:
      'Vi skapade en ren, professionell hemsida som presenterar Pekumas tjänster, erfarenhet och kontaktinformation på ett lättnavigerat sätt. Hemsidan optimerades för lokala sökningar och registrerades på Google Business Profile för att etablera lokal SEO-närvaro direkt från start.',
    results: [
      'Etablerad digital närvaro från noll',
      'Syns i lokala Google-sökningar för relevanta tjänster',
      'Professionell onlinenärvaro som stärker varumärkets trovärdighet',
    ],
  },
  smefast: {
    client: 'Smefast',
    site: 'smefast.se',
    image: '/images/cases/Smefast-interaktiv-karta.webp',
    tags: ['Webb', 'Google Ads', 'Design'],
    tagline: 'Interaktiv lägenhetsmarknadsföring med digital räckvidd',
    challenge:
      'Smefast behövde marknadsföra ett bostadsprojekt och generera leads från potentiella köpare. Traditionell marknadsföring var otillräcklig — de behövde ett digitalt verktyg som engagerade besökare och hjälpte dem att visualisera och välja bland tillgängliga lägenheter.',
    solution:
      'Vi byggde en hemsida med ett unikt interaktivt lägenhetskartplugin — besökare kan klicka på specifika lägenheter i en 2D-planritning och direkt se storlek, pris, balkong och tillgänglighet. Vi kompletterade med Google Ads-kampanjer riktade mot bostadsköpare i regionen och social media-annonsering på Facebook och Instagram.',
    results: [
      'Snabbare bostadsförsäljning jämfört med liknande projekt',
      'Markant ökning av intresseanmälningar per vecka',
      'Det interaktiva kartverktyget sänkte antal frågor till säljteamet',
    ],
  },
}

export function generateStaticParams() {
  return Object.keys(cases).map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = cases[params.slug as keyof typeof cases]
  if (!c) return { title: 'Kundcase | JT Media Sweden' }
  return {
    title: `${c.client} — Kundcase | JT Media Sweden`,
    description: c.tagline,
  }
}

const tagColors: Record<string, string> = {
  AI: 'bg-purple-100 text-purple-700',
  Chatbot: 'bg-indigo-100 text-indigo-700',
  Automation: 'bg-blue-100 text-blue-700',
  Webb: 'bg-sky-100 text-sky-700',
  'Sociala medier': 'bg-pink-100 text-pink-700',
  'E-handel': 'bg-green-100 text-green-700',
  Design: 'bg-orange-100 text-orange-700',
  SEO: 'bg-yellow-100 text-yellow-700',
  'Google Ads': 'bg-red-100 text-red-700',
}

export default function KundcaseSlugPage({ params }: { params: { slug: string } }) {
  const c = cases[params.slug as keyof typeof cases]
  if (!c) return null

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#F8F8F8] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <Link
              href="/kundcase"
              className="inline-flex items-center gap-2 text-sm text-black/45 hover:text-black transition-colors mb-8"
            >
              ← Alla kundcase
            </Link>
            <div className="flex flex-wrap gap-2 mb-6">
              {c.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tagColors[tag] ?? 'bg-gray-100 text-gray-600'}`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-playfair font-black text-5xl md:text-6xl text-black mb-4 leading-tight">
              {c.client}
            </h1>
            <p className="text-xl text-black/55 mb-8">{c.tagline}</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="relative rounded-3xl overflow-hidden aspect-[16/7]">
              <Image
                src={c.image}
                alt={c.client}
                fill
                className="object-cover"
                priority
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Challenge */}
          <ScrollReveal>
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 font-bakerie text-sm bg-black text-white px-4 py-1.5 rounded-full mb-6">
                Utmaningen
              </div>
              <p className="text-lg text-black/65 leading-relaxed">
                {c.challenge}
              </p>
            </div>
          </ScrollReveal>

          {/* Solution */}
          <ScrollReveal>
            <div className="mb-16">
              <div
                className="inline-flex items-center gap-2 font-bakerie text-sm text-black px-4 py-1.5 rounded-full mb-6"
                style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
              >
                Vår lösning
              </div>
              <p className="text-lg text-black/65 leading-relaxed">
                {c.solution}
              </p>
            </div>
          </ScrollReveal>

          {/* Results */}
          <ScrollReveal>
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 font-bakerie text-sm bg-brand-green/15 text-black px-4 py-1.5 rounded-full mb-6">
                Resultat
              </div>
              <ul className="space-y-4">
                {c.results.map((r) => (
                  <li key={r} className="flex items-start gap-4 bg-[#F8F8F8] rounded-2xl p-5">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
                    >
                      <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-black/75 leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Live link */}
          <ScrollReveal>
            <div className="flex items-center gap-4 p-6 bg-[#F8F8F8] rounded-2xl">
              <div>
                <p className="text-sm text-black/40 mb-1">Se live</p>
                <a
                  href={`https://${c.site}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black font-semibold hover:text-brand-green-dark transition-colors"
                >
                  {c.site} ↗
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="font-playfair font-black text-4xl md:text-5xl text-white mb-6">
              Vill du ha liknande resultat?
            </h2>
            <p className="text-white/55 text-lg mb-10">
              Kontakta oss för ett kostnadsfritt samtal om vad vi kan göra för er.
            </p>
            <Link
              href="/kontakt"
              className="inline-flex items-center font-bold py-4 px-8 rounded-full text-black"
              style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
            >
              Kontakta oss →
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
