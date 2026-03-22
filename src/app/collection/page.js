'use client'
import { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight, X, Plus, Pencil, Trash2, Loader2, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

const allTypes  = ['All', 'Sport', 'Dress', 'Complications', 'Tourbillon']
const sortOpts  = ['Default', 'Price: Low to High', 'Price: High to Low', 'Newest First']

const EMPTY_WATCH = {
  brand: '', model: '', reference: '', price: '',
  condition: 'excellent', year: new Date().getFullYear(),
  description: '', features: '', is_featured: false, is_sold: false,
}

export default function CollectionPage() {
  const { isAdmin } = useAuth()
  const [watches, setWatches]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [brand, setBrand]           = useState('All')
  const [sort, setSort]             = useState('Default')
  const [search, setSearch]         = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const [modal, setModal]           = useState(null)
  const [editWatch, setEditWatch]   = useState(EMPTY_WATCH)
  const [saving, setSaving]         = useState(false)
  const [deleteId, setDeleteId]     = useState(null)
  const [error, setError]           = useState('')

  const fetchWatches = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('watches').select('*').eq('is_sold', false)
      .order('created_at', { ascending: false })
    if (!error) setWatches(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchWatches() }, [fetchWatches])

  const allBrands = useMemo(() => ['All', ...[...new Set(watches.map(w => w.brand))].sort()], [watches])

  const filtered = useMemo(() => {
    let list = watches
    if (brand !== 'All') list = list.filter(w => w.brand === brand)
    if (search) list = list.filter(w =>
      `${w.brand} ${w.model} ${w.reference}`.toLowerCase().includes(search.toLowerCase()))
    if (sort === 'Price: Low to High')  list = [...list].sort((a,b) => a.price - b.price)
    if (sort === 'Price: High to Low')  list = [...list].sort((a,b) => b.price - a.price)
    if (sort === 'Newest First')        list = [...list].sort((a,b) => b.year - a.year)
    return list
  }, [watches, brand, sort, search])

  const fmt = (n) => `MYR ${Number(n).toLocaleString()}`

  function openAdd()  { setEditWatch(EMPTY_WATCH); setError(''); setModal('add') }
  function openEdit(w) {
    setEditWatch({ ...w, features: Array.isArray(w.features) ? w.features.join(', ') : (w.features || '') })
    setError(''); setModal('edit')
  }

  async function handleSave() {
    if (!editWatch.brand || !editWatch.model) { setError('Brand and model are required.'); return }
    setSaving(true); setError('')
    const payload = {
      brand: editWatch.brand.trim(), model: editWatch.model.trim(),
      reference: editWatch.reference?.trim() || null,
      price: parseFloat(editWatch.price) || null,
      condition: editWatch.condition || 'excellent',
      year: parseInt(editWatch.year) || null,
      description: editWatch.description?.trim() || null,
      features: editWatch.features ? editWatch.features.split(',').map(f => f.trim()).filter(Boolean) : [],
      is_featured: Boolean(editWatch.is_featured),
      is_sold: Boolean(editWatch.is_sold),
      updated_at: new Date().toISOString(),
    }
    let err
    if (modal === 'add') { ;({ error: err } = await supabase.from('watches').insert(payload)) }
    else { ;({ error: err } = await supabase.from('watches').update(payload).eq('id', editWatch.id)) }
    if (err) { setError(err.message) } else { setModal(null); fetchWatches() }
    setSaving(false)
  }

  async function handleDelete(id) {
    setDeleteId(id)
    const { error: err } = await supabase.from('watches').delete().eq('id', id)
    if (!err) fetchWatches()
    setDeleteId(null)
  }

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>

      {/* â”€â”€ Header â”€â”€ */}
      <section style={{ paddingTop: '8rem', paddingBottom: '3rem', borderBottom: '1px solid #1A1A1A' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <p className="eyebrow mb-5">Curated Inventory</p>
              <h1 style={{
                fontFamily: 'var(--sans)',
                fontWeight: 900,
                fontSize: 'clamp(3rem, 7vw, 7rem)',
                lineHeight: 0.9,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                color: '#fff',
              }}>
                The<br />Collection
              </h1>
            </div>
            {isAdmin && (
              <button onClick={openAdd} className="btn btn-gold" style={{ alignSelf: 'flex-end' }}>
                <Plus size={14} /> Add Watch
              </button>
            )}
          </div>
        </div>
      </section>

      {/* â”€â”€ Filters â”€â”€ */}
      <section style={{ borderBottom: '1px solid #1A1A1A', position: 'sticky', top: '68px', zIndex: 40, background: '#0A0A0A' }}>
        <div className="container" style={{ paddingTop: '1.25rem', paddingBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: '1', minWidth: '180px', maxWidth: '260px' }}>
              <Search size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#444' }} />
              <input
                className="input"
                style={{ paddingLeft: '2.75rem', fontSize: '0.85rem' }}
                placeholder="Search brand or model..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Brand filter */}
            <select
              className="input"
              style={{ maxWidth: '180px', fontSize: '0.85rem' }}
              value={brand}
              onChange={e => setBrand(e.target.value)}
            >
              {allBrands.map(b => <option key={b}>{b}</option>)}
            </select>

            {/* Sort */}
            <select
              className="input"
              style={{ maxWidth: '200px', fontSize: '0.85rem' }}
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              {sortOpts.map(s => <option key={s}>{s}</option>)}
            </select>

            {/* Count */}
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--sans)', fontSize: '0.75rem', fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#444' }}>
              {filtered.length} {filtered.length === 1 ? 'Piece' : 'Pieces'}
            </span>
          </div>
        </div>
      </section>

      {/* â”€â”€ Grid â”€â”€ */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '8rem 0' }}>
              <Loader2 size={32} style={{ color: '#B08D57', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '8rem 0' }}>
              <p style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#222', marginBottom: '1.5rem' }}>
                No Results
              </p>
              <button
                onClick={() => { setBrand('All'); setSearch('') }}
                className="eyebrow hover:text-white transition-colors"
              >
                Clear filters â†’
              </button>
            </div>
          ) : (
            <div style={{ gap: '4rem 2rem' }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            >
              {filtered.map(w => (
                <div key={w.id} style={{ position: 'relative' }} className="group">
                  {/* Admin controls */}
                  {isAdmin && (
                    <div style={{ position: 'absolute', top: '-0.5rem', right: '-0.5rem', display: 'flex', gap: '0.25rem', zIndex: 10 }}>
                      <button onClick={() => openEdit(w)}
                        style={{ padding: '0.375rem', background: '#111', border: '1px solid #222', cursor: 'pointer' }}
                        className="hover:bg-[#B08D57] transition-colors" title="Edit">
                        <Pencil size={11} style={{ color: '#888' }} />
                      </button>
                      <button onClick={() => handleDelete(w.id)} disabled={deleteId === w.id}
                        style={{ padding: '0.375rem', background: '#111', border: '1px solid #222', cursor: 'pointer' }}
                        className="hover:bg-red-900 transition-colors" title="Delete">
                        {deleteId === w.id
                          ? <Loader2 size={11} style={{ color: '#f87171', animation: 'spin 1s linear infinite' }} />
                          : <Trash2 size={11} style={{ color: '#888' }} />}
                      </button>
                    </div>
                  )}

                  {/* Watch image area â€” RM style: image floats on black */}
                  <div style={{
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    overflow: 'hidden',
                    background: 'transparent',
                  }}>
                    {w.images && w.images[0] ? (
                      <img
                        src={w.images[0]}
                        alt={`${w.brand} ${w.model}`}
                        style={{ width: '85%', height: '85%', objectFit: 'contain', transition: 'transform 0.6s ease' }}
                        className="group-hover:scale-105"
                      />
                    ) : (
                      <div style={{
                        width: '80%',
                        height: '80%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #1A1A1A',
                        background: '#0D0D0D',
                      }}>
                        <span style={{
                          fontFamily: 'var(--sans)',
                          fontWeight: 900,
                          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                          color: '#1A1A1A',
                          letterSpacing: '-0.04em',
                          userSelect: 'none',
                          transition: 'color 0.3s',
                        }}
                        className="group-hover:text-[#2A2A2A]"
                        >
                          {w.brand.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Watch info */}
                  <div style={{ textAlign: 'center' }}>
                    {/* Brand */}
                    <p style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      color: '#B08D57',
                      marginBottom: '0.5rem',
                    }}>
                      {w.brand}
                    </p>

                    {/* Model */}
                    <h3 style={{
                      fontFamily: 'var(--sans)',
                      fontWeight: 700,
                      fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
                      letterSpacing: '-0.01em',
                      textTransform: 'uppercase',
                      color: '#fff',
                      lineHeight: 1.2,
                      marginBottom: '0.4rem',
                      transition: 'color 0.2s',
                    }}
                    className="group-hover:text-[#B08D57]"
                    >
                      {w.model}
                    </h3>

                    {/* Ref + condition */}
                    {w.reference && (
                      <p style={{ fontFamily: 'var(--sans)', fontSize: '0.7rem', fontWeight: 400, letterSpacing: '0.15em', color: '#444', marginBottom: '0.75rem' }}>
                        Ref. {w.reference}
                      </p>
                    )}

                    {/* Price + enquire */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '0.75rem' }}>
                      <span style={{
                        fontFamily: 'var(--sans)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: '#fff',
                        letterSpacing: '0.05em',
                      }}>
                        {w.price ? fmt(w.price) : 'P.O.A.'}
                      </span>
                      <span style={{ width: '1px', height: '12px', background: '#2A2A2A' }} />
                      <Link href="/contact" style={{
                        fontFamily: 'var(--sans)',
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: '#B08D57',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                      }}
                      className="hover:text-white"
                      >
                        Enquire
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* â”€â”€ Trade-in CTA â”€â”€ */}
      <section style={{ borderTop: '1px solid #1A1A1A', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <p className="eyebrow mb-4">Selling a watch?</p>
              <h3 style={{
                fontFamily: 'var(--sans)',
                fontWeight: 800,
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: '#fff',
                lineHeight: 1,
              }}>
                We Buy Pre-Owned Timepieces
              </h3>
            </div>
            <Link href="/trade-in" className="btn btn-outline self-start">
              Get a Valuation <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* â”€â”€ Admin Modal â”€â”€ */}
      {modal && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setModal(null) }}
        >
          <div style={{ width: '100%', maxWidth: '32rem', maxHeight: '90vh', overflowY: 'auto', background: '#0D0D0D', border: '1px solid #1A1A1A' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderBottom: '1px solid #1A1A1A' }}>
              <h2 style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}>
                {modal === 'add' ? 'Add New Watch' : 'Edit Watch'}
              </h2>
              <button onClick={() => setModal(null)} style={{ color: '#444', cursor: 'pointer', background: 'none', border: 'none' }} className="hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {error && <p style={{ color: '#f87171', fontSize: '0.8rem', border: '1px solid #7f1d1d', padding: '0.5rem 0.75rem' }}>{error}</p>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[['Brand *','brand','e.g. Rolex'],['Model *','model','e.g. Submariner Date']].map(([lbl,key,ph]) => (
                  <div key={key}>
                    <label className="eyebrow block mb-2" style={{ fontSize: '0.65rem' }}>{lbl}</label>
                    <input className="input" value={editWatch[key]} placeholder={ph}
                      onChange={e => setEditWatch(p => ({...p, [key]: e.target.value}))} />
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[['Reference','reference','e.g. 126610LN'],['Price (MYR)','price','e.g. 65000']].map(([lbl,key,ph]) => (
                  <div key={key}>
                    <label className="eyebrow block mb-2" style={{ fontSize: '0.65rem' }}>{lbl}</label>
                    <input className="input" value={editWatch[key]} placeholder={ph} type={key==='price'?'number':'text'}
                      onChange={e => setEditWatch(p => ({...p, [key]: e.target.value}))} />
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="eyebrow block mb-2" style={{ fontSize: '0.65rem' }}>Condition</label>
                  <select className="input" value={editWatch.condition} onChange={e => setEditWatch(p => ({...p, condition: e.target.value}))}>
                    {['new','unworn','excellent','good','fair'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="eyebrow block mb-2" style={{ fontSize: '0.65rem' }}>Year</label>
                  <input className="input" type="number" value={editWatch.year} placeholder="e.g. 2023"
                    onChange={e => setEditWatch(p => ({...p, year: e.target.value}))} />
                </div>
              </div>

              <div>
                <label className="eyebrow block mb-2" style={{ fontSize: '0.65rem' }}>Description</label>
                <textarea className="input" rows={3} value={editWatch.description} placeholder="Watch description..."
                  style={{ resize: 'vertical', minHeight: '80px' }}
                  onChange={e => setEditWatch(p => ({...p, description: e.target.value}))} />
              </div>

              <div>
                <label className="eyebrow block mb-2" style={{ fontSize: '0.65rem' }}>Features (comma-separated)</label>
                <input className="input" value={editWatch.features} placeholder="e.g. Box & Papers, Ceramic Bezel"
                  onChange={e => setEditWatch(p => ({...p, features: e.target.value}))} />
              </div>

              <div style={{ display: 'flex', gap: '1.5rem' }}>
                {[['is_featured','Featured'],['is_sold','Mark as Sold']].map(([key,lbl]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={editWatch[key]} onChange={e => setEditWatch(p => ({...p, [key]: e.target.checked}))} style={{ accentColor: '#B08D57' }} />
                    <span className="eyebrow" style={{ fontSize: '0.65rem' }}>{lbl}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', padding: '1.5rem', borderTop: '1px solid #1A1A1A' }}>
              <button onClick={() => setModal(null)} className="eyebrow hover:text-white transition-colors" style={{ fontSize: '0.65rem', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 1rem' }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="btn btn-gold" style={{ padding: '0.75rem 1.75rem' }}>
                {saving ? <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : modal === 'add' ? 'Add Watch' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


