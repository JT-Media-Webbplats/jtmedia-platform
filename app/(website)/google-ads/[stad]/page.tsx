import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Search, PenTool, Settings, BarChart3 } from 'lucide-react'
import ScrollReveal from '../../_components/ScrollReveal'

type City = {
  name: string
  intro: string
  adsContext: string
  localContent: string
  metaDesc: string
}

const cities: Record<string, City> = {
  ljungby: {
    name: 'Ljungby',
    intro: 'Ljungby är en växande stad i hjärtat av Småland med ett starkt lokalt näringsliv.',
    adsContext:
      'Med Google Ads kan Ljungbyföretag synas direkt när lokala kunder söker efter era produkter och tjänster, oavsett om de befinner sig i stan eller i omgivande kommuner.',
    localContent:
      'Som vår hemstad känner vi Ljungbymarknaden väl och vet vilka söktermer som faktiskt driver kunder till lokala företag. Många Ljungbyföretag tävlar med större aktörer från Värnamo och Växjö, och Google Ads är ett effektivt sätt att få omedelbar synlighet utan att vänta på SEO-resultat. Vi sätter upp geografiska annonser som riktar sig mot Ljungby och Sunnerbo-regionen, kombinerar med smart sökordsstrategi och optimerar löpande för att sänka er kostnad per klick. Resultat ni kan mäta från första veckan.',
    metaDesc: 'Google Ads i Ljungby, JT Media AB skapar och hanterar Google Ads-kampanjer för lokala Ljungbyföretag. Mer trafik och kunder från dag ett.',
  },
  varnamo: {
    name: 'Värnamo',
    intro: 'Värnamo är känd som möbelstaden och har ett aktivt företagsklimat inom handel och industri.',
    adsContext:
      'I Värnamos handelsmiljö är rätt Google Ads-strategi avgörande. Vi skapar kampanjer som riktar sig mot kunder i Värnamo och omgivande regioner vid rätt tidpunkt.',
    localContent:
      'Värnamos starka industri- och möbelnäring innebär hög konkurrens om viktiga sökord på Google. Det betyder att felhanterade Google Ads-kampanjer kan bränna stora budgetar utan att ge resultat. Vi arbetar med Värnamoföretag i alla branscher och bygger kampanjer baserade på faktisk konkurrensanalys, inte gissningar. Med rätt sökordsstrategi, smart geografisk inriktning och löpande optimering når ni fler kvalificerade leads till lägre kostnad per klick — något som är kritiskt på en så aktiv marknad.',
    metaDesc: 'Google Ads i Värnamo, professionell annonseringshantering av JT Media AB. Sökannonsering och lokala kampanjer för Värnamo-företag.',
  },
  vaxjo: {
    name: 'Växjö',
    intro: 'Växjö är Kronobergs länshuvudstad med ett blomstrande universitetssamhälle och mångfacetterat näringsliv.',
    adsContext:
      'Växjös stora och köpstarka befolkning söker aktivt efter lokala tjänster. Med Google Ads kan ert företag synas direkt för de söktermer som konverterar bäst i Växjö.',
    localContent:
      'Växjö som länshuvudstad har en stor och köpstark befolkning som söker aktivt efter lokala tjänster och produkter via Google. Det skapar både möjligheter och konkurrens — många företag annonserar redan, vilket gör kampanjkvaliteten avgörande. Vi hjälper Växjöföretag att skriva annonstexter som sticker ut, använda smart sökordsmatchning och rikta annonserna mot rätt geografiska områden i Kronoberg. Ofta kombineras Google Ads med SEO för bästa effekt: snabba resultat från ads medan SEO-arbetet bygger upp långsiktig ranking.',
    metaDesc: 'Google Ads i Växjö, JT Media AB hanterar Google Ads för Växjöföretag. Resultatdriven annonsering som ger fler kunder direkt.',
  },
  markaryd: {
    name: 'Markaryd',
    intro: 'Markaryd är en aktiv gränsstad med stark koppling till Skånemarknaden.',
    adsContext:
      'Markaryds geografiska läge ger unika möjligheter att nå kunder från flera regioner via Google Ads. Vi skapar kampanjer med geografisk inriktning som maximerar er räckvidd.',
    localContent:
      'Markaryds geografiska läge precis vid Skånegränsen ger unika möjligheter med Google Ads. Med rätt geografisk inriktning kan era kampanjer fånga sökningar både i Kronoberg och i angränsande Skåne — något som ofta dubblerar er målgrupp utan att budgeten gör det. Vi sätter upp kampanjer med precis geo-targeting, smart sökordsfiltrering för att inte bränna pengar på irrelevanta klick, och löpande optimering för att hålla kostnaden per klick nere. För Markarydföretag är detta ofta den snabbaste vägen till nya kunder.',
    metaDesc: 'Google Ads i Markaryd, lokal Google-annonsering för Markaryd-företag av JT Media AB. Mer kunder, lägre kostnad per klick.',
  },
  halmstad: {
    name: 'Halmstad',
    intro: 'Halmstad är Hallands residensstad med en stor och varierad företagsbas nära kusten.',
    adsContext:
      'Halmstads starka handel och turism skapar säsongsbaserade möjligheter för Google Ads. Vi anpassar era kampanjer efter säsong och målgrupp för maximal effektivitet.',
    localContent:
      'Halmstad har en stark mix av turism, handel och industri som skapar tydliga säsongsmönster i sökbeteendet. Det betyder att Google Ads-kampanjerna behöver kunna växla mellan högsäsong och lågsäsong utan att budgeten slösas. Vi bygger kampanjer för Halmstadföretag som anpassas dynamiskt — högre budget under turistsäsongen för besöksnäring, jämnare flöde året om för andra branscher. Med smart sökordsmatchning, geografisk targeting för Halland och löpande A/B-test av annonstexter får ni maximal avkastning från varje krona.',
    metaDesc: 'Google Ads i Halmstad, JT Media AB skapar resultatdrivna Google-kampanjer för Halmstadföretag. Annonsering som lönar sig.',
  },
  helsingborg: {
    name: 'Helsingborg',
    intro: 'Helsingborg är en av Sveriges mest dynamiska städer med en starkt tillväxtorienterad ekonomi.',
    adsContext:
      'I Helsingborgs konkurrensutsatta marknad kräver Google Ads expertis. Vi analyserar konkurrensen, optimerar budgivning och skriver annonstexter som sticker ut och konverterar.',
    localContent:
      'Helsingborg är en av Sveriges mest digitalt konkurrensutsatta marknader. Klickkostnaderna här ligger ofta högre än i mindre städer, vilket gör att kampanjkvaliteten blir avgörande för lönsamhet. Vi arbetar med Helsingborgsföretag genom systematisk konkurrensanalys, skarp sökordsstrategi och löpande budgivningsoptimering. Genom att fokusera på longtail-sökord och nischade kampanjer hittar vi luckor där ni kan tävla effektivt även mot stora aktörer. Resultat: lägre kostnad per förvärv och högre ROAS än standardkampanjer.',
    metaDesc: 'Google Ads i Helsingborg, professionell annonshantering av JT Media AB. Sökannonsering med hög ROAS för Helsingborgsföretag.',
  },
  jonkoping: {
    name: 'Jönköping',
    intro: 'Jönköping är ett regionalt centrum i södra Sverige med ett starkt fokus på handel och logistik.',
    adsContext:
      'Jönköpings roll som regionalt centrum innebär stor söktrafik. Med rätt Google Ads-kampanjer kan ert företag fånga kunder från hela regionen och driva dem till er hemsida eller butik.',
    localContent:
      'Jönköping som regionalt centrum har stor söktrafik från hela södra Sverige, vilket innebär både möjligheter och konkurrens. För B2B-företag och handelsaktörer i regionen är Google Ads ofta det snabbaste sättet att fånga kvalificerade leads — särskilt eftersom kundresorna här tenderar att vara längre, med flera sökningar innan beslut. Vi bygger kampanjer som täcker hela köpresan, från första research-fas till slutkonvertering, och optimerar löpande för bästa avkastning. Smart geografisk targeting säkerställer att ni når rätt kunder i Jönköping och kringregionen.',
    metaDesc: 'Google Ads i Jönköping, JT Media AB driver kundtrafik för Jönköpingsföretag via Google-annonsering. Resultat från dag ett.',
  },
  almhult: {
    name: 'Älmhult',
    intro: 'Älmhult är IKEAs hemstad, en innovativ industristad med internationell närvaro.',
    adsContext:
      'Älmhult har ett aktivt lokalt näringsliv med specifika målgrupper. Vi skapar precisionsinriktade Google Ads-kampanjer som når rätt personer vid rätt tidpunkt.',
    localContent:
      'Älmhult har en marknad som är både lokal och internationell, tack vare IKEAs närvaro. Det innebär att Google Ads-kampanjerna ofta behöver hantera båda lägena — lokala "Älmhult"-sökningar och bredare nationella eller internationella termer. Vi bygger flexibla kampanjstrukturer för Älmhultsföretag som kan riktas mot olika geografier och språk parallellt. Lokal konkurrens är generellt lägre här än i större städer, vilket ofta innebär lägre kostnad per klick och snabbare avkastning på Google Ads-investeringar.',
    metaDesc: 'Google Ads i Älmhult, JT Media AB hanterar Google Ads för lokala Älmhults-företag. Annonser som konverterar och ger mätbart resultat.',
  },
  lagan: {
    name: 'Lagan',
    intro: 'Lagan är ett aktivt samhälle i Ljungby kommun med lokala företag som behöver digital närvaro.',
    adsContext:
      'För företag i mindre orter som Lagan är Google Ads ett kraftfullt sätt att nå kunder från ett större geografiskt område, utan att behöva vänta på organisk SEO.',
    localContent:
      'Lagan har lägre lokal konkurrens i Google Ads än större städer, vilket innebär markant lägre kostnad per klick för Laganföretag jämfört med t.ex. Helsingborg eller Jönköping. Det är en stor fördel — samma annonsbudget når betydligt fler potentiella kunder. Vi bygger kampanjer som täcker både Lagan och bredare Ljungby-sökningar, eftersom många potentiella kunder söker på "Ljungby" snarare än "Lagan" specifikt. Resultatet: maximal räckvidd inom kommunen och regionen till en kostnad som mindre företag faktiskt har råd med.',
    metaDesc: 'Google Ads i Lagan, JT Media AB skapar Google-kampanjer för lokala Lagan-företag. Syns direkt, nå fler kunder i regionen.',
  },
  lessebo: {
    name: 'Lessebo',
    intro: 'Lessebo är känt för sin glasindustri och har ett aktivt lokalt näringsliv som växer digitalt.',
    adsContext:
      'Lessebos nischade näringsliv skapar möjligheter för riktade Google Ads-kampanjer. Vi hittar de söktermer som dina specifika kunder använder och annonserar precis när de söker.',
    localContent:
      'Lessebos nischade näringsliv med glasindustri och specialiserad tillverkning ger unika möjligheter för riktade Google Ads-kampanjer. Eftersom konkurrensen om nischade sökord är låg kan Lesseboföretag ofta dominera lokala sökresultat utan att betala konkurrenskraftiga klickpriser. Vi identifierar specifika söktermer som er målgrupp faktiskt använder, även de mest specialiserade, och bygger kampanjer som annonserar precis när rätt person söker. Det ger hög konvertering till en låg kostnad, exakt vad nischade företag behöver.',
    metaDesc: 'Google Ads i Lessebo, professionell Google-annonsering för Lessebo-företag av JT Media AB. Fler kunder från sök.',
  },
}

