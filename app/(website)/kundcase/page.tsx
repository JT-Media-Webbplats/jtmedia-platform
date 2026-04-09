import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '../_components/ScrollReveal'

export const metadata: Metadata = {
  title: 'Kundcase — Resultat vi är stolta över | JT Media Sweden',
  description:
    'Se hur vi har hjälpt svenska företag att växa digitalt. Riktiga resultat från riktiga kunder — webb, AI, SEO, Google Ads och sociala medier.',
}

const cases = [
  {
    slug: 'ams-sweden',
    client: 'AMS Sweden',
    image: '/images/cases/AMS-AI-chat.webp',
    tags: ['AI', 'Chatbot', 'Automation'],
    description:
      'En AI-chatbot tränad på tekniska manualer ger servicetekniker omedelbara svar i fält — dygnet runt.',
    site: 'amssweden.com',
  },
  {
    slug: 'hards-transport',
    client: 'Hårds Transport',
    image: '/images/cases/hards-transport.webp',
    tags: ['Webb', 'Sociala medier'],
    description:
      'Från ingen digital närvaro alls till en professionell hemsida och aktiv närvaro på sociala medier.',
    site: 'hardstransport.se',
  },
  {
    slug: 'ljungby-fiber',
    client: 'Ljungby Fiber',
    image: '/images/cases/Ljungby-fiber.webp',
    tags: ['Webb', 'E-handel'],
    description:
      'Ny hemsida med integrerat beställningssystem för fiber — 80% av alla beställningar sker nu online.',
    site: 'ljungbyfiber.se',
  },
  {
    slug: 'molico',
    client: 'Molico',
    image: '/images/cases/molico-webbshop.webp',
    tags: ['Webb', 'Design', 'SEO', 'Sociala medier'],
    description:
      'Komplett digital transformation: webbshop, grafisk design, produktkataloger, sociala medier och SEO.',
    site: 'molico.se',
  },
  {
    slug: 'pekuma',
    client: 'Pekuma',
    image: '/images/cases/Pekuma.webp',
    tags: ['Webb'],
    description:
      'Ren och professionell hemsida som etablerar Pekumas digitala närvaro och ökar lokal synlighet.',
    site: 'pekuma.se',
  },
  {
    slug: 'smefast',
    client: 'Smefast',
    image: '/images/cases/Smefast-interaktiv-karta.webp',
    tags: ['Webb', 'Google Ads', 'Design'],
    description:
      'Hemsida med unik interaktiv lägenhetskartor, Google Ads och sociala medier som driver fler bostadsaffärer.',
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
          <ScrollReveal>
            <span className="inline-block font-bakerie text-sm bg-brand-green/20 text-black px-4 py-1.5 rounded-full mb-6">
              Kundcase
            </span>
            <h1 className="font-playfair font-black text-5xl md:text-6xl lg:text-7xl text-black mb-6 leading-tight">
              Resultat vi är stolta över
            </h1>
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
              <ScrollReveal key={c.slug} delay={i * 70}>
                <Link
                  href={`/kundcase/${c.slug}`}
                  className="group block bg-white rounded-3xl border border-black/6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={c.image}
                      alt={c.client}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-7">
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
                    <div className="flex items-center justify-between">
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
          <ScrollReveal>
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
