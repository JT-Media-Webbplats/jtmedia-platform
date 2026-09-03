import {
  Globe,
  Bot,
  TrendingUp,
  Target,
  Share2,
  Palette,
  DollarSign,
  Users,
  Zap,
  Rocket,
  ArrowRight,
  Mail,
  Phone,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import ScrollReveal from './_components/ScrollReveal'

const clients = [
  { name: 'Lagans GK', logo: '/images/clients/lagans-gk.webp' },
  { name: 'LBY Tech', logo: '/images/clients/lby-tech.webp' },
  { name: 'Ljungby Fiber', logo: '/images/clients/ljungby-fiber.webp' },
  { name: 'Smefast', logo: '/images/clients/smefast.webp' },
  { name: 'Molico', logo: '/images/clients/molico.webp' },
  { name: 'Hårds Transport', logo: '/images/clients/hards-transport.webp' },
  { name: 'AMS Sweden', logo: '/images/clients/ams-sweden.webp' },
  { name: 'Opido', logo: '/images/clients/opido.webp' },
  { name: 'Ljungby Schakt', logo: '/images/clients/ljungby-schakt.webp', sizeClass: 'h-6 sm:h-7' },
  { name: 'Pekuma', logo: '/images/clients/pekuma.webp' },
]

const services = [
  {
    title: 'Webb & Hemsidor',
    desc: 'Snabba, konverterande hemsidor byggda för att ranka högt och sälja. Från landningssidor till komplexa webapplikationer.',
    Icon: Globe,
    href: '/tjanster/webb',
  },
  {
    title: 'AI-lösningar',
    desc: 'Chatbots, automatiserade arbetsflöden och skräddarsydda AI-verktyg som sparar tid och ökar kapaciteten.',
    Icon: Bot,
    href: '/tjanster/ai',
  },
  {
    title: 'SEO & GEO',
    desc: 'Syns när det gäller. Teknisk SEO, lokal sökmotoroptimering och GEO som gör att ni hittas både på Google och i AI-sökningar.',
    Icon: TrendingUp,
    href: '/tjanster/seo',
  },
  {
    title: 'Sociala medier',
    desc: 'Strategi, content och hantering som bygger följarskara och skapar engagemang på Instagram, Facebook och LinkedIn.',
    Icon: Share2,
    href: '/tjanster/sociala-medier',
  },
  {
    title: 'Grafisk design',
    desc: 'Logotyper, varumärkesprofiler, trycksaker och digitalt material som kommunicerar vem ni är och varför ni är bäst.',
    Icon: Palette,
    href: '/tjanster/grafisk-design',
  },
  {
    title: 'Google Ads',
    desc: 'Sökannonsering, shoppingannonser och remarketing som ger resultat från dag ett. Vi sköter strategi, budgivning och daglig optimering.',
    Icon: Target,
    href: '/tjanster/google-ads',
  },
]

const aiCapabilities = [
  {
    title: 'Smarta AI-lösningar',
    desc: 'Vi bygger kundspecifika AI-chatbots, automatiserade innehållsflöden och intelligenta bokningssystem som arbetar åt er dygnet runt.',
    featured: false,
    Icon: Bot,
  },
  {
    title: 'Skräddarsydda plattformar',
    desc: 'Behöver ni mer än en hemsida? Vi utvecklar kundportaler, interna verktyg och SaaS-plattformar byggda exakt för er verksamhet.',
    featured: true,
    Icon: Rocket,
  },
  {
    title: 'Avancerade webbapplikationer',
    desc: 'Full-stack webapplikationer med realtidsdata, API-integrationer och skalbar infrastruktur. Tekniken som driver er nästa fas.',
    featured: false,
    Icon: Globe,
  },
]

const whyPoints = [
  {
    title: 'En fast månadskostnad',
    desc: 'Inga löner, arbetsgivaravgifter, semester eller sjukfrånvaro. Bara resultat.',
    Icon: DollarSign,
  },
  {
    title: 'Hela teamet, direkt',
    desc: 'Webbdesigner, SEO-specialist, copywriter och strateg, allt ingår.',
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
  { client: 'Lagans GK', type: 'Hemsida', bg: 'from-green-100 to-green-50', image: '/images/clients/lagans-gk-mockup.webp', href: '/kundcase' },
  { client: 'AMS Sweden', type: 'AI Chatbot', bg: 'from-blue-100 to-blue-50', image: '/images/clients/ams_sweden_mockup.webp', href: '/kundcase/ams-sweden' },
  { client: 'Molico', type: 'Webbshop', bg: 'from-purple-100 to-purple-50', image: '/images/clients/molico_mockup.webp', href: '/kundcase/molico' },
  { client: 'LBY Tech', type: 'Hemsida', bg: 'from-amber-100 to-amber-50', image: '/images/clients/lby_tech_mockup.webp', href: '/kundcase' },
  { client: 'Ljungby Fiber', type: 'Digital strategi', bg: 'from-teal-100 to-teal-50', image: '/images/clients/ljungby_fiber_mockup.webp', href: '/kundcase/ljungby-fiber' },
  { client: 'Smefast', type: 'Grafisk design', bg: 'from-rose-100 to-rose-50', image: '/images/clients/smefast_mockup.webp', href: '/kundcase/smefast' },
]

export default function HomePage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════
          HERO, White, bright, bold
      ═══════════════════════════════════════════════ */}
      <section className="relative bg-white overflow-hidden">
        <div
          className="pointer-events-none absolute top-0 right-0 w-[600px] h-[500px] opacity-25"
          style={{
            background: 'radial-gradient(ellipse at 80% 20%, #A8D570 0%, transparent 70%)',
          }}
        />

        {/* Animation: fade-up (hero, staggered) */}
        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="min-w-0">
            <ScrollReveal variant="fade-up">
              <h1 className="font-black leading-[1.02] tracking-tight text-black">
                <span className="block text-5xl sm:text-6xl xl:text-[4.25rem]">Din externa</span>
                <span
                  className="block text-[2rem] sm:text-[3.25rem] xl:text-[3.5rem] mt-2"
                  style={{
                    background: 'linear-gradient(135deg, #5fa832 0%, #A8D570 60%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  marknadsavdelning.
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={150}>
              <p className="mt-6 text-lg text-black/50 leading-relaxed max-w-lg font-normal">
                Till en bråkdel av kostnaden. Vi är Theo och Jakob, och vi levererar
                webb, AI, SEO och design från Ljungby, allt under ett tak.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={300}>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="#kontakt"
                  className="inline-flex items-center gap-2 text-black px-7 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-lg animate-glow"
                  style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
                >
                  Boka möte
                </a>
                <a
                  href="#tjanster"
                  className="inline-flex items-center gap-2 border-2 border-black/10 text-black/70 px-7 py-3.5 rounded-xl font-medium text-sm hover:border-brand-green hover:text-black transition-all"
                >
                  Se tjänster <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={450}>
              <div className="mt-8 flex flex-wrap items-center gap-2">
                <span className="text-xs text-black/35 mr-1">Populärt just nu:</span>
                {[
                  { title: 'AI-lösningar', href: '/tjanster/ai' },
                  { title: 'Webb & Hemsidor', href: '/tjanster/webb' },
                  { title: 'GEO', href: '/tjanster/geo' },
                ].map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 bg-white border border-black/8 rounded-full px-3.5 py-1.5 text-xs font-bold text-black/70 hover:border-brand-green hover:text-black transition-colors"
                  >
                    {item.title}
                    <ArrowRight className="w-3 h-3 text-black/30 group-hover:text-brand-green-dark transition-colors" />
                  </Link>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Right, team photo that slides in from the right */}
          <div className="relative min-w-0 mt-4 lg:mt-0 lg:justify-self-end w-full max-w-xl">
            <ScrollReveal variant="slide-left" delay={200}>
              <div className="relative pb-8 pl-2 lg:pl-0">
                {/* Soft green glow behind the photo */}
                <div className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-brand-green/25 blur-3xl" />

                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.18)] rotate-[1.5deg] hover:rotate-0 transition-transform duration-700 ease-out">
                  <Image
                    src="/images/team/theo-jakob-team-bild-2.webp"
                    alt="Theo Brandt och Jakob Jolheden, grundare av JT Media AB"
                    fill
                    priority
                    sizes="(min-width: 1024px) 576px, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  <span className="absolute top-5 left-5 font-bakerie text-sm bg-white/90 backdrop-blur text-black px-3.5 py-1.5 rounded-full">
                    Hej från Ljungby
                  </span>
                </div>

                {/* Personal badge, same feel as contact page */}
                <div className="absolute bottom-0 left-4 lg:-left-8 bg-white rounded-2xl shadow-xl border border-black/6 px-5 py-4 flex items-center gap-4">
                  <div className="flex -space-x-3 shrink-0">
                    {[
                      { src: '/images/team/theo.webp', alt: 'Theo Brandt' },
                      { src: '/images/team/jakob.webp', alt: 'Jakob Jolheden' },
                    ].map((person) => (
                      <div key={person.alt} className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-white">
                        <Image src={person.src} alt={person.alt} fill sizes="44px" className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-bold text-black text-sm leading-tight">Theo & Jakob</p>
                    <p className="text-xs text-black/50 mt-0.5">Grundare. Ni pratar alltid direkt med oss.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CLIENTS, Light gray, marquee with edge fade
      ═══════════════════════════════════════════════ */}
      {/* Animation: fade-up (default) */}
      <section className="bg-[#F8F8F8] border-y border-black/5 py-10">
        <ScrollReveal className="mb-12 text-center" variant="fade-up">
          <p className="font-bakerie text-black/40 text-base tracking-wide">
            Några av våra kunder
          </p>
        </ScrollReveal>
        <div className="overflow-hidden marquee-fade">
          <div className="flex">
            <div className="flex shrink-0 animate-marquee gap-16 items-center pr-16">
              {[...clients, ...clients].map((c, i) => (
                <img
                  key={i}
                  src={c.logo}
                  alt={`${c.name} – kund hos JT Media AB`}
                  loading="lazy"
                  decoding="async"
                  className={`${c.sizeClass ?? 'h-8 sm:h-10'} w-auto object-contain shrink-0`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SERVICES, White + dot pattern, Lucide icons
      ═══════════════════════════════════════════════ */}
      {/* Animation: slide-right */}
      <section id="tjanster" className="bg-white py-28 relative dot-pattern-light">
        <div className="relative max-w-7xl mx-auto px-6">
          <ScrollReveal variant="slide-right">
            <div className="mb-16">
              <p className="font-bakerie text-brand-green-dark text-base mb-3 tracking-wide">
                Vad vi gör
              </p>
              <h2 className="text-4xl sm:text-5xl font-black text-black leading-tight sm:whitespace-nowrap">
                Allt en marknadsavdelning behöver.
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <ScrollReveal key={s.title} delay={i * 80} className="h-full" variant="slide-right">
                <Link
                  href={s.href}
                  className="group relative h-full block bg-white border border-black/8 rounded-2xl p-8 hover:border-brand-green hover:shadow-[0_16px_48px_rgba(168,213,112,0.22)] hover:scale-[1.02] transition-all duration-300 overflow-hidden"
                >
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
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          WHY JT MEDIA, Black + dot pattern, Lucide icons
      ═══════════════════════════════════════════════ */}
      {/* Animation: scale-in */}
      <section id="om-oss" className="bg-black text-white py-28 relative overflow-hidden">
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 dot-pattern pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <ScrollReveal variant="scale-in">
            <p className="font-bakerie text-brand-green text-base mb-4 tracking-wide">
              Varför JT Media
            </p>
            <h2 className="font-black leading-tight mb-6">
              <span className="block text-3xl sm:text-4xl">En hel marknadsavdelning.</span>
              <span className="block text-3xl sm:text-4xl text-brand-green mt-2">En fast kostnad.</span>
            </h2>
            <p className="text-white/60 leading-relaxed mb-8 text-lg">
              Att anställa ett fullt marknadsföringsteam kostar hundratusentals kronor per år.
              Med JT Media får du samma kapacitet, utan overhead.
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
              <ScrollReveal key={p.title} delay={i * 100} className="h-full" variant="scale-in">
                <div className="h-full bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl p-6 hover:border-brand-green/50 hover:bg-white/12 transition-all duration-300">
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
          AI & NEW CAPABILITIES, Light green gradient
      ═══════════════════════════════════════════════ */}
      {/* Animation: blur-in */}
      <section id="ai" className="py-28 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f0fbe5 50%, #e6f7d4 100%)' }}>
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-green/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-brand-green/15 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6">
          <ScrollReveal variant="blur-in">
            <div className="text-center mb-16">
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
              <ScrollReveal key={cap.title} delay={i * 100} variant="blur-in">
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
          WORK EXAMPLES, Placeholder grid
      ═══════════════════════════════════════════════ */}
      {/* Animation: slide-left */}
      <section className="bg-[#F8F8F8] py-28 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal variant="slide-left">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="font-bakerie text-brand-green-dark text-base mb-3 tracking-wide">
                  Vårt arbete
                </p>
                <h2 className="text-4xl sm:text-5xl font-black text-black leading-tight">
                  Projekt vi är stolta över.
                </h2>
              </div>
              <Link
                href="/kundcase"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-black/50 hover:text-black transition-colors"
              >
                Se alla <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {workExamples.map((ex, i) => (
              <ScrollReveal key={ex.client} delay={i * 70} variant="slide-left">
                <Link
                  href={ex.href}
                  className="group block rounded-2xl overflow-hidden border border-black/6 bg-white hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div
                    className={`aspect-[16/10] bg-gradient-to-br ${ex.bg} flex items-center justify-center relative overflow-hidden`}
                  >
                    {ex.image ? (
                      <Image
                        src={ex.image}
                        alt={`${ex.client} – ${ex.type} av JT Media`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center shadow-sm">
                          <Globe className="w-5 h-5 text-black/30" />
                        </div>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-brand-green text-xs font-bold text-black px-2.5 py-1 rounded-full z-10">
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
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SEO TESTER
      ═══════════════════════════════════════════════ */}
      {/* Animation: fade-up-soft */}
      <section id="seo-tester" className="bg-white py-28 border-t border-black/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal variant="fade-up-soft">
            <h2 className="text-4xl sm:text-5xl font-black text-black leading-tight mb-5">
              Hur mår din hemsida?
            </h2>
            <p className="text-black/45 mb-10 leading-relaxed text-lg">
              Testa din hemsidas SEO-hälsa, hastighet och synlighet gratis.
              Få en rapport direkt, inga kortuppgifter krävs.
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
              Kommer snart, anmäl dig för tidig tillgång
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TEAM
      ═══════════════════════════════════════════════ */}
      {/* Animation: slide-right (team) */}
      <section className="bg-[#F8F8F8] py-24 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal variant="slide-right">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-black text-black">Personerna bakom.</h2>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {[
              { name: 'Theo', phone: '076-768 02 02', tel: '+46767680202', role: 'Strategi & Webb' },
              { name: 'Jakob', phone: '073-698 01 31', tel: '+46736980131', role: 'Design & Content' },
            ].map((p, i) => (
              <ScrollReveal key={p.name} delay={i * 120} variant="slide-right">
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
          CTA, Dark bg
      ═══════════════════════════════════════════════ */}
      {/* Animation: scale-in (CTA) */}
      <section id="kontakt" className="py-32 bg-[#060606] relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal variant="scale-in">
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
              exakt vad vi kan göra för er, utan förpliktelser.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@jtmediasweden.com"
                className="inline-flex items-center justify-center gap-2 text-black px-9 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-[0_8px_32px_rgba(168,213,112,0.4)] animate-glow"
                style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}
              >
                <Mail className="w-4 h-4" />
                Mejla oss
              </a>
              <a
                href="tel:+46767680202"
                className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/70 px-9 py-4 rounded-xl font-medium text-sm hover:border-white/35 hover:text-white transition-all"
              >
                <Phone className="w-4 h-4" />
                Ring Theo
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
