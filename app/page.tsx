import { getAllSeries } from '@/lib/series'
import LibraryCard from '@/components/LibraryCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'The Footsteps Devotional — Daily Devotionals Through Scripture & History' },
  description:
    'A library of carefully sourced daily devotionals that walk you through Scripture and the Christian story. Choose a series and begin.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'The Footsteps Devotional',
    description:
      'A library of carefully sourced daily devotionals that walk you through Scripture and the Christian story.',
  },
}

export default function Library() {
  const series = getAllSeries()

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '5rem 2rem 4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
            <div style={{ width: '28px', height: '1px', background: '#D85A30' }} />
            <span style={{
              fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#D85A30', fontWeight: 500
            }}>
              Daily devotionals
            </span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
            fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.01em',
            color: 'var(--text-primary)', margin: '0 0 1.25rem'
          }}>
            The Footsteps Devotional
          </h1>
          <p style={{
            fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7,
            maxWidth: '560px', margin: 0
          }}>
            Carefully sourced daily readings that walk you through Scripture and the Christian story. Choose a series to begin.
          </p>
        </div>
      </header>

      {/* Series grid */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>
        <div style={{
          fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.5rem'
        }}>
          Choose a devotional
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}>
          {series.map((s) => (
            <LibraryCard key={s.slug} series={s} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: '#12100E', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem', color: 'rgba(240,239,233,0.3)' }}>
            The Footsteps Devotional
          </span>
          <span style={{ fontSize: '0.75rem', color: 'rgba(240,239,233,0.2)' }}>
            Matt Blair
          </span>
        </div>
      </footer>

      <style>{`
        .lib-card-live:hover {
          border-color: var(--border-strong) !important;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  )
}
