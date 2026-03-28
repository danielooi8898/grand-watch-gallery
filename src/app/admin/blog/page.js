'use client'
import Spinner from '@/components/Spinner'
import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, X, ExternalLink, Lock, Upload } from 'lucide-react'
import ImageCropModal from '@/components/ImageCropModal'
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
  const [cropData, setCropData] = useState(null)
  const [quickCrop, setQuickCrop] = useState(null) // { src, fileName, articleId }

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('blog_posts').select('*').order('order_index', { ascending: true })
    setPosts(data || [])
    setLoading(false)
  }, [])
  useEffect(() => { fetch() }, [fetch])

  const onQuickImageSelect = (e, articleId) => {
    const file = e.target.files?.[0]
    if (!file) return
    setQuickCrop({ src: URL.createObjectURL(file), fileName: file.name, articleId })
    e.target.value = ''
  }

  const onQuickCropApply = async (blob, outFileName) => {
    const { articleId } = quickCrop
    setQuickCrop(null)
    const path = `blog/${Date.now()}-${outFileName}`
    const { data, error: upErr } = await supabase.storage.from('watch-images').upload(path, blob, { upsert: true, contentType: 'image/jpeg' })
    if (upErr) { alert('Upload failed: ' + upErr.message); return }
    const { data: urlData } = supabase.storage.from('watch-images').getPublicUrl(data.path)
    await supabase.from('blog_posts').update({ image_url: urlData.publicUrl }).eq('id', articleId)
    fetch()
  }

  const onCoverFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCropData({ src: URL.createObjectURL(file), fileName: file.name })
    e.target.value = ''
  }

  const onCoverCropApply = async (blob, outFileName) => {
    setUploadingCover(true)
    setCropData(null)
    const path = `blog/${Date.now()}-${outFileName}`
    const { data, error: upErr } = await supabase.storage.from('watch-images').upload(path, blob, { upsert: true, contentType: 'image/jpeg' })
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

      {/* ── Featured Article Hero Preview ── */}
      {!loading && posts.length > 0 && (() => {
        const hero = posts[0]
        return (
          <div style={{ marginBottom:'2rem', border:'1px solid #E8E2D8', borderRadius:'6px', overflow:'hidden', background:'#fff' }}>
            <div style={{ padding:'0.75rem 1.25rem', borderBottom:'1px solid #F0EDE8', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#FAFAF8' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                <span style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase', fontWeight:700, color:'#B08D57' }}>Featured Article</span>
                <span style={{ fontFamily:'var(--sans)', fontSize:'0.65rem', color:'#bbb' }}>· First article in list · shown as hero on public Journal page</span>
              </div>
              <button onClick={() => openEdit(hero)} style={{ fontFamily:'var(--sans)', fontSize:'0.7rem', color:'#555', border:'1px solid #E0DDD8', background:'#fff', padding:'0.3rem 0.75rem', borderRadius:'3px', cursor:'pointer' }}>
                Edit Article
              </button>
            </div>
            {/* Hero preview */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:'200px' }}>
              {/* Left: image zone — click to change */}
              <label style={{ display:'block', cursor:'pointer', position:'relative', background:'#111', minHeight:'200px', overflow:'hidden' }} title="Click to change featured image">
                {hero.image_url ? (
                  <>
                    <img src={hero.image_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', position:'absolute', inset:0, opacity:0.7 }} />
                    <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0)', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', flexDirection:'column', opacity:0, transition:'opacity 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.opacity=1}
                      onMouseLeave={e => e.currentTarget.style.opacity=0}>
                      <Upload size={20} style={{ color:'#fff' }} />
                      <span style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#fff', fontWeight:600 }}>Replace Image</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.75rem' }}>
                      <span style={{ fontFamily:'var(--sans)', fontWeight:900, fontSize:'3rem', color:'#1A1A1A', letterSpacing:'-0.04em', userSelect:'none' }}>GWG</span>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'rgba(176,141,87,0.15)', border:'1px solid #B08D57', borderRadius:'4px', padding:'0.4rem 0.9rem' }}>
                        <Upload size={13} style={{ color:'#B08D57' }} />
                        <span style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#B08D57', fontWeight:600 }}>Click to add featured image</span>
                      </div>
                    </div>
                  </>
                )}
                <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => onQuickImageSelect(e, hero.id)} />
              </label>
              {/* Right: article info */}
              <div style={{ padding:'2rem', background:'#111', display:'flex', flexDirection:'column', justifyContent:'center', borderLeft:'1px solid #1A1A1A' }}>
                <span style={{ fontFamily:'var(--sans)', fontSize:'0.65rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#B08D57', display:'block', marginBottom:'0.75rem' }}>Featured · {hero.category}</span>
                <p style={{ fontFamily:'var(--sans)', fontWeight:800, fontSize:'1rem', letterSpacing:'-0.01em', textTransform:'uppercase', color:'#fff', lineHeight:1.2, marginBottom:'0.75rem' }}>{hero.title}</p>
                <p style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#999', lineHeight:1.6, marginBottom:'1rem' }}>{hero.excerpt?.slice(0, 100)}{hero.excerpt?.length > 100 ? '…' : ''}</p>
                <span style={{ fontFamily:'var(--sans)', fontSize:'0.65rem', color:'#555' }}>{hero.date} · {hero.source}</span>
              </div>
            </div>
          </div>
        )
      })()}

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
              {/* Clickable image thumbnail — always visible, click to change */}
              <label title="Click to change cover image" style={{ width:'64px', height:'64px', flexShrink:0, borderRadius:'3px', overflow:'hidden', background:'#f5f4f1', cursor:'pointer', display:'block', position:'relative', border:'1px solid #E8E2D8' }}>
                {p.image_url ? (
                  <>
                    <img src={p.image_url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                    <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', opacity:0, transition:'opacity 0.18s' }}
                      onMouseEnter={e => e.currentTarget.style.opacity=1}
                      onMouseLeave={e => e.currentTarget.style.opacity=0}>
                      <Upload size={14} style={{ color:'#fff' }} />
                    </div>
                  </>
                ) : (
                  <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'2px', border:'1.5px dashed #D4CEC6', borderRadius:'3px' }}>
                    <Upload size={13} style={{ color:'#B08D57' }} />
                    <span style={{ fontFamily:'var(--sans)', fontSize:'0.48rem', letterSpacing:'0.08em', textTransform:'uppercase', color:'#B08D57', fontWeight:700 }}>Add</span>
                  </div>
                )}
                <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => onQuickImageSelect(e, p.id)} />
              </label>
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


              {/* ── Cover Image upload ── */}
              <div style={{ border:'1px solid #E8E2D8', borderRadius:'4px', overflow:'hidden', background:'#FAFAF8' }}>
                <div style={{ padding:'0.6rem 1rem', borderBottom:'1px solid #F0EDE8', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontFamily:'var(--sans)', fontSize:'0.62rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'#777', fontWeight:600 }}>Cover Image</span>
                  <span style={{ fontFamily:'var(--sans)', fontSize:'0.65rem', color:'#B08D57', fontWeight:600 }}>optional</span>
                </div>
                <label style={{ display:'block', cursor: uploadingCover ? 'not-allowed' : 'pointer', opacity: uploadingCover ? 0.7 : 1 }}>
                  {uploadingCover ? (
                    <div style={{ height:'120px', display:'flex', alignItems:'center', justifyContent:'center', background:'#f5f4f1' }}>
                      <p style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', color:'#B08D57' }}>Uploading…</p>
                    </div>
                  ) : edit.image_url ? (
                    <div style={{ position:'relative', height:'160px', background:'#f0ede8', overflow:'hidden' }}>
                      <img src={edit.image_url} alt="Cover" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.35)', display:'flex', alignItems:'center', justifyContent:'center', opacity:0, transition:'opacity 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.opacity=1}
                        onMouseLeave={e => e.currentTarget.style.opacity=0}>
                        <span style={{ background:'rgba(0,0,0,0.6)', color:'#fff', padding:'0.4rem 0.9rem', borderRadius:'4px', fontFamily:'var(--sans)', fontSize:'0.72rem', fontWeight:600 }}>Click to replace</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ height:'120px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.5rem', background:'#f5f4f1' }}>
                      <Upload size={22} style={{ color:'#B08D57' }} />
                      <p style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', color:'#888', margin:0 }}>Click to upload cover image</p>
                      <p style={{ fontFamily:'var(--sans)', fontSize:'0.65rem', color:'#bbb', margin:0 }}>You can crop and adjust after selecting</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" style={{ display:'none' }} onChange={onCoverFileSelect} disabled={uploadingCover} />
                </label>
                {edit.image_url && !uploadingCover && (
                  <div style={{ padding:'0.5rem 0.75rem', borderTop:'1px solid #F0EDE8', display:'flex', gap:'0.5rem' }}>
                    <label style={{ display:'inline-flex', alignItems:'center', gap:'0.35rem', padding:'0.3rem 0.7rem', border:'1px solid #E0DDD8', borderRadius:'3px', cursor:'pointer', fontFamily:'var(--sans)', fontSize:'0.68rem', color:'#555' }}>
                      <Upload size={11}/> Replace
                      <input type="file" accept="image/*" style={{ display:'none' }} onChange={onCoverFileSelect} />
                    </label>
                    <button onClick={e => { e.preventDefault(); setEdit(p => ({ ...p, image_url:'' })) }}
                      style={{ display:'inline-flex', alignItems:'center', gap:'0.35rem', padding:'0.3rem 0.7rem', border:'1px solid #fca5a5', borderRadius:'3px', cursor:'pointer', background:'#fff', fontFamily:'var(--sans)', fontSize:'0.68rem', color:'#dc2626' }}>
                      <X size={10}/> Remove
                    </button>
                  </div>
                )}
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

      {cropData && (
        <ImageCropModal
          src={cropData.src}
          fileName={cropData.fileName}
          aspectRatio={16/9}
          onApply={onCoverCropApply}
          onCancel={() => setCropData(null)}
        />
      )}

      {quickCrop && (
        <ImageCropModal
          src={quickCrop.src}
          fileName={quickCrop.fileName}
          aspectRatio={16/9}
          onApply={onQuickCropApply}
          onCancel={() => setQuickCrop(null)}
        />
      )}
    </div>
  )
}
