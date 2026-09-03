import type { Metadata } from 'next'
import Link from 'next/link'
import { Smartphone, Search, Pencil, Zap, Cloud, Wrench, Trophy, BarChart3, Rocket, Lock, Clock } from 'lucide-react'
import ScrollReveal from '../../_components/ScrollReveal'

export const metadata: Metadata = {
  title: 'Webb & Hemsidor',
  description:
    'Professionella hemsidor som rankar högt och konverterar besökare till kunder. Responsiv design, snabb laddning, CMS och support, allt ingår.',
}

const included = [
  {
    Icon: Smartphone,
    title: 'Responsiv design',
    desc: 'Perfekt på alla skärmstorlekar, mobil, surfplatta och dator. Google belönar mobilanpassade sidor.',
  },
  {
    Icon: Search,
    title: 'SEO-redo',
    desc: 'Teknisk SEO är inbyggd från grunden. Rätt struktur, metataggar och laddningstider som sökmotorer gillar.',
  },
  {
    Icon: Pencil,
    title: 'Enkelt CMS',
    desc: 'Uppdatera texter, bilder och sidor själv utan teknisk kunskap, eller låt oss sköta det åt er.',
  },
  {
    Icon: Zap,
    title: 'Snabb laddning',
    desc: 'Optimerade bilder, minimal kod och modern infrastruktur ger laddningstider under 2 sekunder.',
  },
  {
    Icon: Cloud,
    title: 'Hosting & domän',
    desc: 'Vi hjälper till med allt kring domän, e-post och hosting, ni behöver inte tänka på det tekniska.',
  },
  {
    Icon: Wrench,
    title: 'Support & underhåll',
    desc: 'Vi är alltid tillgängliga för justeringar, uppdateringar och support när ni behöver oss.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Möte & kravanalys',
    desc: 'Vi lyssnar på er verksamhet, era mål och er målgrupp. Tillsammans identifierar vi vad hemsidan ska uppnå.',
  },
  {
    number: '02',
    title: 'Design & koncept',
    desc: 'Vi tar fram en design som matchar ert varumärke och konverterar besökare. Ni godkänner innan vi kodar.',
  },
  {
    number: '03',
    title: 'Utveckling',
    desc: 'Vi bygger hemsidan med modern teknik, optimerar för hastighet och säkerställer att allt fungerar perfekt.',
  },
  {
    number: '04',
    title: 'Lansering & support',
    desc: 'Vi lanserar och guidar er genom CMS. Efter lansering finns vi kvar för support och vidareutveckling.',
  },
]

export default function WebbPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#F8F8F8] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <ScrollReveal variant="fade-up">
              <span className="inline-block font-bakerie text-sm bg-brand-green/20 text-black px-4 py-1.5 rounded-full mb-6">
                Webb & Hemsidor
              </span>
              <h1 className="font-playfair font-black text-5xl md:text-6xl lg:text-7xl text-black mb-6 leading-tight">
                Vi bygger hemsidor som säljer
              </h1>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={150}>
              <p className="text-xl text-black/55 leading-relaxed mb-10">
                Modern, snabb och konverterande. En hemsida från JT Media är inte bara snygg, den är byggd för att ranka högt på Google och göra besökare till kunder.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={300}>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center font-bold py-3.5 px-7 rounded-full text-black"
                  style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
                >
                  Offert inom 24 timmar →
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

      {/* What's included */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal variant="slide-right">
            <div className="text-center mb-16">
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-4">
                Vad ingår?
              </h2>
              <p className="text-black/55 text-lg max-w-xl mx-auto">
                Allt ni behöver för en professionell webbnärvaro, inget dolt, inga tillval.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {included.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 80} variant="slide-right">
                <div className="bg-[#F8F8F8] rounded-3xl p-7 h-full">
                  <div className="w-12 h-12 rounded-xl bg-brand-green/12 flex items-center justify-center mb-4">
                    <item.Icon className="w-5 h-5 text-brand-green-dark" />
                  </div>
                  <h3 className="font-playfair font-black text-lg text-black mb-2">
                    {item.title}
                  </h3>
                  <p className="text-black/55 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-[#F8F8F8] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal variant="scale-in">
            <div className="text-center mb-16">
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-4">
                Vår process
              </h2>
              <p className="text-black/55 text-lg max-w-xl mx-auto">
                Från idé till lansering, transparent och effektivt.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 80} variant="scale-in">
                <div className="bg-white rounded-3xl p-7 h-full border border-black/6 shadow-sm">
                  <div className="font-bakerie text-4xl text-brand-green mb-4">{step.number}</div>
                  <h3 className="font-playfair font-black text-lg text-black mb-3">
                    {step.title}
                  </h3>
                  <p className="text-black/55 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Offert inom 24 timmar */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal variant="blur-in">
              <p className="font-bakerie text-brand-green-dark text-base mb-3 tracking-wide">
                Snabbt svar, tydlig offert
              </p>
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-6">
                Offert inom 24 timmar
              </h2>
              <p className="text-black/60 text-lg leading-relaxed mb-6">
                Varje hemsida är unik, därför ger vi aldrig ett pris i blindo. Berätta kort om er verksamhet och vad ni vill uppnå, så återkommer vi med en skräddarsydd offert inom 24 timmar från er förfrågan.
              </p>
              <div className="bg-[#F8F8F8] rounded-3xl p-7 mb-8 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-brand-green/15 flex items-center justify-center shrink-0">
                  <Clock className="w-7 h-7 text-brand-green-dark" />
                </div>
                <div>
                  <div className="text-2xl font-black text-black mb-1">Svar inom 24 timmar</div>
                  <div className="text-black/50 text-sm">Fast pris, tydligt innehåll och en tidplan ni kan lita på.</div>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Skräddarsydd offert utifrån era behov',
                  'Fast pris, inga dolda kostnader',
                  'Kostnadsfri konsultation innan ni bestämmer er',
                  'Ni äger alltid er hemsida och all data',
                ].map((p) => (
                  <li key={p} className="flex items-start gap-3 text-black/65 text-sm">
                    <span className="text-brand-green mt-0.5 shrink-0">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
              <Link
                href="/kontakt"
                className="inline-flex items-center font-bold py-3.5 px-7 rounded-full text-black"
                style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
              >
                Begär offert →
              </Link>
            </ScrollReveal>
            <ScrollReveal variant="blur-in" delay={100}>
              <div className="bg-black rounded-3xl p-10 text-white">
                <h3 className="font-playfair font-black text-2xl mb-6">
                  Varför välja JT Media?
                </h3>
                <ul className="space-y-5">
                  {[
                    { Icon: Trophy, text: 'Lokal byrå med personlig service, ni pratar alltid med grundarna' },
                    { Icon: BarChart3, text: 'Hemsidor byggda för att konvertera, inte bara se bra ut' },
                    { Icon: Rocket, text: 'Snabb leverans, de flesta projekt klara på 3-6 veckor' },
                    { Icon: Lock, text: 'Ingen inlåsning, ni äger alltid er hemsida och data' },
                  ].map((item) => (
                    <li key={item.text} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-green/20 flex items-center justify-center shrink-0">
                        <item.Icon className="w-5 h-5 text-brand-green" />
                      </div>
                      <span className="text-white/70 text-sm leading-relaxed pt-2">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal variant="slide-left">
            <h2 className="font-playfair font-black text-4xl md:text-5xl text-white mb-6">
              Redo att ta nästa steg?
            </h2>
            <p className="text-white/55 text-lg mb-10">
              Skicka en förfrågan idag så har ni en offert inom 24 timmar.
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
