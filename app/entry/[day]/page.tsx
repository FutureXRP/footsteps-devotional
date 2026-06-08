import { getEntry, getAdjacentDays, getAllEntries } from '@/lib/entries'
import EntryReader from '@/components/EntryReader'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const entries = getAllEntries()
  return entries.map(e => ({ day: String(e.day) }))
}

export async function generateMetadata({ params }: { params: Promise<{ day: string }> }): Promise<Metadata> {
  const { day } = await params
  const entry = getEntry(parseInt(day))
  if (!entry) return {}
  return {
    title: `Day ${entry.day}: ${entry.title} — The Footsteps Devotional`,
    description: `${entry.figure} · ${entry.dateLabel}`,
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
