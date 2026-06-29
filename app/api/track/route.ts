import { NextResponse } from 'next/server'
import { getSeries } from '@/lib/series'
import { recordRead } from '@/lib/analytics-store'

// Records one (deduped-per-browser) read of a devotion. Called fire-and-forget
// by the reader the first time a given day is opened on a device. Always
// returns 200 with a tiny body so a beacon/keepalive fetch never surfaces
// errors to the reader; bad input is simply ignored.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const series = typeof body?.series === 'string' ? body.series : ''
    const day = Number(body?.day)

    const cfg = getSeries(series)
    if (!cfg || !Number.isInteger(day) || day < 1 || day > cfg.totalDays) {
      return NextResponse.json({ ok: false }, { status: 200 })
    }

    const recorded = await recordRead(series, day, new Date())
    return NextResponse.json({ ok: recorded }, { status: 200 })
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
