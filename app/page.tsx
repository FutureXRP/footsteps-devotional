import { getFirstEntry, getAllEntries, getTotalDays, getWrittenDays } from '@/lib/entries'
import { VOLUME_COLORS } from '@/lib/types'
import Link from 'next/link'

export default function HomePage() {
  const first = getFirstEntry()
  const allEntries = getAllEntries()
  const colors = VOLUME_COLORS[first.volume]
  const written = getWrittenDays()
  const total = getTotalDays()

  const volumes = [
    { vol: 1, title: 'Blood & Fire', sub: 'The Early Church', years: '30–313 AD', days: '1–73' },
    { vol: 2, title: 'Councils & Confessions', sub: 'The Age of Doctrine', years: '313–600 AD', days: '74–146' },
    { vol: 3, title: 'Darkness & Light', sub: 'The Medieval Church', years: '600–1400 AD', days: '147–219' },
    { vol: 4, title: 'Here I Stand', sub: 'The Reformation', years: '1400–1650 AD', days: '220–292' },
    { vol: 5, title: 'Fire in the World', sub: 'The Modern Church', years: '1650–Present', days: '293–365' },
  ]

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <nav style={{
        padding: '0 1.5rem', height: '52px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)'
      }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--text-primary)' }}>
          The Footsteps Devotional
        </span>
        <Link href="/journey" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
          All entries →
        </Link>
      </nav>

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '4rem 1.5rem 6rem' }}>

        <div style={{ marginBottom: '4rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
            A 365-day journey through church history
          </p>
          <h1 style={{
            fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 400, lineHeight: 1.15, color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Two thousand years.<br />One story at a time.
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '520px', marginBottom: '2rem' }}>
            From Pentecost to the present — the people, moments, and words that carried the faith forward. A daily devotional for those who want to know where they came from.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href={`/entry/${first.day}`} style={{
              display: 'inline-block',
              background: 'var(--text-primary)', color: 'var(--bg)',
              padding: '10px 20px', borderRadius: '6px',
              fontSize: '0.9rem', textDecoration: 'none', fontWeight: 500
            }}>
              Start with Day 1
            </Link>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {written} of {total} entries written
            </span>
          </div>
        </div>

        <div style={{ marginBottom: '4rem' }}>
          <div className="section-label">Start here</div>
          <Link href={`/entry/${first.day}`} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 500,
                  background: colors.badge, color: colors.text,
                  borderRadius: '4px', padding: '2px 7px'
                }}>
                  Day {first.day} · Vol. 1
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{first.dateLabel}</span>
              </div>
              <h2 style={{
                fontFamily: 'var(--font-serif)', fontSize: '1.3rem',
                fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.25rem'
              }}>
                {first.title}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', fontStyle: 'italic' }}>
                {first.figure}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                {first.moment.split('\n\n')[0]}
              </p>
            </div>
          </Link>
        </div>

        <div>
          <div className="section-label">Five volumes</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {volumes.map(({ vol, title, sub, years, days }) => {
              const vc = VOLUME_COLORS[vol]
              const volEntries = allEntries.filter(e => e.volume === vol)
              return (
                <div key={vol} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 10px', borderRadius: '8px',
                  borderBottom: '1px solid var(--border)'
                }}>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 500,
                    background: vc.badge, color: vc.text,
                    borderRadius: '4px', padding: '2px 7px', whiteSpace: 'nowrap'
                  }}>
                    Vol. {vol}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>{title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub} · {years}</div>
                  </div>
                  <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Days {days}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', opacity: 0.6 }}>
                      {volEntries.length} written
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </main>
    </div>
  )
}
