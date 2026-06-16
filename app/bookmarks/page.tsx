'use client'

import { useEffect, useState } from 'react'
import { getBookmarks, toggleBookmark } from '@/lib/storage'
import { VOLUME_COLORS } from '@/lib/types'
import Link from 'next/link'
import entriesData from '@/data/entries.json'

interface SavedEntry {
  day: number
  title: string
  figure: string
  volume: number
  volumeTitle: string
  dateLabel: string
  era: string
}

const allEntries = entriesData as SavedEntry[]

export default function BookmarksPage() {
  const [entries, setEntries] = useState<SavedEntry[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const bookmarks = getBookmarks()
    const saved = allEntries
      .filter(e => bookmarks.includes(e.day))
      .sort((a, b) => a.day - b.day)
    setEntries(saved)
  }, [])

  function handleRemove(day: number) {
    toggleBookmark(day)
    setEntries(prev => prev.filter(e => e.day !== day))
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--bg)', borderBottom: '1px solid var(--border)',
        padding: '0 1.5rem', height: '52px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--text-primary)' }}>
            Footsteps
          </span>
        </Link>
        <Link href="/journey" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
          All entries
        </Link>
      </nav>

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.5rem'
        }}>
          Saved entries
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '3rem' }}>
          {mounted ? (entries.length === 0 ? 'No saved entries yet.' : `${entries.length} saved`) : ''}
        </p>

        {mounted && entries.length === 0 && (
          <div style={{
            padding: '3rem 2rem', textAlign: 'center',
            border: '1px dashed var(--border)', borderRadius: '12px',
            color: 'var(--text-muted)', fontSize: '0.9rem'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem', opacity: 0.3 }}>◇</div>
            Tap the ◇ icon on any entry to save it here.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {entries.map(entry => {
            const colors = VOLUME_COLORS[entry.volume]
            return (
              <div key={entry.day} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px', borderRadius: '8px',
                transition: 'background 0.15s',
              }}
                className="bookmark-row"
              >
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: colors.border, flexShrink: 0
                }} />

                <Link href={`/entry/${entry.day}`} style={{
                  flex: 1, textDecoration: 'none',
                  display: 'flex', alignItems: 'baseline', gap: '10px', minWidth: 0
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                    color: 'var(--text-muted)', flexShrink: 0
                  }}>
                    {entry.day}
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block' }}>
                      {entry.title}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {entry.era} · {entry.dateLabel}
                    </span>
                  </span>
                </Link>

                <button
                  onClick={() => handleRemove(entry.day)}
                  title="Remove bookmark"
                  aria-label={`Remove day ${entry.day} from saved`}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '10px', marginRight: '-6px', lineHeight: 1,
                    color: colors.border, fontSize: '0.85rem', flexShrink: 0,
                  }}
                >
                  ◆
                </button>
              </div>
            )
          })}
        </div>
      </main>

      <style>{`.bookmark-row:hover { background: var(--bg-muted); }`}</style>
    </div>
  )
}
