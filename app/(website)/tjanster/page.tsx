import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '../_components/ScrollReveal'

export const metadata: Metadata = {
  title: 'Tjänster — Webb, SEO, AI & Design | JT Media Sweden',
  description:
    'Alla digitala tjänster under ett tak. Webb, AI-lösningar, SEO, Google Ads, sociala medier, grafisk design och Digital Boost.',
}

const services = [
  {
    icon: '🌐',
    title: 'Webb & Hemsidor',
    description:
      'Snabba, konverterande hemsidor byggda för att ranka högt och sälja. Från enkla presentationssidor till komplexa webapplikationer med CMS och e-handel.',
    href: '/tjanster/webb',
    color: 'bg-blue-50',
  },
  {
    icon: '🤖',
    title: 'AI-lösningar',
    description:
      'Chatbots, automatiserade arbetsflöden och skräddarsydda AI-verktyg som arbetar åt er dygnet runt — och sparar tid, pengar och resurser.',
    href: '/tjanster/ai',
    color: 'bg-purple-50',
  },
  {
    icon: '📈',
    title: 'SEO',
    description:
      'Teknisk SEO, innehållsstrategi och lokal sökmotoroptimering som driver rätt trafik till er hemsida och konverterar besökare till kunder.',
    href: '/tjanster/seo',
    color: 'bg-green-50',
  },
  {
    icon: '🎯',
    title: 'Google Ads',
    description:
      'Sökannonsering, shoppingannonser och remarketing som ger resultat från dag ett. Vi hanterar allt — från strategi till daglig optimering.',
    href: '/tjanster/google-ads',
    color: 'bg-yellow-50',
  },
  {
    icon: '📱',
    title: 'Sociala medier',
    description:
      'Strategi, content och hantering av Instagram, Facebook, LinkedIn och TikTok. Vi skapar engagemang som bygger ert varumärke och driver leads.',
    href: '/tjanster/sociala-medier',
    color: 'bg-pink-50',
  },
  {
    icon: '⚡',
    title: 'Digital Boost',
    description:
      'Allt ni behöver i ett paket — webb, SEO, sociala medier och design. Perfekt för företag som vill ta ett stort kliv digitalt utan att tänka på vad som behövs.',
    href: '/tjanster/digital-boost',
    color: 'bg-orange-50',
  },
  {
    icon: '🎨',
    title: 'Grafisk design',
    description:
      'Logotyper, varumärkesprofiler, trycksaker och digitalt material som kommunicerar vem ni är — och varför ni är det bästa valet för era kunder.',
    href: '/tjanster/grafisk-design',
    color: 'bg-red-50',
  },
]

export default function TjansterPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#F8F8F8] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <ScrollReveal>
            <span className="inline-block font-bakerie text-sm bg-brand-green/20 text-black px-4 py-1.5 rounded-full mb-6">
              Full-service digital byrå
            </span>
            <h1 className="font-playfair font-black text-5xl md:text-6xl lg:text-7xl text-black mb-6 leading-tight">
              Våra tjänster
            </h1>
            <p className="text-xl text-black/55 max-w-2xl mx-auto leading-relaxed">
              Vi erbjuder allt ni behöver för att växa digitalt — under ett tak, med ett team som bryr sig om ert resultat.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <ScrollReveal key={s.href} delay={i * 60}>
                <Link
                  href={s.href}
                  className="group block bg-white rounded-3xl border border-black/6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-8 h-full"
                >
                  <div className={`w-14 h-14 rounded-2xl ${s.color} flex items-center justify-center text-2xl mb-6`}>
                    {s.icon}
                  </div>
                  <h2 className="font-playfair font-black text-xl text-black mb-3">
                    {s.title}
                  </h2>
                  <p className="text-black/55 text-sm leading-relaxed mb-6">
                    {s.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-black group-hover:gap-3 transition-all">
                    Läs mer →
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Image section */}
      <section className="bg-[#F8F8F8] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                <Image
                  src="/images/grafisk-design.webp"
                  alt="Grafisk design och kreativt arbete"
                  fill
                  className="object-cover"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-6">
                Allt under ett tak
              </h2>
              <p className="text-black/60 text-lg leading-relaxed mb-6">
                Istället för att samordna flera leverantörer får ni ett team som hanterar allt — från strategi till genomförande. Det sparar tid, pengar och huvudvärk.
              </p>
              <p className="text-black/60 leading-relaxed mb-8">
                Vi är en liten byrå med stor kapacitet. Varje kund får direkt tillgång till grundarna och ett personligt engagemang som stora byråer sällan kan erbjuda.
              </p>
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 text-black font-bold py-3 px-7 rounded-full text-sm"
                style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
              >
                Kontakta oss →
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Social media image section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-6">
                Digital närvaro som ger resultat
              </h2>
              <p className="text-black/60 text-lg leading-relaxed mb-6">
                Oavsett om ni behöver en ny hemsida, bättre synlighet på Google eller mer engagerade följare på sociala medier — vi vet vad som fungerar och levererar mätbara resultat.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Transparenta rapporter varje månad',
                  'Mätbara mål och tydliga KPIer',
                  'Personlig kontakt med grundarna',
                  'Ingen bindningstid på de flesta tjänster',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-black/65">
                    <span className="text-brand-green mt-0.5 shrink-0">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href="/kundcase"
                className="inline-flex items-center gap-2 font-semibold text-black border-2 border-black px-6 py-3 rounded-full text-sm hover:bg-black hover:text-white transition-colors"
              >
                Se våra kundcase →
              </Link>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="relative rounded-3xl overflow-hidden aspect-[3/4] max-w-sm mx-auto lg:mx-0 lg:ml-auto">
                <Image
                  src="/images/sociala-medier-telefonbild.webp"
                  alt="Sociala medier på telefon"
                  fill
                  className="object-cover"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="font-playfair font-black text-4xl md:text-5xl text-white mb-6">
              Redo att komma igång?
            </h2>
            <p className="text-white/55 text-lg mb-10">
              Kontakta oss för ett kostnadsfritt samtal om vad vi kan göra för er.
            </p>
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 font-bold py-4 px-8 rounded-full text-black"
              style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
            >
              Boka ett möte →
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
