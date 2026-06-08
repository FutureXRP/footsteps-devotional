import { getFirstEntry, getAllEntries, getTotalDays, getWrittenDays } from '@/lib/entries'
import { VOLUME_COLORS } from '@/lib/types'
import Link from 'next/link'

export default function HomePage() {
  const first = getFirstEntry()
  const allEntries = getAllEntries()
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

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20,
        padding: '0 2rem', height: '52px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#12100E',
        borderBottom: '1px solid rgba(255,255,255,0.07)'
      }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: '#F0EFE9' }}>
          The Footsteps Devotional
        </span>
        <Link href="/journey" style={{
          fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: '4px'
        }}>
          All entries →
        </Link>
      </nav>

      {/* Hero — dark, full width */}
      <div style={{
        background: '#12100E',
        backgroundImage: 'radial-gradient(ellipse at 20% 60%, rgba(180,80,30,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(100,60,160,0.08) 0%, transparent 50%)',
        minHeight: '92vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '8rem 2rem 6rem',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Subtle texture lines */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 80px)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '760px', margin: '0 auto', width: '100%', position: 'relative' }}>

          {/* Eyebrow */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem'
          }}>
            <div style={{ width: '28px', height: '1px', background: '#D85A30' }} />
            <span style={{
              fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#D85A30', fontWeight: 500
            }}>
              A 365-day journey through church history
            </span>
          </div>

          {/* Main headline */}
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            fontWeight: 400, lineHeight: 1.1,
            color: '#F0EFE9',
            marginBottom: '1.5rem',
            letterSpacing: '-0.01em'
          }}>
            Two thousand years.<br />
            <span style={{ color: 'rgba(240,239,233,0.45)' }}>One story at a time.</span>
          </h1>

          {/* Sub */}
          <p style={{
            fontSize: '1.1rem', color: 'rgba(240,239,233,0.55)',
            lineHeight: 1.75, maxWidth: '520px', marginBottom: '3rem'
          }}>
            From Pentecost to the present — the people, moments, and words that carried the faith forward.
          </p>

          {/* CTA row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link href={`/entry/${first.day}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#D85A30', color: '#FFF',
              padding: '12px 24px', borderRadius: '6px',
              fontSize: '0.95rem', textDecoration: 'none', fontWeight: 500,
              letterSpacing: '0.01em'
            }}>
              Begin with Day 1
            </Link>
            <Link href="/journey" style={{
              fontSize: '0.9rem', color: 'rgba(240,239,233,0.45)',
              textDecoration: 'none', borderBottom: '1px solid rgba(240,239,233,0.15)',
              paddingBottom: '1px'
            }}>
              Browse all {total} entries
            </Link>
          </div>

          {/* Progress indicator */}
          <div style={{ marginTop: '4rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              height: '2px', width: '200px', background: 'rgba(255,255,255,0.08)',
              borderRadius: '1px', overflow: 'hidden'
            }}>
              <div style={{
                height: '100%', width: `${(written / total) * 100}%`,
                background: '#D85A30', borderRadius: '1px'
              }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'rgba(240,239,233,0.3)' }}>
              {written} of {total} entries written
            </span>
          </div>
        </div>
      </div>

      {/* Featured entry */}
      <div style={{ background: 'var(--bg)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>

          <div style={{
            fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.5rem'
          }}>
            Start here
          </div>

          <Link href={`/entry/${first.day}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              borderRadius: '16px', padding: '2rem',
              display: 'grid', gridTemplateColumns: '1fr auto',
              gap: '2rem', alignItems: 'start',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
              className="featured-card"
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 500,
                    background: VOLUME_COLORS[first.volume].badge,
                    color: VOLUME_COLORS[first.volume].text,
                    borderRadius: '4px', padding: '3px 8px'
                  }}>
                    Day {first.day} · Vol. 1
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{first.dateLabel}</span>
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.6rem', fontWeight: 500,
                  color: 'var(--text-primary)', marginBottom: '0.25rem', lineHeight: 1.25
                }}>
                  {first.title}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', fontStyle: 'italic' }}>
                  {first.figure}
                </p>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>
                  {first.moment.split('\n\n')[0]}
                </p>
              </div>
              <div style={{
                fontSize: '1.5rem', color: 'var(--text-muted)', opacity: 0.3,
                paddingTop: '4px', whiteSpace: 'nowrap'
              }}>
                →
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Volumes */}
      <div style={{ background: 'var(--bg-muted)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>

          <div style={{
            fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '2rem'
          }}>
            Five volumes
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {volumes.map(({ vol, title, sub, years, days }) => {
              const vc = VOLUME_COLORS[vol]
              const volCount = allEntries.filter(e => e.volume === vol).length
              return (
                <div key={vol} style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '1.25rem 1.5rem',
                  display: 'flex', alignItems: 'center', gap: '1.25rem'
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    background: vc.badge, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: vc.text }}>
                      {vol}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.95rem', fontWeight: 500,
                      color: 'var(--text-primary)', marginBottom: '2px'
                    }}>
                      {title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {sub} · {years}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      Days {days}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {volCount} written
                    </div>
                  </div>
                  <div style={{
                    width: '4px', height: '36px', borderRadius: '2px',
                    background: vc.border, flexShrink: 0, opacity: 0.4
                  }} />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: '#12100E', padding: '2.5rem 2rem',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem', color: 'rgba(240,239,233,0.3)' }}>
            The Footsteps Devotional
          </span>
          <span style={{ fontSize: '0.75rem', color: 'rgba(240,239,233,0.2)' }}>
            Matt &amp; Georgia Blair
          </span>
        </div>
      </div>

      <style>{`
        .featured-card:hover {
          border-color: var(--border-strong) !important;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }
      `}</style>
    </div>
  )
}
