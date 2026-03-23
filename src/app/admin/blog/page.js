'use client'
import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, X, LoaderCircle, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const EMPTY = { title:'', category:'Market Update', excerpt:'', source_url:'', source:'', date:'', read_time:'5 min', is_published:true }
const CATS = ['Market Update','Investment','New Release','Interview','History']

const inp   = { width:'100%', padding:'0.65rem 0.85rem', fontFamily:'var(--sans)', fontSize:'0.82rem', border:'1px solid #E8E2D8', background:'#fff', outline:'none', borderRadius:'2px', color:'#111' }
const lbl   = { fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#777', display:'block', marginBottom:'0.4rem' }
const modal = { position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', background:'rgba(0,0,0,0.4)', backdropFilter:'blur(4px)' }

export default function AdminBlog() {
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen]       = useState(false)
  const [edit, setEdit]       = useState(EMPTY)
  const [editId, setEditId]   = useState(null)
  const [saving, setSaving]   = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [error, setError]     = useState('')

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('blog_posts').select('*').order('order_index', { ascending: true })
    setPosts(data || [])
    setLoading(false)
  }, [])
  useEffect(() => { fetch() }, [fetch])

  const openAdd  = () => { setEdit(EMPTY); setEditId(null); setError(''); setOpen(true) }
  const openEdit = (p) => { setEdit({ title:p.title, category:p.category||'Market Update', excerpt:p.excerpt||'', source_url:p.source_url||'', source:p.source||'', date:p.date||'', read_time:p.read_time||'5 min', is_published:p.is_published!==false }); setEditId(p.id); setError(''); setOpen(true) }

  const handleSave = async () => {
    if (!edit.title || !edit.source_url) { setError('Title and source URL are required.'); return }
    setSaving(true); setError('')
    const payload = { title:edit.title.trim(), category:edit.category, excerpt:edit.excerpt.trim(), source_url:edit.source_url.trim(), source:edit.source.trim(), date:edit.date, read_time:edit.read_time, is_published:edit.is_published, order_index: posts.length }
    const { error: err } = editId
      ? await supabase.from('blog_posts').update(payload).eq('id', editId)
      : await supabase.from('blog_posts').insert(payload)
    setSaving(false)
    if (err) { setError(err.message); return }
    setOpen(false); fetch()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this article?')) return
    setDeleting(id)
    await supabase.from('blog_posts').delete().eq('id', id)
    setDeleting(null); fetch()
  }

  const togglePublish = async (p) => {
    await supabase.from('blog_posts').update({ is_published: !p.is_published }).eq('id', p.id)
    fetch()
  }

  return (
    <div style={{ padding:'2.5rem 2.5rem 4rem' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'2rem', paddingBottom:'1.5rem', borderBottom:'1px solid #E8E2D8' }}>
        <div>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.65rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#B08D57', marginBottom:'0.4rem' }}>Admin</p>
          <h1 style={{ fontFamily:'var(--sans)', fontWeight:800, fontSize:'1.75rem', letterSpacing:'-0.02em', color:'#111' }}>Journal Articles</h1>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.8rem', color:'#888', marginTop:'0.25rem' }}>{posts.length} articles</p>
        </div>
        <button onClick={openAdd} style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'#B08D57', color:'#fff', padding:'0.7rem 1.25rem', fontFamily:'var(--sans)', fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', border:'none', cursor:'pointer' }}>
          <Plus size={14} /> Add Article
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:'4rem' }}>
          <LoaderCircle size={24} style={{ color:'#B08D57', animation:'spin 1s linear infinite' }} />
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem', background:'#fff', border:'1px solid #E8E2D8', fontFamily:'var(--sans)', fontSize:'0.85rem', color:'#bbb' }}>
          No articles yet. Add your first journal entry above.
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {posts.map(p => (
            <div key={p.id} style={{ background:'#fff', border:'1px solid #E8E2D8', borderRadius:'2px', padding:'1.25rem 1.5rem', display:'flex', alignItems:'center', gap:'1rem' }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.3rem' }}>
                  <span style={{ fontFamily:'var(--sans)', fontSize:'0.62rem', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.15rem 0.5rem', background:'#F4EFE9', color:'#B08D57', borderRadius:'999px' }}>{p.category}</span>
                  <span style={{ fontFamily:'var(--sans)', fontSize:'0.62rem', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.15rem 0.5rem', background: p.is_published?'#dcfce7':'#f1f5f9', color: p.is_published?'#166534':'#64748b', borderRadius:'999px' }}>
                    {p.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.9rem', color:'#111', marginBottom:'0.25rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.title}</p>
                <p style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#999' }}>{p.date} · {p.source} · {p.read_time} read</p>
              </div>
              <div style={{ display:'flex', gap:'0.5rem', flexShrink:0 }}>
                <a href={p.source_url} target="_blank" rel="noopener noreferrer" title="View source" style={{ padding:'0.4rem', border:'1px solid #E8E2D8', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', color:'#999' }}>
                  <ExternalLink size={13} />
                </a>
                <button onClick={() => togglePublish(p)} title={p.is_published?'Unpublish':'Publish'} style={{ padding:'0.4rem 0.75rem', border:'1px solid #E8E2D8', background:'#fff', cursor:'pointer', fontFamily:'var(--sans)', fontSize:'0.7rem', color:'#555' }}>
                  {p.is_published ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => openEdit(p)} style={{ padding:'0.4rem 0.75rem', border:'1px solid #E8E2D8', background:'#fff', cursor:'pointer', fontFamily:'var(--sans)', fontSize:'0.7rem', display:'flex', alignItems:'center', gap:'0.3rem', color:'#444' }}>
                  <Pencil size={11}/> Edit
                </button>
                <button onClick={() => handleDelete(p.id)} disabled={deleting===p.id} style={{ padding:'0.4rem 0.75rem', border:'1px solid #fca5a5', background:'#fff', cursor:'pointer', fontFamily:'var(--sans)', fontSize:'0.7rem', display:'flex', alignItems:'center', gap:'0.3rem', color:'#dc2626' }}>
                  {deleting===p.id ? <LoaderCircle size={11} style={{ animation:'spin 1s linear infinite' }}/> : <Trash2 size={11}/>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {open && (
        <div style={modal} onClick={e => { if(e.target===e.currentTarget) setOpen(false) }}>
          <div style={{ width:'100%', maxWidth:'540px', maxHeight:'90vh', overflowY:'auto', background:'#fff', border:'1px solid #E8E2D8', borderRadius:'4px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1.5rem', borderBottom:'1px solid #F4EFE9' }}>
              <h2 style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'1rem', color:'#111' }}>{editId ? 'Edit Article' : 'Add Article'}</h2>
              <button onClick={() => setOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#999' }}><X size={18}/></button>
            </div>
            <div style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
              {error && <div style={{ background:'#fee2e2', padding:'0.6rem 0.85rem', fontFamily:'var(--sans)', fontSize:'0.78rem', color:'#dc2626', borderRadius:'2px' }}>{error}</div>}
              <div>
                <label style={lbl}>Title *</label>
                <input style={inp} value={edit.title} onChange={e=>setEdit(p=>({...p,title:e.target.value}))} placeholder="Article title" />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                <div>
                  <label style={lbl}>Category</label>
                  <select style={inp} value={edit.category} onChange={e=>setEdit(p=>({...p,category:e.target.value}))}>
                    {CATS.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Source Name</label>
                  <input style={inp} value={edit.source} onChange={e=>setEdit(p=>({...p,source:e.target.value}))} placeholder="e.g. WatchPro" />
                </div>
              </div>
              <div>
                <label style={lbl}>Source URL *</label>
                <input style={inp} value={edit.source_url} onChange={e=>setEdit(p=>({...p,source_url:e.target.value}))} placeholder="https://..." />
              </div>
              <div>
                <label style={lbl}>Excerpt</label>
                <textarea style={{ ...inp, minHeight:'80px', resize:'vertical' }} value={edit.excerpt} onChange={e=>setEdit(p=>({...p,excerpt:e.target.value}))} placeholder="Short summary of the article…" />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                <div>
                  <label style={lbl}>Date</label>
                  <input style={inp} value={edit.date} onChange={e=>setEdit(p=>({...p,date:e.target.value}))} placeholder="e.g. Jan 2026" />
                </div>
                <div>
                  <label style={lbl}>Read Time</label>
                  <input style={inp} value={edit.read_time} onChange={e=>setEdit(p=>({...p,read_time:e.target.value}))} placeholder="e.g. 5 min" />
                </div>
              </div>
              <label style={{ display:'flex', alignItems:'center', gap:'0.6rem', cursor:'pointer' }}>
                <input type="checkbox" checked={edit.is_published} onChange={e=>setEdit(p=>({...p,is_published:e.target.checked}))} style={{ width:'16px', height:'16px', accentColor:'#B08D57' }} />
                <span style={{ fontFamily:'var(--sans)', fontSize:'0.82rem', color:'#444' }}>Published (visible on site)</span>
              </label>
            </div>
            <div style={{ display:'flex', justifyContent:'flex-end', gap:'0.75rem', padding:'1rem 1.5rem', borderTop:'1px solid #F4EFE9' }}>
              <button onClick={() => setOpen(false)} style={{ padding:'0.65rem 1.25rem', border:'1px solid #E8E2D8', background:'#fff', cursor:'pointer', fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#666' }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} style={{ padding:'0.65rem 1.5rem', background:'#B08D57', color:'#fff', border:'none', cursor:'pointer', fontFamily:'var(--sans)', fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', display:'flex', alignItems:'center', gap:'0.4rem', opacity:saving?0.7:1 }}>
                {saving ? <><LoaderCircle size={12} style={{ animation:'spin 1s linear infinite' }}/> Saving…</> : (editId ? 'Save Changes' : 'Add Article')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
