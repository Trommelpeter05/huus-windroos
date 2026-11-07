/*
* This file was created with significant AI assistance (e.g., Claude)
* to handle loading occupancy and reviews from the Travanto endpoint (client side, shared per listing)
* and the shared enquiry state (calendar / price card → enquiry form).
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
*/
import type { OccupancyDays } from '~/utils/availability'

export type TravantoReviews = {
  value: number
  count: number
  categories: { label: string; value: number }[]
  reviews: { name: string; date: string; period: string; text: string; rating: number }[]
}

type Entry<T> = { status: 'idle' | 'loading' | 'ok' | 'error'; data: T | null }

function useTravantoData<T>(type: 'belegung' | 'bewertungen', objekt: number, pick: (json: any) => T) {
  const state = useState<Entry<T>>(`travanto-${type}-${objekt}`, () => ({ status: 'idle', data: null }))
  const { travantoEndpoint } = useRuntimeConfig().public

  async function load() {
    if (import.meta.server || state.value.status === 'loading' || state.value.status === 'ok') return
    state.value = { status: 'loading', data: null }
    try {
      const res = await fetch(`${travantoEndpoint}?type=${type}&objekt=${objekt}`)
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.message)
      state.value = { status: 'ok', data: pick(json) }
    } catch {
      state.value = { status: 'error', data: null }
    }
  }

  onMounted(load)
  return state
}

export function useOccupancy(objekt: number) {
  return useTravantoData<OccupancyDays>('belegung', objekt, (j) => j.days)
}

export function useReviews(objekt: number) {
  return useTravantoData<TravantoReviews>('bewertungen', objekt, (j) => ({
    value: j.value,
    count: j.count,
    categories: j.categories,
    reviews: j.reviews,
  }))
}

/** Shared enquiry state: filled by the calendar / price card, read by the enquiry form */
export function useEnquiry() {
  return useState('anfrage', () => ({ unitId: '', arrival: '', departure: '', persons: '2', stamp: 0 }))
}
