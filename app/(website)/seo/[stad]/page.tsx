import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Settings, Key, PenTool, MapPin } from 'lucide-react'
import ScrollReveal from '../../_components/ScrollReveal'

type City = {
  name: string
  intro: string
  seoContext: string
  localContent: string
  metaDesc: string
}

const cities: Record<string, City> = {
  ljungby: {
    name: 'Ljungby',
    intro: 'Ljungby är en växande stad i hjärtat av Småland med ett starkt lokalt näringsliv.',
    seoContext:
      'Lokal SEO i Ljungby handlar om att synas när invånare och företag i regionen söker efter era produkter och tjänster. Vi optimerar er för de sökord som faktiskt används i Ljungby och Kronoberg.',
    localContent:
      'Som vår hemstad känner vi Ljungbys marknad bättre än de flesta. Här tävlar lokala företag ofta med större aktörer från Värnamo, Växjö och längre bort, vilket gör lokal sökmotoroptimering helt avgörande. Vi arbetar med Ljungbyföretag i alla branscher — från industri och handel till tjänsteföretag — och hjälper er att synas både för Ljungby-specifika sökningar och bredare termer i Sunnerbo-regionen. Tack vare vårt lokala kontor på Stationsgatan har vi en djup förståelse för hur den lokala marknaden fungerar.',
    metaDesc: 'SEO i Ljungby, JT Media AB hjälper lokala företag att synas på Google. Lokal SEO, teknisk optimering och innehållsstrategi för Ljungbyföretag.',
  },
  varnamo: {
    name: 'Värnamo',
    intro: 'Värnamo är känd som möbelstaden och har ett aktivt företagsklimat inom handel och industri.',
    seoContext:
      'I Värnamos konkurrenskraftiga marknad är synlighet på Google avgörande. Vi hjälper möbelföretag, industri och handel att ranka för de sökord som deras kunder faktiskt använder.',
    localContent:
      'Värnamo är en av Sveriges starkaste industri- och möbelorter, vilket betyder att många företag konkurrerar om samma sökord på Google. För Värnamoföretag räcker det inte att bara finnas online — ni behöver synas där era kunder letar. Vi arbetar med både B2B-företag inom industri och tillverkning samt B2C-aktörer inom handel och hantverk, och anpassar SEO-strategin efter er specifika konkurrenssituation. Många av era potentiella kunder söker både lokalt i Värnamo och i hela Småland — vi optimerar er närvaro för båda.',
    metaDesc: 'SEO i Värnamo, professionell sökmotoroptimering för Värnamo-företag. JT Media AB driver organisk trafik och fler kunder via Google.',
  },
  vaxjo: {
    name: 'Växjö',
    intro: 'Växjö är Kronobergs länshuvudstad med ett blomstrande universitetssamhälle och mångfacetterat näringsliv.',
    seoContext:
      'Växjös stora och välutbildade befolkning söker aktivt efter lokala tjänster och produkter online. Med rätt SEO-strategi kan ert företag fånga den trafiken och konvertera den till kunder.',
    localContent:
      'Som Kronobergs länshuvudstad har Växjö en blandning av universitetssamhälle, regional handel och växande näringsliv som skapar ett brett söklandskap. Det innebär stora möjligheter för Växjöföretag som vet hur man positionerar sig rätt. Vi hjälper er att ranka för både lokala "Växjö"-sökningar och bredare regionala termer som täcker hela Kronoberg. Vår strategi anpassas efter er bransch — handel, tjänster eller B2B — och bygger på faktisk sökordsdata, inte gissningar.',
    metaDesc: 'SEO i Växjö, JT Media AB optimerar Växjöföretags Google-synlighet. Lokal SEO, teknisk SEO och innehåll som rankar.',
  },
  markaryd: {
    name: 'Markaryd',
    intro: 'Markaryd är en aktiv gränsstad med stark koppling till Skånemarknaden.',
    seoContext:
      'Markaryds geografiska läge ger er möjlighet att nå kunder från båda sidor om länsgränsen. Med lokal SEO kan vi se till att ni syns både i Kronoberg och i angränsande Skåne.',
    localContent:
      'Markaryds geografiska läge precis vid Skånegränsen ger unika möjligheter för lokal SEO. Företag här kan med rätt strategi ranka både i Kronoberg och i angränsande delar av Skåne — ett område som många byråer missar att optimera för. Vi hjälper Markarydföretag att fånga sökningar från båda sidor om länsgränsen, vilket ofta dubblerar målgruppen utan att budgeten gör det. Lokal sökoptimering kombineras med en tydlig Google Business Profile för att fånga kunder som söker "i närheten".',
    metaDesc: 'SEO i Markaryd, lokal sökmotoroptimering för Markaryd-företag av JT Media AB. Syns på Google, nå fler kunder.',
  },
  halmstad: {
    name: 'Halmstad',
    intro: 'Halmstad är Hallands residensstad med en stor och varierad företagsbas nära kusten.',
    seoContext:
      'Halmstads blandning av turism, handel och industri skapar unika SEO-möjligheter. Vi identifierar de söktermer som dina potentiella kunder i Halmstad och Halland använder och bygger en strategi runt dem.',
    localContent:
      'Halmstad har en stark mix av turism, handel och industri vid kusten, vilket innebär att SEO-strategin behöver hantera både säsongsbaserad efterfrågan och året-runt-trafik. Vi arbetar med Halmstadföretag i alla storlekar — från lokala butiker och serviceföretag till regionala B2B-aktörer — och anpassar arbetet efter era unika förutsättningar. För besöksnäringen är synlighet under sommarsäsongen kritisk, medan andra branscher behöver jämn organisk trafik året om. Båda lägena täcks med rätt sökordsstrategi.',
    metaDesc: 'SEO i Halmstad, JT Media AB driver organisk trafik för Halmstadföretag. Lokal SEO och Google-optimering som ger resultat.',
  },
  helsingborg: {
    name: 'Helsingborg',
    intro: 'Helsingborg är en av Sveriges mest dynamiska städer med en starkt tillväxtorienterad ekonomi.',
    seoContext:
      'Helsingborgs konkurrensutsatta marknad kräver en aggressiv SEO-strategi. Vi analyserar konkurrenterna och hittar möjligheterna där ert företag kan ta marknadsandelar via organisk söktrafik.',
    localContent:
      'Helsingborg är en av Sveriges mest dynamiska och konkurrensutsatta marknader, med en stark tillväxtekonomi och hög andel digitalt mogna företag. Här räcker det inte med "vanlig SEO" — det krävs en aggressiv strategi byggd på systematisk konkurrensanalys. Vi hjälper Helsingborgsföretag att identifiera luckorna där ni kan ta marknadsandelar via organisk söktrafik. Eftersom konkurrensen är hård fokuserar vi ofta på longtail-sökord och specifika nischtermer där ROI:n är högst.',
    metaDesc: 'SEO i Helsingborg, professionell sökmotoroptimering av JT Media AB. Teknisk SEO och innehållsstrategi för Helsingborgsföretag.',
  },
  jonkoping: {
    name: 'Jönköping',
    intro: 'Jönköping är ett regionalt centrum i södra Sverige med ett starkt fokus på handel och logistik.',
    seoContext:
      'Som regionalt centrum har Jönköping en stark lokalsökning. Företag som rankar högt för relevanta Jönköpingssökningar når kunder från hela regionen, inte bara staden.',
    localContent:
      'Jönköping är ett regionalt centrum med starkt fokus på handel, logistik och B2B-näringsliv. Det innebär ofta längre kundresor med flera sökningar innan beslut — något vi adresserar med en strategi som täcker hela köpresan, inte bara den sista klicken. Vi hjälper Jönköpingföretag att synas tidigt när potentiella kunder undersöker, jämför och slutligen är redo att kontakta er. Lokala sökord kombineras med tematiskt innehåll som visar er expertis inom branschen.',
    metaDesc: 'SEO i Jönköping, JT Media AB hjälper Jönköpingsföretag att synas på Google. Lokal SEO och organisk tillväxt för hela regionen.',
  },
  almhult: {
    name: 'Älmhult',
    intro: 'Älmhult är IKEAs hemstad, en innovativ industristad med internationell närvaro.',
    seoContext:
      'Älmhultsandan om enkelhet och funktionalitet gäller även SEO. Vi arbetar strukturerat och effektivt med sökordsanalys, teknisk optimering och innehåll som rankar, och mäter allt.',
    localContent:
      'Älmhult är hemvist för IKEA och har genom det en internationell prägel som få svenska småorter har. Det skapar en marknad där lokala företag ofta arbetar både i sin närregion och internationellt. Vi anpassar SEO-strategin efter detta — lokal sökoptimering kombineras med tematiskt innehåll som rankar både för "Älmhult"-termer och bredare branschsökningar. För Älmhultsföretag är låg lokal konkurrens en fördel som ger snabba resultat med rätt strategi.',
    metaDesc: 'SEO i Älmhult, lokal sökmotoroptimering för Älmhults-företag av JT Media AB. Google-synlighet som ger verkliga resultat.',
  },
  lagan: {
    name: 'Lagan',
    intro: 'Lagan är ett aktivt samhälle i Ljungby kommun med lokala företag som behöver digital närvaro.',
    seoContext:
      'Små samhällen som Lagan har ofta låg konkurrens i sökresultaten, vilket innebär stora möjligheter. Vi hjälper lokala Laganföretag att dominera sökresultaten för relevanta termer.',
    localContent:
      'Lagan har lägre konkurrens i Google-sökningar än större städer, vilket innebär snabbare resultat med rätt strategi. För Laganföretag är det ofta möjligt att ranka topp 3 inom 3–6 månader för relevanta termer — något som tar betydligt längre tid på en marknad som Helsingborg eller Halmstad. Vi hjälper er att dominera lokala sökresultat utan att överbetala för det. Eftersom Lagan ligger i Ljungby kommun arbetar vi även med bredare "Ljungby-och-Lagan"-sökord när det är relevant.',
    metaDesc: 'SEO i Lagan, JT Media AB hjälper lokala Lagan-företag att synas på Google. Lokal SEO med snabba resultat.',
  },
  lessebo: {
    name: 'Lessebo',
    intro: 'Lessebo är känt för sin glasindustri och har ett aktivt lokalt näringsliv som växer digitalt.',
    seoContext:
      'Lessebos unika industriella arv skapar nischade SEO-möjligheter. Vi hjälper er att hitta de specifika söktermer som era potentiella kunder använder och optimerar er närvaro för dem.',
    localContent:
      'Lessebo har ett unikt industriellt arv med glasbruk och nischade tillverkare som ger nischade SEO-möjligheter. Vi använder den lokala kontexten för att identifiera specifika sökord som driver kvalificerad trafik snarare än bara många klick. För många Lessebföretag är låg konkurrens kombinerat med rätt innehåll en mycket kraftfull SEO-fördel — där andra orter kräver stora insatser räcker det här ofta med fokuserat arbete för att ta topplaceringar.',
    metaDesc: 'SEO i Lessebo, professionell sökmotoroptimering för Lessebo-företag av JT Media AB. Syns på Google och nå fler kunder.',
  },
}

