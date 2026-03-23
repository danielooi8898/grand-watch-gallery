'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

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
    const { error: err } = await signIn(email, password)
    setLoading(false)
    if (err) { setError('Invalid credentials. Please try again.'); return }
    router.push('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F8F5EF' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <p className="serif font-light tracking-[0.2em] uppercase mb-1"
            style={{ fontSize: '1.25rem', color: '#111', fontFamily: 'var(--serif)' }}>
            Grand Watch Gallery
          </p>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#B08D57' }}>
            Admin Portal
          </p>
          <div style={{ width: '36px', height: '1px', background: '#B08D57', margin: '1.5rem auto 0' }} />
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label style={{ fontFamily: 'var(--sans)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '0.4rem' }}>
              Email Address
            </label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)}
              required autoFocus placeholder="admin@gwg.com" style={{ background: '#fff' }} />
          </div>
          <div>
            <label style={{ fontFamily: 'var(--sans)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '0.4rem' }}>
              Password
            </label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)}
              required placeholder="••••••••" style={{ background: '#fff' }} />
          </div>
          {error && (
            <p style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', color: '#c0392b', textAlign: 'center' }}>
              {error}
            </p>
          )}
          <button type="submit" disabled={loading} className="btn btn-dark w-full mt-2"
            style={{ opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="text-center mt-8" style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', color: '#bbb' }}>
          Grand Watch &amp; Jewellery Sdn. Bhd.
        </p>
      </div>
    </div>
  )
}
