import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Villkor | JT Media Sweden',
  description:
    'Allmänna villkor för JT Media Sweden AB. Läs om betalning, immateriella rättigheter, ansvarsbegränsning och kontakt.',
}

export default function VillkorPage() {
  return (
    <div className="bg-white">
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-playfair font-black text-5xl text-black mb-3">Allmänna villkor</h1>
          <p className="text-black/40 text-sm mb-12">Senast uppdaterad: april 2026</p>

          <div className="prose prose-black max-w-none space-y-12">

            <section>
              <h2 className="font-playfair font-black text-2xl text-black mb-4">1. Allmänna villkor</h2>
              <div className="space-y-4 text-black/65 leading-relaxed">
                <p>
                  Dessa allmänna villkor gäller för alla tjänster och uppdrag som utförs av JT Media Sweden AB (org.nr: [registrerat], Stationsgatan 2, 341 60 Ljungby), nedan kallat "JT Media" eller "vi".
                </p>
                <p>
                  Genom att anlita JT Media för ett uppdrag godkänner kunden dessa villkor. Avvikelser från dessa villkor kräver skriftlig överenskommelse.
                </p>
                <p>
                  JT Media förbehåller sig rätten att uppdatera dessa villkor. Kunder informeras om väsentliga ändringar via e-post eller på vår webbplats.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-playfair font-black text-2xl text-black mb-4">2. Uppdrag och offert</h2>
              <div className="space-y-4 text-black/65 leading-relaxed">
                <p>
                  Varje uppdrag inleds med en offert eller ett projektavtal som specificerar scope, leverabler, tidplan och pris. Uppdraget påbörjas när kunden skriftligen (eller via e-post) godkänner offerten.
                </p>
                <p>
                  Tillkommande arbete utöver överenskommet scope debiteras enligt vid var tid gällande timtaxa, efter godkännande av kunden.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-playfair font-black text-2xl text-black mb-4">3. Betalning</h2>
              <div className="space-y-4 text-black/65 leading-relaxed">
                <p>
                  Fakturor förfaller till betalning 20 dagar efter fakturadatum om inget annat avtalats. Vid försenad betalning tillkommer dröjsmålsränta enligt räntelagen.
                </p>
                <p>
                  För uppdrag som överstiger 5 000 kr faktureras vanligtvis 50% vid uppstart och resterande 50% vid leverans, om inget annat avtalats skriftligen.
                </p>
                <p>
                  Löpande tjänster (som SEO-hantering, sociala medier och underhåll) faktureras månadsvis i förväg.
                </p>
                <p>
                  JT Media förbehåller sig rätten att innehålla leverans tills full betalning erhållits.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-playfair font-black text-2xl text-black mb-4">4. Immateriella rättigheter</h2>
              <div className="space-y-4 text-black/65 leading-relaxed">
                <p>
                  Vid slutbetalning överlåts äganderätten till levererat material (hemsidor, logotyper, designmaterial etc.) till kunden, med undantag för:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Tredjepartsprogramvara, ramverk och bibliotek med egna licensvillkor</li>
                  <li>Stockbilder och licensierade typsnitt som kunden måste licensiera separat</li>
                  <li>JT Medias interna verktyg och processer</li>
                </ul>
                <p>
                  JT Media förbehåller sig rätten att använda levererat arbete i vår portfolio och i marknadsföringssammanhang, om inget annat avtalats.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-playfair font-black text-2xl text-black mb-4">5. Kundens ansvar</h2>
              <div className="space-y-4 text-black/65 leading-relaxed">
                <p>
                  Kunden ansvarar för att tillhandahålla korrekta uppgifter, material och godkännanden i tid. Förseningar orsakade av kunden kan påverka projektets tidsplan utan att JT Media hålls ansvariga.
                </p>
                <p>
                  Kunden ansvarar för att material som lämnas till JT Media (bilder, texter, logotyper etc.) inte bryter mot tredje parts upphovsrätt eller andra rättigheter.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-playfair font-black text-2xl text-black mb-4">6. Ansvarsbegränsning</h2>
              <div className="space-y-4 text-black/65 leading-relaxed">
                <p>
                  JT Medias ansvar är begränsat till det belopp kunden betalt för det specifika uppdraget. JT Media ansvarar inte för indirekta skador, följdskador, utebliven vinst eller produktionsbortfall.
                </p>
                <p>
                  JT Media lämnar inga garantier för specifika resultat avseende SEO, Google Ads, sociala medier eller annan digital marknadsföring. Alla uppskattningar och prognoser är baserade på branschpraxis och erfarenhet.
                </p>
                <p>
                  JT Media ansvarar inte för driftstörningar hos tredjepartstjänster som Supabase, Google, Meta eller liknande plattformar.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-playfair font-black text-2xl text-black mb-4">7. Uppsägning</h2>
              <div className="space-y-4 text-black/65 leading-relaxed">
                <p>
                  Löpande avtal kan sägas upp med en månads skriftlig uppsägningstid om inget annat avtalats. Engångsuppdrag avslutas vid leverans och slutbetalning.
                </p>
                <p>
                  Vid förtida avslut av ett pågående projekt faktureras kunden för utfört arbete till datum för avbokning.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-playfair font-black text-2xl text-black mb-4">8. Integritet och GDPR</h2>
              <div className="space-y-4 text-black/65 leading-relaxed">
                <p>
                  JT Media behandlar personuppgifter i enlighet med GDPR och den svenska dataskyddslagstiftningen. Personuppgifter används enbart för att utföra och fakturera uppdrag samt för nödvändig kommunikation.
                </p>
                <p>
                  Kunder har rätt att begära tillgång till, rättelse eller radering av sina personuppgifter. Kontakta info@jtmediasweden.com för sådana förfrågningar.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-playfair font-black text-2xl text-black mb-4">9. Tillämplig lag och tvist</h2>
              <div className="space-y-4 text-black/65 leading-relaxed">
                <p>
                  Dessa villkor regleras av svensk lag. Tvister ska i första hand lösas genom förhandling. Om enighet ej kan nås ska tvisten avgöras av svensk allmän domstol med Kronobergs tingsrätt som första instans.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-playfair font-black text-2xl text-black mb-4">10. Kontakt</h2>
              <div className="space-y-4 text-black/65 leading-relaxed">
                <p>
                  Frågor om dessa villkor besvaras av:
                </p>
                <div className="bg-[#F8F8F8] rounded-2xl p-6 not-prose">
                  <p className="font-semibold text-black">JT Media Sweden AB</p>
                  <p className="text-black/65 text-sm mt-1">Stationsgatan 2, 341 60 Ljungby</p>
                  <a href="mailto:info@jtmediasweden.com" className="text-black/65 text-sm hover:text-black transition-colors">
                    info@jtmediasweden.com
                  </a>
                </div>
              </div>
            </section>

          </div>

          <div className="mt-16 pt-8 border-t border-black/8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-black/45 hover:text-black transition-colors"
            >
              ← Tillbaka till startsidan
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
