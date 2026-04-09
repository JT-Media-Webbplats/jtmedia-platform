import type { Metadata } from 'next'
import Link from 'next/link'
import ScrollReveal from '../../_components/ScrollReveal'

export const metadata: Metadata = {
  title: 'Google Ads-hantering | JT Media Sweden',
  description:
    'Professionell Google Ads-hantering som ger resultat från dag ett. Sökannonsering, shopping, remarketing och lokala kampanjer för svenska företag.',
}

const cities = [
  { slug: 'ljungby', name: 'Ljungby' },
  { slug: 'varnamo', name: 'Värnamo' },
  { slug: 'vaxjo', name: 'Växjö' },
  { slug: 'markaryd', name: 'Markaryd' },
  { slug: 'halmstad', name: 'Halmstad' },
  { slug: 'helsingborg', name: 'Helsingborg' },
  { slug: 'jonkoping', name: 'Jönköping' },
  { slug: 'almhult', name: 'Älmhult' },
  { slug: 'lagan', name: 'Lagan' },
  { slug: 'lessebo', name: 'Lessebo' },
]

const adServices = [
  {
    icon: '🔍',
    title: 'Sökannonsering',
    desc: 'Syns direkt när potentiella kunder söker efter er produkt eller tjänst. Vi optimerar budgivning och text för maximal relevans och lägsta möjliga kostnad per klick.',
  },
  {
    icon: '🛍️',
    title: 'Shoppingannonser',
    desc: 'Visa era produkter med bild, pris och recensioner direkt i sökresultaten. Perfekt för e-handelsföretag som vill öka försäljningen.',
  },
  {
    icon: '🔄',
    title: 'Remarketing',
    desc: 'Nå tillbaka besökare som inte konverterade. Smarta remarketingkampanjer påminner potentiella kunder och driver dem tillbaka till er sida.',
  },
  {
    icon: '📍',
    title: 'Lokala kampanjer',
    desc: 'Nå kunder i ert lokalområde när de söker efter lokala tjänster. Google Local Campaigns och Maps-annonser som driver besök och samtal.',
  },
]

const whyUs = [
  'Certifierade Google Ads-specialister',
  'Daglig optimering av kampanjer',
  'Transparenta rapporter utan krångel',
  'Ingen inlåsning — ni äger era kampanjer',
  'Månadsvis resultatgenomgång',
  'Kostnadsfri startanalys',
]

export default function GoogleAdsPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#F8F8F8] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <ScrollReveal>
              <span className="inline-block font-bakerie text-sm bg-brand-green/20 text-black px-4 py-1.5 rounded-full mb-6">
                Google Ads
              </span>
              <h1 className="font-playfair font-black text-5xl md:text-6xl lg:text-7xl text-black mb-6 leading-tight">
                Google Ads som ger resultat från dag ett
              </h1>
              <p className="text-xl text-black/55 leading-relaxed mb-10">
                Medan SEO tar tid, levererar Google Ads trafik direkt. Vi skapar, optimerar och sköter era kampanjer så att varje krona ni investerar ger maximalt tillbaka.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center font-bold py-3.5 px-7 rounded-full text-black"
                  style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
                >
                  Kom igång →
                </Link>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center font-semibold py-3.5 px-7 rounded-full border-2 border-black text-black hover:bg-black hover:text-white transition-colors"
                >
                  Gratis analys
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-4">
                Annonsformat vi hanterar
              </h2>
              <p className="text-black/55 text-lg max-w-xl mx-auto">
                Vi väljer rätt format baserat på era mål och er budget.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adServices.map((s, i) => (
              <ScrollReveal key={s.title} delay={i * 70}>
                <div className="bg-[#F8F8F8] rounded-3xl p-8 h-full">
                  <div className="text-4xl mb-5">{s.icon}</div>
                  <h3 className="font-playfair font-black text-xl text-black mb-3">{s.title}</h3>
                  <p className="text-black/55 leading-relaxed">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why JT Media */}
      <section className="bg-black py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-white mb-6">
                Varför JT Media för Google Ads?
              </h2>
              <p className="text-white/55 text-lg leading-relaxed mb-8">
                Fel hanterade Google Ads bränner pengar utan att ge resultat. Vi säkerställer att varje kampanj är optimerad för er specifika målgrupp, dina sökord och er budget.
              </p>
              <ul className="space-y-3">
                {whyUs.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-white/70 text-sm">
                    <span className="text-brand-green shrink-0 mt-0.5">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '4×', label: 'Genomsnittlig ROAS', sub: 'Return on ad spend' },
                  { value: '-35%', label: 'Lägre CPC', sub: 'Kostnad per klick' },
                  { value: '48h', label: 'Kampanjstart', sub: 'Från godkänd brief' },
                  { value: '100%', label: 'Transparens', sub: 'Ni ser allt' },
                ].map((s, i) => (
                  <div key={s.label} className="bg-white/8 rounded-2xl p-6 text-center">
                    <div className="font-playfair font-black text-4xl text-brand-green mb-1">{s.value}</div>
                    <div className="text-white text-sm font-semibold mb-0.5">{s.label}</div>
                    <div className="text-white/40 text-xs">{s.sub}</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* City links */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-playfair font-black text-3xl md:text-4xl text-black mb-4">
                Google Ads i hela södra Sverige
              </h2>
              <p className="text-black/55 max-w-xl mx-auto">
                Lokala Google Ads-kampanjer som når rätt kunder i rätt stad.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/google-ads/${city.slug}`}
                className="bg-[#F8F8F8] rounded-2xl border border-black/6 hover:shadow-md hover:-translate-y-0.5 transition-all p-4 text-center text-sm font-semibold text-black/70 hover:text-black"
              >
                Google Ads {city.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="font-playfair font-black text-4xl md:text-5xl text-white mb-6">
              Redo att synas på dag ett?
            </h2>
            <p className="text-white/55 text-lg mb-10">
              Vi gör en kostnadsfri analys av ert nuvarande läge och visar hur vi kan förbättra era resultat.
            </p>
            <Link
              href="/kontakt"
              className="inline-flex items-center font-bold py-4 px-8 rounded-full text-black"
              style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
            >
              Boka kostnadsfri analys →
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
