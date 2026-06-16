'use client'

import { useEffect, useState } from 'react'
import { getReadDays, getBookmarks } from '@/lib/storage'
import Link from 'next/link'
import { VOLUME_COLORS, VOLUME_RANGES } from '@/lib/types'

interface EntryRow {
  day: number
  title: string
  dateLabel: string
  volume: number
}

interface VolumeGroup {
  vol: number
  title: string
  sub: string
  years: string
  rows: (EntryRow | null)[] // null = not yet written
}

export default function JourneyClient({ groups }: { groups: VolumeGroup[] }) {
  const [readDays, setReadDays] = useState<Set<number>>(new Set())
  const [bookmarkedDays, setBookmarkedDays] = useState<Set<number>>(new Set())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setReadDays(new Set(getReadDays()))
    setBookmarkedDays(new Set(getBookmarks()))
  }, [])

  return (
    <>
      {groups.map(({ vol, title, sub, years, rows }) => {
        const colors = VOLUME_COLORS[vol]
        const [start, end] = VOLUME_RANGES[vol]
        const readInVol = mounted ? rows.filter(r => r && readDays.has(r.day)).length : 0
        const totalInVol = rows.filter(r => r !== null).length

        return (
          <div key={vol} style={{ marginBottom: '3rem' }}>
            {/* Volume header */}
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: '10px',
              flexWrap: 'wrap',
              marginBottom: '1rem', paddingBottom: '0.75rem',
              borderBottom: '1px solid var(--border)'
            }}>
              <span style={{
                fontSize: '0.7rem', fontWeight: 500,
                background: colors.badge, color: colors.text,
                borderRadius: '4px', padding: '3px 8px'
              }}>
                Vol. {vol}
              </span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                {title}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {sub} · {years} · Days {start}–{end}
              </span>
              {mounted && readInVol > 0 && (
                <span style={{
                  marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-muted)',
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  {readInVol}/{totalInVol} read
                </span>
              )}
            </div>

            {/* Entry list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {rows.map((entry, i) => {
                const day = start + i
                if (entry) {
                  const isRead = mounted && readDays.has(day)
                  const isBookmarked = mounted && bookmarkedDays.has(day)
                  return (
                    <Link key={day} href={`/entry/${day}`} style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '8px 10px', borderRadius: '6px',
                      textDecoration: 'none', transition: 'background 0.15s',
                    }}
                      className="journey-row"
                    >
                      {/* Read indicator */}
                      <span style={{
                        width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                        background: isRead ? colors.border : 'var(--border)',
                        opacity: isRead ? 1 : 0.4,
                        transition: 'background 0.2s'
                      }} />

                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                        color: 'var(--text-muted)', minWidth: '28px'
                      }}>
                        {day}
                      </span>
                      <span style={{
                        fontSize: '0.9rem',
                        color: isRead ? 'var(--text-secondary)' : 'var(--text-primary)',
                        flex: 1
                      }}>
                        {entry.title}
                      </span>
                      {isBookmarked && (
                        <span style={{ fontSize: '0.6rem', color: colors.border }}>◆</span>
                      )}
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {entry.dateLabel}
                      </span>
                    </Link>
                  )
                } else {
                  return (
                    <div key={day} style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '8px 10px', opacity: 0.35
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }} />
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                        color: 'var(--text-muted)', minWidth: '28px'
                      }}>
                        {day}
                      </span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Coming soon
                      </span>
                    </div>
                  )
                }
              })}
            </div>
          </div>
        )
      })}
      <style>{`.journey-row:hover { background: var(--bg-muted); }`}</style>
    </>
  )
}
