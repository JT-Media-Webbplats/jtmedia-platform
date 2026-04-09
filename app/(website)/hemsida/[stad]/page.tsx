import type { Metadata } from 'next'
import Link from 'next/link'
import ScrollReveal from '../../_components/ScrollReveal'

const cities: Record<string, { name: string; intro: string; businessDesc: string; metaDesc: string }> = {
  ljungby: {
    name: 'Ljungby',
    intro: 'Ljungby är en växande stad i hjärtat av Småland med ett starkt lokalt näringsliv.',
    businessDesc:
      'Med ett aktivt handelsliv och en rad framgångsrika lokala företag är Ljungby en stad där digital närvaro gör skillnad. Konkurrensen ökar — de företag som syns på nätet vinner kunder.',
    metaDesc: 'Professionell webbdesign i Ljungby av JT Media Sweden. Vi bygger snabba hemsidor som rankar på Google och ger fler kunder för lokala företag.',
  },
  varnamo: {
    name: 'Värnamo',
    intro: 'Värnamo är känd som möbelstaden och har ett aktivt företagsklimat inom handel och industri.',
    businessDesc:
      'Värnamos starka industrikultur och handelstradition skapar ett konkurrenskraftigt näringsliv där en professionell hemsida är avgörande för att sticka ut och attrahera nya kunder.',
    metaDesc: 'Webbdesign i Värnamo av JT Media Sweden. Professionella hemsidor för lokala företag som vill synas på Google och växa digitalt.',
  },
  vaxjo: {
    name: 'Växjö',
    intro: 'Växjö är Kronobergs länshuvudstad med ett blomstrande universitetssamhälle och mångfacetterat näringsliv.',
    businessDesc:
      'Växjö kombinerar akademisk innovation med ett starkt lokalt näringsliv. Stadens tillväxt skapar möjligheter för företag med stark digital närvaro att nå en bred och välutbildad kundkrets.',
    metaDesc: 'Hemsida i Växjö — JT Media Sweden skapar professionell webbdesign för Växjöföretag. Snabba, SEO-optimerade sidor som ger fler kunder.',
  },
  markaryd: {
    name: 'Markaryd',
    intro: 'Markaryd är en liten men aktiv gränsstad med stark koppling till Skånemarknaden.',
    businessDesc:
      'Markaryds geografiska läge nära Skåne ger lokala företag tillgång till en större marknad. En professionell hemsida hjälper er att nå kunder på båda sidorna om kommungränsen.',
    metaDesc: 'Webbdesign i Markaryd av JT Media Sweden. Vi hjälper lokala företag att växa digitalt med professionella hemsidor och SEO.',
  },
  halmstad: {
    name: 'Halmstad',
    intro: 'Halmstad är Hallands residensstad med en stor och varierad företagsbas nära kusten.',
    businessDesc:
      'Halmstads dynamiska näringsliv och starka turistsektor skapar unika möjligheter för företag med en professionell digital närvaro. Syns ni på Google när kunderna söker?',
    metaDesc: 'Hemsida i Halmstad — JT Media Sweden bygger professionella webbsidor för Halmstadföretag. SEO-optimerade, snabba och konverterande.',
  },
  helsingborg: {
    name: 'Helsingborg',
    intro: 'Helsingborg är en av Sveriges mest dynamiska städer med en starkt tillväxtorienterad ekonomi.',
    businessDesc:
      'I Helsingborgs konkurrensutsatta affärsmiljö är en stark digital närvaro inte valfri — det är nödvändigt. Vi bygger hemsidor som gör att ni sticker ut och vinner kunder i en krävande marknad.',
    metaDesc: 'Webbdesign i Helsingborg av JT Media Sweden. Professionella hemsidor och digital marknadsföring för Helsingborgsföretag.',
  },
  jonkoping: {
    name: 'Jönköping',
    intro: 'Jönköping är ett regionalt centrum i södra Sverige med ett starkt fokus på handel och logistik.',
    businessDesc:
      'Jönköpings strategiska läge och starka handelstradition gör det till en viktig marknad. Företag med en professionell digital närvaro har ett tydligt försprång i denna konkurrensutsatta stad.',
    metaDesc: 'Hemsida i Jönköping av JT Media Sweden. Vi skapar moderna, SEO-optimerade webbsidor för Jönköpingsföretag som vill växa.',
  },
  almhult: {
    name: 'Älmhult',
    intro: 'Älmhult är IKEAs hemstad — en innovativ industristad med internationell närvaro.',
    businessDesc:
      'Älmhultsandan — innovation, enkelhet och funktionalitet — genomsyrar det lokala näringslivet. Vi bygger hemsidor med samma filosofi: snabba, enkla att använda och byggda för att leverera resultat.',
    metaDesc: 'Webbdesign i Älmhult av JT Media Sweden. Professionella hemsidor för lokala Älmhultsföretag som vill synas och växa digitalt.',
  },
  lagan: {
    name: 'Lagan',
    intro: 'Lagan är ett litet samhälle i Ljungby kommun med lokala företag som behöver digital närvaro.',
    businessDesc:
      'Lagans lokala företag verkar i en miljö där personliga relationer är viktiga — men det hindrar inte att en professionell hemsida öppnar dörrar till fler kunder i regionen och online.',
    metaDesc: 'Hemsida i Lagan av JT Media Sweden. Vi hjälper lokala Laganföretag att etablera sig digitalt med professionell webbdesign.',
  },
  lessebo: {
    name: 'Lessebo',
    intro: 'Lessebo är känt för sin glasindustri och har ett aktivt lokalt näringsliv som växer digitalt.',
    businessDesc:
      'Lessebos unika industriarv och växande näringsliv skapar möjligheter för företag som satsar på digital synlighet. Vi hjälper er att nå kunder som söker era produkter och tjänster på nätet.',
    metaDesc: 'Webbdesign i Lessebo av JT Media Sweden. Professionella hemsidor för Lesseboföretag som vill växa och synas på Google.',
  },
}

