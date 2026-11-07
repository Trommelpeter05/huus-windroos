/*
* This file was created with significant AI assistance (e.g., Claude)
* to handle all page content (texts, prices, image paths) – taken over from www.huus-windroos.de.
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
*/

// Images live in public/images/ – `npm run bilder` downloads them from the current website (scripts/bilder-laden.mjs).

export const nav = [
  { label: 'Ferienwohnung', href: '/#ferienwohnung' },
  { label: 'Apartment', href: '/#apartment' },
  { label: 'Ostfriesland', href: '/#ostfriesland' },
  { label: 'Preise & Belegung', href: '/#belegung' },
  { label: 'Kontakt', href: '/#kontakt' },
]

export const contact = {
  owner: 'Harmine de Vries',
  owners: 'Eheleute Alfred und Harmine de Vries',
  street: 'Pogumer Straße 19',
  city: '26844 Jemgum-Pogum',
  phone: '04902 447',
  phoneHref: 'tel:+494902447',
  email: 'kontakt@huus-windroos.de',
  routeHref: 'https://www.openstreetmap.org/search?query=Pogumer%20Stra%C3%9Fe%2019%2C%2026844%20Jemgum',
  // Fix: position and Google profile of the house (from the Google Maps embed of the old website)
  geo: { lat: 53.31819, lon: 7.2598 },
  googleMapsHref: 'https://maps.google.com/?cid=1054633025378781434',
}

export const hero = {
  // Foto des Hauses (Original 2700 px), Varianten 960 / 1440 / 1920 px
  image: '/images/hero-haus.jpg',
  srcset: '/images/hero-haus-960.jpg 960w, /images/hero-haus-1440.jpg 1440w, /images/hero-haus.jpg 1920w',
  alt: 'Das Huus Windroos: rotes Klinkerhaus mit Windrose im Giebel',
  // Fix: visible kicker inside the H1 with the search terms
  kicker: 'Ferienwohnung & Apartment in Pogum bei Ditzum',
  line1: 'Herzlich willkommen',
  line2: 'im Rheiderland',
  sub: 'Bei Familie de Vries im Huus Windroos – ruhig gelegen am Dollart.',
}

export const intro = {
  label: 'Urlaub am Dollart',
  bold: 'Ihr Urlaub am Dollart wird zu einem großartigen Erlebnis. ',
  text: 'Atmen Sie frische Luft aus erster Hand und genießen Sie Ihre Ferien in einer gemütlichen Unterkunft in Pogum – nur ein paar Minuten vom Fischerdorf Ditzum entfernt.',
}

export type Unit = {
  id: string
  label: string
  titleRed: string
  titleDark: string
  teaser: string
  facts: string[]
  priceFrom: number
  text: string[]
  equipment: { title: string; items: string[] }[]
  prices: { season: string; price: number; minNights: number }[]
  shortStaySurcharge: number
  gallery: { src: string; alt: string }[]
  /** Travanto listing – calendar and reviews are read from there (server/utils/travanto.ts) */
  travanto: { id: number; url: string }
  /** Shown until the live values from Travanto are loaded (and if Travanto is unreachable) */
  rating: { value: number; count: number }
}

// Prices and fees shown in the price card and in „Preise & Belegung“
export const pricing = {
  cleaning: 40,
  /** Surcharge per night applies to stays with up to this many nights (see units[].shortStaySurcharge) */
  shortStayMaxNights: 3,
  /** Deposit only over New Year's Eve */
  newYearDeposit: 150,
}

const seasons = ['01.01. – 31.03.', '01.04. – 30.06.', '01.07. – 30.09.', '01.10. – 31.12.']

