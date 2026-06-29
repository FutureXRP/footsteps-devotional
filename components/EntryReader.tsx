'use client'

import { Entry, EntryNotes, LeadershipLens, FormationLens, UpheavalLens } from '@/lib/types'
import { Series, sectionForDay } from '@/lib/series'
import { toggleBookmark, isBookmarked, markRead, isRead } from '@/lib/storage'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

type SectionColors = { badge: string; text: string; border: string; dot: string }

function Prose({ text }: { text: string }) {
  return (
    <div className="entry-prose" style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.8' }}>
      {text.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
    </div>
  )
}

// A labelled prose block, e.g. "The Leader's Inner Life".
function LensField({ label, text }: { label: string; text: string }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div className="section-label">{label}</div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.8, margin: 0 }}>{text}</p>
    </div>
  )
}

// Accent-tinted callout for the Principle and the weekly Practice.
function Callout({ label, text, colors, serif = false }: { label: string; text: string; colors: SectionColors; serif?: boolean }) {
  return (
    <div style={{
      background: colors.badge, borderRadius: '10px',
      borderLeft: `3px solid ${colors.border}`,
      padding: '1.25rem 1.5rem', marginBottom: '2.5rem'
    }}>
      <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.text, marginBottom: '0.5rem' }}>
        {label}
      </div>
      <p style={{
        margin: 0, color: colors.text,
        fontFamily: serif ? 'var(--font-serif)' : 'var(--font-sans)',
        fontSize: serif ? '1.2rem' : '1rem', lineHeight: 1.6,
        fontStyle: serif ? 'italic' : 'normal',
      }}>
        {text}
      </p>
    </div>
  )
}

function LeadershipBlock({ lens, colors }: { lens: LeadershipLens; colors: SectionColors }) {
  const [teamOpen, setTeamOpen] = useState(false)
  return (
    <>
      <LensField label="The Leader's Inner Life" text={lens.innerLife} />
      <LensField label="Leading Through It" text={lens.leadingThroughIt} />
      <LensField label="The Blind Spot" text={lens.blindSpot} />
      <Callout label="This Week's Practice" text={lens.weeklyPractice} colors={colors} />

      {/* For Your Team — collapsible, for staff/leadership-group use */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setTeamOpen(o => !o)}
          aria-expanded={teamOpen}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '0.75rem', color: 'var(--text-muted)',
            fontFamily: 'var(--font-sans)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500,
          }}
        >
          <span style={{ fontSize: '0.65rem', transition: 'transform 0.2s', display: 'inline-block', transform: teamOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
          For Your Team
        </button>

        {teamOpen && (
          <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {lens.difficultConversations && (
              <div>
                <div className="section-label">When the Conversation Is Hard</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                  {lens.difficultConversations}
                </p>
              </div>
            )}
            <div>
              <div className="section-label">Discussion Questions</div>
              <ol style={{ margin: 0, paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {lens.teamQuestions.map((q, i) => (
                  <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{q}</li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// Formation lens (interior/personal) — the body that sits after the Word.
function FormationBlock({ lens, colors }: { lens: FormationLens; colors: SectionColors }) {
  return (
    <>
      <LensField label="The Interior Work" text={lens.interiorWork} />
      <Callout label="A Practice to Try" text={lens.practice} colors={colors} />
      <LensField label="The Resistance" text={lens.resistance} />
    </>
  )
}

// Upheaval lens (personal + ecclesial) — the body that sits after the Word.
// Holds the phase, the two non-conflated sections (In You = the reader's own
// upheaval; In the Body = the upheaval of the whole Church), and the anchor
// beneath the shaking (What Cannot Be Shaken).
function UpheavalBlock({ lens, colors }: { lens: UpheavalLens; colors: SectionColors }) {
  return (
    <>
      <LensField label="The Phase" text={lens.thePhase} />
      <LensField label="In You" text={lens.inYou} />
      <LensField label="In the Body" text={lens.inTheBody} />
      <Callout label="What Cannot Be Shaken" text={lens.whatRemains} colors={colors} serif />
    </>
  )
}

// The closing turn inward — placed after the Weight so the entry always lands
// on personal reflection (and, if present, a prayer to carry). Shared by the
// formation and upheaval lenses, which both close on reflection + a prayer.
function ReflectionBlock({ reflection, prayer, colors, heading = 'For Personal Reflection', prayerLabel = 'A Prayer to Carry' }: { reflection: string[]; prayer?: string; colors: SectionColors; heading?: string; prayerLabel?: string }) {
  return (
    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '3rem' }}>
      <div className="section-label">{heading}</div>
      <ol style={{ margin: '0 0 1.75rem', paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {reflection.map((q, i) => (
          <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{q}</li>
        ))}
      </ol>
      {prayer && <Callout label={prayerLabel} text={prayer} colors={colors} serif />}
    </div>
  )
}

function SourcesSection({ notes, label }: { notes: EntryNotes; label: string }) {
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
        {label}
      </button>

      {open && (
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.06em',
              color: confidenceColor[notes.confidence] || '#6b7280',
              textTransform: 'uppercase',
            }}>
              ● {confidenceLabel[notes.confidence] || notes.confidence}
            </span>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
              Primary Source
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {notes.primary}
            </p>
          </div>

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

const FALLBACK_COLORS: SectionColors = { badge: 'var(--bg-muted)', text: 'var(--text-secondary)', border: 'var(--text-muted)', dot: 'var(--text-muted)' }

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
      const firstRead = !isRead(series.slug, entry.day)
      markRead(series.slug, entry.day)
      if (firstRead) {
        // Fire-and-forget: record one anonymous server-side read the first time
        // this device opens this devotion (powers the /admin dashboard).
        fetch('/api/track', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ series: series.slug, day: entry.day }),
          keepalive: true,
        }).catch(() => {})
      }
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

  const hr = <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2.5rem 0' }} />

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

        {hr}

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

        {/* THE PRINCIPLE (leadership lens) */}
        {entry.leadership && (
          <Callout label="The Principle" text={entry.leadership.principle} colors={colors} serif />
        )}

        {/* THE INVITATION (formation lens) */}
        {entry.formation && (
          <Callout label="The Invitation" text={entry.formation.invitation} colors={colors} serif />
        )}

        {hr}

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

        {hr}

        {/* LEADERSHIP LENS (post-Word) */}
        {entry.leadership && <LeadershipBlock lens={entry.leadership} colors={colors} />}

        {/* FORMATION LENS (post-Word) */}
        {entry.formation && <FormationBlock lens={entry.formation} colors={colors} />}

        {/* UPHEAVAL LENS (post-Word) — phase, In You, In the Body, the anchor */}
        {entry.upheaval && <UpheavalBlock lens={entry.upheaval} colors={colors} />}

        {/* THE WEIGHT */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="section-label">The Weight</div>
          <Prose text={entry.weight} />
        </div>

        {/* FOR PERSONAL REFLECTION (formation lens — the closing turn inward) */}
        {entry.formation && <ReflectionBlock reflection={entry.formation.reflection} prayer={entry.formation.prayer} colors={colors} />}

        {/* FOR REFLECTION + A PRAYER IN THE SHAKING (upheaval lens — the closing turn) */}
        {entry.upheaval && <ReflectionBlock reflection={entry.upheaval.reflection} prayer={entry.upheaval.prayer} colors={colors} heading="For Reflection" prayerLabel="A Prayer in the Shaking" />}

        {/* Sources */}
        {entry.notes && (
          <SourcesSection notes={entry.notes} label={series.sourcesLabel} />
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
