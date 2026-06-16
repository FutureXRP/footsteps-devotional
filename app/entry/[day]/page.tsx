import { getEntry, getAdjacentDays, getAllEntries } from '@/lib/entries'
import EntryReader from '@/components/EntryReader'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/site'

export async function generateStaticParams() {
  const entries = getAllEntries()
  return entries.map(e => ({ day: String(e.day) }))
}

export async function generateMetadata({ params }: { params: Promise<{ day: string }> }): Promise<Metadata> {
  const { day } = await params
  const entry = getEntry(parseInt(day))
  if (!entry) return {}

  // Title composes with the site-wide template ("%s · The Footsteps Devotional").
  const title = `Day ${entry.day}: ${entry.title}`
  const lead = entry.moment.split('\n\n')[0].replace(/\s+/g, ' ').trim()
  const description = `${entry.figure} · ${entry.dateLabel} — ${lead}`.slice(0, 155)
  const path = `/entry/${entry.day}`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      url: path,
      siteName: SITE_NAME,
      title: `${title} · ${SITE_NAME}`,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} · ${SITE_NAME}`,
      description,
    },
  }
}

export default async function EntryPage({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params
  const dayNum = parseInt(day)
  const entry = getEntry(dayNum)
  if (!entry) notFound()

  const { prev, next } = getAdjacentDays(dayNum)

  return <EntryReader entry={entry} prev={prev} next={next} />
}
