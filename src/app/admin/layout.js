'use client'
import Spinner from '@/components/Spinner'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { LayoutDashboard, Package, BookOpen, Layers, Settings, LogOut, Globe } from 'lucide-react'

const NAV = [
  { href: '/admin',            label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/collection', label: 'Collection', icon: Package },
  { href: '/admin/blog',       label: 'Journal',    icon: BookOpen },
  { href: '/admin/content',    label: 'Homepage',   icon: Layers },
  { href: '/admin/settings',   label: 'Settings',   icon: Settings },
]

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
    <div style={{ minHeight:'100vh', background:'#F7F6F3', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <Spinner size={28} style={{ color:'#B08D57', animation:'spin 1s linear infinite' }} />
    </div>
  )

  const handleSignOut = async () => { await signOut(); router.replace('/admin/login') }
  const initials = user?.email?.[0]?.toUpperCase() || 'A'

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width:'240px', background:'#0A0A0A', display:'flex', flexDirection:'column',
        position:'fixed', left:0, top:0, bottom:0, zIndex:50,
        borderRight:'1px solid #1A1A1A',
      }}>
        {/* Logo */}
        <div style={{ padding:'1.5rem', borderBottom:'1px solid #1A1A1A' }}>
          <p style={{ fontFamily:'var(--serif)', fontWeight:300, fontSize:'0.95rem', letterSpacing:'0.05em', color:'#fff', marginBottom:'0.5rem' }}>
            Grand Watch Gallery
          </p>
          <span style={{ display:'inline-flex', alignItems:'center', gap:'0.35rem', background:'rgba(176,141,87,0.15)', padding:'0.18rem 0.55rem', borderRadius:'3px' }}>
            <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#B08D57', display:'block' }} />
            <span style={{ fontFamily:'var(--sans)', fontSize:'0.52rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#B08D57', fontWeight:600 }}>Admin Portal</span>
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'0.75rem 0', overflowY:'auto' }}>
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            return (
              <Link key={href} href={href} style={{
                display:'flex', alignItems:'center', gap:'0.65rem',
                padding:'0.6rem 1.25rem', textDecoration:'none',
                background: active ? 'rgba(176,141,87,0.1)' : 'transparent',
                borderLeft:`2px solid ${active ? '#B08D57' : 'transparent'}`,
                transition:'all 0.15s',
              }}>
                <Icon size={15} style={{ color: active ? '#B08D57' : '#444', flexShrink:0 }} />
                <span style={{
                  fontFamily:'var(--sans)', fontSize:'0.8rem',
                  fontWeight: active ? 600 : 400,
                  color: active ? '#fff' : '#5C5C5C',
                  letterSpacing:'0.02em',
                }}>
                  {label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding:'1rem 1.25rem', borderTop:'1px solid #1A1A1A' }}>
          {/* User chip */}
          <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.6rem 0.75rem', background:'#141414', borderRadius:'4px', marginBottom:'0.75rem' }}>
            <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'#B08D57', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', fontWeight:700, color:'#fff' }}>{initials}</span>
            </div>
            <div style={{ minWidth:0 }}>
              <p style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', fontWeight:600, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {user?.email?.split('@')[0] || 'Admin'}
              </p>
              <p style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', color:'#444', letterSpacing:'0.05em' }}>Administrator</p>
            </div>
          </div>
          {/* Action buttons */}
          <div style={{ display:'flex', gap:'0.5rem' }}>
            <Link href="/" target="_blank" style={{
              flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem',
              textDecoration:'none', padding:'0.5rem', border:'1px solid #222', borderRadius:'3px',
              transition:'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor='#444'}
            onMouseLeave={e => e.currentTarget.style.borderColor='#222'}>
              <Globe size={12} style={{ color:'#555' }} />
              <span style={{ fontFamily:'var(--sans)', fontSize:'0.65rem', color:'#555' }}>Live Site</span>
            </Link>
            <button onClick={handleSignOut} style={{
              flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem',
              background:'none', border:'1px solid #222', borderRadius:'3px', cursor:'pointer',
              padding:'0.5rem', transition:'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor='#dc2626'}
            onMouseLeave={e => e.currentTarget.style.borderColor='#222'}>
              <LogOut size={12} style={{ color:'#555' }} />
              <span style={{ fontFamily:'var(--sans)', fontSize:'0.65rem', color:'#555' }}>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ marginLeft:'240px', minHeight:'100vh', width:'calc(100% - 240px)', background:'#F7F6F3' }}>
        {children}
      </main>
    </div>
  )
}
