import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '../../_components/ScrollReveal'

export const metadata: Metadata = {
  title: 'AI-lösningar & Automation | JT Media Sweden',
  description:
    'Skräddarsydda AI-chatbots, automation och AI-verktyg som arbetar åt er dygnet runt. JT Media bygger intelligenta lösningar för svenska företag.',
}

const aiServices = [
  {
    icon: '💬',
    title: 'AI-chatbots',
    desc: 'Kundservice och support dygnet runt. Vi tränar en AI-assistent på er data — produkter, manualer, FAQ — som svarar snabbt och korrekt.',
  },
  {
    icon: '⚙️',
    title: 'Automatiserade flöden',
    desc: 'Ta bort repetitivt arbete. Vi automatiserar processer som e-post, orderhantering, rapporter och datainsamling med moderna AI-verktyg.',
  },
  {
    icon: '🛠️',
    title: 'Skräddarsydda AI-verktyg',
    desc: 'Behöver ni ett specifikt verktyg? Vi bygger anpassade AI-applikationer — allt från prisoptimering till innehållsgenerering och analys.',
  },
  {
    icon: '🔗',
    title: 'Plattformsintegrationer',
    desc: 'Vi kopplar ihop era befintliga system med AI — CRM, ERP, e-handel och mer. Smidiga integrationer utan krångel.',
  },
]

export default function AIPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-black py-20 md:py-28 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <ScrollReveal>
              <span className="inline-block font-bakerie text-sm bg-brand-green/20 text-brand-green px-4 py-1.5 rounded-full mb-6">
                AI-lösningar
              </span>
              <h1 className="font-playfair font-black text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight">
                AI som arbetar åt er — dygnet runt
              </h1>
              <p className="text-xl text-white/55 leading-relaxed mb-10">
                Sluta lägga tid på uppgifter som en AI kan göra. Vi bygger smarta lösningar som automatiserar, svarar och optimerar — medan ni fokuserar på det som verkligen kräver er.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center font-bold py-3.5 px-7 rounded-full text-black"
                  style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
                >
                  Boka demo →
                </Link>
                <Link
                  href="/kundcase"
                  className="inline-flex items-center font-semibold py-3.5 px-7 rounded-full border-2 border-white/30 text-white hover:border-white transition-colors"
                >
                  Se kundcase
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-4">
                Vad kan vi bygga?
              </h2>
              <p className="text-black/55 text-lg max-w-xl mx-auto">
                AI-lösningar skräddarsydda för er verksamhet — oavsett bransch och storlek.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiServices.map((s, i) => (
              <ScrollReveal key={s.title} delay={i * 70}>
                <div className="bg-[#F8F8F8] rounded-3xl p-8 h-full">
                  <div className="text-4xl mb-5">{s.icon}</div>
                  <h3 className="font-playfair font-black text-xl text-black mb-3">{s.title}</h3>
                  <p className="text-black/55 leading-relaxed">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Case highlight */}
      <section className="bg-[#F8F8F8] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                <Image
                  src="/images/cases/AMS-AI-chat.webp"
                  alt="AMS Sweden AI chatbot"
                  fill
                  className="object-cover"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <span className="inline-block font-bakerie text-xs bg-black text-white px-3 py-1 rounded-full mb-4">
                Kundcase
              </span>
              <h2 className="font-playfair font-black text-3xl md:text-4xl text-black mb-4">
                AMS Sweden — AI-chatbot för servicetekniker
              </h2>
              <p className="text-black/60 leading-relaxed mb-6">
                AMS Sveriges servicetekniker behövde snabba svar i fält — utan att ringa support. Vi byggde en AI-chatbot tränad på tekniska manualer och felkoder som svarar direkt, dygnet runt.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  '40% färre supportsamtal',
                  'Omedelbara svar 24/7 utan väntetid',
                  'Tränad på befintliga manualer och dokumentation',
                ].map((r) => (
                  <li key={r} className="flex items-start gap-3 text-black/65 text-sm">
                    <span className="text-brand-green shrink-0 mt-0.5">✓</span>
                    {r}
                  </li>
                ))}
              </ul>
              <Link
                href="/kundcase/ams-sweden"
                className="inline-flex items-center font-semibold text-black border-2 border-black px-6 py-3 rounded-full text-sm hover:bg-black hover:text-white transition-colors"
              >
                Läs hela caset →
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Why AI section */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-4">
                Varför AI nu?
              </h2>
              <p className="text-black/55 text-lg max-w-2xl mx-auto">
                Företag som inte anpassar sig till AI riskerar att halka efter. De som agerar nu bygger ett försprång som är svårt att ta igen.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                stat: '40%',
                title: 'Sparad tid',
                desc: 'Automatisering av repetitivt arbete sparar i snitt 40% av arbetstiden för de uppgifter vi automatiserar.',
              },
              {
                stat: '24/7',
                title: 'Alltid tillgänglig',
                desc: 'AI-chatbots och automatiserade system arbetar utan pauser, helger eller sjukdagar.',
              },
              {
                stat: '3×',
                title: 'Snabbare respons',
                desc: 'Kunder som får omedelbara svar är tre gånger mer benägna att slutföra ett köp eller boka en tjänst.',
              },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 80}>
                <div className="text-center bg-[#F8F8F8] rounded-3xl p-8">
                  <div className="font-playfair font-black text-5xl text-black mb-3">{item.stat}</div>
                  <h3 className="font-bold text-lg text-black mb-2">{item.title}</h3>
                  <p className="text-black/55 text-sm leading-relaxed">{item.desc}</p>
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
              Nyfiken på vad AI kan göra för er?
            </h2>
            <p className="text-white/55 text-lg mb-10">
              Boka ett kostnadsfritt samtal och låt oss utforska möjligheterna tillsammans.
            </p>
            <Link
              href="/kontakt"
              className="inline-flex items-center font-bold py-4 px-8 rounded-full text-black"
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
