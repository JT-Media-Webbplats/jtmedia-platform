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
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    title: 'AI-lösningar',
    desc: 'Chatbots, automatiserade arbetsflöden och skräddarsydda AI-verktyg som sparar tid och ökar kapaciteten.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
      </svg>
    ),
  },
  {
    title: 'SEO & Digital Boost',
    desc: 'Syns när det gäller. Teknisk SEO, innehållsstrategi och lokal sökmotoroptimering som driver rätt trafik.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  {
    title: 'Sociala medier',
    desc: 'Strategi, content och hantering som bygger följarskara och skapar engagemang på Instagram, Facebook och LinkedIn.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
  },
  {
    title: 'Grafisk design',
    desc: 'Logotyper, varumärkesprofiler, trycksaker och digitalt material som kommunicerar vem ni är och varför ni är bäst.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
]

const aiCapabilities = [
  {
    tag: 'AI & Automation',
    title: 'Smarta AI-lösningar',
    desc: 'Vi bygger kundspecifika AI-chatbots, automatiserade innehållsflöden och intelligenta bokningssystem som arbetar åt er dygnet runt.',
    featured: false,
  },
  {
    tag: 'Custom Platforms',
    title: 'Skräddarsydda plattformar',
    desc: 'Behöver ni mer än en hemsida? Vi utvecklar kundportaler, interna verktyg och SaaS-plattformar byggda exakt för er verksamhet.',
    featured: true,
  },
  {
    tag: 'Advanced Web Apps',
    title: 'Avancerade webbapplikationer',
    desc: 'Full-stack webapplikationer med realtidsdata, API-integrationer och skalbar infrastruktur. Tekniken som driver er nästa fas.',
    featured: false,
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
    icon: '💰',
  },
  {
    title: 'Hela teamet, direkt',
    desc: 'Webbdesigner, SEO-specialist, copywriter och strateg — allt ingår.',
    icon: '👥',
  },
  {
    title: 'Snabbt och smidigt',
    desc: 'Inga långa processer. Vi agerar snabbt och kommunicerar rakt.',
    icon: '⚡',
  },
  {
    title: 'Alltid i framkant',
    desc: 'Vi ligger steget före med AI, plattformar och nya digitala trender.',
    icon: '🚀',
  },
]

