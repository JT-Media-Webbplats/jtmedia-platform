import type { Metadata } from 'next'
import Link from 'next/link'
import ScrollReveal from '../../_components/ScrollReveal'

const cities: Record<string, { name: string; intro: string; seoContext: string; metaDesc: string }> = {
  ljungby: {
    name: 'Ljungby',
    intro: 'Ljungby är en växande stad i hjärtat av Småland med ett starkt lokalt näringsliv.',
    seoContext:
      'Lokal SEO i Ljungby handlar om att synas när invånare och företag i regionen söker efter era produkter och tjänster. Vi optimerar er för de sökord som faktiskt används i Ljungby och Kronoberg.',
    metaDesc: 'SEO i Ljungby — JT Media Sweden hjälper lokala företag att synas på Google. Lokal SEO, teknisk optimering och innehållsstrategi för Ljungbyföretag.',
  },
  varnamo: {
    name: 'Värnamo',
    intro: 'Värnamo är känd som möbelstaden och har ett aktivt företagsklimat inom handel och industri.',
    seoContext:
      'I Värnamos konkurrenskraftiga marknad är synlighet på Google avgörande. Vi hjälper möbelföretag, industri och handel att ranka för de sökord som deras kunder faktiskt använder.',
    metaDesc: 'SEO i Värnamo — professionell sökmotoroptimering för Värnamo-företag. JT Media Sweden driver organisk trafik och fler kunder via Google.',
  },
  vaxjo: {
    name: 'Växjö',
    intro: 'Växjö är Kronobergs länshuvudstad med ett blomstrande universitetssamhälle och mångfacetterat näringsliv.',
    seoContext:
      'Växjös stora och välutbildade befolkning söker aktivt efter lokala tjänster och produkter online. Med rätt SEO-strategi kan ert företag fånga den trafiken och konvertera den till kunder.',
    metaDesc: 'SEO i Växjö — JT Media Sweden optimerar Växjöföretags Google-synlighet. Lokal SEO, teknisk SEO och innehåll som rankar.',
  },
  markaryd: {
    name: 'Markaryd',
    intro: 'Markaryd är en liten men aktiv gränsstad med stark koppling till Skånemarknaden.',
    seoContext:
      'Markaryds geografiska läge ger er möjlighet att nå kunder från båda sidor om länsgränsen. Med lokal SEO kan vi se till att ni syns både i Kronoberg och i angränsande Skåne.',
    metaDesc: 'SEO i Markaryd — lokal sökmotoroptimering för Markaryd-företag av JT Media Sweden. Syns på Google, nå fler kunder.',
  },
  halmstad: {
    name: 'Halmstad',
    intro: 'Halmstad är Hallands residensstad med en stor och varierad företagsbas nära kusten.',
    seoContext:
      'Halmstads blandning av turism, handel och industri skapar unika SEO-möjligheter. Vi identifierar de söktermer som dina potentiella kunder i Halmstad och Halland använder och bygger en strategi runt dem.',
    metaDesc: 'SEO i Halmstad — JT Media Sweden driver organisk trafik för Halmstadföretag. Lokal SEO och Google-optimering som ger resultat.',
  },
  helsingborg: {
    name: 'Helsingborg',
    intro: 'Helsingborg är en av Sveriges mest dynamiska städer med en starkt tillväxtorienterad ekonomi.',
    seoContext:
      'Helsingborgs konkurrensutsatta marknad kräver en aggressiv SEO-strategi. Vi analyserar konkurrenterna och hittar möjligheterna där ert företag kan ta marknadsandelar via organisk söktrafik.',
    metaDesc: 'SEO i Helsingborg — professionell sökmotoroptimering av JT Media Sweden. Teknisk SEO och innehållsstrategi för Helsingborgsföretag.',
  },
  jonkoping: {
    name: 'Jönköping',
    intro: 'Jönköping är ett regionalt centrum i södra Sverige med ett starkt fokus på handel och logistik.',
    seoContext:
      'Som regionalt centrum har Jönköping en stark lokalsökning. Företag som rankar högt för relevanta Jönköpingssökningar når kunder från hela regionen, inte bara staden.',
    metaDesc: 'SEO i Jönköping — JT Media Sweden hjälper Jönköpingsföretag att synas på Google. Lokal SEO och organisk tillväxt för hela regionen.',
  },
  almhult: {
    name: 'Älmhult',
    intro: 'Älmhult är IKEAs hemstad — en innovativ industristad med internationell närvaro.',
    seoContext:
      'Älmhultsandan om enkelhet och funktionalitet gäller även SEO. Vi arbetar strukturerat och effektivt med sökordsanalys, teknisk optimering och innehåll som rankar — och mäter allt.',
    metaDesc: 'SEO i Älmhult — lokal sökmotoroptimering för Älmhults-företag av JT Media Sweden. Google-synlighet som ger verkliga resultat.',
  },
  lagan: {
    name: 'Lagan',
    intro: 'Lagan är ett litet samhälle i Ljungby kommun med lokala företag som behöver digital närvaro.',
    seoContext:
      'Små samhällen som Lagan har ofta låg konkurrens i sökresultaten — vilket innebär stora möjligheter. Vi hjälper lokala Laganföretag att dominera sökresultaten för relevanta termer.',
    metaDesc: 'SEO i Lagan — JT Media Sweden hjälper lokala Lagan-företag att synas på Google. Lokal SEO med snabba resultat.',
  },
  lessebo: {
    name: 'Lessebo',
    intro: 'Lessebo är känt för sin glasindustri och har ett aktivt lokalt näringsliv som växer digitalt.',
    seoContext:
      'Lessebos unika industriella arv skapar nischade SEO-möjligheter. Vi hjälper er att hitta de specifika söktermer som era potentiella kunder använder och optimerar er närvaro för dem.',
    metaDesc: 'SEO i Lessebo — professionell sökmotoroptimering för Lessebo-företag av JT Media Sweden. Syns på Google och nå fler kunder.',
  },
}

