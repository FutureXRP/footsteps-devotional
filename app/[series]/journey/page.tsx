import { getSeries, getLiveSeries } from '@/lib/series'
import { getSeriesEntries, getWrittenCount } from '@/lib/series-data'
import JourneyClient from '@/components/JourneyClient'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const dynamicParams = false

export function generateStaticParams() {
  return getLiveSeries().map((s) => ({ series: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ series: string }> }): Promise<Metadata> {
  const { series: slug } = await params
  const series = getSeries(slug)
  if (!series) return {}
  return {
    title: `${series.journey.title} — ${series.title}`,
    description: `Browse all ${series.totalDays} entries of ${series.title}.`,
    alternates: { canonical: `/${series.slug}/journey` },
  }
}

export default async function JourneyPage({ params }: { params: Promise<{ series: string }> }) {
  const { series: slug } = await params
  const series = getSeries(slug)
  if (!series || series.status !== 'live') notFound()

  const entries = getSeriesEntries(slug)
  const entryMap = new Map(entries.map(e => [e.day, e]))

  const groups = series.sections.map((sec) => {
    const [start, end] = sec.range
    const rows = Array.from({ length: end - start + 1 }, (_, i) => {
      const day = start + i
      const entry = entryMap.get(day)
      if (!entry) return null
      return { day: entry.day, title: entry.title, dateLabel: entry.dateLabel, volume: entry.volume }
    })
    return { vol: sec.index, title: sec.title, sub: sec.subtitle, meta: sec.meta ?? '', colors: sec.colors, range: sec.range, rows }
  })

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--bg)', borderBottom: '1px solid var(--border)',
        padding: '0 1.5rem', height: '52px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <Link href={`/${series.slug}`} style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--text-primary)' }}>
            {series.shortTitle}
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link href={`/${series.slug}/bookmarks`} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
            Saved
          </Link>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {getWrittenCount(slug)} of {series.totalDays} written
          </span>
        </div>
      </nav>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.5rem'
        }}>
          {series.journey.title}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '3rem' }}>
          {series.journey.subtitle}
        </p>

        <JourneyClient groups={groups} seriesSlug={series.slug} />
      </main>
    </div>
  )
}