type FAQ = { q: string; a: string }

function buildFaqs(cityName: string): FAQ[] {
  return [
    {
      q: `Hur snabbt kan jag se resultat med Google Ads i ${cityName}?`,
      a: `Google Ads ger synlighet direkt — kampanjerna visas typiskt inom 24 timmar efter aktivering. Mätbara resultat (klick, leads, försäljning) kommer löpande från första veckan. För ${cityName}-företag betyder det att ni kan testa er marknad och se vad som fungerar mycket snabbare än med organisk SEO.`,
    },
    {
      q: `Vad kostar Google Ads för ett företag i ${cityName}?`,
      a: 'Annonseringskostnaden beror helt på er bransch och konkurrens — vissa branscher har låga klickkostnader, andra mycket höga. Vi tar betalt för hanteringsarbetet (strategi, optimering, rapportering) som månadsavgift, och annonsbudgeten betalar ni direkt till Google. Vi optimerar löpande för att sänka er kostnad per klick och höja ROAS.',
    },
    {
      q: `Hur stor budget behövs för att synas i ${cityName}?`,
      a: `Det varierar med branschens konkurrens och era mål. För många mindre företag i ${cityName} räcker det med en blygsam månadsbudget för att få meningsfull trafik. Större aktörer eller mer konkurrensutsatta branscher kräver mer. Vi hjälper er att börja på rätt nivå och skala upp baserat på faktiska resultat.`,
    },
    {
      q: 'Lönar sig Google Ads för små företag?',
      a: `Ja, ofta mycket bra — om kampanjerna är rätt uppsatta. Med skarpa sökord, smart geografisk targeting (t.ex. bara ${cityName} och omnejd) och relevanta annonstexter kan även små företag konkurrera. Det är felhanterade kampanjer som bränner pengar — inte Google Ads i sig.`,
    },
    {
      q: 'Hur skiljer sig Google Ads från SEO?',
      a: `Google Ads ger synlighet direkt mot betalning, SEO bygger organisk synlighet över tid. För ${cityName}-företag fungerar det ofta bäst att kombinera båda — Google Ads för snabba resultat medan SEO-arbetet bygger upp långsiktig ranking utan klickkostnad.`,
    },
    {
      q: `Vilka kampanjtyper passar bäst för företag i ${cityName}?`,
      a: `Det beror på er målgrupp. Sökannonsering passar nästan alla — det fångar kunder som aktivt letar efter er tjänst. För e-handel är shoppingannonser ofta starkast. Remarketing fungerar bra för att fånga tillbaka tidigare besökare. För lokala butiker eller serviceföretag i ${cityName} ger lokala kampanjer i Google Maps mycket bra resultat.`,
    },
    {
      q: 'Hur ofta optimerar ni kampanjerna?',
      a: 'Vi gör daglig övervakning och löpande optimering — sökordsförändringar, budgetjusteringar, A/B-test av annonstexter och justering av geo-targeting. Ni får månadsrapport med konkreta KPI:er (klick, kostnad per klick, konverteringar, ROAS) och vi går igenom resultaten tillsammans regelbundet.',
    },
  ]
}

