'use client'
import Spinner from '@/components/Spinner'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { Mail, Phone, Trash2, ChevronDown, ChevronUp, Lock, CheckCircle, Clock, XCircle, List, LayoutGrid, Pencil, X, Save } from 'lucide-react'

const STATUSES = ['new','contacted','converted','closed']
const STATUS_STYLES = {
  new:       { bg:'#FEF3C7', color:'#92400E', label:'New',       border:'#FCD34D', icon: Clock },
  contacted: { bg:'#DBEAFE', color:'#1E40AF', label:'Contacted', border:'#93C5FD', icon: Mail },
  converted: { bg:'#D1FAE5', color:'#065F46', label:'Converted', border:'#6EE7B7', icon: CheckCircle },
  closed:    { bg:'#F3F4F6', color:'#6B7280', label:'Closed',    border:'#D1D5DB', icon: XCircle },
}
const SOURCE_LABELS = { contact:'Contact Form', appointment:'Appointment', trade_in:'Trade-In', career:'Career', partner:'Partner', newsletter:'Newsletter' }
const SOURCE_COLORS = { contact:'#6b7280', appointment:'#3b82f6', trade_in:'#f59e0b', career:'#8b5cf6', partner:'#10b981', newsletter:'#ec4899' }

function timeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime()
  const m = Math.floor(diff/60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m/60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h/24)}d ago`
}

const inp = { width:'100%', padding:'0.55rem 0.75rem', fontFamily:'var(--sans)', fontSize:'0.82rem', border:'1px solid #E0DDD8', background:'#fff', outline:'none', borderRadius:'4px', color:'#111', boxSizing:'border-box' }
const lbl = { fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#888', display:'block', marginBottom:'0.3rem' }

/* ── Edit Modal ── */
function EditModal({ lead, onSave, onClose }) {
  const [form, setForm] = useState({
    name: lead.name || '',
    email: lead.email || '',
    phone: lead.phone || '',
    status: lead.status || 'new',
    source: lead.source || 'contact',
    message: lead.data?.message || lead.data?.notes || '',
    subject: lead.data?.subject || '',
    brand: lead.data?.brand || '',
    model: lead.data?.model || '',
  })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    const updated = {
      name: form.name, email: form.email, phone: form.phone,
      status: form.status, source: form.source,
      data: { ...lead.data, message: form.message, subject: form.subject, brand: form.brand, model: form.model },
    }
    await supabase.from('leads').update(updated).eq('id', lead.id)
    onSave({ ...lead, ...updated })
    setSaving(false)
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', background:'rgba(0,0,0,0.5)', backdropFilter:'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width:'100%', maxWidth:'480px', maxHeight:'90vh', overflowY:'auto', background:'#fff', borderRadius:'8px', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.25rem 1.5rem', borderBottom:'1px solid #EDE9E3' }}>
          <div>
            <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.95rem', color:'#111' }}>Edit Lead</p>
            <p style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#999', marginTop:'0.1rem' }}>{lead.name || 'Unknown'} · {timeAgo(lead.created_at)}</p>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#aaa', padding:'0.25rem' }}><X size={18}/></button>
        </div>

        {/* Form */}
        <div style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
          {/* Status */}
          <div>
            <label style={lbl}>Status</label>
            <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
              {STATUSES.map(s => {
                const st = STATUS_STYLES[s]
                return (
                  <button key={s} onClick={() => set('status', s)}
                    style={{ fontFamily:'var(--sans)', fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', padding:'0.35rem 0.75rem', border:`1.5px solid ${form.status===s ? st.border : '#E0DDD8'}`, background: form.status===s ? st.bg : '#fff', color: form.status===s ? st.color : '#888', borderRadius:'999px', cursor:'pointer' }}>
                    {st.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Name & Email */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
            <div>
              <label style={lbl}>Name</label>
              <input style={inp} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full name" />
            </div>
            <div>
              <label style={lbl}>Email</label>
              <input style={inp} value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
            </div>
          </div>

          {/* Phone & Source */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
            <div>
              <label style={lbl}>Phone</label>
              <input style={inp} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+601X-XXX XXXX" />
            </div>
            <div>
              <label style={lbl}>Source</label>
              <select style={inp} value={form.source} onChange={e => set('source', e.target.value)}>
                {Object.entries(SOURCE_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label style={lbl}>Subject</label>
            <input style={inp} value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="Enquiry subject" />
          </div>

          {/* Brand & Model (for watch enquiries) */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
            <div>
              <label style={lbl}>Brand</label>
              <input style={inp} value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="e.g. Rolex" />
            </div>
            <div>
              <label style={lbl}>Model</label>
              <input style={inp} value={form.model} onChange={e => set('model', e.target.value)} placeholder="e.g. Submariner" />
            </div>
          </div>

          {/* Message */}
          <div>
            <label style={lbl}>Notes / Message</label>
            <textarea style={{ ...inp, minHeight:'80px', resize:'vertical' }} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Additional notes..." />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end', padding:'1rem 1.5rem', borderTop:'1px solid #EDE9E3' }}>
          <button onClick={onClose} style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#888', background:'none', border:'1px solid #E0DDD8', padding:'0.55rem 1.1rem', borderRadius:'4px', cursor:'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving}
            style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', fontFamily:'var(--sans)', fontSize:'0.72rem', fontWeight:700, color:'#fff', background:'#B08D57', border:'none', padding:'0.55rem 1.25rem', borderRadius:'4px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            <Save size={13}/> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Board Card ── */
function BoardCard({ lead, onEdit, onDelete, onDragStart }) {
  const d = lead.data || {}
  return (
    <div draggable onDragStart={e => { e.dataTransfer.setData('leadId', lead.id); e.dataTransfer.effectAllowed='move' }}
      onClick={() => onEdit(lead)}
      style={{ background:'#fff', border:'1px solid #E8E2D8', borderRadius:'8px', padding:'0.85rem 1rem', marginBottom:'0.5rem', cursor:'pointer', boxShadow:'0 1px 2px rgba(0,0,0,0.05)', transition:'all 0.15s', userSelect:'none' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor='#B08D57'; e.currentTarget.style.transform='translateY(-1px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow='0 1px 2px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor='#E8E2D8'; e.currentTarget.style.transform='translateY(0)' }}>

      {/* Source tag */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.5rem' }}>
        <span style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.1em', textTransform:'uppercase', color: SOURCE_COLORS[lead.source] || '#888', fontWeight:700, background:`${SOURCE_COLORS[lead.source]}18`, padding:'0.15rem 0.45rem', borderRadius:'3px' }}>
          {SOURCE_LABELS[lead.source] || lead.source}
        </span>
        <div style={{ display:'flex', gap:'0.3rem' }}>
          <button onClick={e => { e.stopPropagation(); onEdit(lead) }}
            style={{ background:'none', border:'none', cursor:'pointer', color:'#ccc', padding:'0.15rem', display:'flex', alignItems:'center' }}
            onMouseEnter={e => e.currentTarget.style.color='#B08D57'} onMouseLeave={e => e.currentTarget.style.color='#ccc'}>
            <Pencil size={11}/>
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(lead.id) }}
            style={{ background:'none', border:'none', cursor:'pointer', color:'#ccc', padding:'0.15rem', display:'flex', alignItems:'center' }}
            onMouseEnter={e => e.currentTarget.style.color='#dc2626'} onMouseLeave={e => e.currentTarget.style.color='#ccc'}>
            <Trash2 size={11}/>
          </button>
        </div>
      </div>

      {/* Name */}
      <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.88rem', color:'#111', marginBottom:'0.2rem', lineHeight:1.3 }}>{lead.name || 'Unknown'}</p>

      {/* Contact */}
      {lead.email && <p style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#888', marginBottom:'0.15rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{lead.email}</p>}
      {lead.phone && <p style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#888', marginBottom:'0.15rem' }}>{lead.phone}</p>}

      {/* Watch info */}
      {(d.brand || d.model) && (
        <p style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#B08D57', marginBottom:'0.15rem', fontWeight:600 }}>{[d.brand, d.model].filter(Boolean).join(' · ')}</p>
      )}

      {/* Message preview */}
      {(d.message || d.notes || d.subject) && (
        <p style={{ fontFamily:'var(--sans)', fontSize:'0.7rem', color:'#aaa', marginTop:'0.35rem', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
          {d.subject || d.message || d.notes}
        </p>
      )}

      {/* Footer */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'0.6rem', paddingTop:'0.5rem', borderTop:'1px solid #F4EFE9' }}>
        <span style={{ fontFamily:'var(--sans)', fontSize:'0.65rem', color:'#ccc' }}>{timeAgo(lead.created_at)}</span>
        <div style={{ display:'flex', gap:'0.3rem' }}>
          {lead.email && <a href={`mailto:${lead.email}`} onClick={e => e.stopPropagation()} style={{ display:'flex', alignItems:'center', padding:'0.2rem 0.45rem', background:'#B08D57', color:'#fff', textDecoration:'none', borderRadius:'3px', fontSize:'10px' }}><Mail size={9}/></a>}
          {lead.phone && <a href={`https://wa.me/${lead.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ display:'flex', alignItems:'center', padding:'0.2rem 0.45rem', border:'1px solid #25D366', color:'#25D366', textDecoration:'none', borderRadius:'3px', background:'#fff', fontSize:'10px' }}><Phone size={9}/></a>}
        </div>
      </div>
    </div>
  )
}

