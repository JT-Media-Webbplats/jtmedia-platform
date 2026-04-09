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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    title: 'AI-lösningar',
    desc: 'Chatbots, automatiserade arbetsflöden och skräddarsydda AI-verktyg som sparar tid och ökar kapaciteten.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
      </svg>
    ),
  },
  {
    title: 'SEO & Digital Boost',
    desc: 'Syns när det gäller. Teknisk SEO, innehållsstrategi och lokal sökmotoroptimering som driver rätt trafik.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  {
    title: 'Sociala medier',
    desc: 'Strategi, content och hantering som bygger följarskara och skapar engagemang på Instagram, Facebook och LinkedIn.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
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
    accent: '#A8D570',
  },
  {
    tag: 'Custom Platforms',
    title: 'Skräddarsydda plattformar',
    desc: 'Behöver ni mer än en hemsida? Vi utvecklar kundportaler, interna verktyg och SaaS-plattformar byggda exakt för er verksamhet.',
    accent: '#A8D570',
  },
  {
    tag: 'Advanced Web Apps',
    title: 'Avancerade webbapplikationer',
    desc: 'Full-stack webapplikationer med realtidsdata, API-integrationer och skalbar infrastruktur. Tekniken som driver er nästa fas.',
    accent: '#A8D570',
  },
]

const stats = [
  { value: '10+', label: 'Aktiva kunder' },
  { value: '50+', label: 'Projekt levererade' },
  { value: '3×', label: 'Snittökning i trafik' },
  { value: '100%', label: 'Nöjdhetsgrad' },
]

const whyPoints = [
  { title: 'En fast månadskostnad', desc: 'Inga löner, arbetsgivaravgifter, semester eller sjukfrånvaro. Bara resultat.' },
  { title: 'Hela teamet, direkt', desc: 'Webbdesigner, SEO-specialist, copywriter och strateg — allt ingår.' },
  { title: 'Snabbt och smidigt', desc: 'Inga långa processer. Vi agerar snabbt och kommunicerar rakt.' },
  { title: 'Alltid i framkant', desc: 'Vi ligger steget före med AI, plattformar och nya digitala trender.' },
]

