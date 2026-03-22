'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { X, Upload, Trash2 } from 'lucide-react'

const BLANK = { brand:'', model:'', ref:'', price:'', type:'Sport', year:'', condition:'Excellent', tag:'In Stock', description:'', image_url:'' }

export default function ListingModal({ watch = null, onClose, onSaved }) {
  const [form,      setForm]      = useState(watch ? { ...watch, price: watch.price?.toString() } : { ...BLANK })
  const [uploading, setUploading] = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState('')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  // Upload image to Supabase Storage
  const uploadImage = async (file) => {
    setUploading(true)
    const ext  = file.name.split('.').pop()
    const path = `watches/${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage.from('watch-images').upload(path, file, { upsert: true })
    if (upErr) { setError('Image upload failed: ' + upErr.message); setUploading(false); return }
    const { data } = supabase.storage.from('watch-images').getPublicUrl(path)
    setForm(f => ({ ...f, image_url: data.publicUrl }))
    setUploading(false)
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = { ...form, price: parseFloat(form.price) || 0 }
    let err
    if (watch?.id) {
      ;({ error: err } = await supabase.from('watches').update(payload).eq('id', watch.id))
    } else {
      ;({ error: err } = await supabase.from('watches').insert([payload]))
    }
    setSaving(false)
    if (err) { setError(err.message); return }
    onSaved()
    onClose()
  }

  const label = (txt) => (
    <label style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: '0.4rem' }}>
      {txt}
    </label>
  )

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-end sm:justify-end"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>

      {/* Panel — slides in from right on desktop, up from bottom on mobile */}
      <div className="w-full sm:w-[520px] h-[92vh] sm:h-full overflow-y-auto"
        style={{ background: '#fff', boxShadow: '-20px 0 60px rgba(0,0,0,0.15)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b sticky top-0 bg-white z-10"
          style={{ borderColor: '#E4DDD3' }}>
          <div>
            <p style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 400, color: '#111' }}>
              {watch ? 'Edit Listing' : 'New Listing'}
            </p>
            {watch && <p style={{ fontFamily: 'var(--sans)', fontSize: '0.7rem', color: '#888', marginTop: '0.1rem' }}>{watch.brand} {watch.model}</p>}
          </div>
          <button onClick={onClose} className="p-2 hover:opacity-60 transition-opacity"><X size={18} /></button>
        </div>

        <form onSubmit={save} className="px-8 py-6 flex flex-col gap-5">

          {/* Image */}
          <div>
            {form.image_url ? (
              <div className="relative mb-3">
                <img src={form.image_url} alt="Watch" className="w-full object-cover" style={{ height: '200px', objectFit: 'cover' }} />
                <button type="button" onClick={() => setForm(f => ({ ...f, image_url: '' }))}
                  className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 text-white text-xs"
                  style={{ background: 'rgba(0,0,0,0.6)' }}>
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            ) : null}
            <label className="flex items-center justify-center gap-3 w-full py-4 cursor-pointer border border-dashed hover:border-[#B08D57] transition-colors"
              style={{ borderColor: '#E4DDD3' }}>
              <Upload size={16} style={{ color: '#888' }} />
              <span style={{ fontFamily: 'var(--sans)', fontSize: '0.7rem', color: '#888', letterSpacing: '0.1em' }}>
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </span>
              <input type="file" accept="image/*" className="hidden"
                onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />
            </label>
          </div>

          {/* Basic details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              {label('Brand *')}
              <input className="input" name="brand" value={form.brand} onChange={set} required placeholder="e.g. Rolex" />
            </div>
            <div>
              {label('Model *')}
              <input className="input" name="model" value={form.model} onChange={set} required placeholder="e.g. Submariner" />
            </div>
            <div>
              {label('Reference')}
              <input className="input" name="ref" value={form.ref} onChange={set} placeholder="e.g. 126610LN" />
            </div>
            <div>
              {label('Price (MYR) *')}
              <input className="input" name="price" type="number" value={form.price} onChange={set} required placeholder="58000" />
            </div>
            <div>
              {label('Year')}
              <input className="input" name="year" value={form.year} onChange={set} placeholder="2023" />
            </div>
            <div>
              {label('Type')}
              <select className="input" name="type" value={form.type} onChange={set}>
                {['Sport','Dress','Chronograph','Tourbillon','Limited'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              {label('Condition')}
              <select className="input" name="condition" value={form.condition} onChange={set}>
                {['Mint / Unworn','Excellent','Very Good','Good'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              {label('Status Tag')}
              <select className="input" name="tag" value={form.tag} onChange={set}>
                {['In Stock','New Arrival','Rare','Limited','Sold'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            {label('Description')}
            <textarea className="input resize-none" name="description" value={form.description} onChange={set}
              rows={4} placeholder="Detailed description of the watch — condition notes, provenance, accessories included..." />
          </div>

          {error && <p style={{ color: '#c0392b', fontSize: '0.75rem', fontFamily: 'var(--sans)' }}>{error}</p>}

          <div className="flex gap-3 pt-2 border-t" style={{ borderColor: '#E4DDD3' }}>
            <button type="submit" disabled={saving || uploading}
              className="btn btn-dark flex-1" style={{ opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Saving...' : watch ? 'Save Changes' : 'Create Listing'}
            </button>
            <button type="button" onClick={onClose} className="btn btn-outline px-5">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
