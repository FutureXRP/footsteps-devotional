import { getSeries, getLiveSeries, sectionForDay } from '@/lib/series'
import { getFirstEntry, getSeriesEntries, getWrittenCount } from '@/lib/series-data'
import Link from 'next/link'
import ProgressBar from '@/components/ProgressBar'
import { notFound } from 'next/navigation'
import type { Metadata, Viewport } from 'next'

export const dynamicParams = false

export function generateStaticParams() {
  return getLiveSeries().map((s) => ({ series: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ series: string }> }): Promise<Metadata> {
  const { series: slug } = await params
  const series = getSeries(slug)
  if (!series) return {}
  return {
    title: series.title,
    description: series.description,
    alternates: { canonical: `/${series.slug}` },
    openGraph: {
      type: 'website',
      url: `/${series.slug}`,
      title: `${series.title} · The Footsteps Devotional`,
      description: series.description,
    },
  }
}

export async function generateViewport({ params }: { params: Promise<{ series: string }> }): Promise<Viewport> {
  const { series: slug } = await params
  const series = getSeries(slug)
  return { themeColor: series?.heroBg ?? '#12100E' }
}

export default async function SeriesHome({ params }: { params: Promise<{ series: string }> }) {
  const { series: slug } = await params
  const series = getSeries(slug)
  if (!series || series.status !== 'live') notFound()

  const first = getFirstEntry(slug)
  if (!first) notFound()
  const allEntries = getSeriesEntries(slug)
  const written = getWrittenCount(slug)
  const total = series.totalDays
  const firstSection = sectionForDay(series, first.day)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20,
        padding: '0 2rem', height: '52px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: series.heroBg,
        borderBottom: '1px solid rgba(255,255,255,0.07)'
      }}>
        <Link href="/" style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: '#F0EFE9', textDecoration: 'none' }}>
          The Footsteps Devotional
        </Link>
        <Link href={`/${series.slug}/journey`} style={{
          fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: '4px'
        }}>
          All entries →
        </Link>
      </nav>

      {/* Hero */}
      <div style={{
        background: series.heroBg,
        backgroundImage: 'radial-gradient(ellipse at 20% 60%, rgba(180,80,30,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(100,60,160,0.08) 0%, transparent 50%)',
        minHeight: '92vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '8rem 2rem 6rem',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 80px)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '760px', margin: '0 auto', width: '100%', position: 'relative' }}>

          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
            <div style={{ width: '28px', height: '1px', background: series.accent }} />
            <span style={{
              fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase',
              color: series.accent, fontWeight: 500
            }}>
              {series.hero.eyebrow}
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            fontWeight: 400, lineHeight: 1.1,
            color: '#F0EFE9',
            marginBottom: '1.5rem',
            letterSpacing: '-0.01em'
          }}>
            {series.hero.headlineTop}<br />
            <span style={{ color: 'rgba(240,239,233,0.45)' }}>{series.hero.headlineAccent}</span>
          </h1>

          {/* Sub */}
          <p style={{
            fontSize: '1.1rem', color: 'rgba(240,239,233,0.55)',
            lineHeight: 1.75, maxWidth: '520px', marginBottom: '3rem'
          }}>
            {series.hero.sub}
          </p>

          {/* CTA row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link href={`/${series.slug}/entry/${first.day}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: series.accent, color: '#FFF',
              padding: '12px 24px', borderRadius: '6px',
              fontSize: '0.95rem', textDecoration: 'none', fontWeight: 500,
              letterSpacing: '0.01em'
            }}>
              Begin with Day {first.day}
            </Link>
            <Link href={`/${series.slug}/journey`} style={{
              fontSize: '0.9rem', color: 'rgba(240,239,233,0.45)',
              textDecoration: 'none', borderBottom: '1px solid rgba(240,239,233,0.15)',
              paddingBottom: '1px'
            }}>
              Browse all {total} entries
            </Link>
          </div>

          {/* Static written-progress indicator */}
          <div style={{ marginTop: '4rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              height: '2px', width: '200px', background: 'rgba(255,255,255,0.08)',
              borderRadius: '1px', overflow: 'hidden'
            }}>
              <div style={{
                height: '100%', width: `${(written / total) * 100}%`,
                background: series.accent, borderRadius: '1px'
              }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'rgba(240,239,233,0.3)' }}>
              {written} of {total} entries written
            </span>
          </div>

          {/* Personal reading progress */}
          <ProgressBar total={total} series={series} />
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

          <Link href={`/${series.slug}/entry/${first.day}`} style={{ textDecoration: 'none', display: 'block' }}>
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
                    background: firstSection?.colors.badge ?? 'var(--bg-muted)',
                    color: firstSection?.colors.text ?? 'var(--text-secondary)',
                    borderRadius: '4px', padding: '3px 8px'
                  }}>
                    Day {first.day} · {series.sectionAbbrev} {firstSection?.index ?? first.volume}
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

      {/* Sections */}
      <div style={{ background: 'var(--bg-muted)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{
            fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '2rem'
          }}>
            {series.sectionsLabel || `${series.sections.length} parts`}
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {series.sections.map((sec) => {
              const count = allEntries.filter(e => e.day >= sec.range[0] && e.day <= sec.range[1]).length
              return (
                <div key={sec.index} style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '1.25rem 1.5rem',
                  display: 'flex', alignItems: 'center', gap: '1.25rem'
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    background: sec.colors.badge, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: sec.colors.text }}>
                      {sec.index}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.95rem', fontWeight: 500,
                      color: 'var(--text-primary)', marginBottom: '2px'
                    }}>
                      {sec.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {sec.subtitle}{sec.meta ? ` · ${sec.meta}` : ''}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      Days {sec.range[0]}–{sec.range[1]}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {count} written
                    </div>
                  </div>
                  <div style={{
                    width: '4px', height: '36px', borderRadius: '2px',
                    background: sec.colors.border, flexShrink: 0, opacity: 0.4
                  }} />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: series.heroBg, padding: '2.5rem 2rem',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem', color: 'rgba(240,239,233,0.3)', textDecoration: 'none' }}>
            The Footsteps Devotional
          </Link>
          <span style={{ fontSize: '0.75rem', color: 'rgba(240,239,233,0.2)' }}>
            Matt Blair
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