export default function HomePage() {
  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="bg-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24 sm:py-32 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-green/15 border border-brand-green/25 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
              <span className="text-brand-green text-xs font-semibold tracking-widest uppercase">
                Ljungby, Sverige
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black leading-[1.02] tracking-tight">
              Din externa
              <br />
              <span className="text-brand-green">marknads&shy;avdelning.</span>
            </h1>

            <p className="mt-6 text-xl text-white/50 leading-relaxed max-w-lg font-normal">
              Till en bråkdel av kostnaden. JT Media Sweden levererar
              webb, AI, SEO och design — allt under ett tak.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#kontakt"
                className="inline-flex items-center gap-2 bg-brand-green text-black px-7 py-3.5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-brand-green-dark transition-colors animate-glow"
              >
                Boka gratis möte
              </a>
              <a
                href="#tjanster"
                className="inline-flex items-center gap-2 border border-white/15 text-white/70 px-7 py-3.5 rounded-full font-medium text-sm hover:border-white/40 hover:text-white transition-all"
              >
                Se tjänster ↓
              </a>
            </div>

            {/* Mini proof */}
            <div className="mt-12 flex items-center gap-3">
              <div className="flex -space-x-2">
                {['LG', 'LT', 'AS'].map((init) => (
                  <div
                    key={init}
                    className="w-8 h-8 rounded-full bg-brand-green/20 border-2 border-black flex items-center justify-center text-brand-green text-[10px] font-bold"
                  >
                    {init}
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/40">
                Betrodda av <span className="text-white/70">10+ företag</span> i Sverige
              </p>
            </div>
          </div>

          {/* Right — mock analytics card */}
          <div className="hidden lg:flex justify-center items-center relative">
            {/* Glow blob */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-80 h-80 rounded-full bg-brand-green/10 blur-3xl" />
            </div>

            <div className="relative animate-float">
              {/* Main card */}
              <div className="bg-[#111] border border-white/8 rounded-2xl p-5 w-80 shadow-2xl">
                {/* Card header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs text-white/35 mb-0.5">Månadsöversikt</p>
                    <p className="text-sm font-bold text-white">Digital tillväxt</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-brand-green text-xs font-semibold bg-brand-green/10 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                    Live
                  </span>
                </div>

                {/* Main metric */}
                <div className="bg-brand-green rounded-xl p-4 mb-4">
                  <p className="text-black/60 text-xs mb-1 font-medium">Organisk trafik</p>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-black text-black">+127%</p>
                    <svg viewBox="0 0 40 24" className="w-16 h-8">
                      <polyline
                        points="0,22 8,16 16,18 24,10 32,12 40,2"
                        fill="none"
                        stroke="#000"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.4"
                      />
                      <polyline
                        points="0,22 8,16 16,18 24,10 32,12 40,2"
                        fill="none"
                        stroke="#000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Two small metrics */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: 'Besökare/mån', value: '2 847' },
                    { label: 'Konvertering', value: '4.8%' },
                  ].map((m) => (
                    <div key={m.label} className="bg-white/5 rounded-xl p-3">
                      <p className="text-white/35 text-[10px] mb-1">{m.label}</p>
                      <p className="text-white font-bold text-lg">{m.value}</p>
                    </div>
                  ))}
                </div>

                {/* Activity feed */}
                <div className="space-y-2.5">
                  <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold">
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
                        <span className="text-xs text-white/60">{item.name}</span>
                      </div>
                      <span className="text-[10px] text-white/25">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-6 bg-white rounded-xl px-4 py-2.5 shadow-xl flex items-center gap-2 animate-float-slow">
                <div className="w-2 h-2 rounded-full bg-brand-green" />
                <p className="text-xs font-bold text-black">SEO-ranking ↑ 14 plats</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CLIENTS MARQUEE ═══ */}
      <section className="bg-white border-b border-black/6 py-8 overflow-hidden">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-black/25 mb-6">
          Betrodda av
        </p>
        <div className="flex">
          <div className="flex shrink-0 animate-marquee gap-16 items-center pr-16">
            {[...clients, ...clients].map((c, i) => (
              <span
                key={i}
                className="text-sm font-bold text-black/20 hover:text-black/50 transition-colors whitespace-nowrap uppercase tracking-wider"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section id="tjanster" className="bg-white py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-xl mb-16">
            <p className="text-brand-green text-xs font-bold uppercase tracking-[0.2em] mb-3">
              Vad vi gör
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-black leading-tight">
              Allt en marknads&shy;avdelning behöver.
            </h2>
            <p className="mt-4 text-black/45 leading-relaxed">
              Fem kärnkompetenser. Ett tight team. Inga mellanhänder.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <div
                key={s.title}
                className={`group relative rounded-2xl border border-black/8 p-8 hover:bg-black hover:border-black transition-all duration-300 cursor-default ${
                  i === 1 ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="text-black/30 group-hover:text-brand-green transition-colors mb-5">
                  {s.icon}
                </div>
                <h3 className="text-lg font-black text-black group-hover:text-white mb-3 transition-colors">
                  {s.title}
                </h3>
                <p className="text-sm text-black/45 group-hover:text-white/50 leading-relaxed transition-colors">
                  {s.desc}
                </p>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-black/30 group-hover:text-brand-green transition-colors">
                  Läs mer
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY JT MEDIA ═══ */}
      <section id="om-oss" className="bg-black text-white py-28">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <p className="text-brand-green text-xs font-bold uppercase tracking-[0.2em] mb-4">
              Varför JT Media
            </p>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-6">
              En hel marknads&shy;avdelning.
              <br />
              <span className="text-brand-green">En fast kostnad.</span>
            </h2>
            <p className="text-white/50 leading-relaxed mb-8 text-lg">
              Att anställa ett fullt marknadsföringsteam kostar hundratusentals kronor per år.
              Med JT Media får du samma kapacitet — utan overhead.
            </p>
            <a
              href="#kontakt"
              className="inline-flex items-center gap-2 bg-brand-green text-black px-7 py-3.5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-brand-green-dark transition-colors"
            >
              Prata med oss
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {whyPoints.map((p) => (
              <div key={p.title} className="bg-white/5 border border-white/8 rounded-2xl p-6 hover:border-brand-green/30 hover:bg-white/8 transition-all">
                <div className="w-8 h-8 rounded-lg bg-brand-green/15 flex items-center justify-center mb-4">
                  <span className="w-2 h-2 rounded-full bg-brand-green" />
                </div>
                <h3 className="font-bold text-white mb-2">{p.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ AI & NEW CAPABILITIES ═══ */}
      <section id="ai" className="bg-[#050505] text-white py-28 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-green/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-brand-green/10 border border-brand-green/20 rounded-full px-5 py-2 mb-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-brand-green">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
              </svg>
              <span className="text-brand-green text-xs font-semibold tracking-widest uppercase">
                Nästa generation
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-5">
              Vi är mer än en webbyrå.
            </h2>
            <p className="text-white/45 max-w-xl mx-auto leading-relaxed">
              JT Media kliver in i avancerade plattformar, AI-lösningar och skräddarsydda
              webapplikationer. Tekniken som tar ditt företag till nästa nivå.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {aiCapabilities.map((cap, i) => (
              <div
                key={cap.title}
                className={`rounded-2xl p-8 border transition-all hover:-translate-y-1 duration-300 ${
                  i === 1
                    ? 'bg-brand-green border-brand-green'
                    : 'bg-white/4 border-white/8 hover:border-brand-green/30'
                }`}
              >
                <span
                  className={`text-xs font-bold uppercase tracking-widest mb-5 block ${
                    i === 1 ? 'text-black/50' : 'text-brand-green'
                  }`}
                >
                  {cap.tag}
                </span>
                <h3
                  className={`text-xl font-black mb-4 leading-tight ${
                    i === 1 ? 'text-black' : 'text-white'
                  }`}
                >
                  {cap.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    i === 1 ? 'text-black/60' : 'text-white/45'
                  }`}
                >
                  {cap.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="bg-white py-24 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-black/25 mb-14">
            Resultat i siffror
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={s.label} className="text-center group">
                <p
                  className={`text-6xl sm:text-7xl font-black tracking-tight mb-3 transition-colors ${
                    i % 2 === 0 ? 'text-black group-hover:text-brand-green' : 'text-brand-green'
                  }`}
                >
                  {s.value}
                </p>
                <p className="text-sm text-black/40 font-medium uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SEO TESTER TEASER ═══ */}
      <section id="seo-tester" className="bg-[#f5f5f3] py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-brand-green text-xs font-bold uppercase tracking-[0.2em] mb-4">
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
              className="flex-1 bg-white border border-black/10 rounded-full px-6 py-3.5 text-sm font-medium placeholder-black/25 outline-none cursor-not-allowed"
            />
            <button
              disabled
              className="bg-black text-white px-7 py-3.5 rounded-full font-bold text-sm uppercase tracking-widest opacity-60 cursor-not-allowed"
            >
              Testa nu
            </button>
          </div>
          <p className="mt-4 text-xs text-black/25">Kommer snart — anmäl dig för tidig tillgång</p>
        </div>
      </section>

      {/* ═══ TEAM ═══ */}
      <section className="bg-white py-24 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-brand-green text-xs font-bold uppercase tracking-[0.2em] mb-3">
              Teamet
            </p>
            <h2 className="text-4xl font-black text-black">Personerna bakom.</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {[
              { name: 'Theo', phone: '076-768 02 02', role: 'Strategi & Webb' },
              { name: 'Jakob', phone: '073-698 01 31', role: 'Design & Content' },
            ].map((p) => (
              <div
                key={p.name}
                className="group border border-black/8 rounded-2xl p-8 hover:border-brand-green hover:bg-black transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-black group-hover:bg-brand-green flex items-center justify-center text-white group-hover:text-black text-2xl font-black mb-5 transition-all">
                  {p.name[0]}
                </div>
                <h3 className="text-xl font-black text-black group-hover:text-white mb-1 transition-colors">
                  {p.name}
                </h3>
                <p className="text-sm text-black/40 group-hover:text-white/40 mb-4 transition-colors">
                  {p.role}
                </p>
                <a
                  href={`tel:+46${p.phone.replace(/^0/, '').replace(/-/g, '')}`}
                  className="text-sm font-semibold text-brand-green hover:text-brand-green-light transition-colors"
                >
                  {p.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section id="kontakt" className="py-32 bg-black relative overflow-hidden">
        {/* Green gradient blob */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[400px] bg-brand-green/15 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-green/10 border border-brand-green/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
            <span className="text-brand-green text-xs font-semibold tracking-widest uppercase">
              Redo att börja?
            </span>
          </div>

          <h2 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-6">
            Låt oss växa
            <br />
            <span className="text-brand-green">tillsammans.</span>
          </h2>

          <p className="text-white/45 text-xl mb-12 leading-relaxed max-w-xl mx-auto">
            Boka ett gratis strategimöte. Vi lyssnar, analyserar och berättar
            exakt vad vi kan göra för er — utan förpliktelser.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@jtmediasweden.com"
              className="inline-flex items-center justify-center gap-3 bg-brand-green text-black px-9 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-brand-green-dark transition-colors animate-glow"
            >
              info@jtmediasweden.com
            </a>
            <a
              href="tel:+46767680202"
              className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/70 px-9 py-4 rounded-full font-medium text-sm hover:border-white/40 hover:text-white transition-all"
            >
              Ring Theo →
            </a>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/25">
            <span>📍 Stationsgatan 2, 341 60 Ljungby</span>
            <span className="hidden sm:block">·</span>
            <span>✉ info@jtmediasweden.com</span>
          </div>
        </div>
      </section>
    </>
  )
}