type FAQ = { q: string; a: string }

function buildFaqs(cityName: string): FAQ[] {
  return [
    {
      q: `Hur lång tid tar det innan SEO ger resultat i ${cityName}?`,
      a: `De första rörelserna i Google syns ofta efter 2–3 månader. Tydliga, mätbara resultat kommer typiskt efter 4–6 månader, och en stabil topplacering efter 6–12 månader. Hur fort det går beror på er nuvarande synlighet och konkurrensen kring era viktigaste sökord i ${cityName}.`,
    },
    {
      q: `Vad kostar SEO för ett företag i ${cityName}?`,
      a: `Priset varierar beroende på er bransch, konkurrenssituation och hur omfattande arbetet behöver vara. Vi börjar alltid med en kostnadsfri analys där vi går igenom er nuvarande SEO-status och föreslår en konkret plan. Då vet ni exakt vad investeringen ger för utdelning innan ni bestämmer er.`,
    },
    {
      q: `Behöver mitt företag i ${cityName} lokal SEO eller nationell SEO?`,
      a: `Det beror på er målgrupp. Företag som vänder sig till kunder främst i ${cityName} eller regionen tjänar mest på lokal SEO med fokus på "[bransch] ${cityName}"-typ av sökord och en optimerad Google Business Profile. Företag som säljer nationellt eller online behöver istället bredare sökordsstrategi. Många av våra kunder kombinerar båda.`,
    },
    {
      q: `Vilka sökord är viktigast för ${cityName}-företag?`,
      a: `Det varierar helt med bransch, men för lokala företag i ${cityName} handlar det ofta om kombinationer som "[tjänst] ${cityName}", "bästa [tjänst] ${cityName}" och bredare regionala sökningar. Vi gör alltid en sökordsanalys i början där vi identifierar vilka termer era potentiella kunder faktiskt använder, vilken volym de har och hur svår konkurrensen är.`,
    },
    {
      q: 'Kan jag göra SEO själv eller måste jag anlita en byrå?',
      a: `Mycket går att göra själv om man har tid och rätt kompetens — t.ex. skriva bra texter, hålla Google Business Profile uppdaterad och bygga kvalitetsinnehåll. Den tekniska sidan, strukturen och löpande analysen är dock svårare att hantera utan erfarenhet. För de flesta företag i ${cityName} blir det mer kostnadseffektivt att anlita en byrå för det strategiska arbetet och själva fokusera på er kärnverksamhet.`,
    },
    {
      q: 'Hur skiljer sig SEO från Google Ads?',
      a: `SEO bygger organisk synlighet över tid och är "gratis" trafik när rankingen är på plats — men kräver längre arbetstid innan resultat. Google Ads ger trafik direkt, men kostar per klick. För ${cityName}-företag fungerar det ofta bäst att kombinera båda: Google Ads för snabba resultat medan SEO-arbetet bygger upp långsiktig ranking.`,
    },
    {
      q: 'Hur mäter ni resultat?',
      a: 'Vi rapporterar månadsvis med konkreta KPI:er: positionsförändringar för era viktigaste sökord, organisk trafik från Google Search Console, antal leads och konverteringar samt Google Business Profile-statistik. Ni får alltid full insyn i siffrorna och vi förklarar vad som driver utvecklingen.',
    },
  ]
}

