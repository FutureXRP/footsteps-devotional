import entriesData from '@/data/entries.json'
import { Entry } from './types'

const entries: Entry[] = entriesData as Entry[]

export function getAllEntries(): Entry[] {
  return entries.sort((a, b) => a.day - b.day)
}

export function getEntry(day: number): Entry | null {
  return entries.find(e => e.day === day) ?? null
}

export function getFirstEntry(): Entry {
  return entries.sort((a, b) => a.day - b.day)[0]
}

export function getAdjacentDays(day: number): { prev: number | null; next: number | null } {
  const allDays = entries.map(e => e.day).sort((a, b) => a - b)
  const idx = allDays.indexOf(day)
  return {
    prev: idx > 0 ? allDays[idx - 1] : null,
    next: idx < allDays.length - 1 ? allDays[idx + 1] : null,
  }
}

export function getEntriesByVolume(volume: number): Entry[] {
  return entries.filter(e => e.volume === volume).sort((a, b) => a.day - b.day)
}

export function getTotalDays(): number {
  return 365
}

export function getWrittenDays(): number {
  return entries.length
}