export default function HomePage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════
          HERO — White, bright, bold
      ═══════════════════════════════════════════════ */}
      <section className="bg-white overflow-hidden">
        {/* Subtle green tint blob top-right */}
        <div
          className="pointer-events-none absolute top-0 right-0 w-[600px] h-[500px] opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 80% 20%, #A8D570 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 grid lg:grid-cols-2 gap-16 items-center">
          {/* ── Left copy ── */}
          <div>
            {/* Location badge — Bakerie font */}
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
                className="relative inline-block"
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
                style={{
                  background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)',
                }}
              >
                Boka gratis möte
              </a>
              <a
                href="#tjanster"
                className="inline-flex items-center gap-2 border-2 border-black/10 text-black/70 px-7 py-3.5 rounded-xl font-medium text-sm hover:border-brand-green hover:text-black transition-all"
              >
                Se tjänster ↓
              </a>
            </div>

            {/* Social proof */}
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

          {/* ── Right: mock analytics card ── */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative animate-float" style={{ transform: 'rotate(2deg)' }}>
              {/* Main card */}
              <div className="bg-white rounded-2xl p-5 w-80 shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-black/6">
                {/* Card header */}
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

                {/* Main metric — green card */}
                <div
                  className="rounded-xl p-4 mb-4"
                  style={{
                    background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)',
                  }}
                >
                  <p className="text-black/60 text-xs mb-1 font-medium">Organisk trafik</p>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-black text-black">+127%</p>
                    <svg viewBox="0 0 40 24" className="w-16 h-8">
                      <polyline
                        points="0,22 8,16 16,18 24,10 32,12 40,2"
                        fill="none"
                        stroke="rgba(0,0,0,0.25)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <polyline
                        points="0,22 8,16 16,18 24,10 32,12 40,2"
                        fill="none"
                        stroke="rgba(0,0,0,0.7)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Two metrics */}
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

                {/* Activity */}
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

              {/* Floating badge */}
              <div
                className="absolute -bottom-5 -left-6 bg-white rounded-xl px-4 py-2.5 flex items-center gap-2 animate-float-slow"
                style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.12)', transform: 'rotate(-2deg)' }}
              >
                <div className="w-2 h-2 rounded-full bg-brand-green" />
                <p className="text-xs font-bold text-black">SEO-ranking ↑ 14 plats</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CLIENTS — Light gray, marquee
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#F8F8F8] border-y border-black/5 py-10 overflow-hidden">
        <ScrollReveal className="mb-6 text-center">
          <p className="font-bakerie text-black/40 text-base tracking-wide">
            Betrodda av
          </p>
        </ScrollReveal>
        <div className="flex">
          <div className="flex shrink-0 animate-marquee gap-14 items-center pr-14">
            {[...clients, ...clients].map((c, i) => (
              <span
                key={i}
                className="text-sm font-black text-black/25 hover:text-brand-green-dark transition-colors whitespace-nowrap uppercase tracking-widest"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SERVICES — White, cards with green accents
      ═══════════════════════════════════════════════ */}
      <section id="tjanster" className="bg-white py-28">
        <div className="max-w-7xl mx-auto px-6">
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
                <div className="group h-full bg-white border-2 border-black/6 rounded-2xl p-8 hover:border-brand-green hover:shadow-[0_12px_40px_rgba(168,213,112,0.2)] hover:-translate-y-1 transition-all duration-300 cursor-default">
                  {/* Icon circle */}
                  <div className="w-12 h-12 rounded-xl bg-brand-green/15 group-hover:bg-brand-green flex items-center justify-center text-brand-green-dark group-hover:text-black mb-5 transition-all duration-300">
                    {s.icon}
                  </div>
                  <h3 className="text-lg font-black text-black mb-3">{s.title}</h3>
                  <p className="text-sm text-black/45 leading-relaxed">{s.desc}</p>
                  <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-brand-green-dark opacity-0 group-hover:opacity-100 transition-opacity">
                    Läs mer
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
                      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          WHY JT MEDIA — Black, contrast section
      ═══════════════════════════════════════════════ */}
      <section id="om-oss" className="bg-black text-white py-28">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <ScrollReveal>
            <p className="font-bakerie text-brand-green text-base mb-4 tracking-wide">
              Varför JT Media
            </p>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-6">
              En hel marknads&shy;avdelning.{' '}
              <span className="text-brand-green">En fast kostnad.</span>
            </h2>
            <p className="text-white/50 leading-relaxed mb-8 text-lg">
              Att anställa ett fullt marknadsföringsteam kostar hundratusentals kronor per år.
              Med JT Media får du samma kapacitet — utan overhead.
            </p>
            <a
              href="#kontakt"
              className="inline-flex items-center gap-2 text-black px-7 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all"
              style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
            >
              Prata med oss →
            </a>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {whyPoints.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 100}>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-brand-green/40 hover:bg-white/8 transition-all duration-300">
                  <div className="text-2xl mb-4">{p.icon}</div>
                  <h3 className="font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{p.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          AI & NEW CAPABILITIES — Light green gradient, bright
      ═══════════════════════════════════════════════ */}
      <section id="ai" className="py-28 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f0fbe5 50%, #e6f7d4 100%)' }}>
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-green/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-brand-green/15 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div
                className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-6 border"
                style={{ background: 'rgba(168,213,112,0.2)', borderColor: 'rgba(168,213,112,0.4)' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-brand-green-dark">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
                </svg>
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
                  className={`h-full rounded-2xl p-8 border-2 transition-all hover:-translate-y-1 duration-300 ${
                    cap.featured
                      ? 'border-transparent text-black shadow-[0_16px_50px_rgba(168,213,112,0.4)]'
                      : 'bg-white border-black/8 hover:border-brand-green hover:shadow-[0_12px_40px_rgba(168,213,112,0.15)]'
                  }`}
                  style={
                    cap.featured
                      ? { background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }
                      : {}
                  }
                >
                  <span
                    className={`text-xs font-bold uppercase tracking-widest mb-5 block ${
                      cap.featured ? 'text-black/50' : 'text-brand-green-dark'
                    }`}
                  >
                    {cap.tag}
                  </span>
                  <h3
                    className={`text-xl font-black mb-4 leading-tight ${
                      cap.featured ? 'text-black' : 'text-black'
                    }`}
                  >
                    {cap.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${
                      cap.featured ? 'text-black/60' : 'text-black/50'
                    }`}
                  >
                    {cap.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          STATS — White with big green/black numbers
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
          SEO TESTER — White, prominent green input
      ═══════════════════════════════════════════════ */}
      <section id="seo-tester" className="bg-[#F8F8F8] py-28">
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
                className="text-black px-7 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest cursor-not-allowed opacity-70 shadow-sm"
                style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
              >
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
          TEAM — Light gray
      ═══════════════════════════════════════════════ */}
      <section className="bg-white py-24 border-t border-black/5">
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
                <div className="group border-2 border-black/6 rounded-2xl p-8 hover:border-brand-green hover:shadow-[0_12px_40px_rgba(168,213,112,0.2)] hover:-translate-y-1 transition-all duration-300">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-5 transition-all group-hover:scale-110 duration-300"
                    style={{ background: 'linear-gradient(135deg, #000 0%, #333 100%)' }}
                  >
                    {p.name[0]}
                  </div>
                  <h3 className="text-xl font-black text-black mb-1">{p.name}</h3>
                  <p className="text-sm text-black/40 mb-4">{p.role}</p>
                  <a
                    href={`tel:${p.tel}`}
                    className="text-sm font-bold text-brand-green-dark hover:text-brand-green transition-colors"
                  >
                    {p.phone}
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA — Bold green gradient, POP section
      ═══════════════════════════════════════════════ */}
      <section
        id="kontakt"
        className="py-32 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #A8D570 0%, #6aba1f 60%, #4d9c10 100%)' }}
      >
        {/* Decorative blob */}
        <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-80 h-80 rounded-full bg-black/8 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 bg-black/10 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="font-bakerie text-black/70 text-sm tracking-wide">
                Redo att börja?
              </span>
            </div>

            <h2 className="text-5xl sm:text-6xl font-black text-black leading-tight mb-6">
              Låt oss växa
              <br />
              <span className="text-white" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.15)' }}>
                tillsammans.
              </span>
            </h2>

            <p className="text-black/60 text-xl mb-12 leading-relaxed max-w-xl mx-auto">
              Boka ett gratis strategimöte. Vi lyssnar, analyserar och berättar
              exakt vad vi kan göra för er — utan förpliktelser.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="mailto:info@jtmediasweden.com"
                className="inline-flex items-center justify-center gap-2 bg-black text-white px-9 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-black/80 transition-all shadow-xl"
              >
                info@jtmediasweden.com
              </a>
              <a
                href="tel:+46767680202"
                className="inline-flex items-center justify-center gap-2 bg-white/30 backdrop-blur-sm text-black px-9 py-4 rounded-xl font-bold text-sm hover:bg-white/50 transition-all border border-black/10"
              >
                Ring Theo →
              </a>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 text-sm text-black/50 font-medium">
              <span>📍 Stationsgatan 2, 341 60 Ljungby</span>
              <span className="hidden sm:block text-black/25">·</span>
              <span>✉ info@jtmediasweden.com</span>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
