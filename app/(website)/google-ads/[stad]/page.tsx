import type { Metadata } from 'next'
import Link from 'next/link'
import ScrollReveal from '../../_components/ScrollReveal'

const cities: Record<string, { name: string; intro: string; adsContext: string; metaDesc: string }> = {
  ljungby: {
    name: 'Ljungby',
    intro: 'Ljungby är en växande stad i hjärtat av Småland med ett starkt lokalt näringsliv.',
    adsContext:
      'Med Google Ads kan Ljungbyföretag synas direkt när lokala kunder söker efter era produkter och tjänster — oavsett om de befinner sig i stan eller i omgivande kommuner.',
    metaDesc: 'Google Ads i Ljungby — JT Media Sweden skapar och hanterar Google Ads-kampanjer för lokala Ljungbyföretag. Mer trafik och kunder från dag ett.',
  },
  varnamo: {
    name: 'Värnamo',
    intro: 'Värnamo är känd som möbelstaden och har ett aktivt företagsklimat inom handel och industri.',
    adsContext:
      'I Värnamos handelsmiljö är rätt Google Ads-strategi avgörande. Vi skapar kampanjer som riktar sig mot kunder i Värnamo och omgivande regioner vid rätt tidpunkt.',
    metaDesc: 'Google Ads i Värnamo — professionell annonseringshantering av JT Media Sweden. Sökannonsering och lokala kampanjer för Värnamo-företag.',
  },
  vaxjo: {
    name: 'Växjö',
    intro: 'Växjö är Kronobergs länshuvudstad med ett blomstrande universitetssamhälle och mångfacetterat näringsliv.',
    adsContext:
      'Växjös stora och köpstarka befolkning söker aktivt efter lokala tjänster. Med Google Ads kan ert företag synas direkt för de söktermer som konverterar bäst i Växjö.',
    metaDesc: 'Google Ads i Växjö — JT Media Sweden hanterar Google Ads för Växjöföretag. Resultatdriven annonsering som ger fler kunder direkt.',
  },
  markaryd: {
    name: 'Markaryd',
    intro: 'Markaryd är en liten men aktiv gränsstad med stark koppling till Skånemarknaden.',
    adsContext:
      'Markaryds geografiska läge ger unika möjligheter att nå kunder från flera regioner via Google Ads. Vi skapar kampanjer med geografisk inriktning som maximerar er räckvidd.',
    metaDesc: 'Google Ads i Markaryd — lokal Google-annonsering för Markaryd-företag av JT Media Sweden. Mer kunder, lägre kostnad per klick.',
  },
  halmstad: {
    name: 'Halmstad',
    intro: 'Halmstad är Hallands residensstad med en stor och varierad företagsbas nära kusten.',
    adsContext:
      'Halmstads starka handel och turism skapar säsongsbaserade möjligheter för Google Ads. Vi anpassar era kampanjer efter säsong och målgrupp för maximal effektivitet.',
    metaDesc: 'Google Ads i Halmstad — JT Media Sweden skapar resultatdrivna Google-kampanjer för Halmstadföretag. Annonsering som lönar sig.',
  },
  helsingborg: {
    name: 'Helsingborg',
    intro: 'Helsingborg är en av Sveriges mest dynamiska städer med en starkt tillväxtorienterad ekonomi.',
    adsContext:
      'I Helsingborgs konkurrensutsatta marknad kräver Google Ads expertis. Vi analyserar konkurrensen, optimerar budgivning och skriver annonstexter som sticker ut och konverterar.',
    metaDesc: 'Google Ads i Helsingborg — professionell annonshantering av JT Media Sweden. Sökannonsering med hög ROAS för Helsingborgsföretag.',
  },
  jonkoping: {
    name: 'Jönköping',
    intro: 'Jönköping är ett regionalt centrum i södra Sverige med ett starkt fokus på handel och logistik.',
    adsContext:
      'Jönköpings roll som regionalt centrum innebär stor söktrafik. Med rätt Google Ads-kampanjer kan ert företag fånga kunder från hela regionen och driva dem till er hemsida eller butik.',
    metaDesc: 'Google Ads i Jönköping — JT Media Sweden driver kundtrafik för Jönköpingsföretag via Google-annonsering. Resultat från dag ett.',
  },
  almhult: {
    name: 'Älmhult',
    intro: 'Älmhult är IKEAs hemstad — en innovativ industristad med internationell närvaro.',
    adsContext:
      'Älmhult har ett aktivt lokalt näringsliv med specifika målgrupper. Vi skapar precisionsinriktade Google Ads-kampanjer som når rätt personer vid rätt tidpunkt.',
    metaDesc: 'Google Ads i Älmhult — JT Media Sweden hanterar Google Ads för lokala Älmhults-företag. Annonser som konverterar och ger mätbart resultat.',
  },
  lagan: {
    name: 'Lagan',
    intro: 'Lagan är ett litet samhälle i Ljungby kommun med lokala företag som behöver digital närvaro.',
    adsContext:
      'För företag i mindre orter som Lagan är Google Ads ett kraftfullt sätt att nå kunder från ett större geografiskt område — utan att behöva vänta på organisk SEO.',
    metaDesc: 'Google Ads i Lagan — JT Media Sweden skapar Google-kampanjer för lokala Lagan-företag. Syns direkt, nå fler kunder i regionen.',
  },
  lessebo: {
    name: 'Lessebo',
    intro: 'Lessebo är känt för sin glasindustri och har ett aktivt lokalt näringsliv som växer digitalt.',
    adsContext:
      'Lessebos nischade näringsliv skapar möjligheter för riktade Google Ads-kampanjer. Vi hittar de söktermer som dina specifika kunder använder och annonserar precis när de söker.',
    metaDesc: 'Google Ads i Lessebo — professionell Google-annonsering för Lessebo-företag av JT Media Sweden. Fler kunder från sök.',
  },
}

