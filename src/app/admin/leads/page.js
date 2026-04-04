'use client'
import Spinner from '@/components/Spinner'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { Mail, Phone, Trash2, ChevronDown, ChevronUp, Lock, CheckCircle, Clock, XCircle, List, LayoutGrid } from 'lucide-react'

const STATUSES = ['new','contacted','converted','closed']
const STATUS_STYLES = {
  new:       { bg:'#FEF3C7', color:'#92400E', label:'New',       border:'#FCD34D' },
  contacted: { bg:'#DBEAFE', color:'#1E40AF', label:'Contacted', border:'#93C5FD' },
  converted: { bg:'#D1FAE5', color:'#065F46', label:'Converted', border:'#6EE7B7' },
  closed:    { bg:'#F3F4F6', color:'#6B7280', label:'Closed',    border:'#D1D5DB' },
}
const SOURCE_LABELS = { contact:'Contact Form', appointment:'Appointment', trade_in:'Trade-In', career:'Career', partner:'Partner', newsletter:'Newsletter' }
const SOURCE_COLORS = { contact:'#6b7280', appointment:'#3b82f6', trade_in:'#f59e0b', career:'#8b5cf6', partner:'#10b981', newsletter:'#ec4899' }

function age(ts) {
  const diff = Date.now() - new Date(ts).getTime()
  const m = Math.floor(diff/60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m/60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h/24)}d ago`
}

/* ── List View Card ── */
function LeadCard({ lead, onStatusChange, onDelete }) {
  const [open, setOpen] = useState(false)
  const d = lead.data || {}
  const s = STATUS_STYLES[lead.status] || STATUS_STYLES.new
  const isNew = lead.status === 'new' || !lead.status

  return (
    <div style={{ background:'#fff', border:`1px solid ${isNew ? '#B08D57' : '#E8E2D8'}`, borderRadius:'4px', marginBottom:'0.5rem', overflow:'hidden' }}>
      <div onClick={() => setOpen(v => !v)} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.9rem 1.25rem', cursor:'pointer', background: isNew ? '#FFFDF9' : '#fff' }}>
        <div style={{ width:'8px', height:'8px', borderRadius:'50%', background: SOURCE_COLORS[lead.source] || '#888', flexShrink:0 }} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.15rem', flexWrap:'wrap' }}>
            <span style={{ fontFamily:'var(--sans)', fontSize:'0.62rem', letterSpacing:'0.1em', textTransform:'uppercase', color: SOURCE_COLORS[lead.source] || '#888', fontWeight:600 }}>{SOURCE_LABELS[lead.source] || lead.source}</span>
            {isNew && <span style={{ fontFamily:'var(--sans)', fontSize:'0.58rem', fontWeight:700, color:'#B08D57', letterSpacing:'0.1em', textTransform:'uppercase' }}>New</span>}
          </div>
          <p style={{ fontFamily:'var(--sans)', fontWeight:600, fontSize:'0.88rem', color:'#111', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {lead.name || '—'} {lead.email ? `· ${lead.email}` : ''}
          </p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexShrink:0 }}>
          <select value={lead.status || 'new'} onChange={e => { e.stopPropagation(); onStatusChange(lead.id, e.target.value) }}
            onClick={e => e.stopPropagation()}
            style={{ fontFamily:'var(--sans)', fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', background:s.bg, color:s.color, border:'none', borderRadius:'999px', padding:'0.2rem 0.55rem', cursor:'pointer', outline:'none' }}>
            {STATUSES.map(st => <option key={st} value={st}>{STATUS_STYLES[st].label}</option>)}
          </select>
          <span style={{ fontFamily:'var(--sans)', fontSize:'0.68rem', color:'#ccc' }}>{age(lead.created_at)}</span>
          <button onClick={e => { e.stopPropagation(); onDelete(lead.id) }} style={{ background:'none', border:'none', cursor:'pointer', color:'#ddd', padding:'0.2rem' }}
            onMouseEnter={e => e.currentTarget.style.color='#dc2626'} onMouseLeave={e => e.currentTarget.style.color='#ddd'}>
            <Trash2 size={12} />
          </button>
          {open ? <ChevronUp size={13} style={{ color:'#aaa' }}/> : <ChevronDown size={13} style={{ color:'#aaa' }}/>}
        </div>
      </div>
      {open && (
        <div style={{ padding:'0 1.25rem 1.25rem', borderTop:'1px solid #F4EFE9' }}>
          <div style={{ paddingTop:'0.75rem', display:'flex', flexDirection:'column', gap:'0.35rem' }}>
            {[['Name',lead.name],['Email',lead.email],['Phone',lead.phone],['Subject',d.subject],['Message',d.message||d.notes],['Brand',d.brand],['Model',d.model],['Date',d.date],['Interest',d.interest]].filter(([,v])=>v).map(([k,v])=>(
              <div key={k} style={{ display:'flex', gap:'1rem' }}>
                <span style={{ fontFamily:'var(--sans)', fontSize:'0.62rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'#aaa', width:'72px', flexShrink:0 }}>{k}</span>
                <span style={{ fontFamily:'var(--sans)', fontSize:'0.82rem', color:'#333', lineHeight:1.5 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.75rem', flexWrap:'wrap' }}>
            {lead.email && <a href={`mailto:${lead.email}`} style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.35rem 0.75rem', background:'#B08D57', color:'#fff', textDecoration:'none', fontFamily:'var(--sans)', fontSize:'0.68rem', fontWeight:600, borderRadius:'2px' }}><Mail size={10}/> Email</a>}
            {lead.phone && <a href={`tel:${lead.phone}`} style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.35rem 0.75rem', border:'1px solid #E0DDD8', color:'#555', textDecoration:'none', fontFamily:'var(--sans)', fontSize:'0.68rem', borderRadius:'2px', background:'#fff' }}><Phone size={10}/> Call</a>}
            {lead.phone && <a href={`https://wa.me/${lead.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.35rem 0.75rem', border:'1px solid #25D366', color:'#25D366', textDecoration:'none', fontFamily:'var(--sans)', fontSize:'0.68rem', borderRadius:'2px', background:'#fff' }}>WhatsApp</a>}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Board View Card ── */
