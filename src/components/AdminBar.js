'use client'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

export default function AdminBar() {
  const { isAdmin, signOut, user } = useAuth()
  if (!isAdmin) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 sm:px-6"
      style={{ height: '36px', background: '#B08D57', fontFamily: 'var(--sans)' }}>
      <div className="flex items-center gap-4">
        <span style={{ color: '#fff', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500 }}>
          ✦ Admin Mode
        </span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.55rem' }}>|</span>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.6rem' }}>{user?.email}</span>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/collection"
          style={{ color: '#fff', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', opacity: 0.85 }}>
          Manage Listings
        </Link>
        <button onClick={signOut}
          style={{ color: '#fff', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', background: 'rgba(0,0,0,0.2)', border: 'none', padding: '0.25rem 0.75rem', cursor: 'pointer' }}>
          Sign Out
        </button>
      </div>
    </div>
  )
}
