'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { Lock, TrendingUp, Users, Eye, MousePointer, RefreshCw, BarChart2, Clock, Globe } from 'lucide-react'

const SOURCE_COLORS = { contact:'#6b7280', appointment:'#3b82f6', trade_in:'#f59e0b', career:'#8b5cf6', partner:'#10b981', newsletter:'#ec4899' }
const SOURCE_LABELS = { contact:'Contact Form', appointment:'Appointment', trade_in:'Trade-In', career:'Career', partner:'Partner', newsletter:'Newsletter' }

function MiniBarChart({ data, color = '#B08D57' }) {
  if (!data || !data.length) return null
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:'3px', height:'48px' }}>
      {data.map((d, i) => (
        <div key={i} title={`${d.label}: ${d.value}`} style={{ flex:1, background: color, opacity: 0.3 + (d.value/max)*0.7, borderRadius:'2px 2px 0 0', height:`${Math.max((d.value/max)*100, 4)}%`, transition:'height 0.5s ease', cursor:'default' }} />
      ))}
    </div>
  )
}

function StatCard({ label, value, sub, icon: Icon, color = '#B08D57', chart }) {
  return (
    <div style={{ background:'#fff', border:'1px solid #EDE9E3', borderRadius:'8px', padding:'1.25rem', boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: chart ? '0.75rem' : 0 }}>
        <div>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#999', marginBottom:'0.4rem' }}>{label}</p>
          <p style={{ fontFamily:'var(--sans)', fontWeight:800, fontSize:'1.8rem', color:'#111', lineHeight:1 }}>{value ?? '—'}</p>
          {sub && <p style={{ fontFamily:'var(--sans)', fontSize:'0.7rem', color:'#999', marginTop:'0.3rem' }}>{sub}</p>}
        </div>
        <div style={{ width:'36px', height:'36px', borderRadius:'8px', background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      {chart && <MiniBarChart data={chart} color={color} />}
    </div>
  )
}

function TopPagesTable({ pages }) {
  if (!pages?.length) return <p style={{ fontFamily:'var(--sans)', fontSize:'0.82rem', color:'#aaa' }}>No page data yet.</p>
  return (
    <table style={{ width:'100%', borderCollapse:'collapse' }}>
      <thead>
        <tr>
          {['Page', 'Views', 'Avg Time'].map(h => (
            <th key={h} style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#aaa', textAlign:'left', paddingBottom:'0.6rem', borderBottom:'1px solid #F0EBE3', fontWeight:600 }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {pages.map((p, i) => (
          <tr key={i}>
            <td style={{ padding:'0.6rem 0', borderBottom:'1px solid #F7F6F3', fontFamily:'var(--sans)', fontSize:'0.82rem', color:'#333', maxWidth:'180px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.page}</td>
            <td style={{ padding:'0.6rem 0', borderBottom:'1px solid #F7F6F3', fontFamily:'var(--sans)', fontSize:'0.82rem', color:'#555', fontWeight:600 }}>{p.views}</td>
            <td style={{ padding:'0.6rem 0', borderBottom:'1px solid #F7F6F3', fontFamily:'var(--sans)', fontSize:'0.78rem', color:'#999' }}>{p.avgTime}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function LeadStats() {
  const [data, setData] = useState({ sources: [], statusCounts: {}, total: 0, thisWeek: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('leads').select('source, status, created_at').then(({ data: rows }) => {
      if (!rows) { setLoading(false); return }
      const sources = {}
      const statusCounts = { new:0, contacted:0, converted:0, closed:0 }
      const weekAgo = Date.now() - 7*24*60*60*1000
      let thisWeek = 0

      rows.forEach(r => {
        sources[r.source] = (sources[r.source] || 0) + 1
        if (statusCounts[r.status] !== undefined) statusCounts[r.status]++
        if (new Date(r.created_at).getTime() > weekAgo) thisWeek++
      })

      const total = rows.length
      setData({
        total, thisWeek,
        statusCounts,
        sources: Object.entries(sources).map(([source, count]) => ({ source, count, pct: total ? Math.round(count/total*100) : 0 })).sort((a,b) => b.count-a.count),
      })
      setLoading(false)
    })
  }, [])

  if (loading) return <p style={{ fontFamily:'var(--sans)', fontSize:'0.82rem', color:'#aaa' }}>Loading lead stats...</p>

  return (
    <div>
      {/* Status pills */}
      <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1.25rem' }}>
        {[
          { key:'new',       label:'New',       bg:'#FEF3C7', color:'#92400E' },
          { key:'contacted', label:'Contacted', bg:'#DBEAFE', color:'#1E40AF' },
          { key:'converted', label:'Converted', bg:'#D1FAE5', color:'#065F46' },
          { key:'closed',    label:'Closed',    bg:'#F3F4F6', color:'#6B7280' },
        ].map(({ key, label, bg, color }) => (
          <div key={key} style={{ background:bg, padding:'0.3rem 0.75rem', borderRadius:'999px', display:'flex', alignItems:'center', gap:'0.4rem' }}>
            <span style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.88rem', color }}>{data.statusCounts[key] || 0}</span>
            <span style={{ fontFamily:'var(--sans)', fontSize:'0.62rem', letterSpacing:'0.1em', textTransform:'uppercase', color }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Source bars */}
      {data.sources.length === 0
        ? <p style={{ fontFamily:'var(--sans)', fontSize:'0.82rem', color:'#bbb' }}>No leads yet. Submit a form to see data.</p>
        : data.sources.map(({ source, count, pct }) => (
          <div key={source} style={{ marginBottom:'0.6rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.2rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
                <div style={{ width:'7px', height:'7px', borderRadius:'50%', background: SOURCE_COLORS[source] || '#B08D57' }} />
                <span style={{ fontFamily:'var(--sans)', fontSize:'0.8rem', color:'#333' }}>{SOURCE_LABELS[source] || source}</span>
              </div>
              <span style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#888' }}>{count} ({pct}%)</span>
            </div>
            <div style={{ height:'5px', background:'#F0EBE3', borderRadius:'3px' }}>
              <div style={{ height:'100%', width:`${pct}%`, background: SOURCE_COLORS[source] || '#B08D57', borderRadius:'3px', transition:'width 0.8s ease' }} />
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default function AdminTraffic() {
  const { isAdmin } = useAuth()
  const [gaData, setGaData] = useState(null)
  const [gaLoading, setGaLoading] = useState(true)
  const [gaError, setGaError] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)
  const card = { background:'#fff', border:'1px solid #EDE9E3', borderRadius:'8px', padding:'1.5rem', boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }

  const fetchGA = async () => {
    setGaLoading(true)
    setGaError(null)
    try {
      const res = await fetch('/api/analytics')
      const json = await res.json()
      if (json.error) setGaError(json.error)
      if (json.data) { setGaData(json.data); setLastRefresh(new Date()) }
    } catch (e) { setGaError(e.message) }
    setGaLoading(false)
  }

  useEffect(() => { if (isAdmin) fetchGA() }, [isAdmin])

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
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem', paddingBottom:'1.5rem', borderBottom:'1px solid #E8E2D8', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#B08D57', marginBottom:'0.3rem' }}>Admin · Analytics</p>
          <h1 style={{ fontFamily:'var(--sans)', fontWeight:800, fontSize:'1.6rem', letterSpacing:'-0.02em', color:'#111' }}>Website Traffic</h1>
          {lastRefresh && <p style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#aaa', marginTop:'0.2rem' }}>Last updated: {lastRefresh.toLocaleTimeString()}</p>}
        </div>
        <button onClick={fetchGA} disabled={gaLoading}
          style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', padding:'0.5rem 1rem', background:'#fff', border:'1px solid #E0DDD8', borderRadius:'4px', fontFamily:'var(--sans)', fontSize:'0.72rem', fontWeight:600, color:'#555', cursor: gaLoading ? 'not-allowed' : 'pointer' }}>
          <RefreshCw size={13} style={{ animation: gaLoading ? 'spin 1s linear infinite' : 'none' }} />
          {gaLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Error message */}
      {gaError && (
        <div style={{ background:'#FEF2F2', border:'1px solid #FCA5A5', borderRadius:'6px', padding:'0.75rem 1rem', marginBottom:'1.25rem', fontFamily:'var(--sans)', fontSize:'0.78rem', color:'#DC2626' }}>
          ⚠️ GA4 Error: {gaError}
        </div>
      )}

      {/* GA Stat Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'1rem', marginBottom:'1.5rem' }}>
        <StatCard label="Active Users (Now)" value={gaLoading ? '...' : gaData?.activeUsers ?? '—'} icon={Users} color="#3b82f6" sub="Real-time" />
        <StatCard label="Page Views (7d)" value={gaLoading ? '...' : gaData?.pageViews ?? '—'} icon={Eye} color="#B08D57" sub="Last 7 days" chart={gaData?.pageViewsChart} />
        <StatCard label="Sessions (7d)" value={gaLoading ? '...' : gaData?.sessions ?? '—'} icon={Globe} color="#10b981" sub="Last 7 days" chart={gaData?.sessionsChart} />
        <StatCard label="Avg Session" value={gaLoading ? '...' : gaData?.avgSessionDuration ?? '—'} icon={Clock} color="#8b5cf6" sub="Minutes on site" />
        <StatCard label="Bounce Rate" value={gaLoading ? '...' : gaData?.bounceRate ?? '—'} icon={TrendingUp} color="#f59e0b" sub="Lower is better" />
        <StatCard label="New Users (7d)" value={gaLoading ? '...' : gaData?.newUsers ?? '—'} icon={MousePointer} color="#ec4899" sub="First-time visitors" />
      </div>

      {/* Top Pages + Traffic Sources */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'1rem', marginBottom:'1.5rem' }}>
        <div style={card}>
          <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.88rem', color:'#111', marginBottom:'0.2rem' }}>Top Pages</p>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#999', marginBottom:'1rem', paddingBottom:'0.75rem', borderBottom:'1px solid #EDE9E3' }}>Most visited in last 7 days</p>
          {gaLoading ? <p style={{ fontFamily:'var(--sans)', fontSize:'0.82rem', color:'#aaa' }}>Loading...</p> : <TopPagesTable pages={gaData?.topPages} />}
        </div>

        <div style={card}>
          <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.88rem', color:'#111', marginBottom:'0.2rem' }}>Traffic Sources</p>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#999', marginBottom:'1rem', paddingBottom:'0.75rem', borderBottom:'1px solid #EDE9E3' }}>Where visitors come from</p>
          {gaLoading ? <p style={{ fontFamily:'var(--sans)', fontSize:'0.82rem', color:'#aaa' }}>Loading...</p> : (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
              {(gaData?.trafficSources || []).map((s, i) => (
                <div key={i}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.2rem' }}>
                    <span style={{ fontFamily:'var(--sans)', fontSize:'0.8rem', color:'#333', textTransform:'capitalize' }}>{s.source}</span>
                    <span style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#888' }}>{s.sessions} ({s.pct}%)</span>
                  </div>
                  <div style={{ height:'5px', background:'#F0EBE3', borderRadius:'3px' }}>
                    <div style={{ height:'100%', width:`${s.pct}%`, background:'#B08D57', borderRadius:'3px', opacity: 0.4 + (i===0 ? 0.6 : i===1 ? 0.4 : 0.2) }} />
                  </div>
                </div>
              ))}
              {!gaData?.trafficSources?.length && !gaLoading && <p style={{ fontFamily:'var(--sans)', fontSize:'0.82rem', color:'#aaa' }}>No data yet — GA4 needs 24-48h to collect data.</p>}
            </div>
          )}
        </div>
      </div>

      {/* Lead Stats */}
      <div style={card}>
        <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.88rem', color:'#111', marginBottom:'0.2rem' }}>Lead Capture Stats</p>
        <p style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#999', marginBottom:'1rem', paddingBottom:'0.75rem', borderBottom:'1px solid #EDE9E3' }}>Form submissions tracked from your website</p>
        <LeadStats />
      </div>

    </div>
  )
}
