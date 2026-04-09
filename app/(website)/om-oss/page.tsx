import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '../_components/ScrollReveal'

export const metadata: Metadata = {
  title: 'Om oss — JT Media Sweden | Ljungby',
  description:
    'Vi är Theo och Jakob — grundarna av JT Media Sweden i Ljungby. Lär känna teamet bakom er externa marknadsavdelning.',
}

const values = [
  {
    icon: '🔍',
    title: 'Transparens',
    desc: 'Ni ser alltid vad vi gör, varför vi gör det och vad det ger. Inga dolda avgifter, ingen bullshit — bara tydlig kommunikation.',
  },
  {
    icon: '📊',
    title: 'Resultatfokus',
    desc: 'Vi mäter allt och optimerar kontinuerligt. Om något inte fungerar säger vi det — och vi hittar något som fungerar bättre.',
  },
  {
    icon: '🤝',
    title: 'Personlig service',
    desc: 'Ni pratar alltid med grundarna, inte med en account manager. Liten byrå, personlig kontakt och genuint engagemang i ert resultat.',
  },
  {
    icon: '🚀',
    title: 'Teknikfirst',
    desc: 'Vi omfamnar ny teknologi — AI, automation och moderna plattformar — för att ge er ett digitalt försprång mot konkurrenterna.',
  },
]

const stats = [
  { value: '50+', label: 'Nöjda kunder' },
  { value: '5+', label: 'År av erfarenhet' },
  { value: '100+', label: 'Projekt levererade' },
  { value: '100%', label: 'Nöjdhetsgrad' },
]

export default function OmOssPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#F8F8F8] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <span className="inline-block font-bakerie text-sm bg-brand-green/20 text-black px-4 py-1.5 rounded-full mb-6">
                Om oss
              </span>
              <h1 className="font-playfair font-black text-5xl md:text-6xl lg:text-7xl text-black mb-6 leading-tight">
                Vi är JT Media
              </h1>
              <p className="text-xl text-black/55 leading-relaxed mb-6">
                En liten byrå med stor kapacitet och ett genuint engagemang för att hjälpa svenska företag att växa digitalt.
              </p>
              <p className="text-black/50 leading-relaxed mb-10">
                Vi är passion-drivna digitalister baserade i Ljungby. Vi tror att alla företag — oavsett storlek och plats — förtjänar en digital partner som bryr sig om deras resultat lika mycket som de gör det själva.
              </p>
              <Link
                href="/kontakt"
                className="inline-flex items-center font-bold py-3.5 px-7 rounded-full text-black"
                style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
              >
                Jobba med oss →
              </Link>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                <Image
                  src="/images/team/theo-jakob-team.webp"
                  alt="Theo och Jakob — JT Media Sweden"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                <Image
                  src="/images/team/theo-jakob-team-bild-2.webp"
                  alt="JT Media Sweden team"
                  fill
                  className="object-cover"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <span className="inline-block font-bakerie text-sm bg-black text-white px-4 py-1.5 rounded-full mb-6">
                Vår historia
              </span>
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-6">
                Från Ljungby till hela Sverige
              </h2>
              <div className="space-y-4 text-black/60 leading-relaxed">
                <p>
                  JT Media grundades i Ljungby av Theo Brandt och Jakob Jolheden — med en enkel tanke: att lokala och regionala svenska företag förtjänar tillgång till same digital kompetens som stora storstad-bolag, men till en rimlig kostnad.
                </p>
                <p>
                  Vi började med hemsidor. Sedan lade vi till SEO, sociala medier och grafisk design. Sen kom AI-projekten — och en insikt om att vi kan erbjuda något unikt: ett litet team som rör sig snabbt, arbetar med de senaste verktygen och alltid levererar personlig service.
                </p>
                <p>
                  Idag hjälper vi 50+ företag i södra Sverige och fortsätter växa — alltid med Ljungby som bas och hela Sverige som marknad.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-[#F8F8F8] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-4">
                Möt teamet
              </h2>
              <p className="text-black/55 text-lg max-w-xl mx-auto">
                Grundarna bakom JT Media — alltid tillgängliga, alltid engagerade.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Theo */}
            <ScrollReveal delay={0}>
              <div className="bg-white rounded-3xl border border-black/6 shadow-sm overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src="/images/team/theo.webp"
                    alt="Theo Brandt"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-7">
                  <h3 className="font-playfair font-black text-2xl text-black mb-1">Theo Brandt</h3>
                  <p className="text-brand-green font-semibold text-sm mb-4">Grundare & Webb</p>
                  <p className="text-black/55 text-sm leading-relaxed mb-5">
                    Theo driver det tekniska arbetet — från webbutveckling och AI-projekt till plattformsbygge. Med ett öga för design och ett huvud för kod ser han till att allt vi levererar är snabbt, stabilt och byggt för framtiden.
                  </p>
                  <a
                    href="tel:+46767680202"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-black/70 hover:text-black transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    076-768 02 02
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Jakob */}
            <ScrollReveal delay={100}>
              <div className="bg-white rounded-3xl border border-black/6 shadow-sm overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src="/images/team/jakob.webp"
                    alt="Jakob Jolheden"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-7">
                  <h3 className="font-playfair font-black text-2xl text-black mb-1">Jakob Jolheden</h3>
                  <p className="text-brand-green font-semibold text-sm mb-4">Grundare & Digital strategi</p>
                  <p className="text-black/55 text-sm leading-relaxed mb-5">
                    Jakob är strategen som ser helhetsbilden. Han leder arbetet med SEO, Google Ads, sociala medier och digital marknadsstrategi — och ser till att varje insats är kopplad till mätbara affärsmål.
                  </p>
                  <a
                    href="tel:+46736980131"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-black/70 hover:text-black transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    073-698 01 31
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-4">
                Vad som gör oss annorlunda
              </h2>
              <p className="text-black/55 text-lg max-w-xl mx-auto">
                Det handlar inte om storlek — det handlar om engagemang, kompetens och att faktiskt bry sig om era resultat.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 70}>
                <div className="bg-[#F8F8F8] rounded-3xl p-7 flex gap-5">
                  <div className="text-3xl shrink-0">{v.icon}</div>
                  <div>
                    <h3 className="font-playfair font-black text-lg text-black mb-2">{v.title}</h3>
                    <p className="text-black/55 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
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

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-6">
              Jobba med oss
            </h2>
            <p className="text-black/55 text-lg mb-10">
              Nyfiken på vad vi kan göra för er? Boka ett kostnadsfritt samtal — inga förpliktelser, inga säljtricks.
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
