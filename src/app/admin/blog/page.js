'use client'
import Spinner from '@/components/Spinner'
import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, X, ExternalLink, Lock, Upload } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

const OWNER_EMAIL = 'ooimunhong8898@gmail.com'
const EMPTY = { title:'', category:'Market Update', excerpt:'', source_url:'', source:'', date:'', read_time:'5 min', image_url:'', is_published:true }
const CATS = ['Market Update','Investment','New Release','Interview','History']

const inp   = { width:'100%', padding:'0.65rem 0.85rem', fontFamily:'var(--sans)', fontSize:'0.82rem', border:'1px solid #E8E2D8', background:'#fff', outline:'none', borderRadius:'2px', color:'#111', boxSizing:'border-box' }
const lbl   = { fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#777', display:'block', marginBottom:'0.4rem' }
const modal = { position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', background:'rgba(0,0,0,0.4)', backdropFilter:'blur(4px)' }

export default function AdminBlog() {
  const { user, isOwner } = useAuth()
  const [posts, setPosts]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [open, setOpen]         = useState(false)
  const [edit, setEdit]         = useState(EMPTY)
  const [editId, setEditId]     = useState(null)
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [error, setError]       = useState('')
  const [uploadingCover, setUploadingCover] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('blog_posts').select('*').order('order_index', { ascending: true })
    setPosts(data || [])
    setLoading(false)
  }, [])
  useEffect(() => { fetch() }, [fetch])

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCover(true)
    const path = `blog/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const { data, error: upErr } = await supabase.storage.from('watch-images').upload(path, file, { upsert: true })
    if (upErr) { alert('Upload failed: ' + upErr.message); setUploadingCover(false); return }
    const { data: urlData } = supabase.storage.from('watch-images').getPublicUrl(data.path)
    setEdit(p => ({ ...p, image_url: urlData.publicUrl }))
    setUploadingCover(false)
  }

  const openAdd  = () => { setEdit(EMPTY); setEditId(null); setError(''); setOpen(true) }
  const openEdit = (p) => {
    setEdit({ title:p.title, category:p.category||'Market Update', excerpt:p.excerpt||'', source_url:p.source_url||'', source:p.source||'', date:p.date||'', read_time:p.read_time||'5 min', image_url:p.image_url||'', is_published:p.is_published!==false })
    setEditId(p.id); setError(''); setOpen(true)
  }

  const handleSave = async () => {
    if (!edit.title || !edit.source_url) { setError('Title and source URL are required.'); return }
    setSaving(true); setError('')
    const payload = { title:edit.title.trim(), category:edit.category, excerpt:edit.excerpt.trim(), source_url:edit.source_url.trim(), source:edit.source.trim(), date:edit.date, read_time:edit.read_time, image_url:edit.image_url?.trim()||null, is_published:edit.is_published, order_index: posts.length }
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

  // Owner-only guard
  if (!isOwner) {
    return (
      <div style={{ padding:'2.5rem', maxWidth:'540px' }}>
        <div style={{ background:'#fff', border:'1px solid #E8E2D8', borderRadius:'6px', padding:'2.5rem', textAlign:'center' }}>
          <div style={{ width:'48px', height:'48px', borderRadius:'50%', background:'#FEF3C7', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.25rem' }}>
            <Lock size={20} style={{ color:'#B08D57' }} />
          </div>
          <h2 style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'1.1rem', color:'#111', marginBottom:'0.5rem' }}>Owner Access Required</h2>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.82rem', color:'#888', lineHeight:1.7, marginBottom:'1.5rem' }}>
            Journal management is restricted to the account owner.<br/>
            Please contact <strong style={{ color:'#111' }}>{OWNER_EMAIL}</strong> to request access or make changes.
          </p>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#aaa' }}>
            Signed in as: {user?.email}
          </p>
        </div>

        {/* Read-only view */}
        <div style={{ marginTop:'2rem' }}>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#B08D57', marginBottom:'1rem' }}>Current Articles (Read-Only)</p>
          {loading ? <Spinner size={20} style={{ color:'#B08D57', animation:'spin 1s linear infinite' }}/> : (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
              {posts.map(p => (
                <div key={p.id} style={{ background:'#fff', border:'1px solid #E8E2D8', borderRadius:'2px', padding:'0.85rem 1rem', opacity:0.7 }}>
                  <p style={{ fontFamily:'var(--sans)', fontWeight:600, fontSize:'0.85rem', color:'#111', marginBottom:'0.2rem' }}>{p.title}</p>
                  <p style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#999' }}>{p.category} · {p.date} · {p.is_published ? 'Published' : 'Draft'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding:'2.5rem 2.5rem 4rem' }}>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'2rem', paddingBottom:'1.5rem', borderBottom:'1px solid #E8E2D8' }}>
        <div>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.65rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#B08D57', marginBottom:'0.4rem' }}>Admin · Owner Only</p>
          <h1 style={{ fontFamily:'var(--sans)', fontWeight:800, fontSize:'1.75rem', letterSpacing:'-0.02em', color:'#111' }}>Journal Articles</h1>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.8rem', color:'#888', marginTop:'0.25rem' }}>{posts.length} articles</p>
        </div>
        <button onClick={openAdd} style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'#B08D57', color:'#fff', padding:'0.7rem 1.25rem', fontFamily:'var(--sans)', fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', border:'none', cursor:'pointer' }}>
          <Plus size={14} /> Add Article
        </button>
      </div>

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:'4rem' }}>
          <Spinner size={24} style={{ color:'#B08D57', animation:'spin 1s linear infinite' }} />
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem', background:'#fff', border:'1px solid #E8E2D8', fontFamily:'var(--sans)', fontSize:'0.85rem', color:'#bbb' }}>
          No articles yet. Add your first journal entry above.
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {posts.map(p => (
            <div key={p.id} style={{ background:'#fff', border:'1px solid #E8E2D8', borderRadius:'2px', padding:'1.25rem 1.5rem', display:'flex', alignItems:'center', gap:'1rem' }}>
              {p.image_url && (
                <div style={{ width:'56px', height:'56px', flexShrink:0, borderRadius:'2px', overflow:'hidden', background:'#f5f4f1' }}>
                  <img src={p.image_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                </div>
              )}
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
                <button onClick={() => togglePublish(p)} style={{ padding:'0.4rem 0.75rem', border:'1px solid #E8E2D8', background:'#fff', cursor:'pointer', fontFamily:'var(--sans)', fontSize:'0.7rem', color:'#555' }}>
                  {p.is_published ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => openEdit(p)} style={{ padding:'0.4rem 0.75rem', border:'1px solid #E8E2D8', background:'#fff', cursor:'pointer', fontFamily:'var(--sans)', fontSize:'0.7rem', display:'flex', alignItems:'center', gap:'0.3rem', color:'#444' }}>
                  <Pencil size={11}/> Edit
                </button>
                <button onClick={() => handleDelete(p.id)} disabled={deleting===p.id} style={{ padding:'0.4rem 0.75rem', border:'1px solid #fca5a5', background:'#fff', cursor:'pointer', fontFamily:'var(--sans)', fontSize:'0.7rem', display:'flex', alignItems:'center', gap:'0.3rem', color:'#dc2626' }}>
                  {deleting===p.id ? <Spinner size={11} style={{ animation:'spin 1s linear infinite' }}/> : <Trash2 size={11}/>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div style={modal} onClick={e => { if(e.target===e.currentTarget) setOpen(false) }}>
          <div style={{ width:'100%', maxWidth:'580px', maxHeight:'90vh', overflowY:'auto', background:'#fff', border:'1px solid #E8E2D8', borderRadius:'4px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1.5rem', borderBottom:'1px solid #F4EFE9' }}>
              <h2 style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'1rem', color:'#111' }}>{editId ? 'Edit Article' : 'Add Article'}</h2>
              <button onClick={() => setOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#999' }}><X size={18}/></button>
            </div>
            <div style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
              {error && <div style={{ background:'#fee2e2', padding:'0.6rem 0.85rem', fontFamily:'var(--sans)', fontSize:'0.78rem', color:'#dc2626', borderRadius:'2px' }}>{error}</div>}


              {/* ── Cover Image upload (prominent) ── */}
              <div style={{ border:'1px solid #E8E2D8', borderRadius:'4px', padding:'1rem', background:'#FAFAF8' }}>
                <label style={{ ...lbl, marginBottom:'0.75rem', fontSize:'0.65rem' }}>Cover Image <span style={{ color:'#B08D57', fontWeight:700, textTransform:'none', letterSpacing:0 }}>(optional)</span></label>
                {edit.image_url ? (
                  <div style={{ position:'relative', borderRadius:'4px', overflow:'hidden', height:'140px', background:'#f5f4f1', marginBottom:'0.75rem' }}>
                    <img src={edit.image_url} alt="Cover preview" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    <button
                      onClick={() => setEdit(p => ({ ...p, image_url: '' }))}
                      title="Remove image"
                      style={{ position:'absolute', top:'0.4rem', right:'0.4rem', background:'rgba(0,0,0,0.55)', border:'none', borderRadius:'50%', width:'24px', height:'24px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff' }}>
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div style={{ height:'100px', border:'1px dashed #D4CEC6', borderRadius:'4px', display:'flex', alignItems:'center', justifyContent:'center', background:'#f5f4f1', marginBottom:'0.75rem' }}>
                    <p style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#bbb' }}>No cover image</p>
                  </div>
                )}
                <label style={{
                  display:'inline-flex', alignItems:'center', gap:'0.5rem',
                  padding:'0.6rem 1rem', background:'#fff', border:'1px solid #B08D57',
                  borderRadius:'3px', cursor: uploadingCover ? 'not-allowed' : 'pointer',
                  fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#B08D57', fontWeight:600,
                  opacity: uploadingCover ? 0.7 : 1,
                }}>
                  <Upload size={13} />
                  {uploadingCover ? 'Uploading\u2026' : edit.image_url ? 'Replace Image' : 'Upload Cover Image'}
                  <input type="file" accept="image/*" style={{ display:'none' }}
                    onChange={handleCoverUpload} disabled={uploadingCover} />
                </label>
                <p style={{ fontFamily:'var(--sans)', fontSize:'0.67rem', color:'#A09890', marginTop:'0.5rem' }}>JPG, PNG or WebP recommended</p>
              </div>


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
                <textarea style={{ ...inp, minHeight:'80px', resize:'vertical' }} value={edit.excerpt} onChange={e=>setEdit(p=>({...p,excerpt:e.target.value}))} placeholder="Short summary…" />
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
                {saving ? <><Spinner size={12} style={{ animation:'spin 1s linear infinite' }}/> Saving…</> : (editId ? 'Save Changes' : 'Add Article')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