export const units: Unit[] = [
  {
    id: 'ferienwohnung',
    label: 'Unsere Ferienwohnung',
    titleRed: 'Ferienwohnung',
    titleDark: 'für einen erholsamen Urlaub',
    teaser: 'Gemütliche Ferienoberwohnung mit eigenem Balkon – ideal für einen ruhigen Urlaub zu zweit.',
    facts: ['bis 2 Personen', '2 Schlafräume', 'Balkon'],
    priceFrom: 63,
    text: [
      'Sie erwartet eine gemütlich ausgestattete Ferienoberwohnung für bis zu 2 Personen mit separatem Balkon an der Wohnung.',
      'Bad mit ebenerdiger Dusche/WC, Sat-TV, Internetzugang (300 Mbit/s Glasfaser), Handtücher und Bettwäsche sind vorhanden. Zwei Schlafräume mit zwei Doppelbetten, Küche mit Sitzecke und Küchengeräten wie Kaffeemaschine, Wasserkocher und Toaster.',
    ],
    equipment: [
      {
        title: 'Ausstattung',
        items: [
          'Ferienoberwohnung für bis zu 2 Personen',
          'Separater Balkon inkl. Gartenmöbel',
          'Bad mit ebenerdiger Dusche/WC inkl. Handtücher',
          '2 Schlafräume mit 2 Doppelbetten inkl. Bettwäsche',
          'Sat-TV',
          'Internet (300 Mbit/s Glasfaser)',
        ],
      },
      {
        title: 'Küche',
        items: ['Küche mit Sitzecke', 'Kaffeemaschine, Wasserkocher, Toaster u. v. m.'],
      },
    ],
    prices: seasons.map((season) => ({ season, price: 63, minNights: 3 })),
    shortStaySurcharge: 20,
    gallery: [
      { src: '/images/fewo-eingang.jpg', alt: 'Eingangsbereich' },
      { src: '/images/fewo-schlafzimmer.jpg', alt: 'Schlafzimmer' },
      { src: '/images/fewo-wohnbereich.jpg', alt: 'Wohnbereich' },
      { src: '/images/fewo-dusche.jpg', alt: 'Dusche im Badezimmer' },
      { src: '/images/fewo-kueche.jpg', alt: 'Küchenbereich' },
      { src: '/images/fewo-bad-eingang.jpg', alt: 'Badezimmereingang' },
      { src: '/images/fewo-bad.jpg', alt: 'Badezimmer' },
    ],
    travanto: { id: 36065, url: 'https://www.travanto.de/ferienwohnungen/ditzum/36065/huus-windroos.php' },
    rating: { value: 4.7, count: 18 },
  },
  {
    id: 'apartment',
    label: 'Unser Apartment (Studio)',
    titleRed: 'Apartment',
    titleDark: 'mit großem Balkon',
    teaser: 'Helles 1-Zimmer-Studio mit großem Balkon – gerade für Radfahrer und Pendler genau richtig.',
    facts: ['1–2 Personen', 'Studio', 'großer Balkon'],
    priceFrom: 53,
    text: [
      'Es erwartet Sie ein helles und geräumiges 1-Zimmer-Apartment (Studio) mit voll ausgestatteter Küche, großem Balkon, einem Badezimmer mit barrierefreier Dusche und Fernseher. Es ist für Singles oder 2 Personen ausgelegt.',
      'Handtücher und Bettwäsche, diverse Küchengeräte und der Internetzugang (300 Mbit/s Glasfaser) sind inklusive. Das Apartment wurde 2015 im Zuge eines Neubaus erstellt.',
    ],
    equipment: [
      {
        title: 'Ausstattung',
        items: [
          // Fix: die alte Seite nennt hier „Ferienoberwohnung“ (aus der Ferienwohnung kopiert)
          'Helles 1-Zimmer-Apartment (Studio) für 1–2 Personen',
          'Großer Balkon inkl. Gartenmöbel',
          'Bad mit barrierefreier Dusche/WC inkl. Handtücher',
          '1 Doppelbett inkl. Bettwäsche',
          'Sat-TV',
          'Internet (300 Mbit/s Glasfaser)',
        ],
      },
      {
        title: 'Küche',
        items: ['Voll ausgestattete Küche mit Sitzecke', 'Kaffeemaschine, Wasserkocher, Toaster u. v. m.'],
      },
    ],
    prices: seasons.map((season) => ({ season, price: 53, minNights: 3 })),
    shortStaySurcharge: 17,
    gallery: [
      { src: '/images/apartment-wohnbereich-1.jpg', alt: 'Wohnbereich' },
      { src: '/images/apartment-wohnbereich-2.jpg', alt: 'Wohnbereich' },
      { src: '/images/apartment-kueche-1.jpg', alt: 'Küchenbereich' },
      { src: '/images/apartment-balkon.jpg', alt: 'Balkon und Terrasse' },
      { src: '/images/apartment-schlafzimmer.jpg', alt: 'Schlafzimmer' },
      { src: '/images/apartment-kommode.jpg', alt: 'Badezimmerkommode' },
      { src: '/images/apartment-kueche-2.jpg', alt: 'Küche und Esszimmer' },
    ],
    travanto: { id: 1013504, url: 'https://www.travanto.de/moeblierter-wohnraum/ditzum/1013504/huus-windroos-wohnung-2.php' },
    rating: { value: 4.7, count: 3 },
  },
]

