import { getAllEntries } from '@/lib/entries'
import { VOLUME_COLORS, VOLUME_RANGES } from '@/lib/types'
import Link from 'next/link'

const VOLUME_TITLES = [
  { vol: 1, title: 'Blood & Fire', sub: 'The Early Church', years: '30–313 AD' },
  { vol: 2, title: 'Councils & Confessions', sub: 'The Age of Doctrine', years: '313–600 AD' },
  { vol: 3, title: 'Darkness & Light', sub: 'The Medieval Church', years: '600–1400 AD' },
  { vol: 4, title: 'Here I Stand', sub: 'The Reformation', years: '1400–1650 AD' },
  { vol: 5, title: 'Fire in the World', sub: 'The Modern Church', years: '1650–Present' },
]

export default function JourneyPage() {
  const entries = getAllEntries()
  const entryMap = new Map(entries.map(e => [e.day, e]))

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
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {entries.length} of 365 written
        </span>
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

        {VOLUME_TITLES.map(({ vol, title, sub, years }) => {
          const colors = VOLUME_COLORS[vol]
          const [start, end] = VOLUME_RANGES[vol]
          const volumeEntries = entries.filter(e => e.volume === vol)

          return (
            <div key={vol} style={{ marginBottom: '3rem' }}>
              {/* Volume header */}
              <div style={{
                display: 'flex', alignItems: 'baseline', gap: '10px',
                marginBottom: '1rem', paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border)'
              }}>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 500,
                  background: colors.badge, color: colors.text,
                  borderRadius: '4px', padding: '3px 8px'
                }}>
                  Vol. {vol}
                </span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  {title}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {sub} · {years} · Days {start}–{end}
                </span>
              </div>

              {/* Entry list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(day => {
                  const entry = entryMap.get(day)
                  if (entry) {
                    return (
                      <Link key={day} href={`/entry/${day}`} style={{
                        display: 'flex', alignItems: 'baseline', gap: '12px',
                        padding: '8px 10px', borderRadius: '6px',
                        textDecoration: 'none', transition: 'background 0.15s',
                      }}
                        className="journey-row"
                      >
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                          color: 'var(--text-muted)', minWidth: '28px'
                        }}>
                          {day}
                        </span>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', flex: 1 }}>
                          {entry.title}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {entry.dateLabel}
                        </span>
                      </Link>
                    )
                  } else {
                    return (
                      <div key={day} style={{
                        display: 'flex', alignItems: 'baseline', gap: '12px',
                        padding: '8px 10px', opacity: 0.35
                      }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                          color: 'var(--text-muted)', minWidth: '28px'
                        }}>
                          {day}
                        </span>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                          Coming soon
                        </span>
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          )
        })}
      </main>

      <style>{`
        .journey-row:hover { background: var(--bg-muted); }
      `}</style>
    </div>
  )
}
