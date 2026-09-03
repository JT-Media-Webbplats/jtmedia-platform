import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Building2, ShoppingBag, Home } from 'lucide-react'
import ScrollReveal from '../../_components/ScrollReveal'

type City = {
  name: string
  intro: string
  businessDesc: string
  localContent: string
  metaDesc: string
}

const cities: Record<string, City> = {
  ljungby: {
    name: 'Ljungby',
    intro: 'Ljungby är en växande stad i hjärtat av Småland med ett starkt lokalt näringsliv.',
    businessDesc:
      'Med ett aktivt handelsliv och en rad framgångsrika lokala företag är Ljungby en stad där digital närvaro gör skillnad. Konkurrensen ökar, de företag som syns på nätet vinner kunder.',
    localContent:
      'Som vår hemstad känner vi Ljungbys marknad väl. Många lokala företag konkurrerar med större aktörer från Värnamo och Växjö, vilket gör en professionell hemsida helt avgörande för att framstå som ett seriöst alternativ. Vi bygger hemsidor som är optimerade för Ljungbysökningar från start och som ger ert företag en stark digital närvaro i hela Sunnerbo-regionen. Allt vi bygger är snabbt, mobilanpassat och förberett för SEO — så att ni rankar bättre redan från lansering.',
    metaDesc: 'Professionell webbdesign i Ljungby av JT Media AB. Vi bygger snabba hemsidor som rankar på Google och ger fler kunder för lokala företag.',
  },
  varnamo: {
    name: 'Värnamo',
    intro: 'Värnamo är känd som möbelstaden och har ett aktivt företagsklimat inom handel och industri.',
    businessDesc:
      'Värnamos starka industrikultur och handelstradition skapar ett konkurrenskraftigt näringsliv där en professionell hemsida är avgörande för att sticka ut och attrahera nya kunder.',
    localContent:
      'Värnamos starka industri- och möbelnäring betyder att många företag konkurrerar om samma kunder online. Här räcker det inte med en standardiserad mall — er hemsida behöver kommunicera kvalitet, hantverk och förtroende på sekunder. Vi bygger skräddarsydda hemsidor för Värnamoföretag i alla branscher och säkerställer att de är snabba, sökmotoroptimerade och konverteringsfokuserade. Resultatet: en hemsida som drar in fler offertförfrågningar och stärker ert varumärke i hela regionen.',
    metaDesc: 'Webbdesign i Värnamo av JT Media AB. Professionella hemsidor för lokala företag som vill synas på Google och växa digitalt.',
  },
  vaxjo: {
    name: 'Växjö',
    intro: 'Växjö är Kronobergs länshuvudstad med ett blomstrande universitetssamhälle och mångfacetterat näringsliv.',
    businessDesc:
      'Växjö kombinerar akademisk innovation med ett starkt lokalt näringsliv. Stadens tillväxt skapar möjligheter för företag med stark digital närvaro att nå en bred och välutbildad kundkrets.',
    localContent:
      'Växjö är Kronobergs största stad med ett brett näringsliv som spänner från handel och tjänster till universitetsanknutna verksamheter. Det skapar en mångsidig kundkrets med höga förväntningar på digital närvaro. Vi bygger hemsidor för Växjöföretag som är moderna, snabba och designade för att fungera lika bra på mobil som på desktop. SEO-grunder ingår från start, så att ni rankar för "Växjö"-sökord direkt efter lansering — utan att behöva en separat SEO-investering bara för att hemsidan ska bli sökbar.',
    metaDesc: 'Hemsida i Växjö, JT Media AB skapar professionell webbdesign för Växjöföretag. Snabba, SEO-optimerade sidor som ger fler kunder.',
  },
  markaryd: {
    name: 'Markaryd',
    intro: 'Markaryd är en aktiv gränsstad med stark koppling till Skånemarknaden.',
    businessDesc:
      'Markaryds geografiska läge nära Skåne ger lokala företag tillgång till en större marknad. En professionell hemsida hjälper er att nå kunder på båda sidorna om kommungränsen.',
    localContent:
      'Markaryd ligger strategiskt nära Skånegränsen, vilket ger lokala företag en marknad som sträcker sig långt utanför kommunen. Vi bygger hemsidor som är optimerade för att fånga både Markaryd-sökningar och bredare regionala termer i Kronoberg och norra Skåne. Genom rätt sökordsstrategi från start kan er hemsida ranka i flera geografiska områden samtidigt — utan att budgeten blir större för det. Tekniken bakom är samma kvalitet som större byråer levererar, men till en avsevärt lägre kostnad.',
    metaDesc: 'Webbdesign i Markaryd av JT Media AB. Vi hjälper lokala företag att växa digitalt med professionella hemsidor och SEO.',
  },
  halmstad: {
    name: 'Halmstad',
    intro: 'Halmstad är Hallands residensstad med en stor och varierad företagsbas nära kusten.',
    businessDesc:
      'Halmstads dynamiska näringsliv och starka turistsektor skapar unika möjligheter för företag med en professionell digital närvaro. Syns ni på Google när kunderna söker?',
    localContent:
      'Halmstad har en stark mix av turism, handel och industri som ger ett brett spektrum av kundbehov året runt. För besöksnäringen är synlighet under sommarsäsongen kritisk, medan andra branscher behöver jämn trafik året om. Vi bygger hemsidor som är optimerade för båda — snabb laddning, mobilanpassning, och flexibel struktur som kan uppdateras med säsongsinnehåll utan utvecklarhjälp. Allt levereras med SEO-grunder på plats så att ni rankar i Halmstad och Hallandsregionen från start.',
    metaDesc: 'Hemsida i Halmstad, JT Media AB bygger professionella webbsidor för Halmstadföretag. SEO-optimerade, snabba och konverterande.',
  },
  helsingborg: {
    name: 'Helsingborg',
    intro: 'Helsingborg är en av Sveriges mest dynamiska städer med en starkt tillväxtorienterad ekonomi.',
    businessDesc:
      'I Helsingborgs konkurrensutsatta affärsmiljö är en stark digital närvaro inte valfri, det är nödvändigt. Vi bygger hemsidor som gör att ni sticker ut och vinner kunder i en krävande marknad.',
    localContent:
      'Helsingborg är en av Sveriges mest digitalt mogna marknader med hög andel företag som redan investerat i sin närvaro online. Det betyder att en standardhemsida inte räcker — er sida måste vara mätbart bättre än konkurrenternas i hastighet, design och konverteringsoptimering. Vi bygger hemsidor som tävlar i toppskiktet: snabba sub-1-sekund-laddningar, modern visuell identitet, och en konverteringsstruktur som maximerar avkastningen från trafiken ni redan får. Resultat ni kan mäta från första veckan.',
    metaDesc: 'Webbdesign i Helsingborg av JT Media AB. Professionella hemsidor och digital marknadsföring för Helsingborgsföretag.',
  },
  jonkoping: {
    name: 'Jönköping',
    intro: 'Jönköping är ett regionalt centrum i södra Sverige med ett starkt fokus på handel och logistik.',
    businessDesc:
      'Jönköpings strategiska läge och starka handelstradition gör det till en viktig marknad. Företag med en professionell digital närvaro har ett tydligt försprång i denna konkurrensutsatta stad.',
    localContent:
      'Jönköpings position som regionalt centrum innebär att många företag har en kundbas som sträcker sig långt utanför stadens gränser. Det ställer krav på en hemsida som fungerar både som lokal förstahandskontakt och som regional auktoritet inom er bransch. Vi bygger hemsidor för Jönköpingföretag med tydlig informationsstruktur, stark SEO-grund och konverteringselement som adresserar längre kundresor — något som är typiskt för B2B och handel i regionen. Allt designat för att hjälpa er stänga affärer, inte bara visa upp er.',
    metaDesc: 'Hemsida i Jönköping av JT Media AB. Vi skapar moderna, SEO-optimerade webbsidor för Jönköpingsföretag som vill växa.',
  },
  almhult: {
    name: 'Älmhult',
    intro: 'Älmhult är IKEAs hemstad, en innovativ industristad med internationell närvaro.',
    businessDesc:
      'Älmhultsandan, innovation, enkelhet och funktionalitet, genomsyrar det lokala näringslivet. Vi bygger hemsidor med samma filosofi: snabba, enkla att använda och byggda för att leverera resultat.',
    localContent:
      'Älmhult har en stark internationell prägel tack vare IKEAs närvaro, vilket innebär att många lokala företag arbetar både regionalt och internationellt. Er hemsida behöver kunna stötta båda lägena — lokala "Älmhult"-sökord, men också tematiskt innehåll som rankar nationellt och eventuellt på engelska för internationella kunder. Vi bygger hemsidor med flexibel struktur som klarar växling mellan marknader, samtidigt som de håller hög teknisk kvalitet. Resultatet: en hemsida som växer med er.',
    metaDesc: 'Webbdesign i Älmhult av JT Media AB. Professionella hemsidor för lokala Älmhultsföretag som vill synas och växa digitalt.',
  },
  lagan: {
    name: 'Lagan',
    intro: 'Lagan är ett aktivt samhälle i Ljungby kommun med lokala företag som behöver digital närvaro.',
    businessDesc:
      'Lagans lokala företag verkar i en miljö där personliga relationer är viktiga, men det hindrar inte att en professionell hemsida öppnar dörrar till fler kunder i regionen och online.',
    localContent:
      'Lagan tillhör Ljungby kommun och har en marknad där personliga relationer fortfarande väger tungt — men där en professionell hemsida ändå öppnar dörrar till nya kunder och affärer. Eftersom konkurrensen i lokala Google-sökningar är låg är det här mycket möjligt att snabbt ranka topp 3 för relevanta termer med rätt strategi. Vi bygger hemsidor med SEO-grund inbyggd och Google Business Profile-koppling, så att ni syns både för "Lagan"- och "Ljungby"-sökningar från dag ett.',
    metaDesc: 'Hemsida i Lagan av JT Media AB. Vi hjälper lokala Laganföretag att etablera sig digitalt med professionell webbdesign.',
  },
  lessebo: {
    name: 'Lessebo',
    intro: 'Lessebo är känt för sin glasindustri och har ett aktivt lokalt näringsliv som växer digitalt.',
    businessDesc:
      'Lessebos unika industriarv och växande näringsliv skapar möjligheter för företag som satsar på digital synlighet. Vi hjälper er att nå kunder som söker era produkter och tjänster på nätet.',
    localContent:
      'Lessebos starka industriella arv med glasbruk och tillverkning skapar en marknad med många nischade aktörer som tävlar med större, mer digitalt etablerade företag. En professionell hemsida med stark berättelse, kvalitetspresentation av era produkter och tydlig SEO-grund gör mycket stor skillnad här. Vi bygger hemsidor som lyfter fram det unika i ert företag — historik, hantverk, kvalitet — samtidigt som de tekniskt håller högsta klass och rankar i lokala sökningar.',
    metaDesc: 'Webbdesign i Lessebo av JT Media AB. Professionella hemsidor för Lesseboföretag som vill växa och synas på Google.',
  },
}

