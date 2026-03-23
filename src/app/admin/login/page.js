'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const TIMEOUT_MS = 10000

function withTimeout(promise, ms) {
  const timer = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out. Please try again.')), ms)
  )
  return Promise.race([promise, timer])
}

export default function AdminLogin() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data, error: err } = await withTimeout(signIn(email, password), TIMEOUT_MS)
      if (err) {
        setError(err.message || 'Sign in failed. Please check your credentials.')
        setLoading(false)
        return
      }
      if (data?.session) {
        router.push('/admin')
      } else {
        setError('No session returned. Please try again.')
        setLoading(false)
      }
    } catch (ex) {
      setError(ex?.message || String(ex))
      setLoading(false)
    }
  }

  const inputStyle = {
    background: '#fff',
    color: '#111',
    border: '1px solid #ccc',
    outline: 'none',
    borderRadius: '2px',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1rem', background: '#F8F5EF' }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontSize: '1.25rem', color: '#111', fontFamily: 'var(--serif)', fontWeight: 300, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            Grand Watch Gallery
          </p>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#B08D57' }}>
            Admin Portal
          </p>
          <div style={{ width: '36px', height: '1px', background: '#B08D57', margin: '1.5rem auto 0' }} />
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ fontFamily: 'var(--sans)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '0.4rem' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              placeholder="you@example.com"
              style={{ ...inputStyle, width: '100%', padding: '0.85rem 1rem', fontSize: '0.9rem', fontFamily: 'var(--sans)', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontFamily: 'var(--sans)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '0.4rem' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{ ...inputStyle, width: '100%', padding: '0.85rem 1rem', fontSize: '0.9rem', fontFamily: 'var(--sans)', boxSizing: 'border-box' }}
            />
          </div>

          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #f5c6cb', borderRadius: '4px', padding: '0.75rem 1rem' }}>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '0.8rem', color: '#c0392b', margin: 0 }}>
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#888' : '#111',
              color: '#fff',
              border: 'none',
              padding: '1rem',
              fontFamily: 'var(--sans)',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%',
              marginTop: '0.5rem',
              transition: 'background 0.2s',
              borderRadius: '2px',
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontFamily: 'var(--sans)', fontSize: '0.65rem', color: '#bbb' }}>
          Grand Watch &amp; Jewellery Sdn. Bhd.
        </p>
      </div>
    </div>
  )
}
