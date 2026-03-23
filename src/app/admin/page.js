'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, BookOpen, Layers, Settings, ArrowRight, TrendingUp, CheckCircle, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

const card = { background: '#fff', border: '1px solid #E8E2D8', padding: '1.5rem', borderRadius: '2px' }
const label = { fontFamily: 'var(--sans)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#999', marginBottom: '0.5rem' }
const num   = { fontFamily: 'var(--sans)', fontWeight: 800, fontSize: '2.25rem', letterSpacing: '-0.03em', color: '#111', lineHeight: 1 }

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ total: 0, available: 0, sold: 0, featured: 0, posts: 0 })
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ count: total }, { count: sold }, { count: featured }, { data: watches }, { count: posts }] = await Promise.all([
        supabase.from('watches').select('*', { count: 'exact', head: true }),
        supabase.from('watches').select('*', { count: 'exact', head: true }).eq('is_sold', true),
        supabase.from('watches').select('*', { count: 'exact', head: true }).eq('is_featured', true),
        supabase.from('watches').select('id,brand,model,price,is_sold,created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
      ])
      setStats({ total: total||0, available: (total||0)-(sold||0), sold: sold||0, featured: featured||0, posts: posts||0 })
      setRecent(watches||[])
      setLoading(false)
    }
    load()
  }, [])

  const fmt = n => `MYR ${Number(n).toLocaleString()}`

  return (
    <div style={{ padding: '2.5rem 2.5rem 4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #E8E2D8' }}>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#B08D57', marginBottom: '0.4rem' }}>
          Admin Portal
        </p>
        <h1 style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.02em', color: '#111' }}>
          Dashboard
        </h1>
        <p style={{ fontFamily: 'var(--sans)', fontSize: '0.8rem', color: '#888', marginTop: '0.25rem' }}>
          Welcome back{user?.email ? `, ${user.email}` : ''}
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Total Watches', value: stats.total,    icon: Package,     color: '#B08D57' },
          { label: 'Available',     value: stats.available, icon: CheckCircle, color: '#22c55e' },
          { label: 'Sold',          value: stats.sold,      icon: TrendingUp,  color: '#3b82f6' },
          { label: 'Featured',      value: stats.featured,  icon: Clock,       color: '#a855f7' },
          { label: 'Blog Posts',    value: stats.posts,     icon: BookOpen,    color: '#f59e0b' },
        ].map(({ label: lbl, value, icon: Icon, color }) => (
          <div key={lbl} style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={label}>{lbl}</p>
                <p style={num}>{loading ? '—' : value}</p>
              </div>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: color+'18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { href: '/admin/collection', label: 'Manage Collection', desc: 'Add, edit or remove watches', icon: Package },
          { href: '/admin/blog',       label: 'Manage Journal',    desc: 'Publish or edit articles',   icon: BookOpen },
          { href: '/admin/content',    label: 'Edit Homepage',     desc: 'Update services, hero text', icon: Layers },
          { href: '/admin/settings',   label: 'Site Settings',     desc: 'Contact info, about page',   icon: Settings },
        ].map(({ href, label: lbl, desc, icon: Icon }) => (
          <Link key={href} href={href} style={{ ...card, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', transition: 'border-color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='#B08D57'}
            onMouseLeave={e => e.currentTarget.style.borderColor='#E8E2D8'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', background: '#F4EFE9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2px', flexShrink: 0 }}>
                <Icon size={16} style={{ color: '#B08D57' }} />
              </div>
              <div>
                <p style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '0.82rem', color: '#111', marginBottom: '0.15rem' }}>{lbl}</p>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.72rem', color: '#999' }}>{desc}</p>
              </div>
            </div>
            <ArrowRight size={14} style={{ color: '#ccc', flexShrink: 0 }} />
          </Link>
        ))}
      </div>

      {/* Recent watches */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <p style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '0.85rem', color: '#111' }}>Recent Watches</p>
          <Link href="/admin/collection" style={{ fontFamily: 'var(--sans)', fontSize: '0.72rem', color: '#B08D57', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            View all <ArrowRight size={11} />
          </Link>
        </div>
        {loading ? (
          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.8rem', color: '#bbb', padding: '1rem 0' }}>Loading…</p>
        ) : recent.length === 0 ? (
          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.8rem', color: '#bbb', padding: '1rem 0' }}>No watches yet. <Link href="/admin/collection" style={{ color: '#B08D57' }}>Add your first</Link></p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Watch', 'Price', 'Status'].map(h => (
                  <th key={h} style={{ fontFamily: 'var(--sans)', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#aaa', textAlign: 'left', paddingBottom: '0.75rem', borderBottom: '1px solid #F0EBE3' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map(w => (
                <tr key={w.id}>
                  <td style={{ padding: '0.75rem 0', borderBottom: '1px solid #F0EBE3' }}>
                    <p style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '0.82rem', color: '#111' }}>{w.brand} {w.model}</p>
                  </td>
                  <td style={{ padding: '0.75rem 0', borderBottom: '1px solid #F0EBE3' }}>
                    <p style={{ fontFamily: 'var(--sans)', fontSize: '0.82rem', color: '#444' }}>{w.price ? fmt(w.price) : 'P.O.A.'}</p>
                  </td>
                  <td style={{ padding: '0.75rem 0', borderBottom: '1px solid #F0EBE3' }}>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.2rem 0.6rem',
                      background: w.is_sold ? '#fee2e2' : '#dcfce7', color: w.is_sold ? '#991b1b' : '#166534', borderRadius: '999px' }}>
                      {w.is_sold ? 'Sold' : 'Available'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