export function generateStaticParams() {
  return Object.keys(cities).map((stad) => ({ stad }))
}

export function generateMetadata({ params }: { params: { stad: string } }): Metadata {
  const city = cities[params.stad]
  if (!city) return { title: 'SEO | JT Media AB' }
  return {
    title: `SEO i ${city.name} | Sökmotoroptimering | JT Media AB`,
    description: city.metaDesc,
  }
}

export default function SEOStadPage({ params }: { params: { stad: string } }) {
  const city = cities[params.stad]
  if (!city) notFound()

  const faqs = buildFaqs(city.name)

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://jtmedia.se/#localbusiness',
    name: 'JT Media AB',
    description: `SEO och sökmotoroptimering i ${city.name}`,
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
    serviceType: 'SEO och sökmotoroptimering',
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
                SEO, {city.name}
              </span>
              <h1 className="font-playfair font-black text-5xl md:text-6xl lg:text-7xl text-black mb-6 leading-tight">
                SEO i {city.name}
              </h1>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={150}>
              <p className="text-xl text-black/55 leading-relaxed mb-4">
                {city.intro}
              </p>
              <p className="text-lg text-black/50 leading-relaxed mb-10">
                {city.seoContext}
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={300}>
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

      {/* Local context */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <ScrollReveal variant="slide-right">
              <h2 className="font-playfair font-black text-3xl md:text-4xl text-black mb-6">
                SEO för {city.name}-företag
              </h2>
              <p className="text-black/65 text-lg leading-relaxed mb-5">
                {city.localContent}
              </p>
              <p className="text-black/55 leading-relaxed">
                JT Media AB sitter i Ljungby och arbetar med {city.name}-företag på distans. Det betyder ingen restid, ingen overhead för fysiska möten — men full transparens via löpande digital kommunikation och månadsrapporter.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="slide-left">
              <Image
                src="/images/seo.webp"
                alt={`SEO i ${city.name} – sökmotoroptimering av JT Media AB för ${city.name}-företag`}
                width={800}
                height={600}
                sizes="(max-width: 1024px) 100vw, 600px"
                className="w-full h-auto rounded-3xl"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 md:py-20 bg-[#F8F8F8]">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal variant="scale-in">
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
              { Icon: Settings, title: 'Teknisk SEO-revision', desc: 'Vi granskar er hemsida från grunden, hastighet, indexering, mobilanpassning och strukturerad data.' },
              { Icon: Key, title: 'Lokal sökordsanalys', desc: `Vi identifierar vad kunder i ${city.name} och regionen söker efter och bygger er strategi kring det.` },
              { Icon: PenTool, title: 'SEO-anpassat innehåll', desc: 'Texter och sidor optimerade för rätt sökord, med fokus på läsbarhet och konvertering.' },
              { Icon: MapPin, title: 'Google Business Profile', desc: `Optimering av er Google-profil för bättre synlighet i lokala sökningar och Google Maps i ${city.name}.` },
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
                Vanliga frågor om SEO i {city.name}
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
              Börja synas i {city.name}, idag
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
