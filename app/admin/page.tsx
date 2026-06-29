import { cookies } from 'next/headers'
import Link from 'next/link'
import type { Metadata } from 'next'
import { SERIES } from '@/lib/series'
import { getSeriesEntries } from '@/lib/series-data'
import { getSeriesReads, getWindowReads, recentDates, storageConfigured } from '@/lib/analytics-store'
import { ADMIN_COOKIE, checkCookie, adminConfigured } from '@/lib/admin-auth'
import AdminLogin, { AdminLogout } from './AdminLogin'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

type DayCounts = Record<number, number>
type Range = 'all' | '30d' | '7d'
const RANGES: { key: Range; label: string; days: number }[] = [
  { key: 'all', label: 'All time', days: 0 },
  { key: '30d', label: 'Last 30 days', days: 30 },
  { key: '7d', label: 'Last 7 days', days: 7 },
]

function card(label: string, value: string | number, sub?: string) {
  return (
    <div style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.1rem 1.25rem' }}>
      <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{label}</div>
      <div style={{ fontSize: '1.7rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>{sub}</div>}
    </div>
  )
}

// Drop-off curve: reads by day-number across the whole series, as an SVG area.
function DropOff({ counts, totalDays, accent }: { counts: DayCounts; totalDays: number; accent: string }) {
  const W = 820, H = 90
  let max = 1
  for (let d = 1; d <= totalDays; d++) max = Math.max(max, counts[d] || 0)
  const xs = (d: number) => (totalDays > 1 ? ((d - 1) / (totalDays - 1)) * W : 0)
  const ys = (c: number) => H - (c / max) * H
  const line: string[] = []
  for (let d = 1; d <= totalDays; d++) line.push(`${xs(d).toFixed(1)},${ys(counts[d] || 0).toFixed(1)}`)
  const area = `0,${H} ${line.join(' ')} ${W},${H}`
  return (
    <div style={{ marginTop: '1rem' }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '90px', display: 'block' }}>
        <polygon points={area} fill={accent} opacity={0.12} />
        <polyline points={line.join(' ')} fill="none" stroke={accent} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
        <span>Day 1</span><span>reads by day — where readers fall off</span><span>Day {totalDays}</span>
      </div>
    </div>
  )
}

// Completion funnel: reads reaching milestone days (proxy for how far readers get).
function Funnel({ counts, totalDays, accent }: { counts: DayCounts; totalDays: number; accent: string }) {
  const marks = Array.from(new Set([1, Math.round(totalDays * 0.25), Math.round(totalDays * 0.5), Math.round(totalDays * 0.75), totalDays]))
    .filter((d) => d >= 1 && d <= totalDays)
    .sort((a, b) => a - b)
  const base = counts[marks[0]] || 0
  const max = Math.max(1, ...marks.map((m) => counts[m] || 0))
  return (
    <div style={{ marginTop: '1.25rem' }}>
      <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Completion funnel</div>
      {marks.map((m) => {
        const c = counts[m] || 0
        const pctMax = Math.round((c / max) * 100)
        const retained = base > 0 ? Math.round((c / base) * 100) : 0
        return (
          <div key={m} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.25rem 0' }}>
            <span style={{ width: '4rem', fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>Day {m}</span>
            <span style={{ position: 'relative', flex: 1, height: '16px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
              <span style={{ position: 'absolute', inset: 0, width: `${pctMax}%`, background: accent, opacity: 0.85, borderRadius: '4px' }} />
            </span>
            <span style={{ width: '8.5rem', textAlign: 'right', fontSize: '0.78rem', color: 'var(--text-primary)', flexShrink: 0 }}>
              {c.toLocaleString()} <span style={{ color: 'var(--text-muted)' }}>({retained}% of day 1)</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const cookieStore = await cookies()
  if (!checkCookie(cookieStore.get(ADMIN_COOKIE)?.value)) {
    return <AdminLogin configured={adminConfigured()} />
  }

  const sp = await searchParams
  const range: Range = sp.range === '7d' ? '7d' : sp.range === '30d' ? '30d' : 'all'
  const rangeDef = RANGES.find((r) => r.key === range)!
  const configured = storageConfigured()

  // Fetch per-series day counts for the selected range.
  const slugs = SERIES.map((s) => s.slug)
  let countsBySeries: Record<string, DayCounts> = {}
  if (configured) {
    if (range === 'all') {
      for (const slug of slugs) countsBySeries[slug] = await getSeriesReads(slug)
    } else {
      countsBySeries = await getWindowReads(slugs, recentDates(rangeDef.days, new Date()))
    }
  }

  const stats = SERIES.map((s) => {
    const counts = countsBySeries[s.slug] || {}
    const entries = getSeriesEntries(s.slug)
    const titleFor = new Map(entries.map((e) => [e.day, e.title]))
    const pairs = Object.entries(counts).map(([d, c]) => ({ day: Number(d), count: Number(c) }))
    return {
      slug: s.slug,
      title: s.title,
      accent: s.accent,
      totalDays: s.totalDays,
      counts,
      totalReads: pairs.reduce((sum, p) => sum + p.count, 0),
      daysRead: pairs.filter((p) => p.count > 0).length,
      top: pairs.sort((a, b) => b.count - a.count).slice(0, 6).map((p) => ({ day: p.day, title: titleFor.get(p.day) ?? `Day ${p.day}`, count: p.count })),
    }
  })

  const grandTotal = stats.reduce((sum, s) => sum + s.totalReads, 0)
  const rangeNote = range === 'all' ? 'all time' : rangeDef.label.toLowerCase()

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem 6rem', background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-primary)', margin: 0 }}>Readership</h1>
        <AdminLogout />
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1.25rem' }}>
        Anonymous reads, counted once per device per devotion (UTC). Counting began when the store was connected; no historical backfill.
      </p>

      {/* Range tabs */}
      <div style={{ display: 'inline-flex', gap: '2px', background: 'var(--bg-muted)', border: '1px solid var(--border)', borderRadius: '8px', padding: '3px', marginBottom: '2rem' }}>
        {RANGES.map((r) => {
          const active = r.key === range
          return (
            <Link key={r.key} href={r.key === 'all' ? '/admin' : `/admin?range=${r.key}`} prefetch={false}
              style={{
                fontSize: '0.8rem', padding: '0.35rem 0.8rem', borderRadius: '6px', textDecoration: 'none',
                background: active ? 'var(--text-primary)' : 'transparent',
                color: active ? 'var(--bg)' : 'var(--text-muted)',
              }}>
              {r.label}
            </Link>
          )
        })}
      </div>

      {!configured && (
        <div style={{ background: '#FBF1E4', border: '1px solid #E6C68A', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '2rem' }}>
          <div style={{ fontWeight: 600, color: '#7A4E0B', marginBottom: '0.3rem' }}>Storage not connected yet</div>
          <div style={{ fontSize: '0.85rem', color: '#7A4E0B', lineHeight: 1.6 }}>
            Add an <strong>Upstash for Redis</strong> store from the Vercel project&rsquo;s Storage tab, then redeploy. Reads will start
            accumulating here.
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '2.5rem' }}>
        {card(`Total reads (${rangeNote})`, grandTotal.toLocaleString())}
        {card('Series with reads', `${stats.filter((s) => s.totalReads > 0).length} / ${stats.length}`)}
        {card('Storage', configured ? 'Connected' : 'Not connected')}
      </div>

      {stats.map((s) => {
        const coverage = Math.round((s.daysRead / s.totalDays) * 100)
        return (
          <section key={s.slug} style={{ marginBottom: '2.75rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>{s.title}</h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {s.totalReads.toLocaleString()} reads · {s.daysRead}/{s.totalDays} devos read ({coverage}%)
              </div>
            </div>

            {s.totalReads === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>No reads recorded in this range yet.</p>
            ) : (
              <>
                <DropOff counts={s.counts} totalDays={s.totalDays} accent={s.accent} />
                <Funnel counts={s.counts} totalDays={s.totalDays} accent={s.accent} />

                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', margin: '1.4rem 0 0.4rem' }}>Most read</div>
                <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {s.top.map((t) => {
                    const pct = s.top[0].count > 0 ? Math.round((t.count / s.top[0].count) * 100) : 0
                    return (
                      <li key={t.day} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.35rem 0' }}>
                        <span style={{ width: '3.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>Day {t.day}</span>
                        <span style={{ flex: 1, minWidth: 0, fontSize: '0.9rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</span>
                        <span style={{ position: 'relative', width: '110px', height: '8px', background: 'var(--border)', borderRadius: '4px', flexShrink: 0 }}>
                          <span style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: s.accent, borderRadius: '4px' }} />
                        </span>
                        <span style={{ width: '3rem', textAlign: 'right', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', flexShrink: 0 }}>{t.count.toLocaleString()}</span>
                      </li>
                    )
                  })}
                </ol>
              </>
            )}
          </section>
        )
      })}

      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2rem' }}>
        The funnel and curve use reads recorded at each devotion as a proxy for how far readers get (a reader who skips a day still counts
        for later ones). For raw page views, referrers, and geography, see Vercel Web Analytics.
      </p>
    </main>
  )
}
