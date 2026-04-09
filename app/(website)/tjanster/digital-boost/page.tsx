import type { Metadata } from 'next'
import Link from 'next/link'
import ScrollReveal from '../../_components/ScrollReveal'

export const metadata: Metadata = {
  title: 'Digital Boost — Fullständigt Digitalpaket | JT Media Sweden',
  description:
    'Digital Boost är allt ni behöver för att växa digitalt — webb, SEO, sociala medier och design i ett samlat paket. Perfekt för företag som vill ta ett stort kliv digitalt.',
}

const included = [
  {
    icon: '🌐',
    title: 'Ny hemsida',
    desc: 'En modern, responsiv hemsida byggd för konvertering och SEO — inklusive CMS så ni enkelt kan uppdatera innehållet.',
  },
  {
    icon: '📈',
    title: 'SEO-grundläggning',
    desc: 'Teknisk SEO-revision, sökordsanalys och optimering av er hemsida för att synas bättre på Google.',
  },
  {
    icon: '📱',
    title: 'Sociala medier',
    desc: 'Profiluppsättning och strategi för Instagram och Facebook — plus de första månadsinnehållen klara att publicera.',
  },
  {
    icon: '🎨',
    title: 'Grafisk design',
    desc: 'Logotyp eller uppdatering av befintlig logo, färgpalett, typsnitt och grundläggande grafisk profil.',
  },
  {
    icon: '📊',
    title: 'Google Analytics & spårning',
    desc: 'Korrekt inställd spårning så ni vet exakt varifrån era besökare och kunder kommer.',
  },
  {
    icon: '🤝',
    title: 'Personlig onboarding',
    desc: 'Vi går igenom allt med er och ser till att ni vet hur ni använder era nya digitala tillgångar.',
  },
]

const forWho = [
  {
    title: 'Nystartat företag',
    desc: 'Ni behöver allt från grunden och vill komma igång snabbt utan att tänka på vad ni behöver.',
  },
  {
    title: 'Företag som relanserats',
    desc: 'Ny inriktning, ny ägare eller ny varumärkesprofil — ni behöver uppdatera hela er digitala närvaro.',
  },
  {
    title: 'Lokalt företag som vill växa',
    desc: 'Ni har kört på rutin länge och är redo att satsa på digital tillväxt för att nå fler kunder.',
  },
]

export default function DigitalBoostPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="py-20 md:py-28" style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <ScrollReveal>
            <span className="inline-block font-bakerie text-sm bg-black/10 text-black px-4 py-1.5 rounded-full mb-6">
              Digital Boost
            </span>
            <h1 className="font-playfair font-black text-5xl md:text-6xl lg:text-7xl text-black mb-6 leading-tight">
              Allt du behöver för att växa digitalt
            </h1>
            <p className="text-xl text-black/65 leading-relaxed mb-10 max-w-2xl mx-auto">
              Digital Boost är ett komplett paket som tar er från noll till en stark digital närvaro — ny hemsida, SEO, sociala medier och grafisk design, allt koordinerat av oss.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/kontakt"
                className="inline-flex items-center font-bold py-3.5 px-7 rounded-full bg-black text-white hover:bg-black/80 transition-colors"
              >
                Berätta mer →
              </Link>
              <Link
                href="/kundcase"
                className="inline-flex items-center font-semibold py-3.5 px-7 rounded-full border-2 border-black text-black hover:bg-black hover:text-white transition-colors"
              >
                Se kundcase
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* What's included */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-4">
                Vad ingår i Digital Boost?
              </h2>
              <p className="text-black/55 text-lg max-w-xl mx-auto">
                Ett komplett digitalpaket — allt koordinerat av JT Media utan att ni behöver hålla i trådar.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {included.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 60}>
                <div className="bg-[#F8F8F8] rounded-3xl p-7 h-full">
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <h3 className="font-playfair font-black text-lg text-black mb-2">{item.title}</h3>
                  <p className="text-black/55 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-[#F8F8F8] py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-4">
                För vem är Digital Boost?
              </h2>
              <p className="text-black/55 text-lg max-w-xl mx-auto">
                Perfekt för företag som vill ta ett samlat grepp om sin digitala närvaro.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {forWho.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 80}>
                <div className="bg-white rounded-3xl p-8 h-full border border-black/6 shadow-sm text-center">
                  <h3 className="font-playfair font-black text-xl text-black mb-3">{item.title}</h3>
                  <p className="text-black/55 leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing note */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-6">
                Hur fungerar det i praktiken?
              </h2>
              <p className="text-black/60 text-lg leading-relaxed mb-6">
                Vi börjar med ett möte för att förstå er verksamhet, era mål och er målgrupp. Sedan tar vi fram en plan och börjar leverera — i en ordning som passar er.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  { step: '1', text: 'Kostnadsfritt startmöte — vi lyssnar och förstår er situation' },
                  { step: '2', text: 'Vi presenterar en anpassad plan och tidsplan' },
                  { step: '3', text: 'Leverans i etapper — ni ser resultat tidigt' },
                  { step: '4', text: 'Löpande uppföljning och optimering' },
                ].map((item) => (
                  <li key={item.step} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-black font-bold text-sm shrink-0">
                      {item.step}
                    </div>
                    <span className="text-black/65 leading-relaxed pt-1">{item.text}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/kontakt"
                className="inline-flex items-center font-bold py-3.5 px-7 rounded-full text-black"
                style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
              >
                Boka startmöte →
              </Link>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="bg-black rounded-3xl p-10 text-white">
                <div className="text-4xl mb-6">💡</div>
                <h3 className="font-playfair font-black text-2xl mb-4">
                  Investera i tillväxt, inte i administration
                </h3>
                <p className="text-white/60 leading-relaxed mb-6">
                  Många företag lägger tid på att koordinera webb-byrå, designer, SEO-konsult och social media-ansvarig var för sig. Med Digital Boost är allt hos oss — ni har en faktura, en kontaktperson och ett mål.
                </p>
                <div className="border-t border-white/10 pt-6">
                  <p className="text-brand-green font-bold text-sm">
                    "Digital Boost tog oss från ingenting till en komplett digital närvaro på 6 veckor."
                  </p>
                  <p className="text-white/40 text-xs mt-2">— Kund inom transport, Ljungby</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="font-playfair font-black text-4xl md:text-5xl text-white mb-6">
              Ta ett stort kliv digitalt — idag
            </h2>
            <p className="text-white/55 text-lg mb-10">
              Kontakta oss för ett kostnadsfritt samtal om hur Digital Boost kan fungera för ert företag.
            </p>
            <Link
              href="/kontakt"
              className="inline-flex items-center font-bold py-4 px-8 rounded-full text-black"
              style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
            >
              Kom igång →
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
