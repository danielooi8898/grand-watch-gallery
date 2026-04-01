'use client'
import Spinner from '@/components/Spinner'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { LayoutDashboard, Package, BookOpen, Layers, Settings, LogOut, Globe, Menu, X, Inbox } from 'lucide-react'

const NAV = [
  { href: '/admin',              label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/collection',   label: 'Collection', icon: Package },
  { href: '/admin/blog',         label: 'Journal',    icon: BookOpen },
  { href: '/admin/enquiries',    label: 'Enquiries',  icon: Inbox },
  { href: '/admin/content',      label: 'Homepage',   icon: Layers },
  { href: '/admin/settings',     label: 'Settings',   icon: Settings },
]

export default function AdminLayout({ children }) {
  const { user, isAdmin, loading, signOut } = useAuth()
  const router   = useRouter()
  const pathname = usePathname()
  const isLogin  = pathname === '/admin/login'

  const [sideOpen, setSideOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    supabase.from('enquiries').select('id', { count: 'exact', head: true }).eq('is_read', false)
      .then(({ count }) => setUnreadCount(count || 0))
  }, [pathname])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Close sidebar on route change (mobile)
  useEffect(() => { setSideOpen(false) }, [pathname])

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
  const sidebarVisible = !isMobile || sideOpen

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>

      {/* Mobile overlay */}
      {isMobile && sideOpen && (
        <div
          onClick={() => setSideOpen(false)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:40 }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: '240px',
        background: '#0A0A0A',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0, top: 0, bottom: 0,
        zIndex: 50,
        borderRight: '1px solid #1A1A1A',
        transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
      }}>

        <div style={{ padding:'1.5rem', borderBottom:'1px solid #1A1A1A', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <p style={{ fontFamily:'var(--serif)', fontWeight:300, fontSize:'0.95rem', letterSpacing:'0.05em', color:'#fff', marginBottom:'0.5rem' }}>
              Grand Watch Gallery
            </p>
            <span style={{ display:'inline-flex', alignItems:'center', gap:'0.35rem', background:'rgba(176,141,87,0.15)', padding:'0.18rem 0.55rem', borderRadius:'3px' }}>
              <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#B08D57', display:'block' }} />
              <span style={{ fontFamily:'var(--sans)', fontSize:'0.52rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#B08D57', fontWeight:600 }}>Admin Portal</span>
            </span>
          </div>
          {isMobile && (
            <button onClick={() => setSideOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#555', padding:'0.25rem', marginLeft:'0.5rem', flexShrink:0 }}>
              <X size={18} />
            </button>
          )}
        </div>

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

        <div style={{ padding:'1rem 1.25rem', borderTop:'1px solid #1A1A1A' }}>
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
          <div style={{ display:'flex', gap:'0.5rem' }}>
            <Link href="/" target="_blank" style={{
              flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem',
              textDecoration:'none', padding:'0.5rem', border:'1px solid #222', borderRadius:'3px', transition:'border-color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor='#444'}
              onMouseLeave={e => e.currentTarget.style.borderColor='#222'}>
              <Globe size={12} style={{ color:'#555' }} />
              <span style={{ fontFamily:'var(--sans)', fontSize:'0.65rem', color:'#555' }}>Live Site</span>
            </Link>
            <button onClick={handleSignOut} style={{
              flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem',
              background:'none', border:'1px solid #222', borderRadius:'3px', cursor:'pointer', padding:'0.5rem', transition:'border-color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor='#dc2626'}
              onMouseLeave={e => e.currentTarget.style.borderColor='#222'}>
              <LogOut size={12} style={{ color:'#555' }} />
              <span style={{ fontFamily:'var(--sans)', fontSize:'0.65rem', color:'#555' }}>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ display:'flex', flexDirection:'column', flex:1, marginLeft: isMobile ? 0 : '240px', minHeight:'100vh', width: isMobile ? '100%' : 'calc(100% - 240px)', background:'#F7F6F3' }}>

        {/* Mobile top bar */}
        {isMobile && (
          <div style={{ position:'sticky', top:0, zIndex:30, background:'#0A0A0A', borderBottom:'1px solid #1A1A1A', display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.75rem 1rem' }}>
            <button onClick={() => setSideOpen(true)} style={{ background:'none', border:'none', cursor:'pointer', color:'#999', padding:'0.25rem', display:'flex', alignItems:'center' }}>
              <Menu size={20} />
            </button>
            <p style={{ fontFamily:'var(--serif)', fontWeight:300, fontSize:'0.9rem', letterSpacing:'0.05em', color:'#fff', flex:1 }}>
              Grand Watch Gallery
            </p>
            <span style={{ fontFamily:'var(--sans)', fontSize:'0.52rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#B08D57', fontWeight:600 }}>Admin</span>
          </div>
        )}

        <main style={{ flex:1 }}>
          {children}
        </main>
      </div>

    </div>
  )
}
