import 'server-only'
import { Redis } from '@upstash/redis'

// ---------------------------------------------------------------------------
// Server-side read counters for the in-app /admin dashboard.
//
// Reads are recorded as anonymous counts in Upstash Redis (provisioned through
// the Vercel Marketplace). One Redis hash per series — field = day number,
// value = count — so all of a series' per-day counts come back in a single
// HGETALL. Counting is deduped per browser by the client (only the first read
// of a given devotion on a device is reported), so these approximate unique
// readers per devotion rather than raw page-opens.
//
// Everything here is defensive: if no Redis is configured yet, recording is a
// no-op and reads return empty, so the site keeps working before storage is
// connected.
// ---------------------------------------------------------------------------

const url =
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.KV_REST_API_URL ||
  ''
const token =
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.KV_REST_API_TOKEN ||
  ''

let client: Redis | null = null
function redis(): Redis | null {
  if (!url || !token) return null
  if (!client) client = new Redis({ url, token })
  return client
}

export function storageConfigured(): boolean {
  return Boolean(url && token)
}

const seriesKey = (series: string) => `reads:${series}`

// Increment the read count for one devotion. Returns true if recorded.
export async function recordRead(series: string, day: number): Promise<boolean> {
  const r = redis()
  if (!r) return false
  try {
    await r.hincrby(seriesKey(series), String(day), 1)
    return true
  } catch {
    return false
  }
}

// All per-day counts for a series, as { day: count }. Empty if unconfigured.
export async function getSeriesReads(series: string): Promise<Record<number, number>> {
  const r = redis()
  if (!r) return {}
  try {
    const raw = (await r.hgetall<Record<string, number | string>>(seriesKey(series))) || {}
    const out: Record<number, number> = {}
    for (const [k, v] of Object.entries(raw)) {
      const day = Number(k)
      const count = Number(v)
      if (Number.isFinite(day) && Number.isFinite(count)) out[day] = count
    }
    return out
  } catch {
    return {}
  }
}
