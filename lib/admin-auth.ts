import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'

// ---------------------------------------------------------------------------
// Minimal auth for the /admin dashboard. A single ADMIN_PASSWORD env var gates
// access. On login we set an httpOnly cookie holding an HMAC derived from the
// password; the dashboard recomputes that HMAC and compares it in constant time.
// Because the password lives only in a server env var, the cookie cannot be
// forged without it. This is intentionally simple — one operator, one secret.
// ---------------------------------------------------------------------------

export const ADMIN_COOKIE = 'fd_admin'

function password(): string {
  return process.env.ADMIN_PASSWORD || ''
}

export function adminConfigured(): boolean {
  return password().length > 0
}

// The session token written to (and expected in) the cookie.
export function sessionToken(): string {
  return createHmac('sha256', password()).update('fd-admin-session-v1').digest('hex')
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}

// Validate a submitted password against ADMIN_PASSWORD (constant-time).
export function checkPassword(submitted: string): boolean {
  if (!adminConfigured()) return false
  return safeEqual(submitted, password())
}

// Validate a cookie value against the expected session token.
export function checkCookie(value: string | undefined): boolean {
  if (!adminConfigured() || !value) return false
  return safeEqual(value, sessionToken())
}
