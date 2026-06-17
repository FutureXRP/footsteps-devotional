'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Series } from '@/lib/series'
import { getLastReadDay, getReadDays } from '@/lib/storage'

export default function LibraryCard({ series }: { series: Series }) {
  const live = series.status === 'live'
  const [lastDay, setLastDay] = useState<number | null>(null)
  const [readCount, setReadCount] = useState(0)

  useEffect(() => {
    if (!live) return
    setLastDay(getLastReadDay(series.slug))
    setReadCount(getReadDays(series.slug).length)
  }, [live, series.slug])

  const inner = (
    <div
      className={live ? 'lib-card lib-card-live' : 'lib-card'}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '1.75rem',
        height: '100%',
        display: 'flex', flexDirection: 'column', gap: '1rem',
        opacity: live ? 1 : 0.7,
        transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
      }}
    >
      {/* accent + category */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ width: '22px', height: '4px', borderRadius: '2px', background: series.accent }} />
        <span style={{
          fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--text-muted)'
        }}>
          {series.category}
        </span>
        {!live && (
          <span style={{
            marginLeft: 'auto', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--text-muted)',
            border: '1px solid var(--border-strong)', borderRadius: '999px', padding: '2px 8px'
          }}>
            Coming soon
          </span>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <h2 style={{
          fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 500,
          color: 'var(--text-primary)', margin: '0 0 0.5rem', lineHeight: 1.2
        }}>
          {series.title}
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          {series.tagline}
        </p>
      </div>

      {/* footer row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {series.totalDays} days
        </span>
        {live ? (
          <span style={{
            fontSize: '0.88rem', fontWeight: 500, color: series.accent,
            display: 'flex', alignItems: 'center', gap: '4px'
          }}>
            {lastDay ? `Continue — Day ${lastDay}` : 'Begin'} →
          </span>
        ) : (
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>In progress</span>
        )}
      </div>

      {live && readCount > 0 && (
        <div style={{ height: '3px', background: 'var(--bg-muted)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${Math.round((readCount / series.totalDays) * 100)}%`, background: series.accent }} />
        </div>
      )}
    </div>
  )

  if (!live) return inner
  return (
    <Link href={`/${series.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      {inner}
    </Link>
  )
}
