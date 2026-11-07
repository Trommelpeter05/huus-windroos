/*
* This file was created with significant AI assistance (e.g., Claude)
* to handle the JSON endpoint for occupancy and reviews: /api/travanto?type=belegung|bewertungen&objekt=<nr>
* (only the listing numbers from content.ts are accepted). &debug=1 skips the cache and reports what came back.
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
*/
import { units } from '~/data/content'

export default defineEventHandler(async (event) => {
  const { type, objekt, debug } = getQuery(event)
  const nr = Number(objekt)
  if (!units.some((u) => u.travanto.id === nr) || (type !== 'belegung' && type !== 'bewertungen')) {
    setResponseStatus(event, 400)
    return { ok: false, message: 'Ungültige Anfrage' }
  }

  // Fix: diagnosis without cache – shows status, size and how many days / bookings were recognised
  if (debug) {
    const url = type === 'belegung' ? occupancyUrl(nr) : reviewsUrl(nr)
    try {
      const data = type === 'belegung' ? parseOccupancy(await fetchHtmlRaw(url), nr) : parseReviews(await fetchHtmlRaw(url), nr)
      const summary =
        'days' in data
          ? Object.values(data.days).reduce<Record<string, number>>((acc, d) => ((acc[d.s] = (acc[d.s] ?? 0) + 1), acc), {})
          : { value: data.value, count: data.count, reviews: data.reviews.length }
      return { ok: true, url, summary }
    } catch (e) {
      // Fix: include the network cause (e.g. ENOTFOUND, ECONNREFUSED, certificate errors)
      const err = e as Error & { cause?: { code?: string; message?: string } }
      return { ok: false, url, error: [err.message, err.cause?.code, err.cause?.message].filter(Boolean).join(' – ') }
    }
  }

  try {
    const data = type === 'belegung' ? await getOccupancy(nr) : await getReviews(nr)
    setHeader(event, 'Cache-Control', 'public, max-age=900')
    return { ok: true, ...data }
  } catch (e) {
    console.error('[travanto]', e)
    setResponseStatus(event, 502)
    return { ok: false, message: 'Travanto ist gerade nicht erreichbar' }
  }
})
