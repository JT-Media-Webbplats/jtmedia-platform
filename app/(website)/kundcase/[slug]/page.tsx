import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
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
      'AMS Swedens servicetekniker arbetar ute hos kund och behöver snabba, exakta svar på allt från pressar och bultar till specifika mått på deras produkter. Tidigare innebar det ofta ett samtal till kontoret, där någon fick leta reda på svaret i den interna dokumentationen och ringa tillbaka. Det skapade onödiga väntetider mitt i arbetet och tog tid från flera personer i kedjan.',
    solution:
      'Vi byggde en anpassad AI-chatbot tränad på AMS Swedens kompletta bibliotek av tekniska manualer, felkodslista och FAQ. Chatboten integrerades i ett mobilvänligt gränssnitt som teknikerna kan komma åt direkt i fält. AI:n förstår kontextuella frågor och svarar på klarspråk, inte i manualsidor.',
    results: [
      'Egenutvecklad AI-chatbot byggd specifikt för AMS Sweden och deras dokumentation',
      'Servicetekniker får svar direkt utan att behöva ringa kontoret, med hänvisning till källan',
      'Sparar tid både för teknikerna i fält och personalen på kontoret',
    ],
  },
  'hards-transport': {
    client: 'Hårds Transport',
    site: 'hardstransport.se',
    image: '/images/clients/hards_transport_mockup.webp',
    tags: ['Webb', 'SEO', 'Sociala medier'],
    tagline: 'Professionell digital närvaro för transportföretag',
    challenge:
      'Hårds Transport hade en föråldrad hemsida och låg aktivitet på sociala medier. Den digitala närvaron speglade inte vilket företag de faktiskt är, vilket gjorde det svårt för potentiella kunder och chaufförer att hitta dem och få en bra bild av verksamheten online.',
    solution:
      'Sommaren 2022 inledde vi samarbetet och byggde en helt ny hemsida med tydligt fokus på sökmotoroptimering, så att Hårds Transport syns när rätt personer söker. Vi tog samtidigt över deras sociala medier och har sedan dess skött både hemsidan och de sociala kanalerna löpande.',
    results: [
      'Helt ny hemsida byggd med SEO som grund',
      'Markant ökad digital närvaro sedan vi tog över',
      'Pågående samarbete sedan sommaren 2022 där vi sköter både hemsida och sociala medier',
    ],
  },
  'ljungby-fiber': {
    client: 'Ljungby Fiber',
    site: 'ljungbyfiber.se',
    image: '/images/clients/ljungby_fiber_mockup.webp',
    tags: ['Webb', 'E-handel'],
    tagline: 'Digitalt beställningssystem för fiberanslutning',
    challenge:
      'Ljungby Fiber hade en hemsida sedan tidigare, men den fungerade inte som de behövde. Det var svårt för kunder att göra det de faktiskt kom till sajten för, och beställningsflödet behövde tänkas om från grunden för att passa hur fiber säljs i regionen.',
    solution:
      'Vi byggde en helt ny hemsida som lanserades i maj 2025. Tillsammans med Ljungby Fiber arbetade vi fram exakt hur beställningsflödet skulle fungera i praktiken. Kunden kan beställa fiber direkt online, lägga till tillval som router, och se priser som anpassas efter var i länet adressen ligger. Det var en av de mer utmanande delarna i projektet, att få beställningslogiken att hänga ihop med deras prissättningsmodell.',
    results: [
      'Helt ny hemsida lanserad i maj 2025',
      'Beställning av fiberanslutning kan göras direkt online',
      'Smart prisberäkning som anpassas efter adress och tillval',
    ],
  },
  molico: {
    client: 'Molico',
    site: 'molico.se',
    image: '/images/clients/molico_mockup.webp',
    tags: ['Webb', 'SEO', 'Sociala medier', 'Google Ads'],
    tagline: 'Ett stort kliv in i digital försäljning',
    challenge:
      'Molico hade en hemsida med webbshop, men onlineförsäljningen stod helt stilla. Sortimentet fanns, men plattformen och kanalerna runt omkring drev inga affärer. Det digitala var en outnyttjad möjlighet snarare än en intäktskanal.',
    solution:
      'Sedan sommaren 2024 har vi byggt om Molicos webbshop från grunden. Idag rymmer den över 100 produkter fördelade på flera kategorier, vilket krävde ett genomtänkt arbete med struktur, navigation och produktinformation för att hålla det överskådligt även när sortimentet växer. Parallellt arbetar vi löpande med SEO, sociala medier samt Google Ads och Meta-annonser för att driva trafik och försäljning till shoppen.',
    results: [
      'Webbshop med 100+ produkter och en struktur som tål att växa',
      'Digital försäljning som faktiskt rullar, från stillastående till aktiv intäktskanal',
      'Pågående samarbete sedan sommaren 2024 där vi sköter SEO, annonsering och sociala medier',
    ],
  },
  pekuma: {
    client: 'Pekuma',
    site: 'pekuma.se',
    image: '/images/clients/pekuma_mockup.webp',
    tags: ['Webb', 'SEO'],
    tagline: 'Tydlig struktur för tre verksamhetsområden',
    challenge:
      'Pekuma hade en hemsida sedan tidigare, men den var rörig och svår att navigera. Besökare hade svårt att hitta det de letade efter, och det blev onödig friktion mellan intresse och information för en verksamhet som täcker tre ganska olika områden.',
    solution:
      'Vi byggde en helt ny hemsida som lanserades i mars 2025, uppdelad i tre tydliga delar för Pekumas verksamhetsområden: VA, Trafik och Speglar. Allt ligger under samma tak, men varje område har sin egen ingång och struktur så att besökaren direkt ser vart hen ska gå och hittar rätt information snabbt. Sedan lansering arbetar vi löpande med hemsidans SEO och synlighet i sökmotorerna.',
    results: [
      'Ny hemsida lanserad i mars 2025 med tre tydliga ingångar för VA, Trafik och Speglar',
      'Bättre digital närvaro på Google och mer trafik än tidigare',
      'Pågående SEO-arbete sedan lansering',
    ],
  },
  smefast: {
    client: 'Smefast',
    site: 'smefast.se',
    image: '/images/clients/smefast_mockup.webp',
    tags: ['Webb', 'SEO', 'Google Ads', 'Sociala medier'],
    tagline: 'Interaktiv lägenhetskarta i en bredare digital satsning',
    challenge:
      'Smefast hade behov av att bygga upp sin digitala närvaro från flera håll samtidigt. Hemsidan, sociala medier och synlighet i sökmotorer behövde få ett samlat grepp, och längre fram tillkom också utmaningen att presentera lediga lägenheter på ett sätt där besökare snabbt kunde se vad som fanns tillgängligt och var.',
    solution:
      'Samarbetet startade i augusti 2022 med arbete kring sociala medier, och har sedan dess vuxit till ett bredare grepp där vi byggt om hemsidan, arbetar löpande med deras SEO och Google Ads, och utvecklat en interaktiv lägenhetskarta som lanserades i början av 2026. Kartan låter besökare välja ett område de är intresserade av och direkt se vilka lägenheter som finns tillgängliga där, med fullständig information och bilder för varje objekt.',
    results: [
      'Helt ombyggd hemsida med interaktiv lägenhetskarta lanserad i början av 2026',
      'Lediga lägenheter visas tydligt med bilder och fullständig information per objekt',
      'Pågående samarbete sedan augusti 2022 med hemsida, sociala medier, SEO och Google Ads',
    ],
  },
}

export function generateStaticParams() {
  return Object.keys(cases).map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = cases[params.slug as keyof typeof cases]
  if (!c) return { title: 'Kundcase | JT Media AB' }
  return {
    title: `${c.client}, Kundcase | JT Media AB`,
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
  if (!c) notFound()

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#F8F8F8] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal variant="fade-up">
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
          <ScrollReveal variant="fade-up" delay={150}>
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
          <ScrollReveal variant="slide-right">
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
          <ScrollReveal variant="scale-in">
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
          <ScrollReveal variant="blur-in">
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 font-bakerie text-sm bg-brand-green/15 text-black px-4 py-1.5 rounded-full mb-6">
                Resultat
              </div>
              <ul className="space-y-4">
                {c.results.map((r, i) => (
                  <ScrollReveal key={r} delay={i * 80} variant="blur-in">
                    <li className="flex items-start gap-4 bg-[#F8F8F8] rounded-2xl p-5">
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
                  </ScrollReveal>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Live link */}
          <ScrollReveal variant="slide-left">
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
          <ScrollReveal variant="fade-up-soft">
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
