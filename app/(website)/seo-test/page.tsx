import type { Metadata } from 'next'
import Link from 'next/link'
import SeoTestTool from './_components/SeoTestTool'

export const metadata: Metadata = {
  title: 'Gratis SEO-test — Analysera din hemsida | JT Media Sweden',
  description:
    'Testa din hemsidas prestanda, SEO och tillgänglighet gratis på 30 sekunder. Powered by Google PageSpeed Insights.',
}

export default function SeoTestPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#F8F8F8] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block font-bakerie text-sm bg-brand-green/20 text-black px-4 py-1.5 rounded-full mb-6">
            Gratis verktyg
          </span>
          <h1 className="font-playfair font-black text-5xl md:text-6xl text-black mb-6 leading-tight">
            Testa din hemsida gratis
          </h1>
          <p className="text-xl text-black/55 max-w-2xl mx-auto leading-relaxed">
            Få en gratis analys av din hemsidas prestanda, SEO och tillgänglighet på 30 sekunder — direkt från Googles egna mätverktyg.
          </p>
        </div>
      </section>

      {/* Tool */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <SeoTestTool />
        </div>
      </section>

      {/* Info section */}
      <section className="bg-[#F8F8F8] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-playfair font-black text-3xl md:text-4xl text-black mb-4">
              Vad mäter vi?
            </h2>
            <p className="text-black/55 max-w-xl mx-auto">
              Vi använder Google PageSpeed Insights — samma verktyg Google använder för att bedöma er hemsida.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '⚡',
                title: 'Prestanda',
                desc: 'Laddningstider, responsivitet och hur snabbt innehållet visas. Direkt kopplat till er Google-ranking.',
              },
              {
                icon: '♿',
                title: 'Tillgänglighet',
                desc: 'Om alla användare kan använda er hemsida — inklusive personer med funktionsnedsättningar.',
              },
              {
                icon: '🔍',
                title: 'SEO',
                desc: 'Tekniska SEO-faktorer som påverkar hur Google kan hitta, läsa och ranka er hemsida.',
              },
              {
                icon: '✅',
                title: 'Best Practices',
                desc: 'Modern webbutveckling — säkerhet, HTTPS, korrekt kod och andra faktorer som påverkar trovärdighet.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-3xl p-7 border border-black/6 shadow-sm">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-playfair font-black text-lg text-black mb-2">{item.title}</h3>
                <p className="text-black/55 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
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
        </div>
      </section>
    </div>
  )
}
