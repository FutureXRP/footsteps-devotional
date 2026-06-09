import { getAllEntries } from '@/lib/entries'
import { VOLUME_RANGES } from '@/lib/types'
import JourneyClient from '@/components/JourneyClient'
import Link from 'next/link'

const VOLUME_TITLES = [
  { vol: 1, title: 'Blood & Fire', sub: 'The Early Church', years: '30–325 AD' },
  { vol: 2, title: 'Councils & Confessions', sub: 'The Age of Doctrine', years: '313–600 AD' },
  { vol: 3, title: 'Darkness & Light', sub: 'The Medieval Church', years: '600–1517 AD' },
  { vol: 4, title: 'Here I Stand', sub: 'The Reformation', years: '1500–1700 AD' },
  { vol: 5, title: 'Fire in the World', sub: 'The Modern Church', years: '1700–Present' },
]

export default function JourneyPage() {
  const entries = getAllEntries()
  const entryMap = new Map(entries.map(e => [e.day, e]))

  // Build groups for client component
  const groups = VOLUME_TITLES.map(({ vol, title, sub, years }) => {
    const [start, end] = VOLUME_RANGES[vol]
    const rows = Array.from({ length: end - start + 1 }, (_, i) => {
      const day = start + i
      const entry = entryMap.get(day)
      if (!entry) return null
      return { day: entry.day, title: entry.title, dateLabel: entry.dateLabel, volume: entry.volume }
    })
    return { vol, title, sub, years, rows }
  })

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--bg)', borderBottom: '1px solid var(--border)',
        padding: '0 1.5rem', height: '52px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--text-primary)' }}>
            Footsteps
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link href="/bookmarks" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
            Saved
          </Link>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {entries.length} of 365 written
          </span>
        </div>
      </nav>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.5rem'
        }}>
          The Full Journey
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '3rem' }}>
          365 days. Five volumes. Two thousand years.
        </p>

        <JourneyClient groups={groups} />
      </main>
    </div>
  )
}
