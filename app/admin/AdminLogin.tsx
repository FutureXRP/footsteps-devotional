'use client'

import { useState } from 'react'

export function AdminLogout() {
  async function logout() {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' })
    } finally {
      window.location.reload()
    }
  }
  return (
    <button
      onClick={logout}
      style={{
        background: 'none', border: '1px solid var(--border)', cursor: 'pointer',
        borderRadius: '6px', padding: '0.35rem 0.7rem', fontSize: '0.75rem',
        color: 'var(--text-muted)',
      }}
    >
      Sign out
    </button>
  )
}

export default function AdminLogin({ configured }: { configured: boolean }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        window.location.reload()
      } else if (res.status === 503) {
        setError('ADMIN_PASSWORD is not set on the server yet.')
      } else {
        setError('Incorrect password.')
      }
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '1.5rem' }}>
      <form onSubmit={submit} style={{ width: '100%', maxWidth: '360px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--text-primary)', margin: '0 0 0.25rem' }}>
          Admin
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1.5rem' }}>
          Readership dashboard — sign in to continue.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          style={{
            width: '100%', boxSizing: 'border-box', padding: '0.7rem 0.9rem',
            fontSize: '1rem', borderRadius: '8px', border: '1px solid var(--border)',
            background: 'var(--bg-muted)', color: 'var(--text-primary)', marginBottom: '0.75rem',
          }}
        />
        {error && <p style={{ color: '#b91c1c', fontSize: '0.8rem', margin: '0 0 0.75rem' }}>{error}</p>}
        {!configured && (
          <p style={{ color: '#b45309', fontSize: '0.8rem', margin: '0 0 0.75rem' }}>
            Set the ADMIN_PASSWORD environment variable in Vercel to enable sign-in.
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          style={{
            width: '100%', padding: '0.7rem', fontSize: '0.95rem', cursor: busy ? 'default' : 'pointer',
            borderRadius: '8px', border: 'none', background: 'var(--text-primary)', color: 'var(--bg)',
            opacity: busy ? 0.6 : 1,
          }}
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
