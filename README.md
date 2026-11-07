# Huus Windroos – Ferienwohnung & Apartment am Dollart

Nuxt-4-Onepager für www.huus-windroos.de. Optik und Technik nach dem Vorbild der KK-Knappschaft-Landingpage
(gleiches `u()`-Skalierungssystem, Header mit Notch, Hero mit Balken, Eyebrow-Labels, Akkordeon, Pill-Buttons,
GSAP-Einblendungen/Parallax/ScrollSmoother). Inhalte von der bisherigen WordPress-Seite übernommen.

## Setup

```bash
npm install
npm run bilder        # lädt die Fotos der alten Website nach public/images (einmalig)
npm run dev           # http://localhost:3000
npm run build         # Variante Node: node .output/server/index.mjs (Formular über /api/contact, SMTP aus .env)
npm run generate:php  # Variante PHP/statisch: php-version/public hochladen (Formular über kontakt.php)
```

**PHP-Variante:** Inhalt von `php-version/public` als Webroot hochladen, `php-version/lib/` (PHPMailer) und
`php-version/config/` daneben (eine Ebene über dem Webroot). `config.example.php` → `config.php` kopieren und
SMTP-Daten eintragen. Geht es nur innerhalb des Webroots, schützt die `.htaccess` beide Ordner.

**Testinstallation (z. B. relaunch.huus-windroos.de):** mit eigener Adresse und Sperre für Suchmaschinen bauen –
`$env:NUXT_PUBLIC_SITE_URL="https://relaunch.huus-windroos.de"; $env:NUXT_PUBLIC_NOINDEX="true"; npm run generate:php`
(robots.txt sperrt alles, jede Seite bekommt `noindex, nofollow`). Für den Livegang ohne `NUXT_PUBLIC_NOINDEX` und mit
der www-Adresse neu bauen. In PowerShell gesetzte Variablen gelten bis zum Schließen des Fensters.

## Struktur

| Bereich | Datei |
| --- | --- |
| Inhalte (Texte, Preise, Bildpfade, Kontaktdaten) | `app/data/content.ts` |
| Impressum / Datenschutz / AGB | `app/data/legal.ts`, Template `app/components/LegalPage.vue` |
| Design-Tokens, `u()`-Einheit, Breakpoints | `app/assets/scss/_tools.scss` |
| Typo-Skala, Reset, Helfer, Animations-Startzustände | `app/assets/scss/main.scss` |
| Sections | `app/components/Sec*.vue`, `AppHeader.vue`, `AppFooter.vue` |
| Unterkunft (Text, Ausstattung, Preise, Galerie + Lightbox) | `SecUnterkunft.vue` (2× verwendet), `UiLightbox.vue` |
| GSAP (Einblendungen, Hero-Intro, Parallax, Smooth Scroll) | `app/plugins/gsap.client.ts`, Schalter in `app/data/motion.ts` |
| Anfrage-API (Node) | `server/api/contact.post.ts` |
| Anfrage (PHP) | `php-version/php/kontakt.php`, Konfig `php-version/config/` |
| Fotos von der alten Seite laden | `scripts/bilder-laden.mjs` |
| Belegung + Bewertungen von Travanto (Node) | `server/utils/travanto.ts`, Route `server/api/travanto.get.ts` |
| Belegung + Bewertungen von Travanto (PHP) | `php-version/php/travanto.php` (Datei-Cache im Temp-Ordner) |
| Belegungskalender | `BookingCalendar.vue`, `SecBelegung.vue`, Logik `app/utils/availability.ts` |
| Bewertungen | `SecBewertungen.vue`, `RatingBadge.vue`, `UiStars.vue` |
| Ostfriesland (Ausflugstipps) | `SecOstfriesland.vue`, Texte in `content.ts` → `region` |

## Projektnotizen

- **Farben:** Klinkerrot `#9b2c1f` (statt KK-Rot, angelehnt an das alte Logo), Wattenmeer-Petrol `#2c7a86`
  (statt KK-Teal) für Eyebrow-Linien und Fokus, dunkles Schiefergrau `#1f2b32` statt Braun, Sandtöne wie KK.
- **Schriften:** Gantari (Variable) und Great Vibes (Wortmarke) über Fontsource selbst gehostet – keine Adobe Fonts,
  kein Consent nötig. Die Seite setzt keine Cookies.
