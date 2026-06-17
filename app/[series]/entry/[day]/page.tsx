import { getSeries, getLiveSeries } from '@/lib/series'
import { getSeriesEntry, getSeriesEntries, getAdjacent } from '@/lib/series-data'
import EntryReader from '@/components/EntryReader'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const dynamicParams = false

export function generateStaticParams() {
  return getLiveSeries().flatMap((s) =>
    getSeriesEntries(s.slug).map((e) => ({ series: s.slug, day: String(e.day) }))
  )
}

export async function generateMetadata({ params }: { params: Promise<{ series: string; day: string }> }): Promise<Metadata> {
  const { series: slug, day } = await params
  const series = getSeries(slug)
  const entry = series ? getSeriesEntry(slug, parseInt(day)) : null
  if (!series || !entry) return {}

  const title = `Day ${entry.day}: ${entry.title}`
  const lead = entry.moment.split('\n\n')[0].replace(/\s+/g, ' ').trim()
  const description = `${entry.figure} · ${entry.dateLabel} — ${lead}`.slice(0, 155)
  const path = `/${series.slug}/entry/${entry.day}`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      url: path,
      siteName: 'The Footsteps Devotional',
      title: `${title} · The Footsteps Devotional`,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} · The Footsteps Devotional`,
      description,
    },
  }
}

export default async function EntryPage({ params }: { params: Promise<{ series: string; day: string }> }) {
  const { series: slug, day } = await params
  const series = getSeries(slug)
  if (!series || series.status !== 'live') notFound()

  const dayNum = parseInt(day)
  const entry = getSeriesEntry(slug, dayNum)
  if (!entry) notFound()

  const { prev, next } = getAdjacent(slug, dayNum)

  return <EntryReader entry={entry} prev={prev} next={next} series={series} />
}