export const reviews = {
  /** Fix: section "Gästestimmen" hidden for now – the rating badges link straight to Travanto */
  show: false,
  label: 'Gästestimmen',
  titleRed: 'Das sagen',
  titleDark: 'unsere Gäste',
  text: 'Alle Bewertungen stammen von Gästen, die über Travanto gebucht haben und dort verifiziert wurden.',
  /** how many of the latest reviews with a comment are shown */
  maxQuotes: 6,
}

export const booking = {
  label: 'Preise & Belegung',
  titleRed: 'Verfügbarkeit',
  titleDark: 'Ihrer Unterkunft',
  text: 'Wählen Sie im Kalender Ihren Anreise- und Abreisetag und fragen Sie den Zeitraum direkt bei uns an. Der Kalender wird regelmäßig aktualisiert.',
}

export const goodToKnow = {
  label: 'Gut zu wissen',
  titleRed: 'Gut',
  titleDark: 'zu wissen',
  text: 'Für Ferienwohnung und Apartment gelten dieselben Hausregeln. Alle Übernachtungspreise beziehen sich auf maximal 2 Personen.',
  items: [
    { title: 'An- und Abreise', text: 'Die Unterkunft steht am Anreisetag ab 15:00 Uhr bzw. nach Absprache zur Verfügung. Am Abreisetag bitten wir Sie, sie bis 10:00 Uhr zu räumen.' },
    { title: 'Endreinigung & Kaution', text: 'Die Endreinigung beträgt 40 €. Über Silvester wird eine Kaution von 150 € erhoben.' },
    {
      title: 'Kurzurlaub',
      text: 'Für Kurzurlaube mit bis zu 3 Nächten Aufenthalt wird pro Nacht ein Zuschlag erhoben: 20 € in der Ferienwohnung, 17 € im Apartment.',
    },
    { title: 'Parken & Umgebung', text: 'Ein PKW-Stellplatz befindet sich direkt am Haus. Angelmöglichkeiten gibt es ganz in der Nähe.' },
    { title: 'Haustiere & Rauchen', text: 'Haustiere sind leider nicht erlaubt. In beiden Unterkünften gilt ein allgemeines Rauchverbot.' },
    { title: 'Bezahlung & Gästebeitrag', text: 'Die Zahlung erfolgt per Überweisung, nach Absprache auch bar vor Ort. Der Gästebeitrag der Gemeinde Jemgum wird für die Dauer des Aufenthalts berechnet. Alle Details finden Sie in unseren AGB.' },
  ],
}

/*
* This block was created with significant AI assistance (e.g., Claude)
* to handle the region section: tips around Pogum in tabs, pins on the schematic map and bike tours.
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
*/
// „Gut 1 km am Deich“ nach Ditzum stammt aus einer Travanto-Bewertung,
// Supermarkt / Bahnhof / Autobahn aus dem Travanto-Eintrag der Familie.

export type RegionPin = { id: number; label: string; lat: number; lon: number }
export type RegionTip = { title: string; distance: string; text: string; pin?: number; edge?: 'north' | 'south'; link?: string }

