---
name: seo
description: Kör månadens SEO-jobb för en Digital Boost-kund. Analyserar Search Console, föreslår åtgärder som Jakob godkänner, genomför dem via SSH/WP-CLI och Elementor MCP, och loggar arbetet så det hamnar i rapportmejlet i /admin/rapporter. Använd vid /seo eller när användaren vill göra SEO för en kund.
---

# Månadens SEO-jobb

Du gör JT Medias månatliga SEO-arbete för en kund med Digital Boost. Arbetet ska vara datadrivet, synligt för Jakob och loggat, så att det automatiskt hamnar i kundens rapportmejl under `/admin/rapporter`.

**Den viktigaste regeln: ändra ingenting på kundens sajt innan Jakob har godkänt planen.** Det är riktiga kunders livesajter.

**Servern får aldrig belastas.** Alla sajter delar samma server (jtmedia-srv01), och tidigare har en hängande process fyllt den och tagit ner alla kunder. Därför:
- Kör kommandon på servern **endast** via `scripts/seo-ssh.sh <target> '<kommando>'`. Vanlig `ssh`/`scp` stoppas av en hook. Scriptet ger varje kommando max 90 s, 60 s CPU, 2 GB minne och 100 MB per fil, och vägrar bakgrundsprocesser, loopar, `find`/`du`/`grep -r` över hemkatalogen, arkiv, databasexporter, `rm` och plugin-/core-ändringar.
- Ett kommando i taget, korta och riktade (en post, ett meta-fält). Sök inte igenom filsystemet. Behöver du sidans HTML: kör `curl` lokalt på din dator, inte på servern.
- Vägrar scriptet något, eller når ett kommando tidsgränsen: försök inte gå runt det. Berätta för Jakob vad du ville göra och varför.

Argument:
- `/seo Michael Ströms` kör för en kund (namnet matchas mot rapportlistan).
- `/seo LBY Tech: fokus på vattenskärning, de vill ta fler sådana jobb` kör med ett fokus. Allt efter kundnamnet (efter kolon eller komma) är Jakobs önskemål för månaden. Det väger tyngre än `notes` och styr planen: välj åtgärder och sidor som stärker fokusområdet, även om andra sidor har högre siffror. Hämta fokusets sökningar ur `search_console` (filtrera på relevanta ord) och säg ärligt om datan visar lite efterfrågan på området.
- `/seo` utan namn: kör `npx tsx scripts/seo-context.ts --due`, visa listan över kunder vars rapport kommer inom 10 dagar och som inte har SEO loggad, och fråga vilken du ska börja med.

## Steg

1. **Hämta kontext.** Kör `npx tsx scripts/seo-context.ts "<kund>"`. Du får:
   - `report_client_id` och `log_period`: behövs när du loggar i steg 7.
   - `ssh`: anslutningen från Claude-appen (användare@jtmedia-srv01.oderland.com, nyckel). `null` betyder att kunden saknar SSH i appen. Säg det till Jakob och fortsätt med bara Elementor MCP om det finns.
   - `elementor_mcp`: MCP-servern för kundens sajt, om den finns. Verktygen heter `<tool_prefix>elementor-…`. Om `staging` är `true` pekar den mot en staging-sajt och inte mot livesajten. Säg det tydligt och använd den inte för livesajten utan Jakobs OK.
   - `previous_logs`: vad som gjorts tidigare månader. Gör inte samma sak igen.
   - `search_console`: snabba vinster (`striking_distance_queries`), sidor med låg CTR (`low_ctr_pages`), sidor som tappar (`losing_pages`), toppsidor och effekten av tidigare arbete (`effect_of_previous_work`).
   - `notes`: kundspecifika önskemål. Följ dem.

2. **Kontrollera åtkomsten** (endast läsning):
   - SSH: `scripts/seo-ssh.sh <target> 'cd ~/public_html && wp option get home && wp plugin list --status=active --field=name'`. Kontrollera att `home` är kundens domän. Om WordPress inte ligger i `~/public_html`: leta med `ls ~` och `wp --path=…`. Alla WP-CLI-kommandon nedan körs på samma sätt, med `cd ~/public_html && ` först.
   - Sidbyggare: `elementor` i pluginlistan betyder Elementor. `js_composer` betyder WPBakery, då ligger innehållet som shortcodes i `post_content` och det finns ingen Elementor MCP.
   - Elementor MCP: lista sidor med `elementor-list-posts` om servern finns.

3. **Granska det datan pekar på**, för de 3 till 6 mest lovande sidorna:
   - Hitta post-ID: `wp eval 'echo url_to_postid("<url>");'`
   - Nuvarande SEO-titel och metabeskrivning (Yoast): `wp post meta get <id> _yoast_wpseo_title` och `_yoast_wpseo_metadesc`. Tomt betyder Yoasts standardmall. Visa då den faktiska `<title>` via `curl -s <url> | grep -o '<title>.*</title>'`.
   - Rubriker och innehåll: Elementor MCP `elementor-get-page-structure`, eller `curl` på sidan.
   - Bilder utan alt-text, interna länkar till sidan och H1 (finns den, och innehåller den sökordet?).