type FAQ = { q: string; a: string }

function buildFaqs(cityName: string): FAQ[] {
  return [
    {
      q: `Hur lång tid tar det att bygga en hemsida för ett företag i ${cityName}?`,
      a: `En typisk hemsida tar 4–8 veckor från start till lansering. Det inkluderar planering, design, utveckling och lansering. Mindre projekt kan gå snabbare, mer komplexa lösningar som e-handel eller kundportal tar längre tid. Ni får en konkret tidplan i offerten så det inte blir några överraskningar.`,
    },
    {
      q: `Vad kostar en hemsida för ett företag i ${cityName}?`,
      a: `Priset beror helt på omfattningen, antal sidor, designkomplexitet och funktioner som bokningssystem eller e-handel. Vi tar fram en fast offert baserat på era exakta behov inom 24 timmar från er förfrågan, så det blir inga oförutsedda kostnader. Många företag i ${cityName} börjar med en bra grundsida som sedan kan byggas ut över tid.`,
    },
    {
      q: 'Vilken teknik bygger ni på?',
      a: 'Vi anpassar tekniken efter projektet. För de flesta företag använder vi moderna ramverk som Next.js eller WordPress beroende på vad som passar bäst. Allt vi bygger är snabbt, säkert och SEO-optimerat från grunden — oavsett plattform.',
    },
    {
      q: 'Är hemsidan SEO-optimerad från start?',
      a: `Ja. All teknisk SEO ingår — snabba laddningstider, mobilanpassning, strukturerad data, ren kod och korrekt rubrikhierarki. För ${cityName}-företag som vill ranka lokalt sätter vi även upp Google Business Profile-grunderna direkt. Innehållsoptimering (texter, sökordsstrategi) är en separat tjänst om ni vill ha hjälp där.`,
    },
    {
      q: 'Vad ingår i underhåll efter lansering?',
      a: `Vi erbjuder löpande underhåll som täcker uppdateringar, säkerhetspatchar, hosting, domän, backuper och support. Det betyder att ni inte behöver tänka på det tekniska — vi sköter det medan ni fokuserar på er verksamhet i ${cityName}. Avtalet kan när som helst sägas upp.`,
    },
    {
      q: 'Kan ni hjälpa till med en befintlig hemsida?',
      a: `Absolut. Vi tar gärna över befintliga hemsidor, oavsett om det handlar om mindre uppdateringar, omdesign eller migrering till en ny plattform. Många ${cityName}-företag kommer till oss när deras nuvarande sida är gammal eller långsam — vi gör då en analys och föreslår vad som behöver göras.`,
    },
    {
      q: 'Hur ser processen ut från beställning till lansering?',
      a: 'Processen har fem steg: 1) Möte och kravanalys, 2) Design och innehållsstruktur, 3) Utveckling och löpande återkoppling, 4) Granskning och testning, 5) Lansering. Genom hela processen är vi tillgängliga och ni har en fast kontaktperson — så ni alltid vet var i processen vi är.',
    },
  ]
}

