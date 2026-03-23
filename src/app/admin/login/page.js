'use client'
import { useRef, useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function AdminLogin() {
  const { signIn, user, isAdmin, loading } = useAuth()
  const emailRef    = useRef(null)
  const passwordRef = useRef(null)
  const [error,      setError]      = useState('')
  const [submitting, setSubmitting] = useState(false)

  // If already authenticated, redirect immediately (full reload = no race condition)
  useEffect(() => {
    if (!loading && user && isAdmin) {
      window.location.href = '/admin'
    }
  }, [loading, user, isAdmin])

  const submit = async (e) => {
    e.preventDefault()
    const email    = emailRef.current?.value?.trim()    || ''
    const password = passwordRef.current?.value         || ''

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const { data, error: err } = await Promise.race([
        signIn(email, password),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Sign in timed out. Please try again.')), 20000)
        )
      ])

      if (err) {
        setError(err.message || 'Invalid credentials. Please check your email and password.')
        setSubmitting(false)
        return
      }

      if (data?.session) {
        // Full page reload — Supabase re-reads session from localStorage,
        // so the admin layout always sees a clean, fully-initialised auth state.
        // This avoids the React state race condition that caused the redirect loop.
        window.location.href = '/admin'
      } else {
        setError('No session returned. Please try again.')
        setSubmitting(false)
      }
    } catch (ex) {
      setError(ex?.message || 'Sign in failed. Please try again.')
      setSubmitting(false)
    }
  }

  const inputStyle = {
    background: '#fff',
    color: '#111',
    border: '1px solid #ccc',
    outline: 'none',
    borderRadius: '2px',
    width: '100%',
    padding: '0.85rem 1rem',
    fontSize: '0.9rem',
    fontFamily: 'var(--sans)',
    boxSizing: 'border-box',
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
              ref={emailRef}
              type="email"
              defaultValue=""
              autoFocus
              autoComplete="username"
              placeholder="you@example.com"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontFamily: 'var(--sans)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '0.4rem' }}>
              Password
            </label>
            <input
              ref={passwordRef}
              type="password"
              defaultValue=""
              autoComplete="current-password"
              placeholder="••••••••"
              style={inputStyle}
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
            disabled={submitting}
            style={{
              background: submitting ? '#888' : '#111',
              color: '#fff',
              border: 'none',
              padding: '1rem',
              fontFamily: 'var(--sans)',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: submitting ? 'not-allowed' : 'pointer',
              width: '100%',
              marginTop: '0.5rem',
              transition: 'background 0.2s',
              borderRadius: '2px',
            }}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontFamily: 'var(--sans)', fontSize: '0.65rem', color: '#bbb' }}>
          Grand Watch &amp; Jewellery Sdn. Bhd.
        </p>
      </div>
    </div>
  )
}