4. **Gör en plan med 3 till 5 åtgärder** (med fokus ska de flesta röra fokusområdet) och visa den som en tabell: *Åtgärd · Varför (siffran från Search Console) · Sida · Hur (WP-CLI eller Elementor MCP) · Före → efter*. Bra åtgärder, i ungefär denna ordning:
   - Skriv om SEO-titel och metabeskrivning på sidor med många visningar och låg CTR. Titel max cirka 60 tecken med sökord och ort först, metabeskrivning cirka 150 tecken med ett tydligt erbjudande.
   - Stärk sidor som rankar på plats 4 till 20: sökordet i H1 och i första stycket, ett stycke som svarar på sökningen, en FAQ-sektion, interna länkar från andra sidor.
   - Alt-texter på viktiga bilder.
   - Föreslå en ny sida om data visar sökningar som saknar en bra sida (t.ex. "fönsterbyte ljungby" landar på /tjanster/ på plats 33). Skapa den bara om Jakob uttryckligen säger ja.

   Fråga sedan Jakob om godkännande med AskUserQuestion: godkänn allt, godkänn med ändringar eller avbryt. **Vänta på svaret.**

5. **Genomför det godkända.** Spara alltid det gamla värdet först (det ska med i loggens `details`, så att allt kan återställas).
   - Yoast: `wp post meta update <id> _yoast_wpseo_title "<ny titel>"` och `_yoast_wpseo_metadesc`.
   - Alt-text: `wp post meta update <attachment-id> _wp_attachment_image_alt "<text>"`.
   - Innehåll i Elementor-sidor: via Elementor MCP (`elementor-manage-elements`, `elementor-build-composition`), och publicera med `elementor-publish-document`. Ändra inte Elementor-data via WP-CLI.
   - Innehåll i WPBakery-sidor eller klassisk editor: hämta först `wp post get <id> --field=post_content` och spara det i en fil i scratchpaden (återställning). Ändra sedan bara text inuti befintliga shortcodes med `wp post update <id> --post_content='…'`, rör inte shortcode-strukturen. Visa Jakob exakt vilken text som byts innan du kör.
   - Rör aldrig: tema- och core-filer, plugin-installationer och uppdateringar, användare, borttagning av sidor eller innehåll. Fråga först om något sådant verkar behövas.
   - Töm cachen efteråt om LiteSpeed är aktivt: `wp litespeed-purge all`.
   - Kontrollera på livesajten med `curl` (lokalt) att titel och innehåll faktiskt syns.

   Svensk text på kundens sajt: naturlig, lokal och konkret. Inga tankstreck (varken – eller —), använd punkt eller komma. Skriv som ett företag i Småland, inte som en SEO-byrå.

6. **Visa resultatet** för Jakob: vad som ändrades, före och efter, plus länkar.

7. **Logga arbetet.** Skriv en JSON-fil i scratchpaden och kör `npx tsx scripts/seo-log.ts <fil.json>`:
   ```json
   {
     "report_client_id": "<från steg 1>",
     "period": "<log_period från steg 1>",
     "items": [
       "Vi har skrivit om sidan Snickare Ljungby så att den syns bättre när någon söker efter snickare i Ljungby.",
       "Vi har förbättrat hur tre av era tjänstesidor visas i Googles sökresultat, med tydligare rubrik och beskrivning."
     ],
     "details": "Snickare Ljungby (ID 123): Yoast-titel 'Snickare' → 'Snickare i Ljungby | Michael Ströms Bygg' …",
     "pages": ["https://michaelstromsbygg.se/snickare-ljungby/"]
   }
   ```
   - `items` är det kunden läser i rapportmejlet. 2 till 5 punkter, vardagsspråk, inga facktermer som "meta" eller "CTR", inga tankstreck. Beskriv nyttan, inte tekniken. Scriptet stoppar punkter med tankstreck.
   - `details` är för JT Media: exakt vad som ändrades, var, och det gamla värdet.
   - `pages` är de sidor som ändrades. Nästa månad visar `effect_of_previous_work` hur de har gått.

8. **Avsluta** med en kort sammanfattning och påminn om att mejlförslaget under `/admin/rapporter` (knappen *Skapa rapport* eller *Rapport klar* på kundens rad) nu innehåller SEO-punkterna.

## Effekt av tidigare arbete

Om `effect_of_previous_work` visar en tydlig förbättring (fler klick eller bättre position på en sida som ändrades tidigare), lägg till en punkt i `items` som berättar det, t.ex. "Sidan Fönsterbyte som vi förbättrade i september har fått dubbelt så många besökare från Google." Var ärlig: skriv bara det som siffrorna visar.
