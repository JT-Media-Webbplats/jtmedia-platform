export default function HomePage() {
  return (
    <>
      {/* Hero — full black */}
      <section className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 py-32 sm:py-40">
          <p className="text-brand-green text-sm font-semibold uppercase tracking-[0.2em] mb-6">
            Kreativ mediebyrå
          </p>
          <h1 className="text-5xl sm:text-7xl font-black leading-[1.05] tracking-tight max-w-4xl">
            Vi skapar media{' '}
            <span className="text-brand-green">som konverterar.</span>
          </h1>
          <p className="mt-8 text-lg sm:text-xl text-white/60 max-w-2xl leading-relaxed">
            JT Media hjälper svenska företag att synas, växa och sälja med
            strategi, content och kreativ produktion.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <a
              href="#tjanster"
              className="inline-flex items-center justify-center bg-brand-green text-black px-8 py-3.5 rounded-full font-bold hover:bg-brand-green-dark transition-colors text-sm uppercase tracking-widest"
            >
              Våra tjänster
            </a>
            <a
              href="#kontakt"
              className="inline-flex items-center justify-center border border-white/20 text-white px-8 py-3.5 rounded-full font-medium hover:border-white/50 transition-colors text-sm"
            >
              Kontakta oss
            </a>
          </div>
        </div>
      </section>

      {/* Divider strip */}
      <div className="h-1 bg-brand-green" />

      {/* Services */}
      <section id="tjanster" className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <p className="text-black/40 text-xs font-semibold uppercase tracking-[0.2em] mb-3">
              Vad vi erbjuder
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-black leading-tight max-w-xl">
              Allt du behöver för att växa.
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-px bg-black/10">
            {[
              {
                number: '01',
                title: 'Videoproduktion',
                desc: 'Reklamfilm, intervjuer och social media content som fångar uppmärksamhet och driver handling.',
              },
              {
                number: '02',
                title: 'Digital strategi',
                desc: 'Data-driven marknadsföring anpassad för dina kanaler och mål — mätbart, skalbart, effektivt.',
              },
              {
                number: '03',
                title: 'Varumärkesutveckling',
                desc: 'Identitet, tone of voice och visuell profil som sticker ut och skapar förtroende.',
              },
            ].map((service) => (
              <div
                key={service.title}
                className="bg-white p-10 group hover:bg-black transition-colors duration-300"
              >
                <p className="text-brand-green text-xs font-bold uppercase tracking-widest mb-6">
                  {service.number}
                </p>
                <h3 className="text-2xl font-black text-black group-hover:text-white mb-4 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-black/50 group-hover:text-white/60 text-sm leading-relaxed transition-colors duration-300">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About strip */}
      <section id="om-oss" className="bg-black py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-brand-green text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                Om oss
              </p>
              <h2 className="text-4xl font-black text-white leading-tight mb-6">
                Resultat, inte bara räckvidd.
              </h2>
              <p className="text-white/60 leading-relaxed mb-4">
                Vi är ett tight kreativt team som kombinerar produktion, strategi och teknik
                under ett tak. Inga mellanhänder — bara bra arbete och tydliga resultat.
              </p>
              <p className="text-white/60 leading-relaxed">
                Från Göteborg, med kunder i hela Sverige.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '50+', label: 'Nöjda kunder' },
                { value: '200+', label: 'Projekt levererade' },
                { value: '5 år', label: 'I branschen' },
                { value: '98%', label: 'Återköpsgrad' },
              ].map((stat) => (
                <div key={stat.label} className="border border-white/10 rounded-2xl p-6">
                  <p className="text-3xl font-black text-brand-green mb-1">{stat.value}</p>
                  <p className="text-white/40 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="kontakt" className="py-32 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-black/40 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            Kom igång
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-black mb-6 leading-tight">
            Redo att ta nästa steg?
          </h2>
          <p className="text-black/50 mb-10 text-lg leading-relaxed">
            Hör av dig så bokar vi ett kostnadsfritt strategimöte.
            Vi svarar alltid inom 24 timmar.
          </p>
          <a
            href="mailto:hej@jtmedia.se"
            className="inline-flex items-center gap-3 bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-black/80 transition-colors text-sm uppercase tracking-widest"
          >
            <span className="w-2 h-2 rounded-full bg-brand-green" />
            hej@jtmedia.se
          </a>
        </div>
      </section>
    </>
  )
}
