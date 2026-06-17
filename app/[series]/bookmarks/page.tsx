import { getSeries, getLiveSeries } from '@/lib/series'
import { getSeriesEntries } from '@/lib/series-data'
import BookmarksClient, { SavedEntry } from '@/components/BookmarksClient'
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
    title: `Saved — ${series.title}`,
    description: `Your saved entries in ${series.title}.`,
    alternates: { canonical: `/${series.slug}/bookmarks` },
    robots: { index: false, follow: true },
  }
}

export default async function BookmarksPage({ params }: { params: Promise<{ series: string }> }) {
  const { series: slug } = await params
  const series = getSeries(slug)
  if (!series || series.status !== 'live') notFound()

  const allEntries: SavedEntry[] = getSeriesEntries(slug).map((e) => ({
    day: e.day,
    title: e.title,
    figure: e.figure,
    volume: e.volume,
    dateLabel: e.dateLabel,
    era: e.era,
  }))

  return <BookmarksClient series={series} allEntries={allEntries} />
}
