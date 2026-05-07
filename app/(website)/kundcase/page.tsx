import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '../_components/ScrollReveal'

export const metadata: Metadata = {
  title: 'Kundcase, Resultat vi är stolta över | JT Media AB',
  description:
    'Se hur vi har hjälpt svenska företag att växa digitalt. Riktiga resultat från riktiga kunder, webb, AI, SEO, Google Ads och sociala medier.',
}

const cases = [
  {
    slug: 'ams-sweden',
    client: 'AMS Sweden',
    image: '/images/clients/ams_sweden_mockup.webp',
    tags: ['AI', 'Chatbot', 'Automation'],
    description:
      'Egenutvecklad AI-chatbot som ger servicetekniker direkta svar ur AMS interna dokumentation, med hänvisning till källan.',
    site: 'amssweden.com',
  },
  {
    slug: 'hards-transport',
    client: 'Hårds Transport',
    image: '/images/clients/hards_transport_mockup.webp',
    tags: ['Webb', 'SEO', 'Sociala medier'],
    description:
      'Ny hemsida byggd för synlighet i sökmotorer och löpande arbete med sociala medier sedan 2022.',
    site: 'hardstransport.se',
  },
  {
    slug: 'ljungby-fiber',
    client: 'Ljungby Fiber',
    image: '/images/clients/ljungby_fiber_mockup.webp',
    tags: ['Webb', 'E-handel'],
    description:
      'Ny hemsida med smart beställningsflöde där kunder kan beställa fiber och tillval direkt online.',
    site: 'ljungbyfiber.se',
  },
  {
    slug: 'molico',
    client: 'Molico',
    image: '/images/clients/molico_mockup.webp',
    tags: ['Webb', 'SEO', 'Sociala medier', 'Google Ads'],
    description:
      'Ny webbshop med över 100 produkter och löpande arbete med SEO, sociala medier och annonsering som driver försäljningen.',
    site: 'molico.se',
  },
  {
    slug: 'pekuma',
    client: 'Pekuma',
    image: '/images/clients/pekuma_mockup.webp',
    tags: ['Webb', 'SEO'],
    description:
      'Ny hemsida uppdelad i tre tydliga delar för VA, Trafik och Speglar, med löpande SEO-arbete sedan lansering.',
    site: 'pekuma.se',
  },
  {
    slug: 'smefast',
    client: 'Smefast',
    image: '/images/clients/smefast_mockup.webp',
    tags: ['Webb', 'SEO', 'Google Ads', 'Sociala medier'],
    description:
      'Ombyggd hemsida med interaktiv lägenhetskarta, plus löpande arbete med sociala medier, SEO och Google Ads sedan 2022.',
    site: 'smefast.se',
  },
]

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

export default function KundcasePage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#F8F8F8] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <ScrollReveal variant="fade-up">
            <span className="inline-block font-bakerie text-sm bg-brand-green/20 text-black px-4 py-1.5 rounded-full mb-6">
              Kundcase
            </span>
            <h1 className="font-playfair font-black text-5xl md:text-6xl lg:text-7xl text-black mb-6 leading-tight">
              Resultat vi är stolta över
            </h1>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={150}>
            <p className="text-xl text-black/55 max-w-2xl mx-auto leading-relaxed">
              Vi mäter vår framgång i era resultat. Här är ett urval av projekt vi är extra stolta över.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Cases grid */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cases.map((c, i) => (
              <ScrollReveal key={c.slug} delay={i * 80} variant="slide-right" className="h-full">
                <Link
                  href={`/kundcase/${c.slug}`}
                  className="group flex h-full flex-col bg-white rounded-3xl border border-black/6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={c.image}
                      alt={c.client}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-7 flex flex-1 flex-col">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {c.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tagColors[tag] ?? 'bg-gray-100 text-gray-600'}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="font-playfair font-black text-xl text-black mb-2">
                      {c.client}
                    </h2>
                    <p className="text-black/55 text-sm leading-relaxed mb-5">
                      {c.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xs text-black/35">{c.site}</span>
                      <span className="text-sm font-semibold text-black group-hover:gap-3 transition-all flex items-center gap-1.5">
                        Läs mer →
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal variant="scale-in">
            <h2 className="font-playfair font-black text-4xl md:text-5xl text-white mb-6">
              Vill du ha liknande resultat?
            </h2>
            <p className="text-white/55 text-lg mb-10">
              Kontakta oss för ett kostnadsfritt samtal om vad vi kan göra för just er.
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