export function generateStaticParams() {
  return Object.keys(cities).map((stad) => ({ stad }))
}

export function generateMetadata({ params }: { params: { stad: string } }): Metadata {
  const city = cities[params.stad]
  if (!city) return { title: 'Hemsida | JT Media AB' }
  return {
    title: `Hemsida i ${city.name} | Professionell Webbdesign | JT Media AB`,
    description: city.metaDesc,
  }
}

export default function HemsidaStadPage({ params }: { params: { stad: string } }) {
  const city = cities[params.stad]
  if (!city) notFound()

  const faqs = buildFaqs(city.name)

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://jtmedia.se/#localbusiness',
    name: 'JT Media AB',
    description: `Professionell webbdesign och digital marknadsföring i ${city.name}`,
    url: 'https://jtmedia.se',
    telephone: '+46767680202',
    email: 'info@jtmediasweden.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Stationsgatan 2',
      addressLocality: 'Ljungby',
      postalCode: '341 60',
      addressCountry: 'SE',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '18:00',
      },
    ],
    sameAs: [
      'https://instagram.com/jtmediasweden',
      'https://facebook.com/jtmediasweden',
      'https://se.linkedin.com/company/jt-media-ab',
    ],
    areaServed: {
      '@type': 'City',
      name: city.name,
    },
    serviceType: 'Webbdesign och digital marknadsföring',
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  }

  return (
    <div className="bg-white">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="bg-[#F8F8F8] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <ScrollReveal variant="fade-up">
              <span className="inline-block font-bakerie text-sm bg-brand-green/20 text-black px-4 py-1.5 rounded-full mb-6">
                Webb & Hemsidor, {city.name}
              </span>
              <h1 className="font-playfair font-black text-5xl md:text-6xl lg:text-7xl text-black mb-6 leading-tight">
                Hemsida i {city.name}
              </h1>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={150}>
              <p className="text-xl text-black/55 leading-relaxed mb-4">
                {city.intro}
              </p>
              <p className="text-lg text-black/50 leading-relaxed mb-10">
                {city.businessDesc}
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={300}>
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

      {/* Local context */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <ScrollReveal variant="slide-right">
              <h2 className="font-playfair font-black text-3xl md:text-4xl text-black mb-6">
                Hemsidor för {city.name}-företag
              </h2>
              <p className="text-black/65 text-lg leading-relaxed mb-5">
                {city.localContent}
              </p>
              <p className="text-black/55 leading-relaxed">
                JT Media AB sitter i Ljungby och arbetar med {city.name}-företag på distans. Det betyder ingen restid, ingen overhead för fysiska möten — men full transparens via löpande digital kommunikation och en fast kontaktperson genom hela projektet.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="slide-left">
              <Image
                src="/images/hemsida_v1.webp"
                alt={`Hemsida i ${city.name} – professionell webbdesign av JT Media AB för ${city.name}-företag`}
                width={800}
                height={600}
                sizes="(max-width: 1024px) 100vw, 600px"
                className="w-full h-auto rounded-3xl"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Services overview */}
      <section className="py-16 md:py-20 bg-[#F8F8F8]">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal variant="scale-in">
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
              { Icon: Building2, title: 'Företagshemsidor', desc: 'Presentationssidor med fokus på att konvertera besökare till leads och kunder.' },
              { Icon: ShoppingBag, title: 'Webbutiker', desc: 'E-handel med säker betalning, lagerhantering och smidig upplevelse för era kunder.' },
              { Icon: Home, title: 'Landningssidor', desc: 'Konverteringsfokuserade sidor för kampanjer och specifika produkter eller tjänster.' },
            ].map((s, i) => (
              <ScrollReveal key={s.title} delay={i * 80} variant="scale-in">
                <div className="bg-white rounded-3xl p-7">
                  <div className="w-12 h-12 rounded-xl bg-brand-green/12 flex items-center justify-center mb-4">
                    <s.Icon className="w-5 h-5 text-brand-green-dark" />
                  </div>
                  <h3 className="font-playfair font-black text-lg text-black mb-2">{s.title}</h3>
                  <p className="text-black/55 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal variant="blur-in">
            <div className="text-center mb-12">
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-4">
                Vanliga frågor om hemsidor i {city.name}
              </h2>
              <p className="text-black/55 text-lg">
                Snabba svar på det företagare oftast undrar.
              </p>
            </div>
          </ScrollReveal>
          <div className="flex flex-col gap-3">
            {faqs.map((f, i) => (
              <ScrollReveal key={f.q} delay={i * 60} variant="blur-in">
                <details className="group bg-[#F8F8F8] rounded-2xl border border-black/6 overflow-hidden">
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-4 px-6 py-5 font-semibold text-black hover:bg-black/2 transition-colors">
                    <span>{f.q}</span>
                    <span className="text-brand-green-dark text-xl shrink-0 transition-transform group-open:rotate-45 leading-none mt-0.5">
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-5 text-black/65 leading-relaxed">
                    {f.a}
                  </div>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="bg-[#F8F8F8] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal variant="scale-in">
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
            <ScrollReveal variant="scale-in" delay={80}>
              <Link
                href={`/seo/${params.stad}`}
                className="bg-white rounded-2xl border border-black/8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all px-6 py-4 font-semibold text-black/70 hover:text-black block"
              >
                SEO i {city.name} →
              </Link>
            </ScrollReveal>
            <ScrollReveal variant="scale-in" delay={160}>
              <Link
                href={`/google-ads/${params.stad}`}
                className="bg-white rounded-2xl border border-black/8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all px-6 py-4 font-semibold text-black/70 hover:text-black block"
              >
                Google Ads i {city.name} →
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal variant="fade-up">
            <h2 className="font-playfair font-black text-4xl md:text-5xl text-white mb-6">
              Redo för en ny hemsida i {city.name}?
            </h2>
            <p className="text-white/55 text-lg mb-10">
              Kontakta oss för ett kostnadsfritt samtal, vi svarar samma dag.
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
