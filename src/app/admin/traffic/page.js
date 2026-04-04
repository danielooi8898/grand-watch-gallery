'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { Lock, ExternalLink, TrendingUp, Users, Eye, MousePointer } from 'lucide-react'

const SOURCE_COLORS = { contact:'#6b7280', appointment:'#3b82f6', trade_in:'#f59e0b', career:'#8b5cf6', partner:'#10b981', newsletter:'#ec4899' }
const SOURCE_LABELS = { contact:'Contact Form', appointment:'Appointment', trade_in:'Trade-In', career:'Career', partner:'Partner', newsletter:'Newsletter' }

function LeadSourceStats() {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('leads').select('source').then(({ data }) => {
      if (!data) { setLoading(false); return }
      const counts = data.reduce((acc, l) => { acc[l.source] = (acc[l.source] || 0) + 1; return acc }, {})
      const total = data.length
      setStats(Object.entries(counts).map(([source, count]) => ({ source, count, pct: total ? Math.round(count/total*100) : 0 })).sort((a,b) => b.count-a.count))
      setLoading(false)
    })
  }, [])

  if (loading) return <div style={{ textAlign:'center', padding:'2rem', fontFamily:'var(--sans)', fontSize:'0.82rem', color:'#aaa' }}>Loading...</div>
  if (!stats.length) return <p style={{ fontFamily:'var(--sans)', fontSize:'0.82rem', color:'#BBB', textAlign:'center', padding:'2rem' }}>No leads captured yet. Leads appear here once visitors submit any form.</p>

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
      {stats.map(({ source, count, pct }) => (
        <div key={source}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.3rem' }}>
            <span style={{ fontFamily:'var(--sans)', fontSize:'0.82rem', color:'#333' }}>{SOURCE_LABELS[source] || source}</span>
            <span style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', color:'#888' }}>{count} ({pct}%)</span>
          </div>
          <div style={{ height:'6px', background:'#F0EBE3', borderRadius:'3px', overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${pct}%`, background: SOURCE_COLORS[source] || '#B08D57', borderRadius:'3px' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminTraffic() {
  const { isAdmin } = useAuth()
  const card = { background:'#fff', border:'1px solid #EDE9E3', borderRadius:'8px', padding:'1.5rem', boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }

  if (!isAdmin) return (
    <div style={{ padding:'2.5rem' }}>
      <div style={{ background:'#fff', border:'1px solid #E8E2D8', borderRadius:'6px', padding:'2rem', textAlign:'center' }}>
        <Lock size={20} style={{ color:'#B08D57', marginBottom:'1rem' }} />
        <p style={{ fontFamily:'var(--sans)', fontSize:'0.85rem', color:'#888' }}>Admin access required.</p>
      </div>
    </div>
  )

  return (
    <div style={{ padding:'1.5rem 1.5rem 4rem' }}>
      <div style={{ marginBottom:'1.5rem', paddingBottom:'1.5rem', borderBottom:'1px solid #E8E2D8' }}>
        <p style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#B08D57', marginBottom:'0.3rem' }}>Admin · Analytics</p>
        <h1 style={{ fontFamily:'var(--sans)', fontWeight:800, fontSize:'1.6rem', letterSpacing:'-0.02em', color:'#111' }}>Website Traffic</h1>
        <p style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', color:'#888', marginTop:'0.2rem' }}>Analytics overview for grandwatchgallery.my</p>
      </div>

      {/* Quick links */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
        {[
          { label:'Realtime Users',  desc:'Who is on site right now',    icon:Users,        href:'https://analytics.google.com' },
          { label:'Page Views',      desc:'Most visited pages',          icon:Eye,          href:'https://analytics.google.com' },
          { label:'Traffic Sources', desc:'Where visitors come from',    icon:TrendingUp,   href:'https://analytics.google.com' },
          { label:'Conversions',     desc:'Form submissions & enquiries',icon:MousePointer, href:'https://analytics.google.com' },
        ].map(({ label, desc, icon: Icon, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer"
            style={{ ...card, textDecoration:'none', display:'flex', alignItems:'center', gap:'0.75rem', transition:'border-color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='#B08D57'}
            onMouseLeave={e => e.currentTarget.style.borderColor='#EDE9E3'}>
            <div style={{ width:'36px', height:'36px', background:'rgba(176,141,87,0.1)', borderRadius:'6px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Icon size={16} style={{ color:'#B08D57' }} />
            </div>
            <div style={{ minWidth:0 }}>
              <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.82rem', color:'#111', marginBottom:'0.15rem' }}>{label}</p>
              <p style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#999' }}>{desc}</p>
            </div>
            <ExternalLink size={12} style={{ color:'#CCC', marginLeft:'auto', flexShrink:0 }} />
          </a>
        ))}
      </div>

      {/* GA Setup card */}
      <div style={{ ...card, marginBottom:'1.5rem' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.9rem', color:'#111', marginBottom:'0.2rem' }}>Google Analytics 4</p>
            <p style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#999' }}>Full traffic dashboard — visitors, bounce rate, top pages & more</p>
          </div>
          <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer"
            style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', padding:'0.5rem 1rem', background:'#B08D57', color:'#fff', textDecoration:'none', fontFamily:'var(--sans)', fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', borderRadius:'2px' }}>
            Open GA4 <ExternalLink size={11}/>
          </a>
        </div>
        <div style={{ background:'#F7F6F3', borderRadius:'6px', padding:'2rem', textAlign:'center', border:'1px dashed #E0DDD8' }}>
          <TrendingUp size={28} style={{ color:'#B08D57', marginBottom:'0.75rem' }} />
          <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.9rem', color:'#111', marginBottom:'0.4rem' }}>Add Your GA4 Measurement ID</p>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.8rem', color:'#888', marginBottom:'1.25rem', maxWidth:'420px', margin:'0 auto 1.25rem' }}>
            Share your <strong>G-XXXXXXXXXX</strong> ID with your developer and it will be embedded here to show live traffic data.
          </p>
          <div style={{ display:'flex', gap:'0.75rem', justifyContent:'center', flexWrap:'wrap' }}>
            <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer"
              style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', padding:'0.55rem 1.1rem', background:'#B08D57', color:'#fff', textDecoration:'none', fontFamily:'var(--sans)', fontSize:'0.72rem', fontWeight:600, borderRadius:'2px' }}>
              Create GA4 Account <ExternalLink size={11}/>
            </a>
            <a href="https://support.google.com/analytics/answer/9304153" target="_blank" rel="noopener noreferrer"
              style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', padding:'0.55rem 1.1rem', border:'1px solid #E0DDD8', color:'#555', textDecoration:'none', fontFamily:'var(--sans)', fontSize:'0.72rem', borderRadius:'2px', background:'#fff' }}>
              Setup Guide <ExternalLink size={11}/>
            </a>
          </div>
        </div>
      </div>

      {/* Internal stats */}
      <div style={card}>
        <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.9rem', color:'#111', marginBottom:'0.2rem' }}>Leads by Source</p>
        <p style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#999', marginBottom:'1.25rem', paddingBottom:'1rem', borderBottom:'1px solid #EDE9E3' }}>
          Automatically tracked from all forms on your website
        </p>
        <LeadSourceStats />
      </div>
    </div>
  )
}