export function generateStaticParams() {
  return Object.keys(cities).map((stad) => ({ stad }))
}

export function generateMetadata({ params }: { params: { stad: string } }): Metadata {
  const city = cities[params.stad]
  if (!city) return { title: 'Google Ads | JT Media AB' }
  return {
    title: `Google Ads i ${city.name} | Sökannonsering | JT Media AB`,
    description: city.metaDesc,
  }
}

export default function GoogleAdsStadPage({ params }: { params: { stad: string } }) {
  const city = cities[params.stad]
  if (!city) notFound()

  const faqs = buildFaqs(city.name)

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://jtmedia.se/#localbusiness',
    name: 'JT Media AB',
    description: `Google Ads och sökannonsering i ${city.name}`,
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
    serviceType: 'Google Ads och sökannonsering',
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
                Google Ads, {city.name}
              </span>
              <h1 className="font-playfair font-black text-5xl md:text-6xl lg:text-7xl text-black mb-6 leading-tight">
                Google Ads i {city.name}
              </h1>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={150}>
              <p className="text-xl text-black/55 leading-relaxed mb-4">
                {city.intro}
              </p>
              <p className="text-lg text-black/50 leading-relaxed mb-10">
                {city.adsContext}
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={300}>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center font-bold py-3.5 px-7 rounded-full text-black"
                  style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
                >
                  Kom igång →
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
                Google Ads för {city.name}-företag
              </h2>
              <p className="text-black/65 text-lg leading-relaxed mb-5">
                {city.localContent}
              </p>
              <p className="text-black/55 leading-relaxed">
                JT Media AB sitter i Ljungby och arbetar med {city.name}-företag på distans. Det betyder ingen restid, ingen overhead för fysiska möten — men full transparens via löpande digital kommunikation och månadsrapporter med konkreta resultat.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="slide-left">
              <Image
                src="/images/google_ads_v1.webp"
                alt={`Google Ads i ${city.name} – sökannonsering av JT Media AB för ${city.name}-företag`}
                width={800}
                height={600}
                sizes="(max-width: 1024px) 100vw, 600px"
                className="w-full h-auto rounded-3xl"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* What we handle */}
      <section className="py-16 md:py-20 bg-[#F8F8F8]">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal variant="scale-in">
            <div className="text-center mb-16">
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-4">
                Vad vi hanterar
              </h2>
              <p className="text-black/55 text-lg max-w-xl mx-auto">
                Komplett Google Ads-hantering, från strategi till daglig optimering.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { Icon: Search, title: 'Kampanjstrategi', desc: `Vi analyserar er marknad i ${city.name}, identifierar konkurrenterna och skapar en strategi som maximerar er budget.` },
              { Icon: PenTool, title: 'Annonstexter & kreativ', desc: 'Övertygande annonstexter och visuellt material som sticker ut i sökresultaten och driver klick.' },
              { Icon: Settings, title: 'Daglig optimering', desc: 'Vi övervakar och optimerar kampanjerna dagligen, budgivning, söktermer och annonsutformning.' },
              { Icon: BarChart3, title: 'Transparent rapportering', desc: 'Månadsvis rapport med klick, konverteringar, kostnad per klick och ROAS, allt förklarat tydligt.' },
            ].map((s, i) => (
              <ScrollReveal key={s.title} delay={i * 80} variant="scale-in">
                <div className="bg-white rounded-3xl p-8">
                  <div className="w-14 h-14 rounded-2xl bg-brand-green/12 flex items-center justify-center mb-5">
                    <s.Icon className="w-6 h-6 text-brand-green-dark" />
                  </div>
                  <h3 className="font-playfair font-black text-xl text-black mb-3">{s.title}</h3>
                  <p className="text-black/55 leading-relaxed">{s.desc}</p>
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
                Vanliga frågor om Google Ads i {city.name}
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
            </div>
          </ScrollReveal>
          <div className="flex flex-wrap justify-center gap-4">
            <ScrollReveal variant="scale-in" delay={80}>
              <Link
                href={`/hemsida/${params.stad}`}
                className="bg-white rounded-2xl border border-black/8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all px-6 py-4 font-semibold text-black/70 hover:text-black block"
              >
                Hemsida i {city.name} →
              </Link>
            </ScrollReveal>
            <ScrollReveal variant="scale-in" delay={160}>
              <Link
                href={`/seo/${params.stad}`}
                className="bg-white rounded-2xl border border-black/8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all px-6 py-4 font-semibold text-black/70 hover:text-black block"
              >
                SEO i {city.name} →
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
