'use client'
import Spinner from '@/components/Spinner'
import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, X, ExternalLink, Lock, Upload } from 'lucide-react'
import ImageCropModal from '@/components/ImageCropModal'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

const OWNER_EMAIL = 'ooimunhong8898@gmail.com'
const EMPTY = { title:'', category:'Market Update', excerpt:'', source_url:'', source:'', date:'', read_time:'5 min', image_url:'', is_published:true }
const CATS  = ['Market Update','Investment','New Release','Interview','History']

const inp = { width:'100%', padding:'0.65rem 0.85rem', fontFamily:'var(--sans)', fontSize:'0.82rem', border:'1px solid #E8E2D8', background:'#fff', outline:'none', borderRadius:'2px', color:'#111', boxSizing:'border-box' }
const lbl = { fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#777', display:'block', marginBottom:'0.4rem' }

const CSS = `
.ba-page { padding: 1rem 1rem 4rem; }
.ba-header { display:flex; flex-direction:column; gap:1rem; margin-bottom:1.5rem; padding-bottom:1.5rem; border-bottom:1px solid #E8E2D8; }
.ba-actions { display:flex; flex-wrap:wrap; align-items:center; gap:0.5rem; }
.ba-fetch-msg { font-family:var(--sans); font-size:0.72rem; padding:0.35rem 0.75rem; border-radius:3px; }
.ba-hero-bar { display:flex; flex-wrap:wrap; gap:0.5rem; justify-content:space-between; align-items:center; padding:0.75rem 1rem; border-bottom:1px solid #F0EDE8; background:#FAFAF8; }
.ba-hero-grid { display:grid; grid-template-columns:1fr; min-height:180px; }
.ba-hero-text { padding:1.5rem; background:#111; display:flex; flex-direction:column; justify-content:center; border-top:1px solid #1A1A1A; }
.ba-row { background:#fff; border:1px solid #E8E2D8; border-radius:2px; padding:1rem; display:flex; flex-direction:column; gap:0.75rem; }
.ba-row-meta { flex:1; min-width:0; }
.ba-row-actions { display:flex; flex-wrap:wrap; gap:0.4rem; }
.ba-btn-src { display:none !important; }
.ba-modal-bg { position:fixed; inset:0; z-index:100; display:flex; align-items:flex-end; justify-content:center; padding:0; background:rgba(0,0,0,0.45); backdrop-filter:blur(4px); }
.ba-modal-wrap { width:100%; max-height:95vh; overflow-y:auto; background:#fff; border:1px solid #E8E2D8; border-radius:8px 8px 0 0; }
.ba-form-2col { display:grid; grid-template-columns:1fr; gap:0.75rem; }
.ba-modal-pad { padding:1rem; display:flex; flex-direction:column; gap:1rem; }
.ba-modal-footer { display:flex; justify-content:flex-end; gap:0.75rem; padding:0.75rem 1rem; border-top:1px solid #F4EFE9; }
@media (min-width:640px) {
  .ba-page { padding:2.5rem 2.5rem 4rem; }
  .ba-header { flex-direction:row; align-items:flex-end; justify-content:space-between; }
  .ba-hero-grid { grid-template-columns:1fr 1fr; min-height:220px; }
  .ba-hero-text { padding:2rem; border-top:none; border-left:1px solid #1A1A1A; }
  .ba-row { flex-direction:row; align-items:center; padding:1.25rem 1.5rem; }
  .ba-row-actions { flex-wrap:nowrap; }
  .ba-btn-src { display:flex !important; }
  .ba-modal-bg { align-items:center; padding:1rem; }
  .ba-modal-wrap { width:100%; max-width:580px; border-radius:4px; }
  .ba-form-2col { grid-template-columns:1fr 1fr; }
  .ba-modal-pad { padding:1.5rem; }
  .ba-modal-footer { padding:1rem 1.5rem; }
}
`

export default function AdminBlog() {
  const { user, isOwner } = useAuth()

  const [posts,    setPosts]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [open,     setOpen]     = useState(false)
  const [edit,     setEdit]     = useState(EMPTY)
  const [editId,   setEditId]   = useState(null)
  const [saving,   setSaving]   = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [error,    setError]    = useState('')

  const [fetching, setFetching] = useState(false)
  const [fetchMsg, setFetchMsg] = useState('')

  const [uploadingCover, setUploadingCover] = useState(false)
  const [coverCrop, setCoverCrop] = useState(null)
  const [heroCrop,  setHeroCrop]  = useState(null)

  /* load posts */
  const loadPosts = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('blog_posts').select('*').order('order_index', { ascending: true })
    setPosts(data || [])
    setLoading(false)
  }, [])
  useEffect(() => { loadPosts() }, [loadPosts])

  /* hero image upload */
  const onHeroFileSelect = (e) => {
    const file = e.target.files?.[0]; if (!file) return
    setHeroCrop({ src: URL.createObjectURL(file), fileName: file.name })
    e.target.value = ''
  }
  const onHeroCropApply = async (blob, outFileName) => {
    const heroId = posts[0]?.id; if (!heroId) return
    setHeroCrop(null)
    const path = `blog/${Date.now()}-${outFileName}`
    const { data, error: upErr } = await supabase.storage.from('watch-images').upload(path, blob, { upsert:true, contentType:'image/jpeg' })
    if (upErr) { alert('Upload failed: ' + upErr.message); return }
    const { data: urlData } = supabase.storage.from('watch-images').getPublicUrl(data.path)
    await supabase.from('blog_posts').update({ image_url: urlData.publicUrl }).eq('id', heroId)
    loadPosts()
  }

  /* edit-modal cover image upload */
  const onCoverFileSelect = (e) => {
    const file = e.target.files?.[0]; if (!file) return
    setCoverCrop({ src: URL.createObjectURL(file), fileName: file.name })
    e.target.value = ''
  }
  const onCoverCropApply = async (blob, outFileName) => {
    setUploadingCover(true); setCoverCrop(null)
    const path = `blog/${Date.now()}-${outFileName}`
    const { data, error: upErr } = await supabase.storage.from('watch-images').upload(path, blob, { upsert:true, contentType:'image/jpeg' })
    if (upErr) { alert('Upload failed: ' + upErr.message); setUploadingCover(false); return }
    const { data: urlData } = supabase.storage.from('watch-images').getPublicUrl(data.path)
    setEdit(prev => ({ ...prev, image_url: urlData.publicUrl }))
    setUploadingCover(false)
  }

  /* auto-fetch from RSS */
  const fetchLatest = async () => {
    setFetching(true); setFetchMsg('')
    try {
      const res  = await fetch('/api/fetch-journal', { method:'POST' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Unknown error')
      setFetchMsg(json.added > 0 ? `+${json.added} added` : 'Up to date')
      if (json.added > 0) loadPosts()
    } catch (err) { setFetchMsg('Error: ' + err.message) }
    finally { setFetching(false); setTimeout(() => setFetchMsg(''), 5000) }
  }

  /* CRUD */
  const openAdd  = () => { setEdit(EMPTY); setEditId(null); setError(''); setOpen(true) }
  const openEdit = (p) => {
    setEdit({ title:p.title, category:p.category||'Market Update', excerpt:p.excerpt||'',
      source_url:p.source_url||'', source:p.source||'', date:p.date||'',
      read_time:p.read_time||'5 min', image_url:p.image_url||'', is_published:p.is_published!==false })
    setEditId(p.id); setError(''); setOpen(true)
  }

  const handleSave = async () => {
    if (!edit.title || !edit.source_url) { setError('Title and source URL are required.'); return }
    setSaving(true); setError('')
    // Base payload without image_url — saves even if image_url column missing
    const base = {
      title: edit.title.trim(), category: edit.category, excerpt: edit.excerpt.trim(),
      source_url: edit.source_url.trim(), source: edit.source.trim(), date: edit.date,
      read_time: edit.read_time, is_published: edit.is_published,
      order_index: editId ? undefined : posts.length,
    }
    if (!editId) delete base.order_index // let it be set on insert only
    const payload = { ...base, order_index: editId ? undefined : posts.length }
    if (!editId) delete payload.order_index

    // Try with image_url first; fall back without it if column missing
    const withImg = { ...base, image_url: edit.image_url?.trim() || null, order_index: editId ? undefined : posts.length }
    if (!editId) withImg.order_index = posts.length
    if (editId) delete withImg.order_index

    const { error: err } = editId
      ? await supabase.from('blog_posts').update(withImg).eq('id', editId)
      : await supabase.from('blog_posts').insert(withImg)

    if (err && err.message?.includes('image_url')) {
      // image_url column not yet added — save without it
      const noImg = { ...base }
      if (!editId) noImg.order_index = posts.length
      const { error: err2 } = editId
        ? await supabase.from('blog_posts').update(noImg).eq('id', editId)
        : await supabase.from('blog_posts').insert(noImg)
      setSaving(false)
      if (err2) { setError(err2.message + '\n\nNote: Run the SQL to add image_url column — see admin instructions.'); return }
      setError('Saved (without image) — please add image_url column to enable images.')
      loadPosts(); return
    }

    setSaving(false)
    if (err) { setError(err.message); return }
    setOpen(false); loadPosts()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this article?')) return
    setDeleting(id)
    await supabase.from('blog_posts').delete().eq('id', id)
    setDeleting(null); loadPosts()
  }
  const togglePublish = async (p) => {
    await supabase.from('blog_posts').update({ is_published: !p.is_published }).eq('id', p.id)
    loadPosts()
  }

  /* owner guard */
  if (!isOwner) {
    return (
      <div style={{ padding:'1.5rem', maxWidth:'540px' }}>
        <style>{CSS}</style>
        <div style={{ background:'#fff', border:'1px solid #E8E2D8', borderRadius:'6px', padding:'2rem', textAlign:'center' }}>
          <Lock size={20} style={{ color:'#B08D57', marginBottom:'1rem' }} />
          <h2 style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'1rem', color:'#111', marginBottom:'0.5rem' }}>Owner Access Required</h2>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.82rem', color:'#888', lineHeight:1.7 }}>
            Signed in as: <strong>{user?.email}</strong>
          </p>
        </div>
      </div>
    )
  }

  const hero = posts[0]

  return (
    <>
      <style>{CSS}</style>
      <div className="ba-page">

        {/* Header */}
        <div className="ba-header">
          <div>
            <p style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#B08D57', marginBottom:'0.3rem' }}>Admin · Owner Only</p>
            <h1 style={{ fontFamily:'var(--sans)', fontWeight:800, fontSize:'1.6rem', letterSpacing:'-0.02em', color:'#111', margin:0 }}>Journal Articles</h1>
            <p style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', color:'#888', marginTop:'0.2rem' }}>{posts.length} articles</p>
          </div>
          <div className="ba-actions">
            {fetchMsg && (
              <span className="ba-fetch-msg" style={{ color: fetchMsg.startsWith('+') ? '#166534' : fetchMsg.startsWith('Up') ? '#555' : '#c0392b', background: fetchMsg.startsWith('+') ? '#dcfce7' : fetchMsg.startsWith('Up') ? '#f5f4f1' : '#fee2e2', border:`1px solid ${fetchMsg.startsWith('+') ? '#86efac' : fetchMsg.startsWith('Up') ? '#E8E2D8' : '#fca5a5'}` }}>
                {fetchMsg}
              </span>
            )}
            <button onClick={fetchLatest} disabled={fetching}
              style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'#fff', color:'#555', padding:'0.6rem 1rem', fontFamily:'var(--sans)', fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', border:'1px solid #D0CCC4', cursor:fetching?'not-allowed':'pointer', opacity:fetching?0.6:1, whiteSpace:'nowrap' }}>
              <Upload size={12}/> {fetching ? 'Fetching…' : 'Fetch Latest'}
            </button>
            <button onClick={openAdd}
              style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'#B08D57', color:'#fff', padding:'0.65rem 1.1rem', fontFamily:'var(--sans)', fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', border:'none', cursor:'pointer', whiteSpace:'nowrap' }}>
              <Plus size={13}/> Add Article
            </button>
          </div>
        </div>


        {/* Featured hero preview */}
        {!loading && hero && (
          <div style={{ marginBottom:'1.5rem', border:'1px solid #E8E2D8', borderRadius:'6px', overflow:'hidden' }}>
            <div className="ba-hero-bar">
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap' }}>
                <span style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase', fontWeight:700, color:'#B08D57' }}>Featured Article</span>
                <span style={{ fontFamily:'var(--sans)', fontSize:'0.62rem', color:'#bbb' }}>· hero on public Journal page</span>
              </div>
              <button onClick={() => openEdit(hero)}
                style={{ fontFamily:'var(--sans)', fontSize:'0.7rem', color:'#555', border:'1px solid #E0DDD8', background:'#fff', padding:'0.3rem 0.75rem', borderRadius:'3px', cursor:'pointer', whiteSpace:'nowrap' }}>
                Edit Article
              </button>
            </div>
            <div className="ba-hero-grid">
              <label style={{ display:'block', cursor:'pointer', position:'relative', background:'#111', minHeight:'180px', overflow:'hidden' }}>
                {hero.image_url ? (
                  <>
                    <img src={hero.image_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', position:'absolute', inset:0, opacity:0.75 }} />
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0)', opacity:0, transition:'opacity 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.opacity=1} onMouseLeave={e => e.currentTarget.style.opacity=0}>
                      <div style={{ background:'rgba(0,0,0,0.6)', padding:'0.5rem 1rem', borderRadius:'4px', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                        <Upload size={13} style={{ color:'#fff' }}/>
                        <span style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#fff', fontWeight:600 }}>Replace Image</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.75rem' }}>
                    <span style={{ fontFamily:'var(--sans)', fontWeight:900, fontSize:'2.5rem', color:'#1A1A1A', letterSpacing:'-0.04em', userSelect:'none' }}>GWG</span>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', background:'rgba(176,141,87,0.15)', border:'1px solid #B08D57', borderRadius:'4px', padding:'0.4rem 0.9rem' }}>
                      <Upload size={12} style={{ color:'#B08D57' }}/>
                      <span style={{ fontFamily:'var(--sans)', fontSize:'0.7rem', color:'#B08D57', fontWeight:600 }}>Click to add image</span>
                    </div>
                  </div>
                )}
                <input type="file" accept="image/*" style={{ display:'none' }} onChange={onHeroFileSelect} />
              </label>
              <div className="ba-hero-text">
                <span style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#B08D57', display:'block', marginBottom:'0.6rem' }}>Featured · {hero.category}</span>
                <p style={{ fontFamily:'var(--sans)', fontWeight:800, fontSize:'0.95rem', letterSpacing:'-0.01em', textTransform:'uppercase', color:'#fff', lineHeight:1.2, marginBottom:'0.6rem' }}>{hero.title}</p>
                {hero.excerpt && (
                  <p style={{ fontFamily:'var(--sans)', fontSize:'0.73rem', color:'#999', lineHeight:1.6, marginBottom:'0.75rem' }}>
                    {hero.excerpt.length > 120 ? hero.excerpt.slice(0, 120) + '…' : hero.excerpt}
                  </p>
                )}
                <span style={{ fontFamily:'var(--sans)', fontSize:'0.63rem', color:'#555' }}>{hero.date} · {hero.source}</span>
              </div>
            </div>
          </div>
        )}

        {/* Article list */}
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'4rem' }}>
            <Spinner size={24} style={{ color:'#B08D57', animation:'spin 1s linear infinite' }} />
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign:'center', padding:'3rem', background:'#fff', border:'1px solid #E8E2D8', fontFamily:'var(--sans)', fontSize:'0.85rem', color:'#bbb' }}>
            No articles yet. Add your first journal entry above.
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
            {posts.map(p => (
              <div key={p.id} className="ba-row">
                {/* Thumbnail — only show if image exists */}
                {p.image_url && (
                  <div style={{ width:'52px', height:'52px', flexShrink:0, borderRadius:'2px', overflow:'hidden', background:'#f5f4f1' }}>
                    <img src={p.image_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </div>
                )}
                <div className="ba-row-meta">
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.3rem', flexWrap:'wrap' }}>
                    <span style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.15rem 0.5rem', background:'#F4EFE9', color:'#B08D57', borderRadius:'999px' }}>{p.category}</span>
                    <span style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.15rem 0.5rem', background:p.is_published?'#dcfce7':'#f1f5f9', color:p.is_published?'#166534':'#64748b', borderRadius:'999px' }}>
                      {p.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.88rem', color:'#111', marginBottom:'0.2rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.title}</p>
                  <p style={{ fontFamily:'var(--sans)', fontSize:'0.73rem', color:'#999' }}>{p.date} · {p.source} · {p.read_time}</p>
                </div>
                <div className="ba-row-actions">
                  <a href={p.source_url} target="_blank" rel="noopener noreferrer" className="ba-btn-src"
                    style={{ padding:'0.4rem', border:'1px solid #E8E2D8', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', color:'#999' }}>
                    <ExternalLink size={13}/>
                  </a>
                  <button onClick={() => togglePublish(p)}
                    style={{ padding:'0.4rem 0.65rem', border:'1px solid #E8E2D8', background:'#fff', cursor:'pointer', fontFamily:'var(--sans)', fontSize:'0.68rem', color:'#555', whiteSpace:'nowrap' }}>
                    {p.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => openEdit(p)}
                    style={{ padding:'0.4rem 0.65rem', border:'1px solid #E8E2D8', background:'#fff', cursor:'pointer', fontFamily:'var(--sans)', fontSize:'0.68rem', display:'flex', alignItems:'center', gap:'0.3rem', color:'#444' }}>
                    <Pencil size={11}/> Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)} disabled={deleting===p.id}
                    style={{ padding:'0.4rem 0.65rem', border:'1px solid #fca5a5', background:'#fff', cursor:'pointer', fontFamily:'var(--sans)', fontSize:'0.68rem', display:'flex', alignItems:'center', gap:'0.3rem', color:'#dc2626' }}>
                    {deleting===p.id ? <Spinner size={11} style={{ animation:'spin 1s linear infinite' }}/> : <Trash2 size={11}/>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}


        {/* Edit / Add modal */}
        {open && (
          <div className="ba-modal-bg" onClick={e => { if (e.target===e.currentTarget) setOpen(false) }}>
            <div className="ba-modal-wrap">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 1.25rem', borderBottom:'1px solid #F4EFE9' }}>
                <h2 style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'1rem', color:'#111', margin:0 }}>{editId ? 'Edit Article' : 'Add Article'}</h2>
                <button onClick={() => setOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#999', padding:'0.25rem' }}><X size={18}/></button>
              </div>
              <div className="ba-modal-pad">
                {error && (
                  <div style={{ background:'#fee2e2', padding:'0.6rem 0.85rem', fontFamily:'var(--sans)', fontSize:'0.78rem', color:'#dc2626', borderRadius:'2px', whiteSpace:'pre-line' }}>{error}</div>
                )}

                {/* Cover Image */}
                <div style={{ border:'1px solid #E8E2D8', borderRadius:'4px', overflow:'hidden', background:'#FAFAF8' }}>
                  <div style={{ padding:'0.5rem 0.9rem', borderBottom:'1px solid #F0EDE8', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'#777', fontWeight:600 }}>Cover Image</span>
                    <span style={{ fontFamily:'var(--sans)', fontSize:'0.62rem', color:'#B08D57', fontWeight:600 }}>optional</span>
                  </div>
                  <label style={{ display:'block', cursor: uploadingCover ? 'not-allowed' : 'pointer', opacity: uploadingCover ? 0.7 : 1 }}>
                    {uploadingCover ? (
                      <div style={{ height:'100px', display:'flex', alignItems:'center', justifyContent:'center', background:'#f5f4f1' }}>
                        <p style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', color:'#B08D57', margin:0 }}>Uploading…</p>
                      </div>
                    ) : edit.image_url ? (
                      <div style={{ position:'relative', height:'140px', background:'#f0ede8', overflow:'hidden' }}>
                        <img src={edit.image_url} alt="Cover" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.35)', display:'flex', alignItems:'center', justifyContent:'center', opacity:0, transition:'opacity 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.opacity=1} onMouseLeave={e => e.currentTarget.style.opacity=0}>
                          <span style={{ background:'rgba(0,0,0,0.6)', color:'#fff', padding:'0.35rem 0.85rem', borderRadius:'4px', fontFamily:'var(--sans)', fontSize:'0.72rem', fontWeight:600 }}>Click to replace</span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ height:'100px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.4rem', background:'#f5f4f1' }}>
                        <Upload size={20} style={{ color:'#B08D57' }}/>
                        <p style={{ fontFamily:'var(--sans)', fontSize:'0.76rem', color:'#888', margin:0 }}>Click to upload cover image</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" style={{ display:'none' }} onChange={onCoverFileSelect} disabled={uploadingCover} />
                  </label>
                  {edit.image_url && !uploadingCover && (
                    <div style={{ padding:'0.4rem 0.7rem', borderTop:'1px solid #F0EDE8', display:'flex', gap:'0.5rem' }}>
                      <label style={{ display:'inline-flex', alignItems:'center', gap:'0.35rem', padding:'0.28rem 0.65rem', border:'1px solid #E0DDD8', borderRadius:'3px', cursor:'pointer', fontFamily:'var(--sans)', fontSize:'0.67rem', color:'#555' }}>
                        <Upload size={10}/> Replace
                        <input type="file" accept="image/*" style={{ display:'none' }} onChange={onCoverFileSelect}/>
                      </label>
                      <button onClick={e => { e.preventDefault(); setEdit(prev => ({ ...prev, image_url:'' })) }}
                        style={{ display:'inline-flex', alignItems:'center', gap:'0.35rem', padding:'0.28rem 0.65rem', border:'1px solid #fca5a5', borderRadius:'3px', cursor:'pointer', background:'#fff', fontFamily:'var(--sans)', fontSize:'0.67rem', color:'#dc2626' }}>
                        <X size={10}/> Remove
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label style={lbl}>Title *</label>
                  <input style={inp} value={edit.title} onChange={e => setEdit(p => ({ ...p, title:e.target.value }))} placeholder="Article title" />
                </div>
                <div className="ba-form-2col">
                  <div>
                    <label style={lbl}>Category</label>
                    <select style={inp} value={edit.category} onChange={e => setEdit(p => ({ ...p, category:e.target.value }))}>
                      {CATS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Source Name</label>
                    <input style={inp} value={edit.source} onChange={e => setEdit(p => ({ ...p, source:e.target.value }))} placeholder="e.g. WatchPro" />
                  </div>
                </div>
                <div>
                  <label style={lbl}>Source URL *</label>
                  <input style={inp} value={edit.source_url} onChange={e => setEdit(p => ({ ...p, source_url:e.target.value }))} placeholder="https://..." />
                </div>
                <div>
                  <label style={lbl}>Excerpt</label>
                  <textarea style={{ ...inp, minHeight:'72px', resize:'vertical' }} value={edit.excerpt} onChange={e => setEdit(p => ({ ...p, excerpt:e.target.value }))} placeholder="Short summary…" />
                </div>
                <div className="ba-form-2col">
                  <div>
                    <label style={lbl}>Date</label>
                    <input style={inp} value={edit.date} onChange={e => setEdit(p => ({ ...p, date:e.target.value }))} placeholder="e.g. Jan 2026" />
                  </div>
                  <div>
                    <label style={lbl}>Read Time</label>
                    <input style={inp} value={edit.read_time} onChange={e => setEdit(p => ({ ...p, read_time:e.target.value }))} placeholder="e.g. 5 min" />
                  </div>
                </div>
                <label style={{ display:'flex', alignItems:'center', gap:'0.6rem', cursor:'pointer' }}>
                  <input type="checkbox" checked={edit.is_published} onChange={e => setEdit(p => ({ ...p, is_published:e.target.checked }))} style={{ width:'16px', height:'16px', accentColor:'#B08D57' }} />
                  <span style={{ fontFamily:'var(--sans)', fontSize:'0.82rem', color:'#444' }}>Published (visible on site)</span>
                </label>
              </div>
              <div className="ba-modal-footer">
                <button onClick={() => setOpen(false)}
                  style={{ padding:'0.65rem 1.1rem', border:'1px solid #E8E2D8', background:'#fff', cursor:'pointer', fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#666' }}>
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  style={{ padding:'0.65rem 1.4rem', background:'#B08D57', color:'#fff', border:'none', cursor:'pointer', fontFamily:'var(--sans)', fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', display:'flex', alignItems:'center', gap:'0.4rem', opacity:saving?0.7:1 }}>
                  {saving ? <><Spinner size={12} style={{ animation:'spin 1s linear infinite' }}/> Saving…</> : (editId ? 'Save Changes' : 'Add Article')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Crop modals */}
        {coverCrop && (
          <ImageCropModal src={coverCrop.src} fileName={coverCrop.fileName} aspectRatio={16/9}
            onApply={onCoverCropApply} onCancel={() => setCoverCrop(null)} />
        )}
        {heroCrop && (
          <ImageCropModal src={heroCrop.src} fileName={heroCrop.fileName} aspectRatio={16/9}
            onApply={onHeroCropApply} onCancel={() => setHeroCrop(null)} />
        )}
      </div>
    </>
  )
}