function BoardCard({ lead, onStatusChange, onDelete, onDragStart }) {
  const d = lead.data || {}
  const s = STATUS_STYLES[lead.status] || STATUS_STYLES.new
  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, lead.id)}
      style={{ background:'#fff', border:'1px solid #E8E2D8', borderRadius:'6px', padding:'0.85rem', marginBottom:'0.5rem', cursor:'grab', boxShadow:'0 1px 3px rgba(0,0,0,0.06)', transition:'box-shadow 0.15s, transform 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'; e.currentTarget.style.transform='translateY(-1px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,0.06)'; e.currentTarget.style.transform='translateY(0)' }}
    >
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.5rem' }}>
        <span style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.1em', textTransform:'uppercase', color: SOURCE_COLORS[lead.source] || '#888', fontWeight:600 }}>{SOURCE_LABELS[lead.source] || lead.source}</span>
        <button onClick={() => onDelete(lead.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'#ddd', padding:'0', lineHeight:1 }}
          onMouseEnter={e => e.currentTarget.style.color='#dc2626'} onMouseLeave={e => e.currentTarget.style.color='#ddd'}>
          <Trash2 size={11}/>
        </button>
      </div>
      <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.85rem', color:'#111', marginBottom:'0.25rem', lineHeight:1.3 }}>{lead.name || 'Unknown'}</p>
      {lead.email && <p style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#888', marginBottom:'0.25rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{lead.email}</p>}
      {lead.phone && <p style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#888', marginBottom:'0.5rem' }}>{lead.phone}</p>}
      {d.message && <p style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#aaa', marginBottom:'0.5rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.message}</p>}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'0.5rem', paddingTop:'0.5rem', borderTop:'1px solid #F4EFE9' }}>
        <span style={{ fontFamily:'var(--sans)', fontSize:'0.65rem', color:'#ccc' }}>{age(lead.created_at)}</span>
        <div style={{ display:'flex', gap:'0.3rem' }}>
          {lead.email && <a href={`mailto:${lead.email}`} style={{ display:'flex', alignItems:'center', padding:'0.2rem 0.4rem', background:'#B08D57', color:'#fff', textDecoration:'none', borderRadius:'2px' }}><Mail size={9}/></a>}
          {lead.phone && <a href={`https://wa.me/${lead.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{ display:'flex', alignItems:'center', padding:'0.2rem 0.4rem', border:'1px solid #25D366', color:'#25D366', textDecoration:'none', borderRadius:'2px', background:'#fff' }}><Phone size={9}/></a>}
        </div>
      </div>
    </div>
  )
}

/* ── Board Column ── */
function BoardColumn({ status, leads, onStatusChange, onDelete, onDrop, onDragOver, onDragLeave, isDragOver }) {
  const s = STATUS_STYLES[status]
  const icons = { new: Clock, contacted: Mail, converted: CheckCircle, closed: XCircle }
  const Icon = icons[status]
  return (
    <div
      onDragOver={onDragOver}
      onDrop={e => onDrop(e, status)}
      onDragLeave={onDragLeave}
      style={{ flex:1, minWidth:'220px', background: isDragOver ? '#FFFDF9' : '#F7F6F3', borderRadius:'8px', padding:'0.75rem', border:`2px dashed ${isDragOver ? '#B08D57' : 'transparent'}`, transition:'all 0.2s', minHeight:'200px' }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.75rem', paddingBottom:'0.75rem', borderBottom:'1px solid #E8E2D8' }}>
        <div style={{ width:'28px', height:'28px', borderRadius:'6px', background:s.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon size={13} style={{ color:s.color }}/>
        </div>
        <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.82rem', color:'#111' }}>{s.label}</p>
        <span style={{ marginLeft:'auto', fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.75rem', background:s.bg, color:s.color, padding:'0.1rem 0.5rem', borderRadius:'999px' }}>{leads.length}</span>
      </div>
      {leads.length === 0 && (
        <div style={{ textAlign:'center', padding:'1.5rem 0', fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#ccc' }}>Drop here</div>
      )}
      {leads.map(lead => (
        <BoardCard key={lead.id} lead={lead} onStatusChange={onStatusChange} onDelete={onDelete}
          onDragStart={(e, id) => { e.dataTransfer.setData('leadId', id) }} />
      ))}
    </div>
  )
}

/* ── Main Page ── */
export default function AdminLeads() {
  const { isAdmin } = useAuth()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState('board')
  const [dragOver, setDragOver] = useState(null)

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

  const onDrop = (e, status) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('leadId')
    if (id) updateStatus(id, status)
    setDragOver(null)
  }

  if (!isAdmin) return (
    <div style={{ padding:'2.5rem' }}>
      <div style={{ background:'#fff', border:'1px solid #E8E2D8', borderRadius:'6px', padding:'2rem', textAlign:'center' }}>
        <Lock size={20} style={{ color:'#B08D57', marginBottom:'1rem' }} />
        <p style={{ fontFamily:'var(--sans)', fontSize:'0.85rem', color:'#888' }}>Admin access required.</p>
      </div>
    </div>
  )

  const counts = {
    all: leads.length,
    new: leads.filter(l => !l.status || l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    converted: leads.filter(l => l.status === 'converted').length,
    closed: leads.filter(l => l.status === 'closed').length,
  }

  const filtered = filter === 'all' ? leads : leads.filter(l => (l.status || 'new') === filter)

  return (
    <div style={{ padding:'1.5rem 1.5rem 4rem' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem', marginBottom:'1.5rem', paddingBottom:'1.5rem', borderBottom:'1px solid #E8E2D8', flexWrap:'wrap' }}>
        <div>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#B08D57', marginBottom:'0.3rem' }}>Admin · CRM</p>
          <h1 style={{ fontFamily:'var(--sans)', fontWeight:800, fontSize:'1.6rem', letterSpacing:'-0.02em', color:'#111', margin:0 }}>
            Leads
            {counts.new > 0 && <span style={{ marginLeft:'0.6rem', display:'inline-flex', alignItems:'center', justifyContent:'center', width:'22px', height:'22px', background:'#B08D57', color:'#fff', borderRadius:'50%', fontFamily:'var(--sans)', fontSize:'0.65rem', fontWeight:700, verticalAlign:'middle' }}>{counts.new}</span>}
          </h1>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', color:'#888', marginTop:'0.2rem' }}>{counts.all} total · {counts.new} new · {counts.converted} converted</p>
        </div>

        {/* View toggle */}
        <div style={{ display:'flex', background:'#EDE9E3', borderRadius:'6px', padding:'0.25rem', gap:'0.25rem' }}>
          {[{ key:'list', icon:List, label:'List' }, { key:'board', icon:LayoutGrid, label:'Board' }].map(({ key, icon: Icon, label }) => (
            <button key={key} onClick={() => setView(key)}
              style={{ display:'flex', alignItems:'center', gap:'0.35rem', padding:'0.45rem 0.85rem', border:'none', borderRadius:'4px', cursor:'pointer', fontFamily:'var(--sans)', fontSize:'0.72rem', fontWeight: view===key ? 700 : 400, background: view===key ? '#fff' : 'transparent', color: view===key ? '#111' : '#888', boxShadow: view===key ? '0 1px 2px rgba(0,0,0,0.08)' : 'none', transition:'all 0.15s' }}>
              <Icon size={13}/> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))', gap:'0.75rem', marginBottom:'1.5rem' }}>
        {[
          { key:'new',       label:'New',       icon:Clock,        color:'#92400E', bg:'#FEF3C7' },
          { key:'contacted', label:'Contacted', icon:Mail,         color:'#1E40AF', bg:'#DBEAFE' },
          { key:'converted', label:'Converted', icon:CheckCircle,  color:'#065F46', bg:'#D1FAE5' },
          { key:'closed',    label:'Closed',    icon:XCircle,      color:'#6B7280', bg:'#F3F4F6' },
        ].map(({ key, label, icon: Icon, color, bg }) => (
          <div key={key} style={{ background:'#fff', border:'1px solid #EDE9E3', borderRadius:'6px', padding:'0.85rem', cursor:'pointer', outline: filter===key ? '2px solid #B08D57' : 'none' }}
            onClick={() => setFilter(filter === key ? 'all' : key)}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.3rem' }}>
              <span style={{ fontFamily:'var(--sans)', fontSize:'0.58rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'#999' }}>{label}</span>
              <div style={{ width:'22px', height:'22px', borderRadius:'5px', background:bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon size={11} style={{ color }}/>
              </div>
            </div>
            <p style={{ fontFamily:'var(--sans)', fontWeight:800, fontSize:'1.5rem', color:'#111', lineHeight:1 }}>{counts[key]}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:'4rem' }}>
          <Spinner size={24} style={{ color:'#B08D57', animation:'spin 1s linear infinite' }}/>
        </div>
      ) : view === 'board' ? (
        /* ── BOARD VIEW ── */
        <div style={{ display:'flex', gap:'0.75rem', overflowX:'auto', paddingBottom:'1rem', alignItems:'flex-start' }}>
          {STATUSES.map(status => (
            <BoardColumn
              key={status}
              status={status}
              leads={leads.filter(l => (l.status || 'new') === status)}
              onStatusChange={updateStatus}
              onDelete={deleteLead}
              onDrop={onDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(status) }}
              onDragLeave={() => setDragOver(null)}
              isDragOver={dragOver === status}
            />
          ))}
        </div>
      ) : (
        /* ── LIST VIEW ── */
        <>
          <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'1.25rem' }}>
            {['all','new','contacted','converted','closed'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ fontFamily:'var(--sans)', fontSize:'0.68rem', fontWeight: filter===f ? 700 : 400, letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.35rem 0.75rem', border:`1px solid ${filter===f ? '#B08D57' : '#E0DDD8'}`, background: filter===f ? '#B08D57' : '#fff', color: filter===f ? '#fff' : '#666', cursor:'pointer', borderRadius:'2px' }}>
                {f === 'all' ? 'All' : STATUS_STYLES[f]?.label} ({counts[f] || 0})
              </button>
            ))}
          </div>
          {filtered.length === 0
            ? <div style={{ textAlign:'center', padding:'4rem', background:'#fff', border:'1px solid #E8E2D8', borderRadius:'4px', fontFamily:'var(--sans)', fontSize:'0.85rem', color:'#bbb' }}>No leads yet.</div>
            : filtered.map(lead => <LeadCard key={lead.id} lead={lead} onStatusChange={updateStatus} onDelete={deleteLead} />)
          }
        </>
      )}
    </div>
  )
}
