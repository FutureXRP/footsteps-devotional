import { Entry, VOLUME_COLORS } from './types'

// ---------------------------------------------------------------------------
// Series registry — the single source of truth for the devotional library.
//
// Adding a new devotional is DATA, not code: add a Series entry here and (for a
// live series) a content file wired up in lib/series-data.ts. The landing page,
// routing, reader, progress tracking, and sitemap all read from this registry,
// so a new series appears everywhere automatically.
//
// This module is CONFIG ONLY (no entry content) so it is safe to import into
// client components. The heavy entry JSON lives in lib/series-data.ts (server).
// ---------------------------------------------------------------------------

export interface SeriesSection {
  index: number
  title: string
  subtitle: string
  meta?: string // secondary label, e.g. a year range
  range: [number, number]
  colors: { badge: string; text: string; border: string; dot: string }
}

export interface Series {
  slug: string
  title: string // the series' own title, e.g. "Church History"
  shortTitle: string // compact label for nav/cards
  tagline: string // one line for the library card
  description: string // longer blurb for the series home + metadata
  status: 'live' | 'coming-soon'
  category: string
  order: number
  accent: string // primary CTA / progress colour
  heroBg: string // dark hero background
  totalDays: number // intended length
  sectionNoun: string // e.g. "Volume"
  sectionAbbrev: string // e.g. "Vol."
  sectionsLabel: string // e.g. "Five volumes"
  hero: { eyebrow: string; headlineTop: string; headlineAccent: string; sub: string }
  journey: { title: string; subtitle: string }
  sections: SeriesSection[]
}

const footstepsSections: SeriesSection[] = [
  { index: 1, title: 'Blood & Fire', subtitle: 'The Early Church', meta: '30–325 AD', range: [1, 73], colors: VOLUME_COLORS[1] },
  { index: 2, title: 'Councils & Confessions', subtitle: 'The Age of Doctrine', meta: '313–600 AD', range: [74, 146], colors: VOLUME_COLORS[2] },
  { index: 3, title: 'Darkness & Light', subtitle: 'The Medieval Church', meta: '600–1517 AD', range: [147, 219], colors: VOLUME_COLORS[3] },
  { index: 4, title: 'Here I Stand', subtitle: 'The Reformation', meta: '1500–1700 AD', range: [220, 292], colors: VOLUME_COLORS[4] },
  { index: 5, title: 'Fire in the World', subtitle: 'The Modern Church', meta: '1700–Present', range: [293, 365], colors: VOLUME_COLORS[5] },
]

export const SERIES: Series[] = [
  {
    slug: 'footsteps',
    title: 'Church History',
    shortTitle: 'Church History',
    tagline: 'Two thousand years of the church, one day at a time.',
    description:
      'A 365-day journey through twenty centuries of church history — the people, moments, and words that carried the faith from Pentecost to the present.',
    status: 'live',
    category: 'History',
    order: 1,
    accent: '#D85A30',
    heroBg: '#12100E',
    totalDays: 365,
    sectionNoun: 'Volume',
    sectionAbbrev: 'Vol.',
    sectionsLabel: 'Five volumes',
    hero: {
      eyebrow: 'A 365-day journey through church history',
      headlineTop: 'Two thousand years.',
      headlineAccent: 'One story at a time.',
      sub: 'From Pentecost to the present — the people, moments, and words that carried the faith forward.',
    },
    journey: { title: 'The Full Journey', subtitle: '365 days. Five volumes. Two thousand years.' },
    sections: footstepsSections,
  },
  {
    slug: 'leadership',
    title: 'Biblical Leadership',
    shortTitle: 'Leadership',
    tagline: 'How God forms leaders — drawn from Scripture’s own.',
    description:
      'A devotional walk through the leaders of Scripture and the principles that shaped them — for everyone entrusted with people, whether a household, a team, or a church.',
    status: 'coming-soon',
    category: 'Discipleship',
    order: 2,
    accent: '#2F6F6A',
    heroBg: '#0E1413',
    totalDays: 90,
    sectionNoun: 'Part',
    sectionAbbrev: 'Pt.',
    sectionsLabel: '',
    hero: { eyebrow: '', headlineTop: '', headlineAccent: '', sub: '' },
    journey: { title: '', subtitle: '' },
    sections: [],
  },
]

export function getAllSeries(): Series[] {
  return [...SERIES].sort((a, b) => a.order - b.order)
}
export function getLiveSeries(): Series[] {
  return getAllSeries().filter((s) => s.status === 'live')
}
export function getSeries(slug: string): Series | null {
  return SERIES.find((s) => s.slug === slug) ?? null
}
export function sectionForDay(series: Series, day: number): SeriesSection | null {
  return series.sections.find((s) => day >= s.range[0] && day <= s.range[1]) ?? null
}

// Re-export so callers can keep a single import for the Entry shape.
export type { Entry }
