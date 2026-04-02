'use client'
import Spinner from '@/components/Spinner'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, X, Save, Trash2, Camera, Loader } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const COND = ['new','unworn','excellent','good','fair']
const EMPTY = { brand:'', model:'', reference:'', price:'', condition:'excellent', year: new Date().getFullYear(), description:'', features:'', is_featured:false, is_sold:false, images:[] }

const inp = { width:'100%', padding:'0.65rem 0.85rem', fontFamily:'var(--sans)', fontSize:'0.82rem', border:'1px solid #E8E2D8', background:'#fff', outline:'none', borderRadius:'2px', color:'#111' }
const lbl = { fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#777', display:'block', marginBottom:'0.4rem' }
const section = { background:'#fff', border:'1px solid #E8E2D8', borderRadius:'2px', padding:'1.75rem', marginBottom:'1.25rem' }
const sTitle = { fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.85rem', color:'#111', marginBottom:'1.25rem', paddingBottom:'0.75rem', borderBottom:'1px solid #F4EFE9' }

export default function WatchEditPage() {
  const { id }   = useParams()
  const router   = useRouter()
  const isNew    = id === 'new'
  const [form, setForm]       = useState(EMPTY)
  const [loading, setLoading] = useState(!isNew)
  const [saving,  setSaving]  = useState(false)
  const [uploading, setUploading]   = useState(false)
  const [error, setError]           = useState('')
  const [toast, setToast]           = useState('')
  const [stockFetching, setStockFetching] = useState(false)
  const [stockPreview, setStockPreview]   = useState(null) // { imageUrl }
  const [stockError, setStockError]       = useState('')

  useEffect(() => {
    if (isNew) return
    supabase.from('watches').select('*').eq('id', id).single().then(({ data }) => {
      if (data) setForm({ ...data, features: Array.isArray(data.features) ? data.features.join(', ') : (data.features||'') })
      setLoading(false)
    })
  }, [id, isNew])

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    const urls = []
    for (const file of files) {
      const ext  = file.name.split('.').pop()
      const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: upErr } = await supabase.storage.from('watch-images').upload(name, file)
      if (!upErr) {
        const { data: urlData } = supabase.storage.from('watch-images').getPublicUrl(name)
        urls.push(urlData.publicUrl)
      }
    }
    set('images', [...(form.images||[]), ...urls])
    setUploading(false)
  }

  const removeImage = (idx) => set('images', form.images.filter((_,i) => i !== idx))

  const handleFindStockPhoto = async () => {
    if (!form.brand || !form.reference) {
      setStockError('Please enter Brand and Reference Number first.')
      return
    }
    setStockFetching(true)
    setStockError('')
    setStockPreview(null)
    try {
      const res = await fetch(
        `/api/stock-photo?brand=${encodeURIComponent(form.brand)}&reference=${encodeURIComponent(form.reference)}&model=${encodeURIComponent(form.model)}`
      )
      const data = await res.json()
      if (data.imageUrl) {
        setStockPreview(data)
      } else {
        setStockError(data.error || 'No official image found.')
      }
    } catch {
      setStockError('Failed to connect. Please try again.')
    } finally {
      setStockFetching(false)
    }
  }

  const handleUseStockPhoto = async () => {
    if (!stockPreview?.imageUrl) return
    setUploading(true)
    try {
      // Try to download and re-upload to Supabase Storage for permanence
      const res = await fetch(stockPreview.imageUrl)
      if (!res.ok) throw new Error('fetch failed')
      const blob = await res.blob()
      const ext  = blob.type.includes('png') ? 'png' : 'jpg'
      const name = `stock-${form.brand.replace(/\s+/g,'-').toLowerCase()}-${form.reference.replace(/\s+/g,'-')}-${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('watch-images').upload(name, blob, { contentType: blob.type })
      if (upErr) throw upErr
      const { data: urlData } = supabase.storage.from('watch-images').getPublicUrl(name)
      set('images', [...(form.images||[]), urlData.publicUrl])
    } catch {
      // Fallback: store brand CDN URL directly
      set('images', [...(form.images||[]), stockPreview.imageUrl])
    } finally {
      setStockPreview(null)
      setStockError('')
      setUploading(false)
      setToast('Stock photo added!')
      setTimeout(() => setToast(''), 2000)
    }
  }

  const handleSave = async () => {
    if (!form.brand || !form.model) { setError('Brand and model are required.'); return }
    setSaving(true); setError('')
    const payload = {
      brand:       form.brand.trim(),
      model:       form.model.trim(),
      reference:   form.reference?.trim() || null,
      price:       parseFloat(form.price) || null,
      condition:   form.condition || 'excellent',
      year:        parseInt(form.year) || null,
      description: form.description?.trim() || null,
      features:    form.features ? form.features.split(',').map(f=>f.trim()).filter(Boolean) : [],
      images:      form.images || [],
      is_featured: Boolean(form.is_featured),
      is_sold:     Boolean(form.is_sold),
      updated_at:  new Date().toISOString(),
    }
    let err
    if (isNew) {
      ;({ error: err } = await supabase.from('watches').insert(payload))
    } else {
      ;({ error: err } = await supabase.from('watches').update(payload).eq('id', id))
    }
    setSaving(false)
    if (err) { setError(err.message); return }
    setToast(isNew ? 'Watch added!' : 'Changes saved!')
    setTimeout(() => setToast(''), 2500)
    if (isNew) router.replace('/admin/collection')
  }

  const handleDelete = async () => {
    if (!confirm('Delete this watch? This cannot be undone.')) return
    await supabase.from('watches').delete().eq('id', id)
    router.replace('/admin/collection')
  }

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', padding:'6rem' }}>
      <Spinner size={24} style={{ color:'#B08D57', animation:'spin 1s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ padding:'2.5rem 2.5rem 4rem', maxWidth:'860px' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', top:'1.5rem', right:'1.5rem', zIndex:999, background:'#166534', color:'#fff', padding:'0.75rem 1.25rem', fontFamily:'var(--sans)', fontSize:'0.8rem', borderRadius:'4px', boxShadow:'0 4px 12px rgba(0,0,0,0.15)' }}>
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom:'2rem' }}>
        <Link href="/admin/collection" style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#999', textDecoration:'none', marginBottom:'1rem' }}>
          <ArrowLeft size={13} /> Back to Collection
        </Link>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h1 style={{ fontFamily:'var(--sans)', fontWeight:800, fontSize:'1.5rem', letterSpacing:'-0.02em', color:'#111' }}>
            {isNew ? 'Add New Watch' : `Edit: ${form.brand} ${form.model}`}
          </h1>
          {!isNew && (
            <button onClick={handleDelete} style={{ display:'flex', alignItems:'center', gap:'0.4rem', padding:'0.5rem 1rem', border:'1px solid #fca5a5', background:'#fff', cursor:'pointer', fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#dc2626' }}>
              <Trash2 size={13} /> Delete Watch
            </button>
          )}
        </div>
      </div>

      {error && <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', padding:'0.75rem 1rem', marginBottom:'1rem', fontFamily:'var(--sans)', fontSize:'0.8rem', color:'#dc2626', borderRadius:'2px' }}>{error}</div>}

      {/* Images */}
      <div style={section}>
        <p style={sTitle}>Watch Images</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.75rem', marginBottom:'1rem' }}>
          {(form.images||[]).map((url,i) => (
            <div key={i} style={{ position:'relative', width:'100px', height:'100px' }}>
              <img src={url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', border:'1px solid #E8E2D8' }} />
              <button onClick={() => removeImage(i)} style={{ position:'absolute', top:'-6px', right:'-6px', width:'20px', height:'20px', borderRadius:'50%', background:'#dc2626', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <X size={10} style={{ color:'#fff' }} />
              </button>
            </div>
          ))}
          <label style={{ width:'100px', height:'100px', border:'2px dashed #E8E2D8', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer', gap:'0.4rem', background:'#FDFAF7' }}>
            {uploading ? <Spinner size={18} style={{ color:'#B08D57', animation:'spin 1s linear infinite' }} />
              : <><Upload size={18} style={{ color:'#ccc' }} /><span style={{ fontFamily:'var(--sans)', fontSize:'0.62rem', color:'#bbb', letterSpacing:'0.1em', textTransform:'uppercase' }}>Upload</span></>}
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display:'none' }} />
          </label>
        </div>
        {/* Stock Photo Finder */}
        <div style={{ marginTop:'1rem', paddingTop:'1rem', borderTop:'1px solid #F4EFE9' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
            <button
              type="button"
              onClick={handleFindStockPhoto}
              disabled={stockFetching || uploading}
              style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.6rem 1.1rem', background:'#0A0A0A', color:'#fff', border:'none', cursor: stockFetching ? 'not-allowed' : 'pointer', fontFamily:'var(--sans)', fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', opacity: stockFetching ? 0.7 : 1, borderRadius:'2px' }}
            >
              {stockFetching
                ? <><Loader size={13} style={{ animation:'spin 1s linear infinite' }} /> Searching…</>
                : <><Camera size={13} /> Use Stock Photo</>
              }
            </button>
            <p style={{ fontFamily:'var(--sans)', fontSize:'0.7rem', color:'#aaa', margin:0 }}>
              Auto-fetches the official product image from the brand&apos;s website using the Brand + Reference you entered.
            </p>
          </div>

          {stockError && (
            <p style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#dc2626', marginTop:'0.6rem' }}>{stockError}</p>
          )}

          {stockPreview && (
            <div style={{ marginTop:'1rem', display:'flex', alignItems:'flex-start', gap:'1.25rem', background:'#FDFAF7', border:'1px solid #E8E2D8', padding:'1rem', borderRadius:'2px' }}>
              <img
                src={stockPreview.imageUrl}
                alt="Stock photo preview"
                style={{ width:'120px', height:'120px', objectFit:'contain', background:'#fff', border:'1px solid #E8E2D8', flexShrink:0 }}
              />
              <div>
                <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.8rem', color:'#111', marginBottom:'0.3rem' }}>
                  Official image found
                </p>
                <p style={{ fontFamily:'var(--sans)', fontSize:'0.7rem', color:'#888', marginBottom:'0.75rem', wordBreak:'break-all' }}>
                  Source: {stockPreview.brand} — {stockPreview.reference}
                </p>
                <div style={{ display:'flex', gap:'0.5rem' }}>
                  <button
                    type="button"
                    onClick={handleUseStockPhoto}
                    disabled={uploading}
                    style={{ padding:'0.5rem 1rem', background:'#B08D57', color:'#fff', border:'none', cursor:'pointer', fontFamily:'var(--sans)', fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', borderRadius:'2px', opacity: uploading ? 0.7 : 1 }}
                  >
                    {uploading ? 'Saving…' : 'Use This Photo'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStockPreview(null); setStockError('') }}
                    style={{ padding:'0.5rem 0.85rem', background:'transparent', color:'#888', border:'1px solid #E8E2D8', cursor:'pointer', fontFamily:'var(--sans)', fontSize:'0.7rem', borderRadius:'2px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <p style={{ fontFamily:'var(--sans)', fontSize:'0.7rem', color:'#bbb', marginTop:'0.75rem' }}>Upload your own images or use the stock photo finder above. First image is the main display photo.</p>
      </div>

      {/* Basic info */}
      <div style={section}>
        <p style={sTitle}>Basic Information</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
          {[['Brand *','brand','e.g. Rolex'],['Model *','model','e.g. Submariner Date']].map(([l,k,ph]) => (
            <div key={k}><label style={lbl}>{l}</label><input style={inp} value={form[k]||''} placeholder={ph} onChange={e=>set(k,e.target.value)} /></div>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
          <div><label style={lbl}>Reference</label><input style={inp} value={form.reference||''} placeholder="e.g. 126610LN" onChange={e=>set('reference',e.target.value)} /></div>
          <div><label style={lbl}>Price (MYR)</label><input style={inp} type="number" value={form.price||''} placeholder="e.g. 65000" onChange={e=>set('price',e.target.value)} /></div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
          <div>
            <label style={lbl}>Condition</label>
            <select style={inp} value={form.condition} onChange={e=>set('condition',e.target.value)}>
              {COND.map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Year</label><input style={inp} type="number" value={form.year||''} placeholder="e.g. 2023" onChange={e=>set('year',e.target.value)} /></div>
        </div>
      </div>

      {/* Details */}
      <div style={section}>
        <p style={sTitle}>Description & Details</p>
        <div style={{ marginBottom:'1rem' }}>
          <label style={lbl}>Description</label>
          <textarea style={{ ...inp, minHeight:'100px', resize:'vertical' }} value={form.description||''} placeholder="Detailed description of this timepiece…" onChange={e=>set('description',e.target.value)} />
        </div>
        <div>
          <label style={lbl}>Includes / Features (comma-separated)</label>
          <input style={inp} value={form.features||''} placeholder="e.g. Box & Papers, Service History, Ceramic Bezel" onChange={e=>set('features',e.target.value)} />
        </div>
      </div>

      {/* Status */}
      <div style={section}>
        <p style={sTitle}>Listing Status</p>
        <div style={{ display:'flex', gap:'2rem', flexWrap:'wrap' }}>
          {[['is_featured','⭐ Feature on Homepage'],['is_sold','Mark as Sold']].map(([k,lbl2]) => (
            <label key={k} style={{ display:'flex', alignItems:'center', gap:'0.6rem', cursor:'pointer' }}>
              <input type="checkbox" checked={!!form[k]} onChange={e=>set(k,e.target.checked)} style={{ width:'16px', height:'16px', accentColor:'#B08D57', cursor:'pointer' }} />
              <span style={{ fontFamily:'var(--sans)', fontSize:'0.82rem', color:'#444' }}>{lbl2}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Save */}
      <button onClick={handleSave} disabled={saving} style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'#B08D57', color:'#fff', padding:'0.85rem 2rem', border:'none', cursor:'pointer', fontFamily:'var(--sans)', fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', opacity: saving?0.7:1 }}>
        {saving ? <><Spinner size={14} style={{ animation:'spin 1s linear infinite' }} /> Saving…</> : <><Save size={14} /> {isNew ? 'Add Watch' : 'Save Changes'}</>}
      </button>
    </div>
  )
}
