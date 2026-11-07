/*
* This file was created with significant AI assistance (e.g., Claude)
* to handle the occupancy rules of the calendar: which nights are free, where a stay may start / end,
* and whether a chosen period is available.
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
*/
export type DayStatus = 'frei' | 'belegt' | 'anreise' | 'abreise' | 'wechsel'
export type DayInfo = { s: DayStatus; an: boolean; ab: boolean }
export type OccupancyDays = Record<string, DayInfo>

const DAY = 86_400_000

export function isoDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

export function addDays(iso: string, n: number) {
  return isoDate(new Date(Date.parse(`${iso}T00:00:00Z`) + n * DAY))
}

export function todayIso() {
  const now = new Date()
  return isoDate(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())))
}

/** The night from `iso` to the next day is free (unknown days count as free – the family checks every enquiry) */
export function nightFree(days: OccupancyDays | null, iso: string) {
  const d = days?.[iso]
  return !d || d.s === 'frei' || d.s === 'abreise'
}

export function canArrive(days: OccupancyDays | null, iso: string) {
  if (iso < todayIso()) return false
  const d = days?.[iso]
  return nightFree(days, iso) && (!d || d.an)
}

/** All nights from arrival up to the night before departure are free, and departure is allowed that day */
export function rangeFree(days: OccupancyDays | null, arrival: string, departure: string) {
  if (departure <= arrival) return false
  for (let d = arrival; d < departure; d = addDays(d, 1)) {
    if (!nightFree(days, d)) return false
  }
  const dep = days?.[departure]
  return !dep || dep.ab
}