export const region = {
  label: 'Das Rheiderland',
  titleRed: 'Unsere Tipps',
  titleDark: 'rund um Pogum',
  lead: 'Was wir selbst gern machen – vom Fischbrötchen in Ditzum bis zum Regentag in Leer. Die Nummern zeigen, wo die Tipps auf der Karte liegen.',
  home: { label: 'Huus Windroos', lat: 53.318, lon: 7.243 },
  pins: [
    { id: 1, label: 'Ditzum', lat: 53.315, lon: 7.275 },
    { id: 2, label: 'Emsfähre', lat: 53.329, lon: 7.264 },
    { id: 3, label: 'Dollart', lat: 53.26, lon: 7.215 },
    { id: 4, label: 'Emden', lat: 53.367, lon: 7.206 },
    { id: 5, label: 'Leer', lat: 53.231, lon: 7.459 },
  ] as RegionPin[],
  tabs: [
    {
      key: 'ausfluege',
      label: 'Ausflüge',
      tips: [
        { title: 'Fischerdorf Ditzum', distance: 'gut 1 km', pin: 1, text: 'Kutterhafen, Mühle und Fischbrötchen – am Deich entlang ein schöner Spaziergang.' },
        { title: 'Emsfähre Ditzum–Petkum', distance: 'ab Ditzum', pin: 2, text: 'Setzt mit Rad und Auto über die Ems – der kürzeste Weg nach Emden. Fahrzeiten vorher prüfen.' },
        { title: 'Dollart & Deich', distance: 'vor der Tür', pin: 3, text: 'Weite, Schafe und im Herbst und Winter Tausende Wildgänse am Dollart.' },
        { title: 'Emden', distance: 'über die Fähre', pin: 4, text: 'Hafenstadt mit Kunsthalle, Landesmuseum und Otto Huus.' },
        { title: 'Leer', distance: 'Ausflug', pin: 5, text: 'Historische Altstadt mit Museumshafen und Bünting Teemuseum.' },
        { title: 'Greetsiel & Pilsum', distance: 'Tagesausflug', edge: 'north', text: 'Zwillingsmühlen, Kutterhafen und der gelb-rote Pilsumer Leuchtturm.' },
        { title: 'Ein Tag auf der Insel', distance: 'Tagesausflug', edge: 'north', text: 'Borkum ab Emden, Juist oder Norderney ab Norddeich.' },
      ] as RegionTip[],
    },
    {
      key: 'regen',
      label: 'Bei Regen',
      tips: [
        { title: 'Bünting Teemuseum', distance: 'Leer', pin: 5, text: 'Alles über die ostfriesische Teekultur – mit Teeprobe.' },
        { title: 'Kunsthalle Emden', distance: 'Emden', pin: 4, text: 'Kunst des 20. und 21. Jahrhunderts direkt am Wasser.' },
        { title: 'Ostfriesisches Landesmuseum', distance: 'Emden', pin: 4, text: 'Geschichte, Kunst und Rüstkammer im historischen Rathaus.' },
        { title: 'Meyer Werft Besucherzentrum', distance: 'Papenburg', edge: 'south', text: 'Kreuzfahrtschiffe im Bau aus der Nähe – Führungen vorher buchen.' },
      ] as RegionTip[],
    },
    {
      key: 'praktisch',
      label: 'Praktisch',
      tips: [
        { title: 'Parken', distance: 'am Haus', text: 'PKW-Stellplatz direkt am Haus.' },
        { title: 'Supermarkt', distance: '1,3 km', text: 'Für den täglichen Einkauf ganz in der Nähe.' },
        { title: 'Autobahn', distance: '18 km', text: 'Schnell erreichbar – und trotzdem ruhig gelegen.' },
        { title: 'Bahnhof', distance: '25 km', text: 'Wir helfen gern bei der Anreise ohne Auto.' },
      ] as RegionTip[],
    },
  ],
  bikeTitle: 'Radtouren ab der Haustür',
  bikes: [
    { title: 'Deichrunde nach Ditzum', facts: ['kurz', 'leicht'], text: 'Auf dem Deich nach Ditzum, Fischbrötchen am Hafen und zurück durchs Rheiderland.', link: '' },
    { title: 'Mit der Fähre nach Emden', facts: ['halber Tag'], text: 'Mit der Emsfähre nach Petkum, an der Ems entlang in die Stadt und am Nachmittag zurück.', link: '' },
    { title: 'Dollard-Route', facts: ['mehrtägig', 'grenzüberschreitend'], text: 'Grenzüberschreitende Radroute rund um den Dollart – durch Ostfriesland und die Provinz Groningen.', link: 'https://www.dollard-route.de' },
  ],
}

export const kontakt = {
  label: 'Kontakt',
  titleRed: 'Jetzt',
  titleDark: 'anfragen',
  text: 'Sie möchten bei uns Urlaub machen? Schreiben Sie uns Ihren Wunschzeitraum – wir melden uns schnellstmöglich mit der Verfügbarkeit und einem Angebot.',
}

export const cta = {
  line1: 'Moin und bis bald',
  line2: 'im Huus Windroos!',
}
