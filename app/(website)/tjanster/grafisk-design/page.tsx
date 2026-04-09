import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '../../_components/ScrollReveal'

export const metadata: Metadata = {
  title: 'Grafisk Design — Logotyp & Varumärke | JT Media Sweden',
  description:
    'Professionell grafisk design i Ljungby. Logotyper, varumärkesprofiler, trycksaker och digitalt material som kommunicerar ert varumärke med kraft.',
}

const designServices = [
  {
    icon: '✏️',
    title: 'Logotyp & identitet',
    desc: 'En logotyp som sticker ut och håller länge. Vi tar fram koncept som speglar er verksamhet, era värderingar och er målgrupp.',
  },
  {
    icon: '📖',
    title: 'Varumärkesprofil',
    desc: 'Komplett visuell identitet — färgpalett, typografi, bildstil och grafiska riktlinjer som säkerställer konsekvens i all kommunikation.',
  },
  {
    icon: '🖨️',
    title: 'Trycksaker',
    desc: 'Visitkort, broschyrer, affischer, kataloger och rollups som ser professionella ut och lämnar ett bestående intryck.',
  },
  {
    icon: '💻',
    title: 'Digitalt material',
    desc: 'Mallar för sociala medier, banners, presentationer och nyhetsbrev — designade för att matcha er visuella identitet.',
  },
  {
    icon: '📦',
    title: 'Förpackningsdesign',
    desc: 'Förpackningar och etiketter som sticker ut i butikshyllan och förmedlar ert varumärkes kvalitet och personlighet.',
  },
  {
    icon: '📚',
    title: 'Kataloger & lookbooks',
    desc: 'Produktkataloger och lookbooks i print och digitalt format — stilrena och säljande material för er verksamhet.',
  },
]

export default function GrafiskDesignPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#F8F8F8] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <span className="inline-block font-bakerie text-sm bg-brand-green/20 text-black px-4 py-1.5 rounded-full mb-6">
                Grafisk design
              </span>
              <h1 className="font-playfair font-black text-5xl md:text-6xl text-black mb-6 leading-tight">
                Design som kommunicerar vem ni är
              </h1>
              <p className="text-xl text-black/55 leading-relaxed mb-10">
                En stark visuell identitet är inte en lyx — det är en investering. Vi skapar design som bygger förtroende, sticker ut bland konkurrenterna och gör att potentiella kunder väljer just er.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center font-bold py-3.5 px-7 rounded-full text-black"
                  style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
                >
                  Berätta om ert projekt →
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
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                <Image
                  src="/images/grafisk-design.webp"
                  alt="Grafisk design och varumärkesarbete"
                  fill
                  className="object-cover"
                />
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
                Vad vi designar
              </h2>
              <p className="text-black/55 text-lg max-w-xl mx-auto">
                Från logotyp till komplett varumärkesprofil — vi designar allt ert företag behöver.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designServices.map((s, i) => (
              <ScrollReveal key={s.title} delay={i * 60}>
                <div className="bg-[#F8F8F8] rounded-3xl p-7 h-full">
                  <div className="text-3xl mb-4">{s.icon}</div>
                  <h3 className="font-playfair font-black text-lg text-black mb-2">{s.title}</h3>
                  <p className="text-black/55 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-[#F8F8F8] py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-4">
                Så arbetar vi
              </h2>
              <p className="text-black/55 text-lg max-w-xl mx-auto">
                Designprocessen är strukturerad och transparent — ni är alltid involverade.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Briefing', desc: 'Vi lär känna er verksamhet, era konkurrenter, er målgrupp och vad ni vill kommunicera.' },
              { num: '02', title: 'Koncept', desc: 'Vi tar fram 2–3 designkoncept och presenterar dem med motiveringar — ni väljer väg.' },
              { num: '03', title: 'Förfining', desc: 'Valda konceptet förfinas utifrån er feedback tills det är perfekt.' },
              { num: '04', title: 'Leverans', desc: 'Ni får alla filer i rätt format för print och digitalt — redo att använda direkt.' },
            ].map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 80}>
                <div className="bg-white rounded-3xl p-7 h-full border border-black/6 shadow-sm">
                  <div className="font-bakerie text-4xl text-brand-green mb-4">{step.num}</div>
                  <h3 className="font-playfair font-black text-lg text-black mb-2">{step.title}</h3>
                  <p className="text-black/55 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Molico case highlight */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="bg-black rounded-3xl p-10 md:p-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="inline-block font-bakerie text-xs bg-brand-green/20 text-brand-green px-3 py-1 rounded-full mb-4">
                    Kundcase
                  </span>
                  <h2 className="font-playfair font-black text-3xl md:text-4xl text-white mb-4">
                    Molico — Komplett designsystem
                  </h2>
                  <p className="text-white/60 leading-relaxed mb-6">
                    Molico behövde en komplett digital transformation. Vi skapade ett sammanhängande designsystem — webbshop, produktkataloger, grafisk profil och sociala medier-mallar — som resulterade i fördubblad onlineförsäljning.
                  </p>
                  <ul className="space-y-2 mb-8">
                    {['Ny logotyp och varumärkesprofil', 'Produktkataloger i print och digitalt', 'Mallar för sociala medier', 'Webbshop i ny design'].map((r) => (
                      <li key={r} className="flex items-start gap-3 text-white/60 text-sm">
                        <span className="text-brand-green shrink-0">✓</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/kundcase/molico"
                    className="inline-flex items-center font-semibold text-black px-6 py-3 rounded-full text-sm"
                    style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
                  >
                    Läs hela caset →
                  </Link>
                </div>
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                  <Image
                    src="/images/cases/molico-webbshop.webp"
                    alt="Molico webbshop design"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="font-playfair font-black text-4xl md:text-5xl text-white mb-6">
              Dags att uppgradera ert varumärke?
            </h2>
            <p className="text-white/55 text-lg mb-10">
              Kontakta oss för ett kostnadsfritt samtal om ert designprojekt.
            </p>
            <Link
              href="/kontakt"
              className="inline-flex items-center font-bold py-4 px-8 rounded-full text-black"
              style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
            >
              Berätta om ert projekt →
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
