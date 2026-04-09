import type { Metadata } from 'next'
import Link from 'next/link'
import ScrollReveal from '../../_components/ScrollReveal'

export const metadata: Metadata = {
  title: 'SEO-tjänster i Sverige | JT Media Sweden',
  description:
    'Syns på Google och få fler kunder med professionell SEO. Teknisk SEO, lokal SEO, innehållsstrategi och länkbyggnad för svenska företag.',
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

const seoServices = [
  {
    icon: '⚙️',
    title: 'Teknisk SEO',
    desc: 'Hastighet, mobilanpassning, strukturerad data och crawlbarhet. Vi ser till att Google kan läsa och indexera er sida optimalt.',
  },
  {
    icon: '✍️',
    title: 'Innehållsstrategi',
    desc: 'Rätt sökord, rätt innehåll och rätt struktur. Vi researchar vad era potentiella kunder söker efter och skapar innehåll som rankar.',
  },
  {
    icon: '📍',
    title: 'Lokal SEO',
    desc: 'Syns i Google Maps och lokala sökningar. Optimering av Google Business Profile och lokal länkbyggnad för fler lokala kunder.',
  },
  {
    icon: '🔗',
    title: 'Länkbyggnad',
    desc: 'Kvalitetslänkar från relevanta svenska sajter ökar er domänauktoritet och förbättrar rankingen för konkurrenskraftiga sökord.',
  },
]

export default function SEOPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#F8F8F8] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <ScrollReveal>
              <span className="inline-block font-bakerie text-sm bg-brand-green/20 text-black px-4 py-1.5 rounded-full mb-6">
                SEO
              </span>
              <h1 className="font-playfair font-black text-5xl md:text-6xl lg:text-7xl text-black mb-6 leading-tight">
                Syns på Google — mer trafik, fler kunder
              </h1>
              <p className="text-xl text-black/55 leading-relaxed mb-10">
                93% av alla köpbeslut börjar med en sökning på Google. Vi ser till att era potentiella kunder hittar er — och ingen annan — när de söker efter det ni erbjuder.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/seo-test"
                  className="inline-flex items-center font-bold py-3.5 px-7 rounded-full text-black"
                  style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
                >
                  Testa er SEO gratis →
                </Link>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center font-semibold py-3.5 px-7 rounded-full border-2 border-black text-black hover:bg-black hover:text-white transition-colors"
                >
                  Kontakta oss
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-4">
                Hur vi jobbar med SEO
              </h2>
              <p className="text-black/55 text-lg max-w-xl mx-auto">
                SEO är ett maraton, inte ett sprinterlopp. Vi bygger en stabil grund och förbättrar kontinuerligt.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {seoServices.map((s, i) => (
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

      {/* Results */}
      <section className="bg-black py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-white mb-4">
                Vad ni kan förvänta er
              </h2>
              <p className="text-white/50 text-lg max-w-xl mx-auto">
                Typiska resultat efter 3–6 månaders SEO-arbete.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '+120%', label: 'Organisk trafik' },
              { value: 'Top 3', label: 'Lokala sökord' },
              { value: '3–6 mån', label: 'Till synliga resultat' },
              { value: '100%', label: 'Rapporttransparens' },
            ].map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 70}>
                <div className="text-center">
                  <div className="font-playfair font-black text-5xl text-brand-green mb-2">{s.value}</div>
                  <div className="text-white/50 text-sm">{s.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Test CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="bg-[#F8F8F8] rounded-3xl p-10 md:p-16 text-center">
              <h2 className="font-playfair font-black text-3xl md:text-4xl text-black mb-4">
                Hur mår er hemsida just nu?
              </h2>
              <p className="text-black/55 text-lg mb-8 max-w-xl mx-auto">
                Analysera er hemsidas prestanda, SEO och tillgänglighet på 30 sekunder — helt gratis.
              </p>
              <Link
                href="/seo-test"
                className="inline-flex items-center font-bold py-4 px-8 rounded-full text-black"
                style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
              >
                Starta gratis SEO-test →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* City links */}
      <section className="bg-[#F8F8F8] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-playfair font-black text-3xl md:text-4xl text-black mb-4">
                SEO i hela södra Sverige
              </h2>
              <p className="text-black/55 max-w-xl mx-auto">
                Vi hjälper företag att synas lokalt — oavsett var ni finns.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/seo/${city.slug}`}
                className="bg-white rounded-2xl border border-black/6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-4 text-center text-sm font-semibold text-black/70 hover:text-black"
              >
                SEO {city.name}
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
              Låt oss ta er till toppen av Google
            </h2>
            <p className="text-white/55 text-lg mb-10">
              Kontakta oss för ett kostnadsfritt SEO-samtal och ta reda på var ni kan förbättra er.
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
