import 'server-only'
import { Redis } from '@upstash/redis'

// ---------------------------------------------------------------------------
// Server-side read counters for the in-app /admin dashboard.
//
// Reads are recorded as anonymous counts in Upstash Redis (provisioned through
// the Vercel Marketplace). Counting is deduped per browser by the client (only
// the first read of a given devotion on a device is reported), so these
// approximate unique readers per devotion rather than raw page-opens.
//
// Two views are kept per read:
//   reads:<series>            hash day -> count   (all-time, never expires)
//   reads:<series>:d:<date>   hash day -> count   (per UTC-day, ~100d TTL)
// The all-time hash powers the default dashboard, drop-off curve and funnel;
// the dated hashes power the 7-/30-day range filters.
//
// Everything is defensive: with no Redis configured, recording is a no-op and
// reads return empty, so the site keeps working before storage is connected.
// ---------------------------------------------------------------------------

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || ''
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || ''

let client: Redis | null = null
function redis(): Redis | null {
  if (!url || !token) return null
  if (!client) client = new Redis({ url, token })
  return client
}

export function storageConfigured(): boolean {
  return Boolean(url && token)
}

const allKey = (series: string) => `reads:${series}`
const dayKey = (series: string, date: string) => `reads:${series}:d:${date}`

// UTC YYYY-MM-DD for a Date.
export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

// The last `n` UTC dates (most recent first), as YYYY-MM-DD.
export function recentDates(n: number, now: Date): string[] {
  const out: string[] = []
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getTime() - i * 86400000)
    out.push(isoDate(d))
  }
  return out
}

type DayCounts = Record<number, number>

function toDayCounts(raw: Record<string, unknown> | null | undefined): DayCounts {
  const out: DayCounts = {}
  if (!raw) return out
  for (const [k, v] of Object.entries(raw)) {
    const day = Number(k)
    const count = Number(v)
    if (Number.isFinite(day) && Number.isFinite(count)) out[day] = (out[day] || 0) + count
  }
  return out
}

// Increment the all-time and today's dated counters for one devotion.
export async function recordRead(series: string, day: number, now: Date): Promise<boolean> {
  const r = redis()
  if (!r) return false
  try {
    const today = isoDate(now)
    const dk = dayKey(series, today)
    const p = r.pipeline()
    p.hincrby(allKey(series), String(day), 1)
    p.hincrby(dk, String(day), 1)
    p.expire(dk, 60 * 60 * 24 * 100) // keep dated buckets ~100 days
    await p.exec()
    return true
  } catch {
    return false
  }
}

// All-time per-day counts for one series.
export async function getSeriesReads(series: string): Promise<DayCounts> {
  const r = redis()
  if (!r) return {}
  try {
    return toDayCounts(await r.hgetall(allKey(series)))
  } catch {
    return {}
  }
}

// Per-day counts for several series over a set of dates, merged per series.
// One pipelined round trip for all (series x date) hashes.
export async function getWindowReads(
  seriesSlugs: string[],
  dates: string[],
): Promise<Record<string, DayCounts>> {
  const out: Record<string, DayCounts> = {}
  for (const s of seriesSlugs) out[s] = {}
  const r = redis()
  if (!r || seriesSlugs.length === 0 || dates.length === 0) return out
  try {
    const p = r.pipeline()
    const owner: string[] = []
    for (const s of seriesSlugs) {
      for (const date of dates) {
        p.hgetall(dayKey(s, date))
        owner.push(s)
      }
    }
    const results = (await p.exec()) as (Record<string, unknown> | null)[]
    results.forEach((hash, i) => {
      const s = owner[i]
      const counts = toDayCounts(hash)
      for (const [day, c] of Object.entries(counts)) {
        out[s][Number(day)] = (out[s][Number(day)] || 0) + c
      }
    })
    return out
  } catch {
    return out
  }
}
