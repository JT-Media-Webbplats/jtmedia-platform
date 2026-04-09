import {
  Globe,
  Bot,
  TrendingUp,
  Share2,
  Palette,
  DollarSign,
  Users,
  Zap,
  Rocket,
  Sparkles,
  ArrowRight,
  MapPin,
  Mail,
  Phone,
  CheckCircle,
} from 'lucide-react'
import ScrollReveal from './_components/ScrollReveal'

const clients = [
  'Lagans GK',
  'LBY Tech',
  'Ljungby Fiber',
  'Smefast',
  'Molico',
  'Hårds Transport',
  'AMS Sweden',
  'Opido',
  'Ljungby Schakt',
  'Pekuma',
]

const services = [
  {
    title: 'Webb & Hemsidor',
    desc: 'Snabba, konverterande hemsidor byggda för att ranka högt och sälja. Från landningssidor till komplexa webapplikationer.',
    Icon: Globe,
  },
  {
    title: 'AI-lösningar',
    desc: 'Chatbots, automatiserade arbetsflöden och skräddarsydda AI-verktyg som sparar tid och ökar kapaciteten.',
    Icon: Bot,
  },
  {
    title: 'SEO & Digital Boost',
    desc: 'Syns när det gäller. Teknisk SEO, innehållsstrategi och lokal sökmotoroptimering som driver rätt trafik.',
    Icon: TrendingUp,
  },
  {
    title: 'Sociala medier',
    desc: 'Strategi, content och hantering som bygger följarskara och skapar engagemang på Instagram, Facebook och LinkedIn.',
    Icon: Share2,
  },
  {
    title: 'Grafisk design',
    desc: 'Logotyper, varumärkesprofiler, trycksaker och digitalt material som kommunicerar vem ni är och varför ni är bäst.',
    Icon: Palette,
  },
]

const aiCapabilities = [
  {
    tag: 'AI & Automation',
    title: 'Smarta AI-lösningar',
    desc: 'Vi bygger kundspecifika AI-chatbots, automatiserade innehållsflöden och intelligenta bokningssystem som arbetar åt er dygnet runt.',
    featured: false,
    Icon: Bot,
  },
  {
    tag: 'Custom Platforms',
    title: 'Skräddarsydda plattformar',
    desc: 'Behöver ni mer än en hemsida? Vi utvecklar kundportaler, interna verktyg och SaaS-plattformar byggda exakt för er verksamhet.',
    featured: true,
    Icon: Rocket,
  },
  {
    tag: 'Advanced Web Apps',
    title: 'Avancerade webbapplikationer',
    desc: 'Full-stack webapplikationer med realtidsdata, API-integrationer och skalbar infrastruktur. Tekniken som driver er nästa fas.',
    featured: false,
    Icon: Globe,
  },
]

const stats = [
  { value: '10+', label: 'Aktiva kunder' },
  { value: '50+', label: 'Projekt levererade' },
  { value: '3×', label: 'Snittökning i trafik' },
  { value: '100%', label: 'Nöjdhetsgrad' },
]

const whyPoints = [
  {
    title: 'En fast månadskostnad',
    desc: 'Inga löner, arbetsgivaravgifter, semester eller sjukfrånvaro. Bara resultat.',
    Icon: DollarSign,
  },
  {
    title: 'Hela teamet, direkt',
    desc: 'Webbdesigner, SEO-specialist, copywriter och strateg — allt ingår.',
    Icon: Users,
  },
  {
    title: 'Snabbt och smidigt',
    desc: 'Inga långa processer. Vi agerar snabbt och kommunicerar rakt.',
    Icon: Zap,
  },
  {
    title: 'Alltid i framkant',
    desc: 'Vi ligger steget före med AI, plattformar och nya digitala trender.',
    Icon: Rocket,
  },
]

