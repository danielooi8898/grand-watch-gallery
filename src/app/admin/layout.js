'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { LayoutDashboard, Package, BookOpen, Layers, Settings, LogOut, ExternalLink, Loader2 } from 'lucide-react'

const NAV = [
  { href: '/admin',           label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/admin/collection',label: 'Collection',  icon: Package },
  { href: '/admin/blog',      label: 'Journal',     icon: BookOpen },
  { href: '/admin/content',   label: 'Homepage',    icon: Layers },
  { href: '/admin/settings',  label: 'Settings',    icon: Settings },
]

const S = {
  sidebar: { width: '220px', background: '#111', display: 'flex', flexDirection: 'column',
    position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 50, overflowY: 'auto' },
  logo:    { padding: '1.75rem 1.5rem 1.25rem', borderBottom: '1px solid #1e1e1e' },
  nav:     { flex: 1, padding: '0.75rem 0' },
  footer:  { padding: '1rem 1.5rem', borderTop: '1px solid #1e1e1e', display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  main:    { marginLeft: '220px', minHeight: '100vh', background: '#F4EFE9' },
}

export default function AdminLayout({ children }) {
  const { user, isAdmin, loading, signOut } = useAuth()
  const router   = useRouter()
  const pathname = usePathname()
  const isLogin  = pathname === '/admin/login'

  useEffect(() => {
    if (!loading && !isLogin && (!user || !isAdmin)) router.replace('/admin/login')
  }, [user, isAdmin, loading, isLogin, router])

  if (isLogin) return <>{children}</>

  if (loading || !user || !isAdmin) return (
    <div style={{ minHeight: '100vh', background: '#F4EFE9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={28} style={{ color: '#B08D57', animation: 'spin 1s linear infinite' }} />
    </div>
  )

  const handleSignOut = async () => { await signOut(); router.replace('/admin/login') }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* ── Sidebar ── */}
      <aside style={S.sidebar}>
        <div style={S.logo}>
          <p style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: '0.9rem', letterSpacing: '0.08em', color: '#fff', marginBottom: '0.2rem' }}>
            Grand Watch Gallery
          </p>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.5rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#B08D57' }}>
            Admin Portal
          </p>
        </div>

        <nav style={S.nav}>
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: '0.65rem',
                padding: '0.65rem 1.5rem', textDecoration: 'none',
                background: active ? 'rgba(176,141,87,0.12)' : 'transparent',
                borderLeft: `2px solid ${active ? '#B08D57' : 'transparent'}`,
                transition: 'background 0.15s',
              }}>
                <Icon size={15} style={{ color: active ? '#B08D57' : '#555', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--sans)', fontSize: '0.78rem', fontWeight: 500,
                  letterSpacing: '0.04em', color: active ? '#fff' : '#777' }}>
                  {label}
                </span>
              </Link>
            )
          })}
        </nav>

        <div style={S.footer}>
          <Link href="/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <ExternalLink size={13} style={{ color: '#555' }} />
            <span style={{ fontFamily: 'var(--sans)', fontSize: '0.7rem', color: '#555' }}>View Live Site</span>
          </Link>
          <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <LogOut size={13} style={{ color: '#e05252' }} />
            <span style={{ fontFamily: 'var(--sans)', fontSize: '0.7rem', color: '#e05252' }}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={S.main}>
        {children}
      </main>
    </div>
  )
}