export function generateStaticParams() {
  return Object.keys(cities).map((stad) => ({ stad }))
}

export function generateMetadata({ params }: { params: { stad: string } }): Metadata {
  const city = cities[params.stad]
  if (!city) return { title: 'SEO | JT Media Sweden' }
  return {
    title: `SEO i ${city.name} | Sökmotoroptimering | JT Media Sweden`,
    description: city.metaDesc,
  }
}

export default function SEOStadPage({ params }: { params: { stad: string } }) {
  const city = cities[params.stad]
  if (!city) return null

  return (
    <div className="bg-white">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'JT Media Sweden',
            description: `SEO och sökmotoroptimering i ${city.name}`,
            url: 'https://jtmediasweden.com',
            telephone: '+46767680202',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Stationsgatan 2',
              addressLocality: 'Ljungby',
              postalCode: '341 60',
              addressCountry: 'SE',
            },
            areaServed: city.name,
            serviceType: 'SEO och sökmotoroptimering',
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-[#F8F8F8] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <ScrollReveal>
              <span className="inline-block font-bakerie text-sm bg-brand-green/20 text-black px-4 py-1.5 rounded-full mb-6">
                SEO — {city.name}
              </span>
              <h1 className="font-playfair font-black text-5xl md:text-6xl lg:text-7xl text-black mb-6 leading-tight">
                SEO i {city.name}
              </h1>
              <p className="text-xl text-black/55 leading-relaxed mb-4">
                {city.intro}
              </p>
              <p className="text-lg text-black/50 leading-relaxed mb-10">
                {city.seoContext}
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

      {/* What's included */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-4">
                Vad ingår i vår SEO?
              </h2>
              <p className="text-black/55 text-lg max-w-xl mx-auto">
                En komplett SEO-strategi anpassad för er marknad i {city.name}.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '⚙️', title: 'Teknisk SEO-revision', desc: 'Vi granskar er hemsida från grunden — hastighet, indexering, mobilanpassning och strukturerad data.' },
              { icon: '🔑', title: 'Lokal sökordsanalys', desc: `Vi identifierar vad kunder i ${city.name} och regionen söker efter och bygger er strategi kring det.` },
              { icon: '✍️', title: 'SEO-anpassat innehåll', desc: 'Texter och sidor optimerade för rätt sökord — med fokus på läsbarhet och konvertering.' },
              { icon: '📍', title: 'Google Business Profile', desc: `Optimering av er Google-profil för bättre synlighet i lokala sökningar och Google Maps i ${city.name}.` },
            ].map((s, i) => (
              <ScrollReveal key={s.title} delay={i * 70}>
                <div className="bg-[#F8F8F8] rounded-3xl p-8">
                  <div className="text-4xl mb-5">{s.icon}</div>
                  <h3 className="font-playfair font-black text-xl text-black mb-3">{s.title}</h3>
                  <p className="text-black/55 leading-relaxed">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="bg-[#F8F8F8] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="font-playfair font-black text-2xl md:text-3xl text-black mb-3">
                Fler digitala tjänster i {city.name}
              </h2>
            </div>
          </ScrollReveal>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/hemsida/${params.stad}`}
              className="bg-white rounded-2xl border border-black/8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all px-6 py-4 font-semibold text-black/70 hover:text-black"
            >
              Hemsida i {city.name} →
            </Link>
            <Link
              href={`/google-ads/${params.stad}`}
              className="bg-white rounded-2xl border border-black/8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all px-6 py-4 font-semibold text-black/70 hover:text-black"
            >
              Google Ads i {city.name} →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="font-playfair font-black text-4xl md:text-5xl text-white mb-6">
              Börja synas i {city.name} — idag
            </h2>
            <p className="text-white/55 text-lg mb-10">
              Testa er nuvarande SEO gratis eller kontakta oss direkt för ett samtal.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/seo-test"
                className="inline-flex items-center font-bold py-4 px-8 rounded-full text-black"
                style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
              >
                Gratis SEO-test →
              </Link>
              <Link
                href="/kontakt"
                className="inline-flex items-center font-semibold py-4 px-8 rounded-full border-2 border-white/30 text-white hover:border-white transition-colors"
              >
                Kontakta oss
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
