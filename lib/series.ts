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
  sourcesLabel: string // label for the collapsible sources panel
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
    sourcesLabel: 'Historical Sources',
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
    tagline: '365 leadership principles, drawn straight from Scripture.',
    description:
      'A 365-day journey through the leadership principles of Scripture — for anyone entrusted with people, whether a household, a team, or a church.',
    status: 'live',
    category: 'Discipleship',
    order: 2,
    accent: '#2F8F86',
    heroBg: '#0E1413',
    totalDays: 365,
    sectionNoun: 'Theme',
    sectionAbbrev: 'Theme',
    sectionsLabel: 'Thirteen themes',
    sourcesLabel: 'Scripture & Sources',
    hero: {
      eyebrow: 'A 365-day journey in biblical leadership',
      headlineTop: 'How God forms a leader,',
      headlineAccent: 'one principle at a time.',
      sub: 'Three hundred and sixty-five leadership principles, drawn straight from Scripture — for anyone entrusted with people: a household, a team, or a church.',
    },
    journey: { title: 'The Principles', subtitle: '365 principles. 13 themes. Drawn from Scripture.' },
    sections: [
      { index: 1, title: 'Calling & Authority', subtitle: 'Where leadership begins', range: [1, 30], colors: { badge: '#E2F0EE', text: '#1C5A54', border: '#2F8F86', dot: '#2F8F86' } },
      { index: 2, title: 'Character & Integrity', subtitle: 'Who you are unseen', range: [31, 65], colors: { badge: '#E6F1FB', text: '#0C447C', border: '#378ADD', dot: '#378ADD' } },
      { index: 3, title: 'Humility & Servanthood', subtitle: 'Greatness that stoops', range: [66, 95], colors: { badge: '#E1F5EE', text: '#085041', border: '#1D9E75', dot: '#1D9E75' } },
      { index: 4, title: 'Wisdom & Discernment', subtitle: 'Leading with skill', range: [96, 130], colors: { badge: '#FAEEDA', text: '#633806', border: '#EF9F27', dot: '#EF9F27' } },
      { index: 5, title: 'Vision & Direction', subtitle: 'Setting the way', range: [131, 155], colors: { badge: '#EEEDFE', text: '#3C3489', border: '#7F77DD', dot: '#7F77DD' } },
      { index: 6, title: 'Courage & Conviction', subtitle: 'Standing firm', range: [156, 185], colors: { badge: '#FAECE7', text: '#712B13', border: '#D85A30', dot: '#D85A30' } },
      { index: 7, title: 'Shepherding & Developing People', subtitle: 'Caring for and raising others', range: [186, 220], colors: { badge: '#E7E9FB', text: '#2A3170', border: '#5560C9', dot: '#5560C9' } },
      { index: 8, title: 'Delegation, Team & Succession', subtitle: 'Sharing and handing off', range: [221, 245], colors: { badge: '#E8F2E4', text: '#2E5121', border: '#5C9A45', dot: '#5C9A45' } },
      { index: 9, title: 'Words, Truth & Influence', subtitle: 'The weight of words', range: [246, 270], colors: { badge: '#E9EEF3', text: '#2C4257', border: '#5B7B98', dot: '#5B7B98' } },
      { index: 10, title: 'Conflict, Correction & Reconciliation', subtitle: 'Hard conversations, kept whole', range: [271, 300], colors: { badge: '#F6E7EC', text: '#6E1F38', border: '#B14A6B', dot: '#B14A6B' } },
      { index: 11, title: 'Endurance, Suffering & Opposition', subtitle: 'Staying on the wall', range: [301, 325], colors: { badge: '#F3EDE2', text: '#5C4326', border: '#A07A45', dot: '#A07A45' } },
      { index: 12, title: 'Failure, Grace & Restoration', subtitle: 'Falling and rising', range: [326, 345], colors: { badge: '#E0F0F1', text: '#134E52', border: '#2C8A90', dot: '#2C8A90' } },
      { index: 13, title: 'Prayer & Dependence', subtitle: "Leading from God's presence", range: [346, 365], colors: { badge: '#EDEAF2', text: '#44356B', border: '#8A6FB0', dot: '#8A6FB0' } },
    ],
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
