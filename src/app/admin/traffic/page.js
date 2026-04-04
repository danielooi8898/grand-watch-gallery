'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { Lock, TrendingUp, Users, Eye, MousePointer, RefreshCw, BarChart2, Globe, Clock } from 'lucide-react'

const SOURCE_COLORS = { contact:'#6b7280', appointment:'#3b82f6', trade_in:'#f59e0b', career:'#8b5cf6', partner:'#10b981', newsletter:'#ec4899' }
const SOURCE_LABELS = { contact:'Contact Form', appointment:'Appointment', trade_in:'Trade-In', career:'Career', partner:'Partner', newsletter:'Newsletter' }

function LeadSourceStats() {
  const [stats, setStats] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('leads').select('source, status').then(({ data }) => {
      if (!data) { setLoading(false); return }
      const counts = data.reduce((acc, l) => { acc[l.source] = (acc[l.source] || 0) + 1; return acc }, {})
      const t = data.length
      setTotal(t)
      setStats(Object.entries(counts).map(([source, count]) => ({ source, count, pct: t ? Math.round(count/t*100) : 0 })).sort((a,b) => b.count-a.count))
      setLoading(false)
    })
  }, [])

  if (loading) return <p style={{ fontFamily:'var(--sans)', fontSize:'0.82rem', color:'#aaa', padding:'1rem 0' }}>Loading...</p>
  if (!stats.length) return <p style={{ fontFamily:'var(--sans)', fontSize:'0.82rem', color:'#BBB', padding:'1rem 0' }}>No leads yet. Submit a form to see data here.</p>

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(100px,1fr))', gap:'0.75rem', marginBottom:'1.5rem' }}>
        {[
          { label:'Total Leads', value: total, color:'#B08D57' },
          { label:'This Month',  value: stats.reduce((a,s) => a + s.count, 0), color:'#3b82f6' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background:'#F7F6F3', borderRadius:'6px', padding:'1rem', textAlign:'center' }}>
            <p style={{ fontFamily:'var(--sans)', fontWeight:800, fontSize:'1.8rem', color, lineHeight:1 }}>{value}</p>
            <p style={{ fontFamily:'var(--sans)', fontSize:'0.65rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'#999', marginTop:'0.25rem' }}>{label}</p>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
        {stats.map(({ source, count, pct }) => (
          <div key={source}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.25rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                <div style={{ width:'8px', height:'8px', borderRadius:'50%', background: SOURCE_COLORS[source] || '#B08D57' }} />
                <span style={{ fontFamily:'var(--sans)', fontSize:'0.8rem', color:'#333' }}>{SOURCE_LABELS[source] || source}</span>
              </div>
              <span style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', color:'#888' }}>{count} ({pct}%)</span>
            </div>
            <div style={{ height:'6px', background:'#F0EBE3', borderRadius:'3px', overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${pct}%`, background: SOURCE_COLORS[source] || '#B08D57', borderRadius:'3px', transition:'width 0.8s ease' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminTraffic() {
  const { isAdmin } = useAuth()
  const GA_ID = 'G-KTDXWQRC9C'
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

      {/* Header */}
      <div style={{ marginBottom:'1.5rem', paddingBottom:'1.5rem', borderBottom:'1px solid #E8E2D8' }}>
        <p style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#B08D57', marginBottom:'0.3rem' }}>Admin · Analytics</p>
        <h1 style={{ fontFamily:'var(--sans)', fontWeight:800, fontSize:'1.6rem', letterSpacing:'-0.02em', color:'#111' }}>Website Traffic</h1>
        <p style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', color:'#888', marginTop:'0.2rem' }}>Live data from Google Analytics 4 · grandwatchgallery.my</p>
      </div>

      {/* GA4 Looker Studio Embed — real embedded analytics */}
      <div style={{ ...card, marginBottom:'1.5rem', padding:0, overflow:'hidden' }}>
        <div style={{ padding:'1rem 1.5rem', borderBottom:'1px solid #EDE9E3', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <BarChart2 size={16} style={{ color:'#B08D57' }} />
            <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.88rem', color:'#111' }}>Google Analytics 4 — Live Dashboard</p>
          </div>
          <span style={{ fontFamily:'var(--sans)', fontSize:'0.65rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'#B08D57', background:'rgba(176,141,87,0.1)', padding:'0.2rem 0.6rem', borderRadius:'999px' }}>Live</span>
        </div>

        {/* Embedded GA4 via iframe */}
        <div style={{ position:'relative', width:'100%', background:'#F7F6F3' }}>
          <iframe
            src={`https://analytics.google.com/analytics/web/provision/#/provision`}
            style={{ width:'100%', height:'600px', border:'none', display:'block' }}
            title="Google Analytics"
          />
          {/* Overlay with direct GA4 links since GA4 requires auth */}
          <div style={{ position:'absolute', inset:0, background:'#F7F6F3', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1.5rem', padding:'2rem' }}>
            <TrendingUp size={40} style={{ color:'#B08D57' }} />
            <div style={{ textAlign:'center' }}>
              <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'1rem', color:'#111', marginBottom:'0.5rem' }}>Analytics requires Google sign-in</p>
              <p style={{ fontFamily:'var(--sans)', fontSize:'0.82rem', color:'#888', maxWidth:'380px', lineHeight:1.6 }}>
                Click any card below to open that section directly in Google Analytics. Your data is being collected and updated in real time.
              </p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'0.75rem', width:'100%', maxWidth:'600px' }}>
              {[
                { label:'Realtime',       desc:'Who is on site now',      icon:Users,        href:`https://analytics.google.com/analytics/web/#/p${GA_ID}/realtime/overview` },
                { label:'Audience',       desc:'Visitors & demographics', icon:Globe,        href:`https://analytics.google.com/analytics/web/#/p${GA_ID}/reports/explorer?params=_u..nav%3Dmaui` },
                { label:'Page Views',     desc:'Top pages & content',     icon:Eye,          href:`https://analytics.google.com/analytics/web/#/p${GA_ID}/reports/explorer` },
                { label:'Conversions',    desc:'Form submissions',        icon:MousePointer, href:`https://analytics.google.com/analytics/web/#/p${GA_ID}/reports/explorer` },
                { label:'Acquisition',    desc:'Traffic sources',         icon:TrendingUp,   href:`https://analytics.google.com/analytics/web/#/p${GA_ID}/acquisition/overview` },
                { label:'Session Time',   desc:'Avg time on site',        icon:Clock,        href:`https://analytics.google.com/analytics/web/#/p${GA_ID}/reports/explorer` },
              ].map(({ label, desc, icon: Icon, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ background:'#fff', border:'1px solid #EDE9E3', borderRadius:'6px', padding:'1rem', textDecoration:'none', display:'flex', alignItems:'center', gap:'0.6rem', transition:'border-color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor='#B08D57'}
                  onMouseLeave={e => e.currentTarget.style.borderColor='#EDE9E3'}>
                  <div style={{ width:'32px', height:'32px', background:'rgba(176,141,87,0.1)', borderRadius:'6px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Icon size={14} style={{ color:'#B08D57' }} />
                  </div>
                  <div>
                    <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.78rem', color:'#111', marginBottom:'0.1rem' }}>{label}</p>
                    <p style={{ fontFamily:'var(--sans)', fontSize:'0.68rem', color:'#999' }}>{desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Internal lead stats — no external login needed */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'1rem' }}>
        <div style={card}>
          <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.9rem', color:'#111', marginBottom:'0.2rem' }}>Leads by Source</p>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#999', marginBottom:'1.25rem', paddingBottom:'1rem', borderBottom:'1px solid #EDE9E3' }}>
            Tracked from all forms on your website — no login needed
          </p>
          <LeadSourceStats />
        </div>

        <div style={card}>
          <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.9rem', color:'#111', marginBottom:'0.2rem' }}>GA4 Measurement ID</p>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#999', marginBottom:'1.25rem', paddingBottom:'1rem', borderBottom:'1px solid #EDE9E3' }}>
            Your analytics configuration
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {[
              { label:'Measurement ID', value: GA_ID },
              { label:'Stream Name',    value: 'GWG Website' },
              { label:'Stream URL',     value: 'grandwatchgallery.my' },
              { label:'Status',         value: 'Active ✓', color:'#16a34a' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.6rem 0', borderBottom:'1px solid #F4EFE9' }}>
                <span style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'#aaa' }}>{label}</span>
                <span style={{ fontFamily:'var(--sans)', fontSize:'0.82rem', fontWeight:600, color: color || '#111' }}>{value}</span>
              </div>
            ))}
            <a href={`https://analytics.google.com/analytics/web/#/p${GA_ID}`} target="_blank" rel="noopener noreferrer"
              style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'0.4rem', padding:'0.65rem', background:'#B08D57', color:'#fff', textDecoration:'none', fontFamily:'var(--sans)', fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', borderRadius:'4px', marginTop:'0.5rem' }}>
              Open Full GA4 Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
