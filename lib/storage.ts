'use client'

// Reading progress and bookmarks are tracked per series, so a given day in one
// devotional never collides with the same day number in another. Keys are
// namespaced by series slug: fd:<series>:bookmarks / :progress / :lastread.

const key = (series: string, kind: 'bookmarks' | 'progress' | 'lastread') => `fd:${series}:${kind}`

export function getBookmarks(series: string): number[] {
  if (typeof window === 'undefined') return []
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
  const progress: number[] = JSON.parse(localStorage.getItem(key(series, 'progress')) ?? '[]')
  if (!progress.includes(day)) {
    progress.push(day)
    localStorage.setItem(key(series, 'progress'), JSON.stringify(progress))
  }
  localStorage.setItem(key(series, 'lastread'), String(day))
}

export function getReadDays(series: string): number[] {
  if (typeof window === 'undefined') return []
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
  const val = localStorage.getItem(key(series, 'lastread'))
  return val ? parseInt(val) : null
}
