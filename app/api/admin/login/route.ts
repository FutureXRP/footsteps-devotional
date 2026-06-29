import { NextResponse } from 'next/server'
import { checkPassword, sessionToken, ADMIN_COOKIE, adminConfigured } from '@/lib/admin-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST { password } -> set the admin session cookie on success.
export async function POST(request: Request) {
  if (!adminConfigured()) {
    return NextResponse.json({ ok: false, error: 'unconfigured' }, { status: 503 })
  }
  const body = await request.json().catch(() => null)
  const submitted = typeof body?.password === 'string' ? body.password : ''
  if (!checkPassword(submitted)) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
  return res
}

// DELETE -> clear the session cookie (logout).
export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 })
  return res
}
