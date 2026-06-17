'use client'

import { useEffect, useState } from 'react'
import { getReadDays, getLastReadDay, getBookmarks } from '@/lib/storage'
import Link from 'next/link'
import { Series } from '@/lib/series'

export default function ProgressBar({ total, series }: { total: number; series: Series }) {
  const [readCount, setReadCount] = useState(0)
  const [lastDay, setLastDay] = useState<number | null>(null)
  const [bookmarkCount, setBookmarkCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setReadCount(getReadDays(series.slug).length)
    setLastDay(getLastReadDay(series.slug))
    setBookmarkCount(getBookmarks(series.slug).length)
  }, [series.slug])

  if (!mounted || readCount === 0) return null

  const pct = Math.round((readCount / total) * 100)

  return (
    <div style={{
      marginTop: '2rem',
      padding: '1.25rem 1.5rem',
      background: 'rgba(255,255,255,0.04)',
      borderRadius: '10px',
      border: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', flexDirection: 'column', gap: '0.875rem'
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: 'rgba(240,239,233,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
          Your progress
        </span>
        <span style={{ fontSize: '0.75rem', color: 'rgba(240,239,233,0.35)' }}>
          {readCount} of {total} read · {pct}%
        </span>
      </div>

      {/* Progress bar */}
      <div style={{
        height: '3px', background: 'rgba(255,255,255,0.08)',
        borderRadius: '2px', overflow: 'hidden'
      }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: series.accent, borderRadius: '2px',
          transition: 'width 0.4s ease'
        }} />
      </div>

      {/* Actions row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {lastDay && (
          <Link href={`/${series.slug}/entry/${lastDay}`} style={{
            fontSize: '0.85rem', color: series.accent,
            textDecoration: 'none', fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: '4px'
          }}>
            Continue — Day {lastDay} →
          </Link>
        )}
        {bookmarkCount > 0 && (
          <Link href={`/${series.slug}/bookmarks`} style={{
            fontSize: '0.85rem', color: 'rgba(240,239,233,0.4)',
            textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '4px'
          }}>
            ◆ {bookmarkCount} saved
          </Link>
        )}
      </div>
    </div>
  )
}
