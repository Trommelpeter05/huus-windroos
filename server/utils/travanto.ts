/*
* This file was created with significant AI assistance (e.g., Claude)
* to handle reading the occupancy calendar and the reviews of a Travanto listing (the same external pages
* Travanto offers for embedding) and turning them into small JSON objects. Mirrors php-version/php/travanto.php.
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
*/

// Note: this is not an official API – if Travanto changes the HTML, the regexes below need an update.
// A more stable source would be the iCal export from the Travanto landlord area.
const BASE = 'https://ext.travanto.de/ferienwohnung'
const SITE = 'https://www.huus-windroos.de/'
// Fix: browser-like request – a bot-like User-Agent can get a challenge page instead of the calendar
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml',
  'Accept-Language': 'de-DE,de;q=0.9',
  Referer: SITE,
}

export type DayStatus = 'frei' | 'belegt' | 'anreise' | 'abreise' | 'wechsel'
export type Occupancy = {
  objekt: number
  updated: string
  /** YYYY-MM-DD → status; `an` / `ab` = arrival / departure allowed on that day (Travanto rules) */
  days: Record<string, { s: DayStatus; an: boolean; ab: boolean }>
}
export type Reviews = {
  objekt: number
  updated: string
  value: number
  count: number
  categories: { label: string; value: number }[]
  reviews: { name: string; date: string; period: string; text: string; rating: number }[]
}

const num = (s: string | undefined) => (s ? Number(s.replace(',', '.')) : 0)
const decode = (s: string) =>
  s
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .trim()

export function parseOccupancy(html: string, objekt: number): Occupancy {
  const days: Occupancy['days'] = {}
  // Fix: read every day tag on its own – independent of the attribute order inside the tag
  for (const tag of html.match(/<[a-z]+\b[^>]*\bdata-datum="[^"]*"[^>]*>/gi) ?? []) {
    const m = /data-datum="(\d{2})\.(\d{2})\.(\d{4})"/.exec(tag)
    if (!m) continue
    const cls = ` ${/\bclass="([^"]*)"/.exec(tag)?.[1] ?? ''} `
    // Fix: the "vor/zurück" buttons carry a data-datum too – they are no calendar days
    if (cls.includes('blaettern')) continue
    const has = (k: string) => cls.includes(` ${k} `) || cls.includes(` ob_${k} `)
    const arr = has('anfahrt') // a booking starts that day → the night is taken
    const dep = has('abfahrt') // a booking ends that day → the morning is taken, the night is free
    const s: DayStatus = has('belegt') ? 'belegt' : arr && dep ? 'wechsel' : arr ? 'anreise' : dep ? 'abreise' : 'frei'
    days[`${m[3]}-${m[2]}-${m[1]}`] = { s, an: cls.includes(' anreisetag '), ab: cls.includes(' abreisetag ') }
  }
  if (!Object.keys(days).length) throw new Error('Travanto calendar: no days found')
  return { objekt, updated: new Date().toISOString(), days }
}

export function parseReviews(html: string, objekt: number): Reviews {
  const flat = html.replace(/\s+/g, ' ')
  const firstReview = flat.indexOf('itemprop="review"')
  const head = firstReview > -1 ? flat.slice(0, firstReview) : flat

  const count = Number(/itemprop="ratingCount">(\d+)</.exec(head)?.[1] ?? 0)
  const value = num(/itemprop="ratingValue" content="([\d.]+)"/.exec(head)?.[1])
  const categories = [...head.matchAll(/presentation-rating-box-w-in">([^<]+)<\/div> <div class="presentation-rating-box-w-in"> <span class="rating-box-w-num"[^>]*><span>([\d,]+)</g)].map(
    (m) => ({ label: decode(m[1]!), value: num(m[2]) }),
  )

  const reviews = flat
    .split('itemprop="review"')
    .slice(1)
    .map((block) => {
      const text = /itemprop="description">(.*?)<\/span>/.exec(block)?.[1]
      return {
        name: decode(/Bewertung von (.*?) vom/.exec(block)?.[1] ?? ''),
        date: /itemprop="datePublished" content="([\d-]+)"/.exec(block)?.[1] ?? '',
        period: decode(/rating-single-comment-us-zeitraum">(.*?)<\/div>/.exec(block)?.[1] ?? ''),
        text: text ? decode(text) : '',
        rating: num(/itemprop="reviewRating".*?itemprop="ratingValue" content="([\d.]+)"/.exec(block)?.[1]),
      }
    })

  if (!count || !value) throw new Error('Travanto reviews: no rating found')
  return { objekt, updated: new Date().toISOString(), value, count, categories, reviews }
}

export async function fetchHtmlRaw(url: string) {
  const res = await fetch(url, { headers: HEADERS, redirect: 'follow', signal: AbortSignal.timeout(10000) })
  const html = await res.text()
  // Fix: clear error message instead of an empty calendar (status + start of the answer for debugging)
  if (!res.ok) throw new Error(`Travanto HTTP ${res.status}: ${html.slice(0, 200).replace(/\s+/g, ' ')}`)
  return html
}

export const occupancyUrl = (objekt: number) =>
  `${BASE}/externer_belegzeitenkalender.php?nummer=${objekt}&lang=de&externUrl=${encodeURIComponent(SITE)}&design=responsive&legendPosition=top`
export const reviewsUrl = (objekt: number) => `${BASE}/externe_bewertungen.php?onr=${objekt}&lang=de&externUrl=${encodeURIComponent(SITE)}`

export const getOccupancy = defineCachedFunction(
  async (objekt: number) => parseOccupancy(await fetchHtmlRaw(occupancyUrl(objekt)), objekt),
  { name: 'travanto-belegung-v2', maxAge: 60 * 60 * 2, swr: true, getKey: (objekt: number) => String(objekt) },
)

export const getReviews = defineCachedFunction(
  async (objekt: number) => parseReviews(await fetchHtmlRaw(reviewsUrl(objekt)), objekt),
  { name: 'travanto-bewertungen-v2', maxAge: 60 * 60 * 24, swr: true, getKey: (objekt: number) => String(objekt) },
)
