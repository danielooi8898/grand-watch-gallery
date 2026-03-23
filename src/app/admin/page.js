'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, BookOpen, Layers, Settings, ArrowRight, TrendingUp, CheckCircle, Clock, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats,   setStats]   = useState({ total:0, available:0, sold:0, featured:0, posts:0 })
  const [recent,  setRecent]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [
        { count: total },
        { count: sold },
        { count: featured },
        { data: watches },
        { count: posts },
      ] = await Promise.all([
        supabase.from('watches').select('*', { count:'exact', head:true }),
        supabase.from('watches').select('*', { count:'exact', head:true }).eq('is_sold', true),
        supabase.from('watches').select('*', { count:'exact', head:true }).eq('is_featured', true),
        supabase.from('watches').select('id,brand,model,price,is_sold,is_featured,created_at').order('created_at', { ascending:false }).limit(6),
        supabase.from('blog_posts').select('*', { count:'exact', head:true }),
      ])
      setStats({ total:total||0, available:(total||0)-(sold||0), sold:sold||0, featured:featured||0, posts:posts||0 })
      setRecent(watches||[])
      setLoading(false)
    }
    load()
  }, [])

  const fmt = n => n ? `MYR ${Number(n).toLocaleString()}` : 'P.O.A.'

  const card  = { background:'#fff', borderRadius:'8px', border:'1px solid #EDE9E3', boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }

  const STAT_CARDS = [
    { label:'Total Watches', value:stats.total,     icon:Package,     color:'#B08D57', bg:'rgba(176,141,87,0.1)' },
    { label:'Available',     value:stats.available, icon:CheckCircle, color:'#16A34A', bg:'rgba(22,163,74,0.1)'  },
    { label:'Sold',          value:stats.sold,      icon:TrendingUp,  color:'#2563EB', bg:'rgba(37,99,235,0.1)'  },
    { label:'Featured',      value:stats.featured,  icon:Star,        color:'#9333EA', bg:'rgba(147,51,234,0.1)' },
    { label:'Articles',      value:stats.posts,     icon:BookOpen,    color:'#D97706', bg:'rgba(217,119,6,0.1)'  },
  ]

  return (
    <div style={{ padding:'2rem 2rem 4rem' }}>
      {/* Header */}
      <div style={{ marginBottom:'2rem', paddingBottom:'1.5rem', borderBottom:'1px solid #EDE9E3' }}>
        <p style={{ fontFamily:'var(--sans)', fontSize:'0.62rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#B08D57', marginBottom:'0.35rem' }}>Admin</p>
        <h1 style={{ fontFamily:'var(--sans)', fontWeight:800, fontSize:'1.6rem', letterSpacing:'-0.02em', color:'#111' }}>Dashboard</h1>
        <p style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', color:'#888', marginTop:'0.2rem' }}>
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''} â€” here's your store at a glance.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
        {STAT_CARDS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={{ ...card, padding:'1.25rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <p style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#999', marginBottom:'0.5rem' }}>{label}</p>
                <p style={{ fontFamily:'var(--sans)', fontWeight:800, fontSize:'2rem', letterSpacing:'-0.03em', color:'#111', lineHeight:1 }}>
                  {loading ? 'â€”' : value}
                </p>
              </div>
              <div style={{ width:'34px', height:'34px', borderRadius:'8px', background:bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
        {[
          { href:'/admin/collection', label:'Manage Collection', desc:'Add, edit or remove watches',  icon:Package },
          { href:'/admin/blog',       label:'Manage Journal',    desc:'Publish or edit articles',     icon:BookOpen },
          { href:'/admin/content',    label:'Edit Homepage',     desc:'Update hero, services & more', icon:Layers },
          { href:'/admin/settings',   label:'Site Settings',     desc:'Contact info, about page',     icon:Settings },
        ].map(({ href, label, desc, icon: Icon }) => (
          <Link key={href} href={href} style={{ ...card, padding:'1.25rem', textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'0.75rem', transition:'border-color 0.15s, box-shadow 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#B08D57'; e.currentTarget.style.boxShadow='0 2px 8px rgba(176,141,87,0.12)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#EDE9E3'; e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
              <div style={{ width:'36px', height:'36px', background:'rgba(176,141,87,0.1)', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'6px', flexShrink:0 }}>
                <Icon size={16} style={{ color:'#B08D57' }} />
              </div>
              <div>
                <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.82rem', color:'#111', marginBottom:'0.15rem' }}>{label}</p>
                <p style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#999' }}>{desc}</p>
              </div>
            </div>
            <ArrowRight size={14} style={{ color:'#CCC', flexShrink:0 }} />
          </Link>
        ))}
      </div>

      {/* Recent Watches */}
      <div style={{ ...card, padding:'1.5rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
          <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.88rem', color:'#111' }}>Recent Watches</p>
          <Link href="/admin/collection" style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#B08D57', textDecoration:'none', display:'flex', alignItems:'center', gap:'0.3rem' }}>
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'2rem' }}>
            <Loader2 size={20} style={{ color:'#B08D57', animation:'spin 1s linear infinite' }} />
          </div>
        ) : recent.length === 0 ? (
          <div style={{ textAlign:'center', padding:'2.5rem', background:'#F7F6F3', borderRadius:'6px' }}>
            <Package size={24} style={{ color:'#CCC', marginBottom:'0.75rem' }} />
            <p style={{ fontFamily:'var(--sans)', fontSize:'0.82rem', color:'#BBB' }}>No watches yet.</p>
            <Link href="/admin/collection" style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', color:'#B08D57', textDecoration:'none', fontWeight:600 }}>Add your first watch â†’</Link>
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'480px' }}>
              <thead>
                <tr>
                  {['Watch','Price','Status'].map(h => (
                    <th key={h} style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#AAA', textAlign:'left', paddingBottom:'0.75rem', borderBottom:'1px solid #F0EBE3', fontWeight:600 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(w => (
                  <tr key={w.id}>
                    <td style={{ padding:'0.75rem 0', borderBottom:'1px solid #F7F6F3' }}>
                      <p style={{ fontFamily:'var(--sans)', fontWeight:600, fontSize:'0.82rem', color:'#111' }}>{w.brand} {w.model}</p>
                    </td>
                    <td style={{ padding:'0.75rem 0', borderBottom:'1px solid #F7F6F3' }}>
                      <p style={{ fontFamily:'var(--sans)', fontSize:'0.82rem', color:'#555' }}>{fmt(w.price)}</p>
                    </td>
                    <td style={{ padding:'0.75rem 0', borderBottom:'1px solid #F7F6F3' }}>
                      <span style={{ fontFamily:'var(--sans)', fontSize:'0.64rem', letterSpacing:'0.08em', textTransform:'uppercase', padding:'0.2rem 0.65rem', background: w.is_sold ? '#FEE2E2' : '#DCFCE7', color: w.is_sold ? '#991B1B' : '#166534', borderRadius:'999px', fontWeight:600 }}>
                        {w.is_sold ? 'Sold' : 'Available'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}



