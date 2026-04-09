import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '../../_components/ScrollReveal'

export const metadata: Metadata = {
  title: 'Sociala medier — Strategi & Content | JT Media Sweden',
  description:
    'Professionell hantering av Instagram, Facebook, LinkedIn och TikTok. Vi skapar innehåll, hanterar era konton och bygger er närvaro på sociala medier.',
}

const platforms = [
  {
    name: 'Instagram',
    icon: '📷',
    desc: 'Visuellt berättande som bygger varumärke och driver engagemang. Reels, stories och inlägg som din målgrupp faktiskt vill se.',
  },
  {
    name: 'Facebook',
    icon: '👥',
    desc: 'Räckvidd och community-byggande för lokala och nationella märken. Organisk närvaro och betald annonsering i kombination.',
  },
  {
    name: 'LinkedIn',
    icon: '💼',
    desc: 'B2B-kommunikation som positionerar er som expert och skapar affärsmöjligheter. Tankeledare-content som konverterar.',
  },
  {
    name: 'TikTok',
    icon: '🎵',
    desc: 'Nå en yngre målgrupp med kreativt videoinnehåll. TikTok-algoritmen är mer generös med räckvidd — perfekt för varumärken som vågar.',
  },
]

const whatsIncluded = [
  { icon: '🗺️', title: 'Strategi', desc: 'Kanalval, målgrupp, ton och redaktionell planering anpassad för er verksamhet.' },
  { icon: '✍️', title: 'Innehållsproduktion', desc: 'Texter, grafik, foto och video som ser professionellt ut och talar till rätt målgrupp.' },
  { icon: '📅', title: 'Schemalagd publicering', desc: 'Vi publicerar vid optimala tider för maximal räckvidd — ni slipper tänka på det.' },
  { icon: '💬', title: 'Engagemang', desc: 'Vi svarar på kommentarer och DMs i ert namn och bygger en aktiv community.' },
  { icon: '📊', title: 'Månadsrapporter', desc: 'Tydliga rapporter med räckvidd, engagemang, följartillväxt och vad vi fokuserar på härnäst.' },
  { icon: '📈', title: 'Betald annonsering', desc: 'Sponsrade inlägg och annonser för att nå utanför din befintliga följarskara (tillval).' },
]

export default function SocialaMedierPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#F8F8F8] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <span className="inline-block font-bakerie text-sm bg-brand-green/20 text-black px-4 py-1.5 rounded-full mb-6">
                Sociala medier
              </span>
              <h1 className="font-playfair font-black text-5xl md:text-6xl text-black mb-6 leading-tight">
                Bygg er digitala närvaro — vi sköter innehållet
              </h1>
              <p className="text-xl text-black/55 leading-relaxed mb-10">
                Sociala medier som engagerar, bygger varumärke och driver leads. Vi tar hand om allt — från strategi till dagligt handhavande — så att ni kan fokusera på verksamheten.
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
                  href="/kundcase"
                  className="inline-flex items-center font-semibold py-3.5 px-7 rounded-full border-2 border-black text-black hover:bg-black hover:text-white transition-colors"
                >
                  Se kundcase
                </Link>
              </div>
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

      {/* Platforms */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-4">
                Plattformar vi hanterar
              </h2>
              <p className="text-black/55 text-lg max-w-xl mx-auto">
                Vi är aktiva på de plattformar som passar er målgrupp bäst.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platforms.map((p, i) => (
              <ScrollReveal key={p.name} delay={i * 70}>
                <div className="bg-[#F8F8F8] rounded-3xl p-8 flex gap-5 h-full">
                  <div className="text-4xl shrink-0">{p.icon}</div>
                  <div>
                    <h3 className="font-playfair font-black text-xl text-black mb-2">{p.name}</h3>
                    <p className="text-black/55 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-[#F8F8F8] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-4">
                Vad ingår?
              </h2>
              <p className="text-black/55 text-lg max-w-xl mx-auto">
                Ett komplett paket för er sociala mediepresens — inget ni behöver tänka på.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatsIncluded.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 60}>
                <div className="bg-white rounded-3xl p-7 h-full border border-black/6 shadow-sm">
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <h3 className="font-playfair font-black text-lg text-black mb-2">{item.title}</h3>
                  <p className="text-black/55 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '500+', label: 'Följare per kund', sub: 'Genomsnittlig tillväxt i år' },
              { value: '4×', label: 'Fler leads', sub: 'Mot ingen social närvaro' },
              { value: '30+', label: 'Inlägg per mån', sub: 'Beroende på paket' },
              { value: '100%', label: 'Ert varumärke', sub: 'Vi pratar som ni' },
            ].map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 70}>
                <div className="text-center bg-[#F8F8F8] rounded-3xl p-7">
                  <div className="font-playfair font-black text-4xl text-black mb-1">{s.value}</div>
                  <div className="text-black font-semibold text-sm mb-1">{s.label}</div>
                  <div className="text-black/40 text-xs">{s.sub}</div>
                </div>
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
              Redo att växa på sociala medier?
            </h2>
            <p className="text-white/55 text-lg mb-10">
              Kontakta oss för ett kostnadsfritt samtal om er sociala mediestrategi.
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
