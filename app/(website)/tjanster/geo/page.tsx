import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, FileText, ShieldCheck, Layers, Search, Bot, ArrowRight } from 'lucide-react'
import ScrollReveal from '../../_components/ScrollReveal'

export const metadata: Metadata = {
  title: 'GEO, Generative Engine Optimization | JT Media AB',
  description:
    'Syns i ChatGPT, Google AI Overviews, Perplexity och Gemini. GEO (Generative Engine Optimization) gör att AI-tjänster rekommenderar ert företag när kunder frågar.',
  openGraph: {
    title: 'GEO, Generative Engine Optimization | JT Media AB',
    description:
      'Syns i ChatGPT, Google AI Overviews, Perplexity och Gemini. Vi optimerar ert innehåll så att AI-tjänster rekommenderar ert företag.',
  },
}

const geoServices = [
  {
    Icon: Sparkles,
    title: 'AI-synlighetsanalys',
    desc: 'Vi kartlägger hur ChatGPT, Gemini, Perplexity och Googles AI Overviews svarar när någon frågar om era tjänster idag, och vilka konkurrenter som nämns istället för er.',
  },
  {
    Icon: FileText,
    title: 'Innehåll som AI citerar',
    desc: 'AI-modeller föredrar tydliga, faktabaserade och välstrukturerade texter. Vi skriver om och bygger ut ert innehåll så att det blir den källa AI-tjänsterna väljer att citera.',
  },
  {
    Icon: Layers,
    title: 'Strukturerad data och entiteter',
    desc: 'Schema.org, konsekventa företagsuppgifter och tydliga kopplingar mellan ert varumärke, era tjänster och er ort. Det gör att AI förstår vilka ni är och vad ni gör.',
  },
  {
    Icon: ShieldCheck,
    title: 'Auktoritet och omnämnanden',
    desc: 'AI-tjänster litar på källor som andra litar på. Vi arbetar med recensioner, branschsajter, kataloger och pressomnämnanden som stärker ert varumärke i AI-modellernas ögon.',
  },
]

const comparison = [
  { label: 'Målet', seo: 'Ranka högt i Googles sökresultat', geo: 'Bli rekommenderad i AI-svar' },
  { label: 'Var ni syns', seo: 'Google, Bing och lokala sökningar', geo: 'ChatGPT, Gemini, Perplexity, AI Overviews' },
  { label: 'Vad som mäts', seo: 'Positioner, klick och organisk trafik', geo: 'Omnämnanden, citeringar och hänvisningar' },
  { label: 'Vad som krävs', seo: 'Teknik, sökord och länkar', geo: 'Tydlighet, fakta, struktur och auktoritet' },
]

const steps = [
  {
    number: '01',
    title: 'Nulägesanalys',
    desc: 'Vi ställer de frågor era kunder ställer till AI-tjänsterna och dokumenterar exakt vad de svarar idag.',
  },
  {
    number: '02',
    title: 'Innehållsplan',
    desc: 'Vi identifierar vilka sidor, texter och fakta som saknas för att AI ska kunna rekommendera er med säkerhet.',
  },
  {
    number: '03',
    title: 'Genomförande',
    desc: 'Vi skriver, strukturerar och märker upp innehållet, och ser till att ert företag beskrivs konsekvent överallt på nätet.',
  },
  {
    number: '04',
    title: 'Uppföljning',
    desc: 'Varje månad mäter vi hur ofta ni nämns i AI-svaren och justerar strategin efter vad som ger effekt.',
  },
]