export function generateStaticParams() {
  return Object.keys(cities).map((stad) => ({ stad }))
}

export function generateMetadata({ params }: { params: { stad: string } }): Metadata {
  const city = cities[params.stad]
  if (!city) return { title: 'Google Ads | JT Media Sweden' }
  return {
    title: `Google Ads i ${city.name} | Sökannonsering | JT Media Sweden`,
    description: city.metaDesc,
  }
}

export default function GoogleAdsStadPage({ params }: { params: { stad: string } }) {
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
            description: `Google Ads och sökannonsering i ${city.name}`,
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
            serviceType: 'Google Ads och sökannonsering',
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-[#F8F8F8] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <ScrollReveal>
              <span className="inline-block font-bakerie text-sm bg-brand-green/20 text-black px-4 py-1.5 rounded-full mb-6">
                Google Ads — {city.name}
              </span>
              <h1 className="font-playfair font-black text-5xl md:text-6xl lg:text-7xl text-black mb-6 leading-tight">
                Google Ads i {city.name}
              </h1>
              <p className="text-xl text-black/55 leading-relaxed mb-4">
                {city.intro}
              </p>
              <p className="text-lg text-black/50 leading-relaxed mb-10">
                {city.adsContext}
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

      {/* What we handle */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-4">
                Vad vi hanterar
              </h2>
              <p className="text-black/55 text-lg max-w-xl mx-auto">
                Komplett Google Ads-hantering — från strategi till daglig optimering.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '🔍', title: 'Kampanjstrategi', desc: `Vi analyserar er marknad i ${city.name}, identifierar konkurrenterna och skapar en strategi som maximerar er budget.` },
              { icon: '✍️', title: 'Annonstexter & kreativ', desc: 'Övertygande annonstexter och visuellt material som sticker ut i sökresultaten och driver klick.' },
              { icon: '⚙️', title: 'Daglig optimering', desc: 'Vi övervakar och optimerar kampanjerna dagligen — budgivning, söktermer och annonsutformning.' },
              { icon: '📊', title: 'Transparent rapportering', desc: 'Månadsvis rapport med klick, konverteringar, kostnad per klick och ROAS — allt förklarat tydligt.' },
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
              href={`/seo/${params.stad}`}
              className="bg-white rounded-2xl border border-black/8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all px-6 py-4 font-semibold text-black/70 hover:text-black"
            >
              SEO i {city.name} →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="font-playfair font-black text-4xl md:text-5xl text-white mb-6">
              Syns i {city.name} från dag ett
            </h2>
            <p className="text-white/55 text-lg mb-10">
              Kontakta oss för en kostnadsfri analys av er Google Ads-potential.
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
