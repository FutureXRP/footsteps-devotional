'use client'

const BOOKMARKS_KEY = 'fd_bookmarks'
const PROGRESS_KEY = 'fd_progress'
const LAST_READ_KEY = 'fd_last_read'

export function getBookmarks(): number[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function toggleBookmark(day: number): boolean {
  const bookmarks = getBookmarks()
  const idx = bookmarks.indexOf(day)
  if (idx === -1) {
    bookmarks.push(day)
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
    return true
  } else {
    bookmarks.splice(idx, 1)
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
    return false
  }
}

export function isBookmarked(day: number): boolean {
  return getBookmarks().includes(day)
}

export function markRead(day: number): void {
  if (typeof window === 'undefined') return
  const progress: number[] = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '[]')
  if (!progress.includes(day)) {
    progress.push(day)
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  }
  localStorage.setItem(LAST_READ_KEY, String(day))
}

export function getReadDays(): number[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function isRead(day: number): boolean {
  return getReadDays().includes(day)
}

export function getLastReadDay(): number | null {
  if (typeof window === 'undefined') return null
  const val = localStorage.getItem(LAST_READ_KEY)
  return val ? parseInt(val) : null
}