export default function GEOPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#F8F8F8] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <ScrollReveal variant="fade-up">
              <span className="inline-block font-bakerie text-sm bg-brand-green/20 text-black px-4 py-1.5 rounded-full mb-6">
                GEO
              </span>
              <h1 className="font-playfair font-black text-5xl md:text-6xl lg:text-7xl text-black mb-6 leading-tight">
                Syns när kunderna frågar AI
              </h1>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={150}>
              <p className="text-xl text-black/55 leading-relaxed mb-10">
                Allt fler börjar sin kundresa i ChatGPT, Gemini eller Googles AI Overviews istället för i en vanlig sökruta. GEO, Generative Engine Optimization, ser till att AI-tjänsterna rekommenderar just ert företag när någon frågar.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={300}>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center font-bold py-3.5 px-7 rounded-full text-black"
                  style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
                >
                  Få en GEO-analys →
                </Link>
                <Link
                  href="/tjanster/seo"
                  className="inline-flex items-center font-semibold py-3.5 px-7 rounded-full border-2 border-black text-black hover:bg-black hover:text-white transition-colors"
                >
                  Läs om SEO
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* What is GEO */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal variant="slide-right">
              <p className="font-bakerie text-brand-green-dark text-base mb-3 tracking-wide">
                Vad är GEO?
              </p>
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-6">
                Nästa steg efter SEO
              </h2>
              <p className="text-black/60 text-lg leading-relaxed mb-5">
                SEO handlar om att ranka i en lista med tio blå länkar. GEO handlar om att bli det svar en AI-tjänst faktiskt ger. När någon skriver "vilken webbyrå i Ljungby ska jag anlita?" i ChatGPT får de inte en lista, de får en rekommendation.
              </p>
              <p className="text-black/60 leading-relaxed mb-5">
                AI-modellerna väljer sina källor utifrån hur tydligt, trovärdigt och välstrukturerat innehållet är. Företag som beskriver sig konsekvent, svarar på konkreta frågor och backas upp av andra källor blir de som nämns.
              </p>
              <p className="text-black/60 leading-relaxed">
                Det goda är att GEO och SEO förstärker varandra. Det mesta vi gör för att AI ska förstå er gör också att Google rankar er högre.
              </p>
            </ScrollReveal>
            <ScrollReveal variant="slide-left" delay={100}>
              <div className="bg-black rounded-3xl p-8 md:p-10 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-green/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-brand-green" />
                  </div>
                  <p className="text-sm text-white/50">Exempel på en fråga till AI</p>
                </div>
                <p className="font-playfair text-xl md:text-2xl leading-snug mb-6">
                  "Vilken byrå i Småland kan hjälpa mig med en ny hemsida och SEO?"
                </p>
                <div className="border-t border-white/10 pt-6 space-y-3">
                  <p className="text-xs uppercase tracking-widest text-white/40 font-semibold">Utan GEO</p>
                  <p className="text-white/60 text-sm">AI:n nämner tre konkurrenter och vet inte att ni finns.</p>
                  <p className="text-xs uppercase tracking-widest text-brand-green font-semibold pt-3">Med GEO</p>
                  <p className="text-white/80 text-sm">AI:n rekommenderar er med namn, beskriver vad ni gör och länkar till er hemsida.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="bg-[#F8F8F8] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal variant="slide-right">
            <div className="text-center mb-16">
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-4">
                Hur vi jobbar med GEO
              </h2>
              <p className="text-black/55 text-lg max-w-xl mx-auto">
                Fyra områden som avgör om AI-tjänsterna väljer er eller någon annan.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {geoServices.map((s, i) => (
              <ScrollReveal key={s.title} delay={i * 80} variant="slide-right">
                <div className="bg-white rounded-3xl p-8 h-full border border-black/6 shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-brand-green/12 flex items-center justify-center mb-5">
                    <s.Icon className="w-6 h-6 text-brand-green-dark" />
                  </div>
                  <h3 className="font-playfair font-black text-xl text-black mb-3">{s.title}</h3>
                  <p className="text-black/55 leading-relaxed">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SEO vs GEO */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal variant="scale-in">
            <div className="text-center mb-12">
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-4">
                SEO och GEO, sida vid sida
              </h2>
              <p className="text-black/55 text-lg max-w-xl mx-auto">
                Två discipliner med samma syfte: att era kunder hittar er först.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="scale-in" delay={100}>
            <div className="rounded-3xl border border-black/6 shadow-sm overflow-hidden">
              <div className="grid grid-cols-3 bg-black text-white text-xs sm:text-sm font-bold uppercase tracking-widest">
                <div className="px-4 sm:px-6 py-4"></div>
                <div className="px-4 sm:px-6 py-4 flex items-center gap-2"><Search className="w-4 h-4 text-brand-green" /> SEO</div>
                <div className="px-4 sm:px-6 py-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-brand-green" /> GEO</div>
              </div>
              {comparison.map((row, i) => (
                <div key={row.label} className={`grid grid-cols-3 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-[#F8F8F8]'}`}>
                  <div className="px-4 sm:px-6 py-4 font-semibold text-black">{row.label}</div>
                  <div className="px-4 sm:px-6 py-4 text-black/60">{row.seo}</div>
                  <div className="px-4 sm:px-6 py-4 text-black/60">{row.geo}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Process */}
      <section className="bg-[#F8F8F8] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal variant="scale-in">
            <div className="text-center mb-16">
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-black mb-4">
                Så går det till
              </h2>
              <p className="text-black/55 text-lg max-w-xl mx-auto">
                Från nulägesanalys till mätbar synlighet i AI-svaren.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 80} variant="scale-in">
                <div className="bg-white rounded-3xl p-7 h-full border border-black/6 shadow-sm">
                  <div className="font-bakerie text-4xl text-brand-green mb-4">{step.number}</div>
                  <h3 className="font-playfair font-black text-lg text-black mb-3">{step.title}</h3>
                  <p className="text-black/55 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="bg-black py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal variant="scale-in">
            <div className="text-center mb-16">
              <h2 className="font-playfair font-black text-4xl md:text-5xl text-white mb-4">
                Vad ni kan förvänta er
              </h2>
              <p className="text-white/50 text-lg max-w-xl mx-auto">
                GEO är fortfarande nytt, och det är just därför försprånget är så stort för de som börjar nu.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: 'Först', label: 'Ut i er bransch lokalt' },
              { value: '2-4 mån', label: 'Till första omnämnanden' },
              { value: '1 rapport', label: 'Varje månad, i klartext' },
              { value: '0', label: 'Bindningstid' },
            ].map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 80} variant="scale-in">
                <div className="text-center">
                  <div className="font-playfair font-black text-5xl text-brand-green mb-2">{s.value}</div>
                  <div className="text-white/50 text-sm">{s.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SEO cross link */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal variant="blur-in">
            <div className="bg-[#F8F8F8] rounded-3xl p-10 md:p-16 text-center">
              <h2 className="font-playfair font-black text-3xl md:text-4xl text-black mb-4">
                Grunden är fortfarande SEO
              </h2>
              <p className="text-black/55 text-lg mb-8 max-w-xl mx-auto">
                En snabb, teknisk stabil hemsida med bra innehåll är förutsättningen för både Google och AI. Börja med ett gratis SEO-test och se var ni står.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/seo-test"
                  className="inline-flex items-center font-bold py-4 px-8 rounded-full text-black"
                  style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
                >
                  Starta gratis SEO-test →
                </Link>
                <Link
                  href="/tjanster/seo"
                  className="inline-flex items-center gap-2 font-semibold py-4 px-8 rounded-full border-2 border-black text-black hover:bg-black hover:text-white transition-colors"
                >
                  Om vår SEO <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal variant="fade-up-soft">
            <h2 className="font-playfair font-black text-4xl md:text-5xl text-white mb-6">
              Vill ni veta vad AI säger om er idag?
            </h2>
            <p className="text-white/55 text-lg mb-10">
              Kontakta oss så gör vi en kostnadsfri nulägesanalys. Ni får svar och en offert inom 24 timmar.
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
