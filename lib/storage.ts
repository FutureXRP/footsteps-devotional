'use client'

// Reading progress and bookmarks are tracked per series, so a given day in one
// devotional never collides with the same day number in another. Keys are
// namespaced by series slug: fd:<series>:bookmarks / :progress / :lastread.

const key = (series: string, kind: 'bookmarks' | 'progress' | 'lastread') => `fd:${series}:${kind}`

// ---------------------------------------------------------------------------
// One-time migration: Church History Volume 1 (days 1-73) was written in two
// passes and shipped out of order — days 1-51 walked 30-325 AD, then day 52
// reset to c. 108 AD and walked it again. The volume is now a single timeline,
// which renumbered 51 of its 73 entries. Saved progress and bookmarks are day
// numbers, so without this remap a reader's history would point at the wrong
// devotions. Runs once per browser, then leaves a marker.
// ---------------------------------------------------------------------------
const V1_REMAP: Record<number, number> = {
  17: 20, 18: 17, 19: 18, 20: 19, 25: 26, 26: 25, 29: 30, 30: 32, 31: 34, 32: 35,
  33: 36, 34: 37, 35: 38, 36: 39, 37: 40, 38: 44, 39: 47, 40: 43, 41: 55, 42: 56,
  43: 51, 44: 58, 45: 59, 46: 63, 47: 65, 48: 68, 49: 71, 50: 72, 51: 73, 52: 29,
  53: 31, 54: 33, 55: 41, 56: 42, 57: 45, 58: 48, 59: 46, 60: 49, 61: 50, 62: 52,
  63: 53, 64: 54, 65: 57, 66: 60, 67: 61, 68: 62, 69: 64, 70: 66, 71: 67, 72: 69,
  73: 70,
}
const MIGRATION_MARKER = 'fd:footsteps:v1-chronological'

function migrate(series: string): void {
  if (series !== 'footsteps' || typeof window === 'undefined') return
  try {
    if (localStorage.getItem(MIGRATION_MARKER)) return
    const remap = (d: number) => V1_REMAP[d] ?? d
    for (const kind of ['progress', 'bookmarks'] as const) {
      const raw = localStorage.getItem(key(series, kind))
      if (raw) {
        const days: number[] = JSON.parse(raw)
        if (Array.isArray(days)) {
          const moved = [...new Set(days.map(remap))].sort((a, b) => a - b)
          localStorage.setItem(key(series, kind), JSON.stringify(moved))
        }
      }
    }
    const last = localStorage.getItem(key(series, 'lastread'))
    if (last) localStorage.setItem(key(series, 'lastread'), String(remap(parseInt(last))))
    localStorage.setItem(MIGRATION_MARKER, '1')
  } catch {
    // A malformed value should never block reading; leave it and move on.
    try { localStorage.setItem(MIGRATION_MARKER, '1') } catch {}
  }
}

export function getBookmarks(series: string): number[] {
  if (typeof window === 'undefined') return []
  migrate(series)
  try {
    return JSON.parse(localStorage.getItem(key(series, 'bookmarks')) ?? '[]')
  } catch {
    return []
  }
}

export function toggleBookmark(series: string, day: number): boolean {
  const bookmarks = getBookmarks(series)
  const idx = bookmarks.indexOf(day)
  if (idx === -1) {
    bookmarks.push(day)
    localStorage.setItem(key(series, 'bookmarks'), JSON.stringify(bookmarks))
    return true
  } else {
    bookmarks.splice(idx, 1)
    localStorage.setItem(key(series, 'bookmarks'), JSON.stringify(bookmarks))
    return false
  }
}

export function isBookmarked(series: string, day: number): boolean {
  return getBookmarks(series).includes(day)
}

export function markRead(series: string, day: number): void {
  if (typeof window === 'undefined') return
  migrate(series)
  const progress: number[] = JSON.parse(localStorage.getItem(key(series, 'progress')) ?? '[]')
  if (!progress.includes(day)) {
    progress.push(day)
    localStorage.setItem(key(series, 'progress'), JSON.stringify(progress))
  }
  localStorage.setItem(key(series, 'lastread'), String(day))
}

export function getReadDays(series: string): number[] {
  if (typeof window === 'undefined') return []
  migrate(series)
  try {
    return JSON.parse(localStorage.getItem(key(series, 'progress')) ?? '[]')
  } catch {
    return []
  }
}

export function isRead(series: string, day: number): boolean {
  return getReadDays(series).includes(day)
}

export function getLastReadDay(series: string): number | null {
  if (typeof window === 'undefined') return null
  migrate(series)
  const val = localStorage.getItem(key(series, 'lastread'))
  return val ? parseInt(val) : null
}
