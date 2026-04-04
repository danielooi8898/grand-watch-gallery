'use client'
import Spinner from '@/components/Spinner'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { Mail, Phone, Tag, Trash2, ChevronDown, ChevronUp, Lock, CheckCircle, Clock, XCircle } from 'lucide-react'

const STATUSES = ['new','contacted','converted','closed']
const STATUS_STYLES = {
  new:       { bg:'#FEF3C7', color:'#92400E', label:'New' },
  contacted: { bg:'#DBEAFE', color:'#1E40AF', label:'Contacted' },
  converted: { bg:'#D1FAE5', color:'#065F46', label:'Converted' },
  closed:    { bg:'#F3F4F6', color:'#6B7280', label:'Closed' },
}
const SOURCE_LABELS = {
  contact:'Contact Form', appointment:'Appointment', trade_in:'Trade-In',
  career:'Career', partner:'Partner', newsletter:'Newsletter',
}
const SOURCE_COLORS = {
  contact:'#6b7280', appointment:'#3b82f6', trade_in:'#f59e0b',
  career:'#8b5cf6', partner:'#10b981', newsletter:'#ec4899',
}

function StatusBadge({ status, onChange }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.new
  return (
    <select value={status} onChange={e => onChange(e.target.value)}
      onClick={e => e.stopPropagation()}
      style={{ fontFamily:'var(--sans)', fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', background:s.bg, color:s.color, border:'none', borderRadius:'999px', padding:'0.2rem 0.6rem', cursor:'pointer', outline:'none' }}>
      {STATUSES.map(st => <option key={st} value={st}>{STATUS_STYLES[st].label}</option>)}
    </select>
  )
}

function LeadCard({ lead, onStatusChange, onDelete }) {
  const [open, setOpen] = useState(false)
  const d = lead.data || {}
  const age = (() => {
    const diff = Date.now() - new Date(lead.created_at).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  })()
  const srcColor = SOURCE_COLORS[lead.source] || '#888'
  const isNew = lead.status === 'new'

  return (
    <div style={{ background:'#fff', border:`1px solid ${isNew ? '#B08D57' : '#E8E2D8'}`, borderRadius:'4px', marginBottom:'0.6rem', overflow:'hidden', boxShadow: isNew ? '0 0 0 1px rgba(176,141,87,0.1)' : 'none' }}>
      <div onClick={() => setOpen(v => !v)} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.9rem 1.25rem', cursor:'pointer', background: isNew ? '#FFFDF9' : '#fff' }}>
        <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:srcColor, flexShrink:0 }} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.2rem', flexWrap:'wrap' }}>
            <span style={{ fontFamily:'var(--sans)', fontSize:'0.62rem', letterSpacing:'0.1em', textTransform:'uppercase', color:srcColor, fontWeight:600 }}>{SOURCE_LABELS[lead.source] || lead.source}</span>
            {isNew && <span style={{ fontFamily:'var(--sans)', fontSize:'0.58rem', fontWeight:700, color:'#B08D57', letterSpacing:'0.1em', textTransform:'uppercase' }}>New</span>}
          </div>
          <p style={{ fontFamily:'var(--sans)', fontWeight:600, fontSize:'0.88rem', color:'#111', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {lead.name || '—'} {lead.email ? `· ${lead.email}` : ''}
          </p>
          {lead.phone && <p style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#999', marginTop:'0.1rem' }}>{lead.phone}</p>}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', flexShrink:0 }}>
          <StatusBadge status={lead.status || 'new'} onChange={v => onStatusChange(lead.id, v)} />
          <span style={{ fontFamily:'var(--sans)', fontSize:'0.68rem', color:'#ccc' }}>{age}</span>
          <button onClick={e => { e.stopPropagation(); onDelete(lead.id) }}
            style={{ background:'none', border:'none', cursor:'pointer', color:'#ddd', padding:'0.2rem' }}
            onMouseEnter={e => e.currentTarget.style.color='#dc2626'}
            onMouseLeave={e => e.currentTarget.style.color='#ddd'}>
            <Trash2 size={12} />
          </button>
          {open ? <ChevronUp size={13} style={{ color:'#aaa' }}/> : <ChevronDown size={13} style={{ color:'#aaa' }}/>}
        </div>
      </div>
      {open && (
        <div style={{ padding:'0 1.25rem 1.25rem', borderTop:'1px solid #F4EFE9' }}>
          <div style={{ paddingTop:'0.75rem', display:'flex', flexDirection:'column', gap:'0.4rem' }}>
            {[['Name', lead.name], ['Email', lead.email], ['Phone', lead.phone],
              ['Subject', d.subject], ['Message', d.message || d.notes],
              ['Brand', d.brand], ['Model', d.model], ['Date', d.date],
              ['Interest', d.interest], ['Company', d.company],
            ].filter(([,v]) => v).map(([k,v]) => (
              <div key={k} style={{ display:'flex', gap:'1rem' }}>
                <span style={{ fontFamily:'var(--sans)', fontSize:'0.62rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'#aaa', width:'80px', flexShrink:0, paddingTop:'0.1rem' }}>{k}</span>
                <span style={{ fontFamily:'var(--sans)', fontSize:'0.82rem', color:'#333', lineHeight:1.5 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:'0.5rem', marginTop:'1rem', flexWrap:'wrap' }}>
            {lead.email && <a href={`mailto:${lead.email}`} style={{ display:'inline-flex', alignItems:'center', gap:'0.35rem', padding:'0.4rem 0.85rem', background:'#B08D57', color:'#fff', textDecoration:'none', fontFamily:'var(--sans)', fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', borderRadius:'2px' }}><Mail size={11}/> Email</a>}
            {lead.phone && <a href={`tel:${lead.phone}`} style={{ display:'inline-flex', alignItems:'center', gap:'0.35rem', padding:'0.4rem 0.85rem', border:'1px solid #E0DDD8', color:'#555', textDecoration:'none', fontFamily:'var(--sans)', fontSize:'0.7rem', fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', borderRadius:'2px', background:'#fff' }}><Phone size={11}/> Call</a>}
            {lead.phone && <a href={`https://wa.me/${lead.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:'0.35rem', padding:'0.4rem 0.85rem', border:'1px solid #25D366', color:'#25D366', textDecoration:'none', fontFamily:'var(--sans)', fontSize:'0.7rem', fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', borderRadius:'2px', background:'#fff' }}>WhatsApp</a>}
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminLeads() {
  const { isAdmin } = useAuth()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
    setLeads(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id, status) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    await supabase.from('leads').update({ status }).eq('id', id)
  }

  const deleteLead = async (id) => {
    if (!confirm('Delete this lead?')) return
    await supabase.from('leads').delete().eq('id', id)
    setLeads(prev => prev.filter(l => l.id !== id))
  }

  if (!isAdmin) return (
    <div style={{ padding:'2.5rem' }}>
      <div style={{ background:'#fff', border:'1px solid #E8E2D8', borderRadius:'6px', padding:'2rem', textAlign:'center' }}>
        <Lock size={20} style={{ color:'#B08D57', marginBottom:'1rem' }} />
        <p style={{ fontFamily:'var(--sans)', fontSize:'0.85rem', color:'#888' }}>Admin access required.</p>
      </div>
    </div>
  )

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter)
  const counts = { all: leads.length, new: leads.filter(l => l.status === 'new' || !l.status).length, contacted: leads.filter(l => l.status === 'contacted').length, converted: leads.filter(l => l.status === 'converted').length, closed: leads.filter(l => l.status === 'closed').length }

  return (
    <div style={{ padding:'1.5rem 1.5rem 4rem' }}>
      <div style={{ marginBottom:'1.5rem', paddingBottom:'1.5rem', borderBottom:'1px solid #E8E2D8' }}>
        <p style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#B08D57', marginBottom:'0.3rem' }}>Admin · CRM</p>
        <h1 style={{ fontFamily:'var(--sans)', fontWeight:800, fontSize:'1.6rem', letterSpacing:'-0.02em', color:'#111', margin:0 }}>
          Leads
          {counts.new > 0 && <span style={{ marginLeft:'0.6rem', display:'inline-flex', alignItems:'center', justifyContent:'center', width:'22px', height:'22px', background:'#B08D57', color:'#fff', borderRadius:'50%', fontFamily:'var(--sans)', fontSize:'0.65rem', fontWeight:700, verticalAlign:'middle' }}>{counts.new}</span>}
        </h1>
        <p style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', color:'#888', marginTop:'0.2rem' }}>{counts.all} total · {counts.new} new · {counts.converted} converted</p>
      </div>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:'0.75rem', marginBottom:'1.5rem' }}>
        {[
          { key:'new',       label:'New',       icon:Clock,        color:'#92400E', bg:'#FEF3C7' },
          { key:'contacted', label:'Contacted', icon:Mail,         color:'#1E40AF', bg:'#DBEAFE' },
          { key:'converted', label:'Converted', icon:CheckCircle,  color:'#065F46', bg:'#D1FAE5' },
          { key:'closed',    label:'Closed',    icon:XCircle,      color:'#6B7280', bg:'#F3F4F6' },
        ].map(({ key, label, icon: Icon, color, bg }) => (
          <div key={key} style={{ background:'#fff', border:'1px solid #EDE9E3', borderRadius:'6px', padding:'1rem', cursor:'pointer', outline: filter === key ? '2px solid #B08D57' : 'none' }} onClick={() => setFilter(filter === key ? 'all' : key)}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.4rem' }}>
              <span style={{ fontFamily:'var(--sans)', fontSize:'0.58rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#999' }}>{label}</span>
              <div style={{ width:'24px', height:'24px', borderRadius:'6px', background:bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon size={12} style={{ color }} />
              </div>
            </div>
            <p style={{ fontFamily:'var(--sans)', fontWeight:800, fontSize:'1.6rem', color:'#111', lineHeight:1 }}>{counts[key]}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'1.25rem' }}>
        {['all','new','contacted','converted','closed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ fontFamily:'var(--sans)', fontSize:'0.68rem', fontWeight: filter===f ? 700 : 400, letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.4rem 0.85rem', border:`1px solid ${filter===f ? '#B08D57' : '#E0DDD8'}`, background: filter===f ? '#B08D57' : '#fff', color: filter===f ? '#fff' : '#666', cursor:'pointer', borderRadius:'2px' }}>
            {f === 'all' ? 'All' : STATUS_STYLES[f]?.label || f} ({counts[f] || 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:'4rem' }}>
          <Spinner size={24} style={{ color:'#B08D57', animation:'spin 1s linear infinite' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem', background:'#fff', border:'1px solid #E8E2D8', borderRadius:'4px' }}>
          <Tag size={24} style={{ color:'#CCC', marginBottom:'0.75rem' }} />
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.85rem', color:'#BBB' }}>No leads yet. Leads are captured automatically from all forms.</p>
        </div>
      ) : (
        filtered.map(lead => <LeadCard key={lead.id} lead={lead} onStatusChange={updateStatus} onDelete={deleteLead} />)
      )}
    </div>
  )
}
