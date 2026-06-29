import { cookies } from 'next/headers'
import type { Metadata } from 'next'
import { SERIES } from '@/lib/series'
import { getSeriesEntries } from '@/lib/series-data'
import { getSeriesReads, storageConfigured } from '@/lib/analytics-store'
import { ADMIN_COOKIE, checkCookie, adminConfigured } from '@/lib/admin-auth'
import AdminLogin, { AdminLogout } from './AdminLogin'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

type SeriesStat = {
  slug: string
  title: string
  totalDays: number
  totalReads: number
  daysRead: number
  top: { day: number; title: string; count: number }[]
}

function card(label: string, value: string | number, sub?: string) {
  return (
    <div style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.1rem 1.25rem' }}>
      <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{label}</div>
      <div style={{ fontSize: '1.7rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>{sub}</div>}
    </div>
  )
}

export default async function AdminPage() {
  const cookieStore = await cookies()
  const authed = checkCookie(cookieStore.get(ADMIN_COOKIE)?.value)

  if (!authed) {
    return <AdminLogin configured={adminConfigured()} />
  }

  const configured = storageConfigured()

  // Build per-series readership stats from the registry + the counter store.
  const stats: SeriesStat[] = []
  for (const s of SERIES) {
    const reads = configured ? await getSeriesReads(s.slug) : {}
    const entries = getSeriesEntries(s.slug)
    const titleFor = new Map(entries.map((e) => [e.day, e.title]))
    const pairs = Object.entries(reads).map(([d, c]) => ({ day: Number(d), count: Number(c) }))
    const totalReads = pairs.reduce((sum, p) => sum + p.count, 0)
    const top = pairs
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
      .map((p) => ({ day: p.day, title: titleFor.get(p.day) ?? `Day ${p.day}`, count: p.count }))
    stats.push({
      slug: s.slug,
      title: s.title,
      totalDays: s.totalDays,
      totalReads,
      daysRead: pairs.filter((p) => p.count > 0).length,
      top,
    })
  }

  const grandTotal = stats.reduce((sum, s) => sum + s.totalReads, 0)
  const seriesWithReads = stats.filter((s) => s.totalReads > 0).length

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem 6rem', background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-primary)', margin: 0 }}>Readership</h1>
        <AdminLogout />
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 2rem' }}>
        Anonymous reads, counted once per device per devotion. Counting began when the store was connected; there is no historical backfill.
      </p>

      {!configured && (
        <div style={{ background: '#FBF1E4', border: '1px solid #E6C68A', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '2rem' }}>
          <div style={{ fontWeight: 600, color: '#7A4E0B', marginBottom: '0.3rem' }}>Storage not connected yet</div>
          <div style={{ fontSize: '0.85rem', color: '#7A4E0B', lineHeight: 1.6 }}>
            Add an <strong>Upstash for Redis</strong> store from the Vercel project&rsquo;s Storage tab. It injects the
            connection env vars automatically; redeploy and reads will start accumulating here.
          </div>
        </div>
      )}

      {/* Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '2.5rem' }}>
        {card('Total reads', grandTotal.toLocaleString())}
        {card('Series with reads', `${seriesWithReads} / ${stats.length}`)}
        {card('Storage', configured ? 'Connected' : 'Not connected')}
      </div>

      {/* Per series */}
      {stats.map((s) => {
        const coverage = Math.round((s.daysRead / s.totalDays) * 100)
        return (
          <section key={s.slug} style={{ marginBottom: '2.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>{s.title}</h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {s.totalReads.toLocaleString()} reads · {s.daysRead}/{s.totalDays} devos read ({coverage}%)
              </div>
            </div>

            {s.top.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>No reads recorded yet.</p>
            ) : (
              <ol style={{ margin: '1rem 0 0', padding: 0, listStyle: 'none' }}>
                {s.top.map((t) => {
                  const pct = s.top[0].count > 0 ? Math.round((t.count / s.top[0].count) * 100) : 0
                  return (
                    <li key={t.day} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.4rem 0' }}>
                      <span style={{ width: '3.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>Day {t.day}</span>
                      <span style={{ flex: 1, minWidth: 0, fontSize: '0.9rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</span>
                      <span style={{ position: 'relative', width: '120px', height: '8px', background: 'var(--border)', borderRadius: '4px', flexShrink: 0 }}>
                        <span style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: 'var(--text-primary)', borderRadius: '4px' }} />
                      </span>
                      <span style={{ width: '3rem', textAlign: 'right', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', flexShrink: 0 }}>{t.count.toLocaleString()}</span>
                    </li>
                  )
                })}
              </ol>
            )}
          </section>
        )
      })}

      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2rem' }}>
        For raw page views, referrers, and visitor geography, see Vercel Web Analytics in the project dashboard. This page adds the
        per-devotion, per-series breakdown that lives inside the app.
      </p>
    </main>
  )
}
