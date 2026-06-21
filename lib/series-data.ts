import { Entry } from './types'
import footstepsData from '@/data/entries.json'
import leadershipData from '@/data/series/leadership.json'
import formationData from '@/data/series/spiritual-formation.json'
import upheavalData from '@/data/series/the-upheaval.json'

// ---------------------------------------------------------------------------
// Server-only entry data access.
//
// This is the only module that imports the (large) per-series content files,
// so it must never be imported from a client component — pages load the data
// here and pass what's needed down as props.
//
// The historical series intentionally keeps loading from its original,
// untouched path (data/entries.json). New series live under data/series/.
// ---------------------------------------------------------------------------

const ENTRIES: Record<string, Entry[]> = {
  footsteps: footstepsData as Entry[],
  leadership: leadershipData as Entry[],
  'spiritual-formation': formationData as Entry[],
  'the-upheaval': upheavalData as Entry[],
}

export function getSeriesEntries(slug: string): Entry[] {
  return (ENTRIES[slug] ?? []).slice().sort((a, b) => a.day - b.day)
}

export function getSeriesEntry(slug: string, day: number): Entry | null {
  return (ENTRIES[slug] ?? []).find((e) => e.day === day) ?? null
}

export function getFirstEntry(slug: string): Entry | null {
  return getSeriesEntries(slug)[0] ?? null
}

export function getAdjacent(slug: string, day: number): { prev: number | null; next: number | null } {
  const days = getSeriesEntries(slug).map((e) => e.day)
  const i = days.indexOf(day)
  return {
    prev: i > 0 ? days[i - 1] : null,
    next: i >= 0 && i < days.length - 1 ? days[i + 1] : null,
  }
}

export function getWrittenCount(slug: string): number {
  return (ENTRIES[slug] ?? []).length
}
