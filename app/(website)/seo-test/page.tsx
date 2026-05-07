import type { Metadata } from 'next'
import Link from 'next/link'
import { Zap, Accessibility, Search, CheckCircle } from 'lucide-react'
import SeoTestTool from './_components/SeoTestTool'
import ScrollReveal from '../_components/ScrollReveal'

export const metadata: Metadata = {
  title: 'Gratis SEO-test, Analysera din hemsida | JT Media AB',
  description:
    'Testa din hemsidas prestanda, SEO och tillgänglighet gratis på 30 sekunder med vårt SEO-verktyg.',
}

export default function SeoTestPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#F8F8F8] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <ScrollReveal variant="fade-up">
            <span className="inline-block font-bakerie text-sm bg-brand-green/20 text-black px-4 py-1.5 rounded-full mb-6">
              Gratis verktyg
            </span>
            <h1 className="font-playfair font-black text-5xl md:text-6xl text-black mb-6 leading-tight">
              Testa din hemsida gratis
            </h1>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={150}>
            <p className="text-xl text-black/55 max-w-2xl mx-auto leading-relaxed">
              Få en gratis analys av din hemsidas prestanda, SEO och tillgänglighet på 30 sekunder.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Tool */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal variant="scale-in">
            <SeoTestTool />
          </ScrollReveal>
        </div>
      </section>

      {/* Info section */}
      <section className="bg-[#F8F8F8] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal variant="slide-right">
            <div className="text-center mb-12">
              <h2 className="font-playfair font-black text-3xl md:text-4xl text-black mb-4">
                Vad mäter vi?
              </h2>
              <p className="text-black/55 max-w-xl mx-auto">
                Vi mäter samma tekniska faktorer som faktiskt påverkar er ranking på Google och upplevelsen för era besökare.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                Icon: Zap,
                title: 'Prestanda',
                desc: 'Laddningstider, responsivitet och hur snabbt innehållet visas. Direkt kopplat till er Google-ranking.',
              },
              {
                Icon: Accessibility,
                title: 'Tillgänglighet',
                desc: 'Om alla användare kan använda er hemsida, inklusive personer med funktionsnedsättningar.',
              },
              {
                Icon: Search,
                title: 'SEO',
                desc: 'Tekniska SEO-faktorer som påverkar hur Google kan hitta, läsa och ranka er hemsida.',
              },
              {
                Icon: CheckCircle,
                title: 'Best Practices',
                desc: 'Modern webbutveckling, säkerhet, HTTPS, korrekt kod och andra faktorer som påverkar trovärdighet.',
              },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 80} variant="slide-right">
                <div className="bg-white rounded-3xl p-7 border border-black/6 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-brand-green/12 flex items-center justify-center mb-4">
                    <item.Icon className="w-5 h-5 text-brand-green-dark" />
                  </div>
                  <h3 className="font-playfair font-black text-lg text-black mb-2">{item.title}</h3>
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
          <ScrollReveal variant="blur-in">
            <h2 className="font-playfair font-black text-4xl md:text-5xl text-white mb-6">
              Låg poäng? Vi fixar det.
            </h2>
            <p className="text-white/55 text-lg mb-10">
              Kontakta oss för ett kostnadsfritt samtal om hur vi kan förbättra er hemsida.
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