const workExamples = [
  { client: 'Lagans GK', type: 'Hemsida', bg: 'from-green-100 to-green-50' },
  { client: 'AMS Sweden', type: 'AI Chatbot', bg: 'from-blue-100 to-blue-50' },
  { client: 'Opido', type: 'SEO', bg: 'from-purple-100 to-purple-50' },
  { client: 'LBY Tech', type: 'Hemsida', bg: 'from-amber-100 to-amber-50' },
  { client: 'Ljungby Fiber', type: 'Digital strategi', bg: 'from-teal-100 to-teal-50' },
  { client: 'Smefast', type: 'Grafisk design', bg: 'from-rose-100 to-rose-50' },
]

export default function HomePage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════
          HERO — White, bright, bold
      ═══════════════════════════════════════════════ */}
      <section className="bg-white overflow-hidden">
        <div
          className="pointer-events-none absolute top-0 right-0 w-[600px] h-[500px] opacity-25"
          style={{
            background: 'radial-gradient(ellipse at 80% 20%, #A8D570 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-green/15 border border-brand-green/30 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse shrink-0" />
              <span className="font-bakerie text-black/70 text-sm tracking-wide">
                Ljungby, Sverige
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl xl:text-[4.25rem] font-black leading-[1.02] tracking-tight text-black">
              Din externa
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #5fa832 0%, #A8D570 60%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                marknads&shy;avdelning.
              </span>
            </h1>

            <p className="mt-6 text-lg text-black/50 leading-relaxed max-w-lg font-normal">
              Till en bråkdel av kostnaden. JT Media Sweden levererar
              webb, AI, SEO och design — allt under ett tak.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#kontakt"
                className="inline-flex items-center gap-2 text-black px-7 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-lg animate-glow"
                style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
              >
                Boka gratis möte
              </a>
              <a
                href="#tjanster"
                className="inline-flex items-center gap-2 border-2 border-black/10 text-black/70 px-7 py-3.5 rounded-xl font-medium text-sm hover:border-brand-green hover:text-black transition-all"
              >
                Se tjänster <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="mt-12 flex items-center gap-3">
              <div className="flex -space-x-2">
                {['LG', 'LF', 'AS'].map((init) => (
                  <div
                    key={init}
                    className="w-8 h-8 rounded-full bg-brand-green border-2 border-white flex items-center justify-center text-black text-[10px] font-black"
                  >
                    {init}
                  </div>
                ))}
              </div>
              <p className="text-sm text-black/45">
                Betrodda av <span className="text-black font-semibold">10+ företag</span> i Sverige
              </p>
            </div>
          </div>

          {/* Right — mock analytics card */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative animate-float" style={{ transform: 'rotate(2deg)' }}>
              <div className="bg-white rounded-2xl p-5 w-80 shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-black/6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs text-black/35 mb-0.5">Månadsöversikt</p>
                    <p className="text-sm font-bold text-black">Digital tillväxt</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-[#3a8a00] text-xs font-semibold bg-brand-green/20 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                    Live
                  </span>
                </div>

                <div
                  className="rounded-xl p-4 mb-4"
                  style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
                >
                  <p className="text-black/60 text-xs mb-1 font-medium">Organisk trafik</p>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-black text-black">+127%</p>
                    <svg viewBox="0 0 40 24" className="w-16 h-8">
                      <polyline points="0,22 8,16 16,18 24,10 32,12 40,2" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points="0,22 8,16 16,18 24,10 32,12 40,2" fill="none" stroke="rgba(0,0,0,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: 'Besökare/mån', value: '2 847' },
                    { label: 'Konvertering', value: '4.8%' },
                  ].map((m) => (
                    <div key={m.label} className="bg-black/4 rounded-xl p-3">
                      <p className="text-black/35 text-[10px] mb-1">{m.label}</p>
                      <p className="text-black font-bold text-lg">{m.value}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5">
                  <p className="text-[10px] text-black/25 uppercase tracking-widest font-semibold">
                    Senaste leads
                  </p>
                  {[
                    { name: 'Lagans GK', time: 'Just nu' },
                    { name: 'LBY Tech', time: '3 min' },
                    { name: 'Ljungby Fiber', time: '11 min' },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                        <span className="text-xs text-black/60">{item.name}</span>
                      </div>
                      <span className="text-[10px] text-black/25">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="absolute -bottom-5 -left-6 bg-white rounded-xl px-4 py-2.5 flex items-center gap-2 animate-float-slow"
                style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.12)', transform: 'rotate(-2deg)' }}
              >
                <CheckCircle className="w-3.5 h-3.5 text-brand-green shrink-0" />
                <p className="text-xs font-bold text-black">SEO-ranking ↑ 14 plats</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CLIENTS — Light gray, marquee with edge fade
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#F8F8F8] border-y border-black/5 py-10">
        <ScrollReveal className="mb-6 text-center">
          <p className="font-bakerie text-black/40 text-base tracking-wide">
            Betrodda av
          </p>
        </ScrollReveal>
        <div className="overflow-hidden marquee-fade">
          <div className="flex">
            <div className="flex shrink-0 animate-marquee gap-14 items-center pr-14">
              {[...clients, ...clients].map((c, i) => (
                <span
                  key={i}
                  className="text-sm font-black text-black/25 hover:text-brand-green-dark transition-colors whitespace-nowrap uppercase tracking-widest cursor-default"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SERVICES — White + dot pattern, Lucide icons
      ═══════════════════════════════════════════════ */}
      <section id="tjanster" className="bg-white py-28 relative dot-pattern-light">
        <div className="relative max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-xl mb-16">
              <p className="font-bakerie text-brand-green-dark text-base mb-3 tracking-wide">
                Vad vi gör
              </p>
              <h2 className="text-4xl sm:text-5xl font-black text-black leading-tight">
                Allt en marknads&shy;avdelning behöver.
              </h2>
              <p className="mt-4 text-black/45 leading-relaxed text-lg">
                Fem kärnkompetenser. Ett tight team. Inga mellanhänder.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <ScrollReveal key={s.title} delay={i * 80}>
                <div className="group relative h-full bg-white border border-black/8 rounded-2xl p-8 hover:border-brand-green hover:shadow-[0_16px_48px_rgba(168,213,112,0.22)] hover:scale-[1.02] transition-all duration-300 cursor-default overflow-hidden">
                  {/* Left accent bar */}
                  <div className="absolute left-0 top-6 bottom-6 w-[3px] bg-brand-green rounded-r-full scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />

                  <div className="w-12 h-12 rounded-xl bg-brand-green/12 group-hover:bg-brand-green flex items-center justify-center mb-5 transition-all duration-300">
                    <s.Icon className="w-5 h-5 text-brand-green-dark group-hover:text-black transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-black text-black mb-3">{s.title}</h3>
                  <p className="text-sm text-black/45 leading-relaxed">{s.desc}</p>
                  <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-brand-green-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Läs mer <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          WHY JT MEDIA — Black + dot pattern, Lucide icons
      ═══════════════════════════════════════════════ */}
      <section id="om-oss" className="bg-black text-white py-28 relative overflow-hidden">
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 dot-pattern pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <ScrollReveal>
            <p className="font-bakerie text-brand-green text-base mb-4 tracking-wide">
              Varför JT Media
            </p>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-6">
              En hel marknads&shy;avdelning.{' '}
              <span className="text-brand-green">En fast kostnad.</span>
            </h2>
            <p className="text-white/60 leading-relaxed mb-8 text-lg">
              Att anställa ett fullt marknadsföringsteam kostar hundratusentals kronor per år.
              Med JT Media får du samma kapacitet — utan overhead.
            </p>
            <a
              href="#kontakt"
              className="inline-flex items-center gap-2 text-black px-7 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
            >
              Prata med oss <ArrowRight className="w-4 h-4" />
            </a>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {whyPoints.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 100}>
                <div className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl p-6 hover:border-brand-green/50 hover:bg-white/12 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-brand-green/20 flex items-center justify-center mb-4">
                    <p.Icon className="w-5 h-5 text-brand-green" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{p.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          AI & NEW CAPABILITIES — Light green gradient
      ═══════════════════════════════════════════════ */}
      <section id="ai" className="py-28 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f0fbe5 50%, #e6f7d4 100%)' }}>
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-green/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-brand-green/15 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div
                className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-6 border"
                style={{ background: 'rgba(168,213,112,0.2)', borderColor: 'rgba(168,213,112,0.4)' }}
              >
                <Sparkles className="w-4 h-4 text-brand-green-dark" />
                <span className="font-bakerie text-brand-green-dark text-sm tracking-wide">
                  Nästa generation
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-black leading-tight mb-5">
                Vi är mer än en webbyrå.
              </h2>
              <p className="text-black/50 max-w-xl mx-auto leading-relaxed text-lg">
                JT Media kliver in i avancerade plattformar, AI-lösningar och skräddarsydda
                webapplikationer. Tekniken som tar ditt företag till nästa nivå.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-3 gap-5">
            {aiCapabilities.map((cap, i) => (
              <ScrollReveal key={cap.title} delay={i * 100}>
                <div
                  className={`h-full rounded-2xl p-8 border-2 transition-all hover:-translate-y-1 hover:scale-[1.01] duration-300 ${
                    cap.featured
                      ? 'border-transparent shadow-[0_16px_50px_rgba(168,213,112,0.45)]'
                      : 'bg-white border-black/8 hover:border-brand-green hover:shadow-[0_12px_40px_rgba(168,213,112,0.18)]'
                  }`}
                  style={cap.featured ? { background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' } : {}}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${
                      cap.featured ? 'bg-black/12' : 'bg-brand-green/12'
                    }`}
                  >
                    <cap.Icon className={`w-5 h-5 ${cap.featured ? 'text-black' : 'text-brand-green-dark'}`} />
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-widest mb-4 block ${
                      cap.featured ? 'text-black/50' : 'text-brand-green-dark'
                    }`}
                  >
                    {cap.tag}
                  </span>
                  <h3 className={`text-xl font-black mb-4 leading-tight ${cap.featured ? 'text-black' : 'text-black'}`}>
                    {cap.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${cap.featured ? 'text-black/60' : 'text-black/50'}`}>
                    {cap.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          STATS
      ═══════════════════════════════════════════════ */}
      <section className="bg-white py-24 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <p className="text-center font-bakerie text-black/30 text-base mb-14 tracking-wide">
              Resultat i siffror
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 80}>
                <div className="text-center group">
                  <p
                    className="text-6xl sm:text-7xl font-black tracking-tight mb-3 transition-colors group-hover:text-brand-green-dark"
                    style={{ color: i % 2 === 0 ? '#000000' : '#5fa832' }}
                  >
                    {s.value}
                  </p>
                  <p className="text-sm text-black/40 font-medium uppercase tracking-wider">
                    {s.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          WORK EXAMPLES — Placeholder grid
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#F8F8F8] py-28 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="font-bakerie text-brand-green-dark text-base mb-3 tracking-wide">
                  Vårt arbete
                </p>
                <h2 className="text-4xl sm:text-5xl font-black text-black leading-tight">
                  Projekt vi är stolta över.
                </h2>
              </div>
              <a
                href="#kontakt"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-black/50 hover:text-black transition-colors"
              >
                Se alla <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {workExamples.map((ex, i) => (
              <ScrollReveal key={ex.client} delay={i * 70}>
                <div className="group rounded-2xl overflow-hidden border border-black/6 bg-white hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  {/* Placeholder image area */}
                  <div
                    className={`aspect-[16/10] bg-gradient-to-br ${ex.bg} flex items-center justify-center relative`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center shadow-sm">
                        <Globe className="w-5 h-5 text-black/30" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-xs font-bold text-black/60 px-2.5 py-1 rounded-full">
                      {ex.type}
                    </div>
                  </div>
                  {/* Card footer */}
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-black text-sm">{ex.client}</p>
                      <p className="text-xs text-black/40 mt-0.5">{ex.type}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-black/5 group-hover:bg-brand-green flex items-center justify-center transition-all duration-300">
                      <ArrowRight className="w-4 h-4 text-black/30 group-hover:text-black transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SEO TESTER
      ═══════════════════════════════════════════════ */}
      <section id="seo-tester" className="bg-white py-28 border-t border-black/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <p className="font-bakerie text-brand-green-dark text-base mb-4 tracking-wide">
              Gratis verktyg
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-black leading-tight mb-5">
              Hur mår din hemsida?
            </h2>
            <p className="text-black/45 mb-10 leading-relaxed text-lg">
              Testa din hemsidas SEO-hälsa, hastighet och synlighet gratis.
              Få en rapport direkt — inga kortuppgifter krävs.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input
                type="url"
                placeholder="https://dinhemsida.se"
                disabled
                className="flex-1 bg-white border-2 border-brand-green/50 rounded-xl px-6 py-3.5 text-sm font-medium placeholder-black/25 outline-none cursor-not-allowed shadow-sm"
              />
              <button
                disabled
                className="inline-flex items-center justify-center gap-2 text-black px-7 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest cursor-not-allowed opacity-70"
                style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
              >
                <TrendingUp className="w-4 h-4" />
                Testa nu
              </button>
            </div>
            <p className="mt-4 text-xs text-black/30 font-bakerie tracking-wide">
              Kommer snart — anmäl dig för tidig tillgång
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TEAM
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#F8F8F8] py-24 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="font-bakerie text-brand-green-dark text-base mb-3 tracking-wide">
                Teamet
              </p>
              <h2 className="text-4xl font-black text-black">Personerna bakom.</h2>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {[
              { name: 'Theo', phone: '076-768 02 02', tel: '+46767680202', role: 'Strategi & Webb' },
              { name: 'Jakob', phone: '073-698 01 31', tel: '+46736980131', role: 'Design & Content' },
            ].map((p, i) => (
              <ScrollReveal key={p.name} delay={i * 120}>
                <div className="group bg-white border border-black/6 rounded-2xl p-8 hover:border-brand-green hover:shadow-[0_12px_40px_rgba(168,213,112,0.2)] hover:-translate-y-1 transition-all duration-300">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-5 group-hover:scale-110 transition-transform duration-300"
                    style={{ background: 'linear-gradient(135deg, #000 0%, #333 100%)' }}
                  >
                    {p.name[0]}
                  </div>
                  <h3 className="text-xl font-black text-black mb-1">{p.name}</h3>
                  <p className="text-sm text-black/40 mb-4">{p.role}</p>
                  <a
                    href={`tel:${p.tel}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-green-dark hover:text-brand-green transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {p.phone}
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA — Dark bg, atmospheric green glow (not flat green)
      ═══════════════════════════════════════════════ */}
      <section id="kontakt" className="py-32 bg-[#060606] relative overflow-hidden">
        {/* Atmospheric green glow blobs */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% 60%, rgba(168,213,112,0.18) 0%, transparent 70%)',
          }}
        />
        <div
          className="pointer-events-none absolute -top-20 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px]"
          style={{ background: 'rgba(168,213,112,0.1)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 right-1/4 w-[300px] h-[300px] rounded-full blur-[100px]"
          style={{ background: 'rgba(168,213,112,0.08)' }}
        />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <div
              className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-8"
              style={{ background: 'rgba(168,213,112,0.1)', borderColor: 'rgba(168,213,112,0.25)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
              <span className="font-bakerie text-brand-green text-sm tracking-wide">
                Redo att börja?
              </span>
            </div>

            <h2 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-6">
              Låt oss växa
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #A8D570 0%, #c4e49a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                tillsammans.
              </span>
            </h2>

            <p className="text-white/45 text-xl mb-12 leading-relaxed max-w-xl mx-auto">
              Boka ett gratis strategimöte. Vi lyssnar, analyserar och berättar
              exakt vad vi kan göra för er — utan förpliktelser.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="mailto:info@jtmediasweden.com"
                className="inline-flex items-center justify-center gap-2 text-black px-9 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-[0_8px_32px_rgba(168,213,112,0.4)] animate-glow"
                style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
              >
                <Mail className="w-4 h-4" />
                info@jtmediasweden.com
              </a>
              <a
                href="tel:+46767680202"
                className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/70 px-9 py-4 rounded-xl font-medium text-sm hover:border-white/35 hover:text-white transition-all"
              >
                <Phone className="w-4 h-4" />
                Ring Theo
              </a>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/30 font-medium">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Stationsgatan 2, 341 60 Ljungby
              </span>
              <span className="hidden sm:block text-white/15">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                info@jtmediasweden.com
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