export function generateStaticParams() {
  return Object.keys(cities).map((stad) => ({ stad }))
}

export function generateMetadata({ params }: { params: { stad: string } }): Metadata {
  const city = cities[params.stad]
  if (!city) return { title: 'Hemsida | JT Media Sweden' }
  return {
    title: `Hemsida i ${city.name} | Professionell Webbdesign | JT Media`,
    description: city.metaDesc,
  }
}

export default function HemsidaStadPage({ params }: { params: { stad: string } }) {
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
            description: `Professionell webbdesign och digital marknadsföring i ${city.name}`,
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
            serviceType: 'Webbdesign och digital marknadsföring',
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-[#F8F8F8] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <ScrollReveal>
              <span className="inline-block font-bakerie text-sm bg-brand-green/20 text-black px-4 py-1.5 rounded-full mb-6">
                Webb & Hemsidor — {city.name}
              </span>
              <h1 className="font-playfair font-black text-5xl md:text-6xl lg:text-7xl text-black mb-6 leading-tight">
                Hemsida i {city.name}
              </h1>
              <p className="text-xl text-black/55 leading-relaxed mb-4">
                {city.intro}
              </p>
              <p className="text-lg text-black/50 leading-relaxed mb-10">
                {city.businessDesc}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center font-bold py-3.5 px-7 rounded-full text-black"
                  style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
                >
                  Få en offert →
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
        </div>
      </section>

      {/* Services overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-4">
                Vad vi bygger
              </h2>
              <p className="text-black/55 text-lg max-w-xl mx-auto">
                Professionella hemsidor anpassade för er verksamhet i {city.name}.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🏢', title: 'Företagshemsidor', desc: 'Presentationssidor med fokus på att konvertera besökare till leads och kunder.' },
              { icon: '🛍️', title: 'Webbutiker', desc: 'E-handel med säker betalning, lagerhantering och smidig upplevelse för era kunder.' },
              { icon: '🏠', title: 'Landningssidor', desc: 'Konverteringsfokuserade sidor för kampanjer och specifika produkter eller tjänster.' },
            ].map((s, i) => (
              <ScrollReveal key={s.title} delay={i * 70}>
                <div className="bg-[#F8F8F8] rounded-3xl p-7">
                  <div className="text-3xl mb-4">{s.icon}</div>
                  <h3 className="font-playfair font-black text-lg text-black mb-2">{s.title}</h3>
                  <p className="text-black/55 text-sm leading-relaxed">{s.desc}</p>
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
              <p className="text-black/55 max-w-xl mx-auto">
                Kombinera er hemsida med SEO och Google Ads för ännu bättre resultat.
              </p>
            </div>
          </ScrollReveal>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/seo/${params.stad}`}
              className="bg-white rounded-2xl border border-black/8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all px-6 py-4 font-semibold text-black/70 hover:text-black"
            >
              SEO i {city.name} →
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
              Redo för en ny hemsida i {city.name}?
            </h2>
            <p className="text-white/55 text-lg mb-10">
              Kontakta oss för ett kostnadsfritt samtal — vi svarar samma dag.
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