/* ── Board Column ── */
function BoardColumn({ status, leads, onEdit, onDelete, onDrop, onDragOver, onDragLeave, isDragOver }) {
  const s = STATUS_STYLES[status]
  const Icon = s.icon
  return (
    <div style={{ flex:'0 0 260px', display:'flex', flexDirection:'column' }}>
      {/* Column header */}
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.6rem', padding:'0 0.25rem' }}>
        <div style={{ width:'26px', height:'26px', borderRadius:'6px', background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Icon size={12} style={{ color:s.color }}/>
        </div>
        <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.82rem', color:'#111' }}>{s.label}</p>
        <span style={{ marginLeft:'auto', fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.72rem', background:s.bg, color:s.color, padding:'0.1rem 0.45rem', borderRadius:'999px' }}>{leads.length}</span>
      </div>

      {/* Drop zone */}
      <div onDragOver={e => { e.preventDefault(); onDragOver() }} onDrop={e => onDrop(e, status)} onDragLeave={onDragLeave}
        style={{ flex:1, minHeight:'120px', borderRadius:'8px', padding:'0.5rem', background: isDragOver ? 'rgba(176,141,87,0.06)' : '#F7F6F3', border:`2px dashed ${isDragOver ? '#B08D57' : 'transparent'}`, transition:'all 0.15s' }}>

        {leads.length === 0 ? (
          <div style={{ textAlign:'center', padding:'1.5rem 0.5rem', border:'1.5px dashed #E0DDD8', borderRadius:'6px', background:'#fff' }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 0.5rem' }}>
              <Icon size={14} style={{ color:s.color }}/>
            </div>
            <p style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#ccc', lineHeight:1.4 }}>No {s.label.toLowerCase()} leads</p>
            <p style={{ fontFamily:'var(--sans)', fontSize:'0.65rem', color:'#ddd', marginTop:'0.2rem' }}>Drop cards here</p>
          </div>
        ) : (
          leads.map(lead => <BoardCard key={lead.id} lead={lead} onEdit={onEdit} onDelete={onDelete} />)
        )}
      </div>
    </div>
  )
}

/* ── List Card ── */
function ListCard({ lead, onEdit, onDelete }) {
  const [open, setOpen] = useState(false)
  const d = lead.data || {}
  const s = STATUS_STYLES[lead.status || 'new']
  const isNew = !lead.status || lead.status === 'new'

  return (
    <div style={{ background:'#fff', border:`1px solid ${isNew ? '#B08D57' : '#E8E2D8'}`, borderRadius:'6px', marginBottom:'0.5rem', overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.85rem 1.1rem', cursor:'pointer', background: isNew ? '#FFFDF9' : '#fff' }}
        onClick={() => setOpen(v => !v)}>
        <div style={{ width:'8px', height:'8px', borderRadius:'50%', background: SOURCE_COLORS[lead.source] || '#888', flexShrink:0 }} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', marginBottom:'0.1rem', flexWrap:'wrap' }}>
            <span style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.1em', textTransform:'uppercase', color: SOURCE_COLORS[lead.source]||'#888', fontWeight:700 }}>{SOURCE_LABELS[lead.source]||lead.source}</span>
            {isNew && <span style={{ fontFamily:'var(--sans)', fontSize:'0.58rem', fontWeight:700, color:'#B08D57', letterSpacing:'0.1em', textTransform:'uppercase' }}>New</span>}
          </div>
          <p style={{ fontFamily:'var(--sans)', fontWeight:600, fontSize:'0.88rem', color:'#111', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {lead.name||'—'} {lead.email ? `· ${lead.email}` : ''}
          </p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexShrink:0 }}>
          <span style={{ fontFamily:'var(--sans)', fontSize:'0.62rem', fontWeight:700, background:s.bg, color:s.color, padding:'0.15rem 0.5rem', borderRadius:'999px' }}>{s.label}</span>
          <span style={{ fontFamily:'var(--sans)', fontSize:'0.68rem', color:'#ccc' }}>{timeAgo(lead.created_at)}</span>
          <button onClick={e => { e.stopPropagation(); onEdit(lead) }} style={{ background:'none', border:'none', cursor:'pointer', color:'#ccc', padding:'0.15rem' }}
            onMouseEnter={e => e.currentTarget.style.color='#B08D57'} onMouseLeave={e => e.currentTarget.style.color='#ccc'}><Pencil size={12}/></button>
          <button onClick={e => { e.stopPropagation(); onDelete(lead.id) }} style={{ background:'none', border:'none', cursor:'pointer', color:'#ccc', padding:'0.15rem' }}
            onMouseEnter={e => e.currentTarget.style.color='#dc2626'} onMouseLeave={e => e.currentTarget.style.color='#ccc'}><Trash2 size={12}/></button>
          {open ? <ChevronUp size={13} style={{ color:'#aaa' }}/> : <ChevronDown size={13} style={{ color:'#aaa' }}/>}
        </div>
      </div>
      {open && (
        <div style={{ padding:'0 1.1rem 1rem', borderTop:'1px solid #F4EFE9' }}>
          <div style={{ paddingTop:'0.65rem', display:'flex', flexDirection:'column', gap:'0.3rem' }}>
            {[['Name',lead.name],['Email',lead.email],['Phone',lead.phone],['Subject',d.subject],['Message',d.message||d.notes],['Brand',d.brand],['Model',d.model],['Date',d.date],['Interest',d.interest]].filter(([,v])=>v).map(([k,v])=>(
              <div key={k} style={{ display:'flex', gap:'1rem' }}>
                <span style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'#aaa', width:'68px', flexShrink:0 }}>{k}</span>
                <span style={{ fontFamily:'var(--sans)', fontSize:'0.8rem', color:'#333', lineHeight:1.5 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:'0.4rem', marginTop:'0.75rem', flexWrap:'wrap' }}>
            <button onClick={() => onEdit(lead)} style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.35rem 0.75rem', background:'#f4f4f4', color:'#555', border:'1px solid #E0DDD8', fontFamily:'var(--sans)', fontSize:'0.68rem', fontWeight:600, borderRadius:'3px', cursor:'pointer' }}><Pencil size={10}/> Edit</button>
            {lead.email && <a href={`mailto:${lead.email}`} style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.35rem 0.75rem', background:'#B08D57', color:'#fff', textDecoration:'none', fontFamily:'var(--sans)', fontSize:'0.68rem', fontWeight:600, borderRadius:'3px' }}><Mail size={10}/> Email</a>}
            {lead.phone && <a href={`tel:${lead.phone}`} style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.35rem 0.75rem', border:'1px solid #E0DDD8', color:'#555', textDecoration:'none', fontFamily:'var(--sans)', fontSize:'0.68rem', borderRadius:'3px', background:'#fff' }}><Phone size={10}/> Call</a>}
            {lead.phone && <a href={`https://wa.me/${lead.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.35rem 0.75rem', border:'1px solid #25D366', color:'#25D366', textDecoration:'none', fontFamily:'var(--sans)', fontSize:'0.68rem', borderRadius:'3px', background:'#fff' }}>WhatsApp</a>}
          </div>
        </div>
      )}
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
  const [editLead, setEditLead] = useState(null)

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

  const handleSave = (updated) => {
    setLeads(prev => prev.map(l => l.id === updated.id ? updated : l))
    setEditLead(null)
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
  const filtered = filter === 'all' ? leads : leads.filter(l => (l.status||'new') === filter)

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
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#888', marginTop:'0.2rem' }}>{counts.all} total · {counts.new} new · {counts.converted} converted · Click any card to edit</p>
        </div>
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
          { key:'new', label:'New', icon:Clock, color:'#92400E', bg:'#FEF3C7' },
          { key:'contacted', label:'Contacted', icon:Mail, color:'#1E40AF', bg:'#DBEAFE' },
          { key:'converted', label:'Converted', icon:CheckCircle, color:'#065F46', bg:'#D1FAE5' },
          { key:'closed', label:'Closed', icon:XCircle, color:'#6B7280', bg:'#F3F4F6' },
        ].map(({ key, label, icon: Icon, color, bg }) => (
          <div key={key} style={{ background:'#fff', border:'1px solid #EDE9E3', borderRadius:'6px', padding:'0.85rem', cursor:'pointer', outline: filter===key ? '2px solid #B08D57' : 'none', transition:'outline 0.1s' }}
            onClick={() => setFilter(filter===key ? 'all' : key)}>
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
        <div style={{ display:'flex', gap:'0.75rem', overflowX:'auto', paddingBottom:'1rem', alignItems:'flex-start' }}>
          {STATUSES.map(status => (
            <BoardColumn key={status} status={status}
              leads={leads.filter(l => (l.status||'new') === status)}
              onEdit={setEditLead} onDelete={deleteLead}
              onDrop={onDrop}
              onDragOver={() => setDragOver(status)}
              onDragLeave={() => setDragOver(null)}
              isDragOver={dragOver === status}
            />
          ))}
        </div>
      ) : (
        <>
          <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'1.25rem' }}>
            {['all','new','contacted','converted','closed'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ fontFamily:'var(--sans)', fontSize:'0.68rem', fontWeight: filter===f ? 700 : 400, letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.35rem 0.75rem', border:`1px solid ${filter===f ? '#B08D57' : '#E0DDD8'}`, background: filter===f ? '#B08D57' : '#fff', color: filter===f ? '#fff' : '#666', cursor:'pointer', borderRadius:'2px' }}>
                {f === 'all' ? 'All' : STATUS_STYLES[f]?.label} ({counts[f]||0})
              </button>
            ))}
          </div>
          {filtered.length === 0
            ? <div style={{ textAlign:'center', padding:'4rem', background:'#fff', border:'1px solid #E8E2D8', borderRadius:'6px' }}>
                <p style={{ fontFamily:'var(--sans)', fontSize:'0.85rem', color:'#BBB' }}>No leads yet. Submit a form to capture leads.</p>
              </div>
            : filtered.map(lead => <ListCard key={lead.id} lead={lead} onEdit={setEditLead} onDelete={deleteLead} />)
          }
        </>
      )}

      {/* Edit Modal */}
      {editLead && <EditModal lead={editLead} onSave={handleSave} onClose={() => setEditLead(null)} />}

    </div>
  )
}
