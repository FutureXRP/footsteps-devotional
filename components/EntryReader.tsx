'use client'

import { Entry, EntryNotes } from '@/lib/types'
import { Series, sectionForDay } from '@/lib/series'
import { toggleBookmark, isBookmarked, markRead } from '@/lib/storage'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

function Prose({ text }: { text: string }) {
  return (
    <div className="entry-prose" style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.8' }}>
      {text.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
    </div>
  )
}

function SourcesSection({ notes }: { notes: EntryNotes }) {
  const [open, setOpen] = useState(false)

  const confidenceLabel: Record<string, string> = {
    high: 'Well documented',
    medium: 'Documented with caveats',
    tradition: 'Primarily tradition',
  }
  const confidenceColor: Record<string, string> = {
    high: '#1a7a4a',
    medium: '#b45309',
    tradition: '#6b7280',
  }

  return (
    <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '0.75rem', color: 'var(--text-muted)', padding: 0,
          fontFamily: 'var(--font-sans)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500,
        }}
        aria-expanded={open}
      >
        <span style={{ fontSize: '0.65rem', transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
        Historical Sources
      </button>

      {open && (
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Confidence badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.06em',
              color: confidenceColor[notes.confidence] || '#6b7280',
              textTransform: 'uppercase',
            }}>
              ● {confidenceLabel[notes.confidence] || notes.confidence}
            </span>
          </div>

          {/* Primary source */}
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
              Primary Source
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {notes.primary}
            </p>
          </div>

          {/* Tradition notes */}
          {notes.tradition && (
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                Historical Tradition
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {notes.tradition}
              </p>
            </div>
          )}

          {/* Archaeological */}
          {notes.archaeological && (
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                Archaeological & Historical
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {notes.archaeological}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const FALLBACK_COLORS = { badge: 'var(--bg-muted)', text: 'var(--text-secondary)', border: 'var(--text-muted)', dot: 'var(--text-muted)' }

export default function EntryReader({ entry, prev, next, series }: { entry: Entry; prev: number | null; next: number | null; series: Series }) {
  const section = sectionForDay(series, entry.day)
  const colors = section?.colors ?? FALLBACK_COLORS
  const [bookmarked, setBookmarked] = useState(false)
  const [justBookmarked, setJustBookmarked] = useState(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      setBookmarked(isBookmarked(series.slug, entry.day))
      markRead(series.slug, entry.day)
    }
  }, [series.slug, entry.day])

  function handleBookmark() {
    const result = toggleBookmark(series.slug, entry.day)
    setBookmarked(result)
    if (result) {
      setJustBookmarked(true)
      setTimeout(() => setJustBookmarked(false), 1500)
    }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Top nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--bg)', borderBottom: '1px solid var(--border)',
        padding: '0 1.5rem', height: '52px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <Link href={`/${series.slug}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--text-primary)' }}>
            {series.shortTitle}
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href={`/${series.slug}/journey`} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
            All entries
          </Link>
          <button onClick={handleBookmark} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '10px', marginRight: '-10px', lineHeight: 1,
            color: bookmarked ? colors.dot : 'var(--text-muted)',
            fontSize: '1.1rem', display: 'flex', alignItems: 'center'
          }} title={bookmarked ? 'Remove bookmark' : 'Bookmark'} aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}>
            {bookmarked ? '◆' : '◇'}
          </button>
        </div>
      </nav>

      {/* Entry */}
      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 1.5rem 6rem' }}>

        {/* Section + day badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
          <span style={{
            display: 'inline-block', fontSize: '0.7rem', fontWeight: 500,
            background: colors.badge, color: colors.text,
            borderRadius: '4px', padding: '3px 8px', letterSpacing: '0.03em'
          }}>
            {series.sectionAbbrev} {entry.volume} — {section?.title ?? entry.volumeTitle}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Day {entry.day}</span>
        </div>

        {/* Era + date */}
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          {entry.era} · {entry.dateLabel}
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: 500, lineHeight: 1.2, color: 'var(--text-primary)',
          marginBottom: '0.25rem'
        }}>
          {entry.title}
        </h1>

        {/* Figure */}
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2.5rem', fontStyle: 'italic' }}>
          {entry.figure}
        </p>

        {/* THE MOMENT */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="section-label">The Moment</div>
          <Prose text={entry.moment} />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2.5rem 0' }} />

        {/* THE VOICE */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="section-label">The Voice</div>
          <blockquote style={{
            borderLeft: `3px solid ${colors.border}`,
            paddingLeft: '1.25rem',
            margin: 0,
            borderRadius: 0
          }}>
            <p style={{
              fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontStyle: 'italic',
              lineHeight: 1.7, color: 'var(--text-primary)', marginBottom: '0.75rem'
            }}>
              &ldquo;{entry.voiceQuote}&rdquo;
            </p>
            <cite style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'normal' }}>
              — {entry.voiceAttribution}
            </cite>
          </blockquote>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2.5rem 0' }} />

        {/* THE WORD */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="section-label">The Word</div>
          <div style={{
            background: 'var(--bg-muted)', borderRadius: '8px',
            padding: '1.25rem 1.5rem', border: '1px solid var(--border)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 500, color: colors.text, marginBottom: '0.5rem' }}>
              {entry.scriptureRef}
            </div>
            <p style={{
              fontFamily: 'var(--font-serif)', fontSize: '1rem', fontStyle: 'italic',
              lineHeight: 1.7, color: 'var(--text-secondary)', margin: 0
            }}>
              &ldquo;{entry.scriptureText}&rdquo;
            </p>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2.5rem 0' }} />

        {/* THE WEIGHT */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="section-label">The Weight</div>
          <Prose text={entry.weight} />
        </div>

        {/* Historical Sources */}
        {entry.notes && (
          <SourcesSection notes={entry.notes} />
        )}

        {/* Prev / Next */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: '2rem', borderTop: '1px solid var(--border)'
        }}>
          {prev ? (
            <Link href={`/${series.slug}/entry/${prev}`} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none'
            }}>
              ← Day {prev}
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`/${series.slug}/entry/${next}`} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none',
              background: 'var(--bg-muted)', padding: '8px 16px', borderRadius: '6px',
              border: '1px solid var(--border)'
            }}>
              Day {next} →
            </Link>
          ) : (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>More coming soon</span>
          )}
        </div>

        {/* Bookmark toast */}
        {justBookmarked && (
          <div style={{
            position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
            background: 'var(--text-primary)', color: 'var(--bg)',
            padding: '10px 20px', borderRadius: '8px', fontSize: '0.85rem',
            pointerEvents: 'none'
          }}>
            Entry saved
          </div>
        )}
      </main>
    </div>
  )
}
