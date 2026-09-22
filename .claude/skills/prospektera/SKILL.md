---
name: prospektera
description: Hittar nya potentiella kunder till JT Media utanför mejlen. Letar nystartade företag och företag i regionen med dålig eller ingen hemsida, svag SEO och ingen annonsering, analyserar dem och lägger in dem som säljmöjligheter i /admin/salj. Använd vid /prospektera eller när användaren vill hitta nya kunder.
---

# Prospektering av nya kunder

Du letar företag som JT Media borde kontakta, bedömer deras digitala närvaro och lägger in de bästa på säljtavlan (`sales_opportunities`, `kind = 'new'`) med ett första mejlutkast. Inget skickas automatiskt.

Argument styr fokus, t.ex. `/prospektera Ljungby bygg`, `/prospektera nystartade Värnamo`, `/prospektera restauranger Växjö`. Utan argument: blanda nystartade företag och etablerade småföretag i Ljungby med omnejd (Ljungby, Lagan, Markaryd, Älmhult, Värnamo, Växjö, Halmstad, Ljungby kommun).

## Steg

1. **Kontext från databasen.** Hämta `customers` (name, email), `prospects` (company) och öppna `sales_opportunities` (company) med ett tillfälligt tsx-script under `scripts/.tmp/` (ta bort efteråt). Dessa företag ska inte föreslås igen.

2. **Bygg en kandidatlista** (15 till 40 företag) med `WebSearch` och `WebFetch`. Bra källor:
   - Nystartade: sök `"nystartade företag" Ljungby 2026`, `nyregistrerade bolag Ljungby kommun`, allabolag.se/nystartade per ort, lokalpress ("Smålänningen", "Ljungby Tidning", "Värnamo Nyheter") om nya butiker, restauranger, hantverkare.
   - Etablerade med svag närvaro: branschkataloger (hitta.se, eniro.se, ratsit) per ort och bransch, t.ex. bygg, VVS, el, måleri, bilverkstad, restaurang, frisör, redovisning, transport, snickeri, trädgård. Företag som bara har Facebook-sida eller kataloglistning utan egen domän är extra intressanta.
   - Kunders kunder och partners som nämns i mejlen kan också tas med.
   Notera för varje kandidat: företagsnamn, ort, bransch, domän om den finns, kontaktväg (e-post från hemsida eller katalog, annars null).

3. **Analysera hemsidorna** med `npx tsx scripts/analyze-sites.ts --file <lista> --out <rapport.json>`. Scriptet ger behovspoäng 0 till 100 och konkreta fynd (saknar HTTPS, ej mobilanpassad, ingen Google Ads-tagg, låg PageSpeed, gammalt copyright-år osv). Företag utan hemsida får 100. Lägg till `--no-pagespeed` om listan är lång och du vill ha en snabb första sortering, kör sedan PageSpeed bara på topp 10.

4. **Kompletterande signaler** (bara för topp 10 till 15):
   - Google Ads: sök på företagets kärntjänst + ort och se om deras annons syns. Scriptets Ads-tagg är bara en indikation.
   - Google-synlighet: sök `"<företagsnamn>" <ort>` och tjänsten + ort. Om företaget inte syns på första sidan för sin egen tjänst är SEO ett tydligt behov.
   - Aktivitet: senaste inlägg på Facebook/Instagram om det går att se, nyheter om företaget, antal anställda om allabolag visar det (större bolag = högre värde).

5. **Välj ut max 10** och skriv för varje: `kind: "new"`, `service_key` (webb om sidan saknas eller är riktigt dålig, seo om sidan finns men inte syns, google-ads om de har bra sida men ingen annonsering, annars other + service_name), `priority` (1 = nystartat eller tydligt behov och kontaktväg finns, 2 = behov men ingen direkt kontakt, 3 = långskott), `summary` (varför, 1 till 3 meningar), `evidence` (behovspoäng, de viktigaste fynden från analysen, sökresultat som visar att de inte syns, källa till uppgifterna), `website`, `email`, `contact_name` om det framgår, `estimated_value` bara om det går att motivera, med `value_type` = `one_time` för engångsjobb (hemsida, film, design) och `recurring` (kr/år) för löpande tjänster.

6. **Mejlutkast** på svenska, kort och konkret, i JT Medias ton: hänvisa till något specifikt vi sett (t.ex. "er sida går inte att läsa på mobilen" eller "grattis till starten"), erbjud en gratis genomgång eller det kostnadsfria SEO-testet på jtmediasweden.com/seo-test, ett tydligt nästa steg. Inga priser. Inga tankstreck (varken – eller —). Avsluta med "Med vänlig hälsning" utan namn. Om ingen e-post finns: skriv ändå ett utkast så det kan användas via kontaktformulär eller telefon, och notera i `summary` att kontaktväg saknas.

7. **Importera** via `npx tsx scripts/sales-agent-import.ts <fil.json>` med `run.summary` som beskriver sökningen (område, bransch, antal kandidater) och `run.threads_scanned = 0`.

8. **Rapportera** kort: antal kandidater, hur många som lades in, topp 3 med behovspoäng och varför, samt vad som inte gick att verifiera.

## Regler

- Hitta inte på uppgifter. Allt i `evidence` ska komma från analysscriptet, en sökning eller en sida du faktiskt hämtat. Skriv "ej verifierat" hellre än att gissa.
- Föreslå aldrig företag som redan finns som kund, prospekt eller öppen möjlighet.
- Skicka inga mejl och skapa inga Gmail-utkast utan uttrycklig begäran.
- Respektera robots.txt och belasta inte enskilda sajter med upprepade anrop.
