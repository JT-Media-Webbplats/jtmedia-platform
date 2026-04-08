export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
          Vi skapar media som{' '}
          <span className="text-brand-600">konverterar</span>
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
          JT Media hjälper svenska företag att synas, växa och sälja med
          strategi, content och kreativ produktion.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#tjanster"
            className="bg-brand-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-700 transition-colors"
          >
            Våra tjänster
          </a>
          <a
            href="#kontakt"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-full font-semibold hover:border-gray-400 transition-colors"
          >
            Kontakta oss
          </a>
        </div>
      </section>

      {/* Services */}
      <section id="tjanster" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Vad vi erbjuder
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                title: 'Videoproduktion',
                desc: 'Reklamfilm, intervjuer och social media content som fångar uppmärksamhet.',
              },
              {
                title: 'Digital strategi',
                desc: 'Data-driven marknadsföring anpassad för dina kanaler och mål.',
              },
              {
                title: 'Varumärkesutveckling',
                desc: 'Identitet, tone of voice och visuell profil som sticker ut.',
              },
            ].map((service) => (
              <div
                key={service.title}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="kontakt" className="py-24 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Redo att ta nästa steg?
          </h2>
          <p className="text-gray-500 mb-8">
            Hör av dig så bokar vi ett kostnadsfritt strategimöte.
          </p>
          <a
            href="mailto:hej@jtmedia.se"
            className="inline-block bg-brand-600 text-white px-10 py-3 rounded-full font-semibold hover:bg-brand-700 transition-colors"
          >
            hej@jtmedia.se
          </a>
        </div>
      </section>
    </>
  )
}