- **Logo:** Windrose als Inline-SVG (`LogoWindroos.vue`) + Schriftzug „Huus Windroos“ in Great Vibes.
- **Skalierung:** Desktop (≥ 1200 px) mit `u(px)` auf Basis 1920 px, darunter eigenes gestapeltes Layout.
- **„Verfügbarkeit anfragen“** in einer Unterkunft springt zum Formular und wählt die Unterkunft vor (`useState('objekt')`).
- **Bilder:** Hero = Hausfoto (`hero-haus*.jpg`, 960/1440/1920 px) + `og-image.jpg` (1200 × 630), liegen im Projekt.
  Die übrigen Fotos der alten Seite sind klein (500 px) und kommen per `npm run bilder`; bis dahin zeigen die Flächen Sand.

## Travanto (Belegung & Bewertungen)

- Quelle sind die externen Seiten, die Travanto zum Einbinden anbietet: Belegzeitenkalender
  (`externer_belegzeitenkalender.php?nummer=…`) und Bewertungen (`externe_bewertungen.php?onr=…`).
  Objektnummern: Ferienwohnung **36065**, Apartment **1013504** (`content.ts` → `units[].travanto`).
- Der Server (Node-Route bzw. `travanto.php`) liest das HTML, macht daraus JSON und cached es
  (Belegung 2 h, Bewertungen 24 h). Der Browser spricht nie direkt mit Travanto → kein Consent nötig.
- **Keine offizielle Schnittstelle.** Ändert Travanto das HTML, müssen die Regex in beiden Dateien angepasst werden.
  Stabiler wäre ein iCal-Export aus dem Travanto-Vermieterbereich (falls vorhanden).
- **Diagnose:** `/api/travanto?type=belegung&objekt=36065&debug=1` (PHP: `/travanto.php?…&debug=1`) holt ohne
  Cache und zeigt HTTP-Fehler bzw. wie viele Tage frei / belegt erkannt wurden.
- Ist Travanto nicht erreichbar: Kalender bleibt wählbar (Hinweis), Bewertungen zeigen die Werte aus `content.ts`,
  die PHP-Version liefert den letzten Cache-Stand.
- Kalender-Logik: Eine Nacht ist frei bei „frei“ oder „Abreise anderer Gäste“; An-/Abreisetage folgen den
  Travanto-Regeln (`anreisetag` / `abreisetag`).

## Preise

- Preiskarte statt Tabelle, solange alle Saisons gleich viel kosten – mit unterschiedlichen Saisonpreisen
  erscheint automatisch wieder die Tabelle.
- Kein Preisrechner: In „Preise & Belegung“ stehen „ab … € pro Nacht“ und die festen Zuschläge; der gewählte
  Zeitraum wird ins Anfrageformular übernommen.
- Gebühren in `content.ts` → `pricing` (Endreinigung, Kurzurlaub-Grenze).

## Ostfriesland („Unsere Tipps rund um Pogum“)

- Schematische Karte (`RegionMap.vue`, Orte per Koordinaten platziert, Küste/Ems von Hand gezeichnet) neben den
  Tipps in Tabs (Ausflüge, Bei Regen, Essen & Einkaufen, Praktisch). Hover/Fokus auf einen Tipp hebt den Pin hervor
  und umgekehrt; Ziele außerhalb der Karte (Greetsiel, Papenburg) werden über Pfeile am Kartenrand markiert.
- Darunter Radtouren ab der Haustür (GPX-Links folgen).
- Inhalte in `content.ts` → `region`. Einträge mit `draft: true` (gelbes „Entwurf“-Label) warten auf Tipps der Familie.

## Offene Punkte

- Preise/Daten von der alten Seite bereinigt: „31.06.“/„31.09.“ → 30.06./30.09.; alle Saisons haben denselben Preis.
- Widerspruch auf der alten Seite: Mindestaufenthalt 3 Nächte, aber Zuschlag „für Kurzurlaube bis 3 Nächte“.
- Ferienwohnung „für bis zu 2 Personen“, aber „2 Schlafräume mit 2 Doppelbetten“ – mit der Familie klären.
- Datenschutz vor dem Livegang prüfen lassen (Hoster ist bisher nicht namentlich genannt).
- Ostfriesland: Tab „Essen & Einkaufen“ ist ausgeblendet, bis persönliche Tipps der Familie vorliegen; die beiden
  eigenen Radtouren haben noch keine GPX-Links (Feld `link` in `content.ts` → `region.bikes`).
