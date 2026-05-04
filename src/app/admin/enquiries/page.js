'use client'
import Spinner from '@/components/Spinner'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { useActivityLog } from '@/hooks/useActivityLog'
import { Trash2, Mail, MailOpen, ChevronDown, ChevronUp, Lock, Phone, Calendar, Clock, Tag, ExternalLink } from 'lucide-react'

const TYPES = ['All','appointment','trade_in','career','partner','contact','newsletter']
const TYPE_LABELS = { appointment:'Appointment', trade_in:'Trade-In', career:'Career', partner:'Partner', contact:'Contact', newsletter:'Newsletter' }
const TYPE_COLORS = { appointment:'#3b82f6', trade_in:'#f59e0b', career:'#8b5cf6', partner:'#10b981', contact:'#6b7280', newsletter:'#ec4899' }

const OWNER_EMAIL = 'ooimunhong8898@gmail.com'

function Badge({ type }) {
  const bg = TYPE_COLORS[type] || '#888'
  return (
    <span style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.15em', textTransform:'uppercase', fontWeight:700, color:'#fff', background:bg, padding:'0.2rem 0.55rem', borderRadius:'999px' }}>
      {TYPE_LABELS[type] || type}
    </span>
  )
}

function Field({ label, value }) {
  if (!value) return null
  return (
    <div style={{ display:'flex', gap:'0.75rem', padding:'0.5rem 0', borderBottom:'1px solid #F4EFE9' }}>
      <span style={{ fontFamily:'var(--sans)', fontSize:'0.65rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'#aaa', width:'120px', flexShrink:0, paddingTop:'0.1rem' }}>{label}</span>
      <span style={{ fontFamily:'var(--sans)', fontSize:'0.82rem', color:'#333', lineHeight:1.5, wordBreak:'break-word' }}>{value}</span>
    </div>
  )
}

function EnquiryCard({ item, onMarkRead, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const d = item.data || {}
  const age = (() => {
    const diff = Date.now() - new Date(item.created_at).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  })()

  const toggle = () => {
    setExpanded(v => !v)
    if (!item.is_read) onMarkRead(item.id)
  }

  return (
    <div style={{ background:'#fff', border:`1px solid ${item.is_read ? '#E8E2D8' : '#B08D57'}`, borderRadius:'4px', overflow:'hidden', marginBottom:'0.6rem', boxShadow: item.is_read ? 'none' : '0 0 0 1px rgba(176,141,87,0.15)' }}>
      <div onClick={toggle} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'1rem 1.25rem', cursor:'pointer', background: item.is_read ? '#fff' : '#FFFDF9' }}>
        <div style={{ flexShrink:0, color: item.is_read ? '#ccc' : '#B08D57' }}>
          {item.is_read ? <MailOpen size={16}/> : <Mail size={16}/>}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.25rem', flexWrap:'wrap' }}>
            <Badge type={item.type} />
            {!item.is_read && <span style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', fontWeight:700, color:'#B08D57', letterSpacing:'0.1em', textTransform:'uppercase' }}>New</span>}
          </div>
          <p style={{ fontFamily:'var(--sans)', fontWeight: item.is_read ? 400 : 700, fontSize:'0.88rem', color:'#111', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {item.name || d.name || 'Anonymous'} {item.email ? `— ${item.email}` : ''}
          </p>
          {d.message && !expanded && (
            <p style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#999', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:'0.2rem' }}>{d.message}</p>
          )}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', flexShrink:0 }}>
          <span style={{ fontFamily:'var(--sans)', fontSize:'0.7rem', color:'#bbb' }}>{age}</span>
          <button onClick={e => { e.stopPropagation(); onDelete(item.id) }}
            style={{ background:'none', border:'none', cursor:'pointer', color:'#ddd', padding:'0.25rem', display:'flex', alignItems:'center' }}
            onMouseEnter={e => e.currentTarget.style.color='#dc2626'}
            onMouseLeave={e => e.currentTarget.style.color='#ddd'}>
            <Trash2 size={13}/>
          </button>
          {expanded ? <ChevronUp size={14} style={{ color:'#aaa' }}/> : <ChevronDown size={14} style={{ color:'#aaa' }}/>}
        </div>
      </div>

      {expanded && (
        <div style={{ padding:'0 1.25rem 1.25rem', borderTop:'1px solid #F4EFE9' }}>
          <div style={{ paddingTop:'0.75rem' }}>
            {/* Common fields */}
            <Field label="Name"    value={item.name || d.name} />
            <Field label="Email"   value={item.email || d.email} />
            <Field label="Phone"   value={d.phone} />
            {/* Appointment */}
            <Field label="Date"     value={d.date} />
            <Field label="Time"     value={d.time} />
            <Field label="Interest" value={d.interest} />
            {/* Trade-in */}
            <Field label="Brand"     value={d.brand} />
            <Field label="Model"     value={d.model} />
            <Field label="Reference" value={d.ref} />
            <Field label="Year"      value={d.year} />
            <Field label="Condition" value={d.condition} />
            <Field label="Box"       value={d.box} />
            <Field label="Papers"    value={d.papers} />
            {/* Career */}
            <Field label="Role"     value={d.role} />
            {/* Partner */}
            <Field label="Company"  value={d.company} />
            <Field label="Type"     value={d.type} />
            {/* Contact */}
            <Field label="Subject"  value={d.subject} />
            {/* Common */}
            <Field label="Message" value={d.message || d.notes} />
            <Field label="Read Time" value={d.read_time} />
            <div style={{ marginTop:'0.75rem', display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
              {item.email && (
                <a href={`mailto:${item.email}`}
                  style={{ display:'inline-flex', alignItems:'center', gap:'0.35rem', padding:'0.4rem 0.85rem', background:'#B08D57', color:'#fff', textDecoration:'none', fontFamily:'var(--sans)', fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', borderRadius:'2px' }}>
                  <Mail size={11}/> Reply by Email
                </a>
              )}
              {d.phone && (
                <a href={`tel:${d.phone}`}
                  style={{ display:'inline-flex', alignItems:'center', gap:'0.35rem', padding:'0.4rem 0.85rem', border:'1px solid #E0DDD8', color:'#555', textDecoration:'none', fontFamily:'var(--sans)', fontSize:'0.7rem', fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', borderRadius:'2px', background:'#fff' }}>
                  <Phone size={11}/> Call
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminEnquiries() {
  const { user, isAdmin } = useAuth()
  const { logAction } = useActivityLog()
  const [enquiries, setEnquiries] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [filter,    setFilter]    = useState('All')
  const [deleting,  setDeleting]  = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false })
    setEnquiries(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const markRead = async (id) => {
    const enquiry = enquiries.find(e => e.id === id)
    const targetName = enquiry ? `${enquiry.name || enquiry.email || 'Unknown'}` : 'Unknown'

    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, is_read: true } : e))
    await supabase.from('enquiries').update({ is_read: true }).eq('id', id)

    // Log the activity
    await logAction({
      action: 'view',
      category: 'enquiries',
      targetId: id,
      targetName: targetName
    })
  }

  const del = async (id) => {
    if (!confirm('Delete this enquiry?')) return
    setDeleting(id)

    // Get enquiry info for logging
    const enquiry = enquiries.find(e => e.id === id)
    const targetName = enquiry ? `${enquiry.name || enquiry.email || 'Unknown'}` : 'Unknown'

    // Delete the enquiry
    await supabase.from('enquiries').delete().eq('id', id)

    // Log the deletion
    await logAction({
      action: 'delete',
      category: 'enquiries',
      targetId: id,
      targetName: targetName
    })

    setEnquiries(prev => prev.filter(e => e.id !== id))
    setDeleting(null)
  }

  const markAllRead = async () => {
    await supabase.from('enquiries').update({ is_read: true }).eq('is_read', false)
    setEnquiries(prev => prev.map(e => ({ ...e, is_read: true })))
  }

  if (!isAdmin) return (
    <div style={{ padding:'2.5rem', maxWidth:'400px' }}>
      <div style={{ background:'#fff', border:'1px solid #E8E2D8', borderRadius:'6px', padding:'2rem', textAlign:'center' }}>
        <Lock size={20} style={{ color:'#B08D57', marginBottom:'1rem' }} />
        <p style={{ fontFamily:'var(--sans)', fontSize:'0.85rem', color:'#888' }}>Admin access required.</p>
      </div>
    </div>
  )

  const filtered = filter === 'All' ? enquiries : enquiries.filter(e => e.type === filter)
  const unread   = enquiries.filter(e => !e.is_read).length
  const counts   = TYPES.reduce((acc, t) => {
    acc[t] = t === 'All' ? enquiries.length : enquiries.filter(e => e.type === t).length
    return acc
  }, {})

  return (
    <div style={{ padding:'1.5rem 1.5rem 4rem' }}>
      {/* Header */}
      <div style={{ display:'flex', flexWrap:'wrap', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem', marginBottom:'1.5rem', paddingBottom:'1.5rem', borderBottom:'1px solid #E8E2D8' }}>
        <div>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#B08D57', marginBottom:'0.3rem' }}>Admin · All Channels</p>
          <h1 style={{ fontFamily:'var(--sans)', fontWeight:800, fontSize:'1.6rem', letterSpacing:'-0.02em', color:'#111', margin:0 }}>
            Enquiries
            {unread > 0 && <span style={{ marginLeft:'0.6rem', display:'inline-flex', alignItems:'center', justifyContent:'center', width:'22px', height:'22px', background:'#B08D57', color:'#fff', borderRadius:'50%', fontFamily:'var(--sans)', fontSize:'0.65rem', fontWeight:700, verticalAlign:'middle' }}>{unread}</span>}
          </h1>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', color:'#888', marginTop:'0.2rem' }}>{enquiries.length} total · {unread} unread</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead}
            style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'#fff', color:'#555', padding:'0.55rem 1rem', fontFamily:'var(--sans)', fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', border:'1px solid #D0CCC4', cursor:'pointer', borderRadius:'2px' }}>
            <MailOpen size={12}/> Mark All Read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
        {TYPES.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            style={{ fontFamily:'var(--sans)', fontSize:'0.68rem', fontWeight: filter===t ? 700 : 400, letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.4rem 0.85rem', border:`1px solid ${filter===t ? '#B08D57' : '#E0DDD8'}`, background: filter===t ? '#B08D57' : '#fff', color: filter===t ? '#fff' : '#666', cursor:'pointer', borderRadius:'2px', display:'flex', alignItems:'center', gap:'0.35rem' }}>
            {t === 'All' ? 'All' : TYPE_LABELS[t]}
            {counts[t] > 0 && <span style={{ fontSize:'0.6rem', opacity:0.8 }}>({counts[t]})</span>}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:'4rem' }}>
          <Spinner size={24} style={{ color:'#B08D57', animation:'spin 1s linear infinite' }}/>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem', background:'#fff', border:'1px solid #E8E2D8', borderRadius:'4px', fontFamily:'var(--sans)', fontSize:'0.85rem', color:'#bbb' }}>
          {filter === 'All' ? 'No enquiries yet.' : `No ${TYPE_LABELS[filter] || filter} enquiries.`}
        </div>
      ) : (
        <div>
          {filtered.map(item => (
            <EnquiryCard key={item.id} item={item} onMarkRead={markRead} onDelete={del} />
          ))}
        </div>
      )}
    </div>
  )
}
