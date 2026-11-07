/*
* This file was created with significant AI assistance (e.g., Claude)
* to handle the structured data (schema.org JSON-LD) of the start page: the house as LodgingBusiness
* with both accommodations, offers and the website – built from content.ts so it never drifts from the page.
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
*/
import { contact, goodToKnow, hero, units } from '~/data/content'

// No aggregateRating on purpose: Google ignores self-published ratings of a business on its own site
// ("self-serving reviews") and can flag the markup. Ratings come from Google / Travanto directly.
export function useStructuredData() {
  const { siteUrl } = useRuntimeConfig().public
  const [street, cityLine] = [contact.street, contact.city]
  const postalCode = cityLine.split(' ')[0]
  const locality = cityLine.split(' ').slice(1).join(' ')

  const address = {
    '@type': 'PostalAddress',
    streetAddress: street,
    postalCode,
    addressLocality: locality,
    addressRegion: 'Niedersachsen',
    addressCountry: 'DE',
  }

  const graph = [
    {
      '@type': 'LodgingBusiness',
      '@id': `${siteUrl}/#huus`,
      name: 'Huus Windroos',
      description:
        'Ferienwohnung und Apartment (Studio) bei Familie de Vries in Pogum, nahe dem Fischerdorf Ditzum am Dollart im Rheiderland (Ostfriesland).',
      url: `${siteUrl}/`,
      telephone: contact.phoneHref.replace('tel:', ''),
      email: contact.email,
      image: [`${siteUrl}${hero.image}`, `${siteUrl}/images/og-image.jpg`],
      address,
      // Fix: coordinates, map and the profiles of the house on other platforms
      geo: { '@type': 'GeoCoordinates', latitude: contact.geo.lat, longitude: contact.geo.lon },
      hasMap: contact.googleMapsHref,
      sameAs: [contact.googleMapsHref, ...units.map((u) => u.travanto.url)],
      priceRange: `${Math.min(...units.map((u) => u.priceFrom))}–${Math.max(...units.map((u) => u.priceFrom))} € pro Nacht`,
      currenciesAccepted: 'EUR',
      paymentAccepted: 'Überweisung, Barzahlung nach Absprache',
      checkinTime: '15:00',
      checkoutTime: '10:00',
      petsAllowed: false,
      smokingAllowed: false,
      numberOfRooms: units.length,
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Internet (300 Mbit/s Glasfaser)', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'PKW-Stellplatz am Haus', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Balkon', value: true },
      ],
      containsPlace: units.map((u) => ({ '@id': `${siteUrl}/#${u.id}` })),
      makesOffer: units.map((u) => ({
        '@type': 'Offer',
        name: `${u.titleRed} – Übernachtung`,
        url: `${siteUrl}/#${u.id}`,
        itemOffered: { '@id': `${siteUrl}/#${u.id}` },
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: u.priceFrom,
          priceCurrency: 'EUR',
          unitText: 'Nacht',
          eligibleQuantity: { '@type': 'QuantitativeValue', minValue: u.prices[0]?.minNights ?? 1, unitText: 'Nächte' },
        },
      })),
    },
    ...units.map((u) => ({
      '@type': 'Apartment',
      '@id': `${siteUrl}/#${u.id}`,
      name: `${u.label} im Huus Windroos`,
      description: u.text.join(' '),
      url: `${siteUrl}/#${u.id}`,
      image: u.gallery.slice(0, 4).map((g) => `${siteUrl}${g.src}`),
      address,
      containedInPlace: { '@id': `${siteUrl}/#huus` },
      occupancy: { '@type': 'QuantitativeValue', maxValue: 2, unitText: 'Personen' },
      amenityFeature: u.equipment.flatMap((g) => g.items).map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
      petsAllowed: false,
    })),
    // Fix: "Gut zu wissen" as FAQ (questions and answers for search engines and AI assistants)
    {
      '@type': 'FAQPage',
      '@id': `${siteUrl}/#faq`,
      mainEntity: goodToKnow.items.map((item) => ({
        '@type': 'Question',
        name: `${item.title} – was gilt im Huus Windroos?`,
        acceptedAnswer: { '@type': 'Answer', text: item.text },
      })),
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: 'Huus Windroos',
      inLanguage: 'de-DE',
      publisher: { '@id': `${siteUrl}/#huus` },
    },
  ]

  useHead({
    script: [
      {
        type: 'application/ld+json',
        key: 'ld-json',
        innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      },
    ],
  })
}
