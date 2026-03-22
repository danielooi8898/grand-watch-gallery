'use client'
import { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight, SlidersHorizontal, X, Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
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
  const [type, setType]             = useState('All')
  const [sort, setSort]             = useState('Default')
  const [search, setSearch]         = useState('')
  const [showFilter, setShowFilter] = useState(false)

  // Modal state
  const [modal, setModal]           = useState(null) // null | 'add' | 'edit'
  const [editWatch, setEditWatch]   = useState(EMPTY_WATCH)
  const [saving, setSaving]         = useState(false)
  const [deleteId, setDeleteId]     = useState(null)
  const [error, setError]           = useState('')

  const fetchWatches = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('watches')
      .select('*')
      .eq('is_sold', false)
      .order('created_at', { ascending: false })
    if (!error) setWatches(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchWatches() }, [fetchWatches])

  const allBrands = useMemo(() => ['All', ...[...new Set(watches.map(w => w.brand))].sort()], [watches])

  const filtered = useMemo(() => {
    let list = watches
    if (brand !== 'All')  list = list.filter(w => w.brand === brand)
    if (type  !== 'All')  list = list.filter(w => w.type  === type)
    if (search)           list = list.filter(w =>
      `${w.brand} ${w.model} ${w.reference}`.toLowerCase().includes(search.toLowerCase()))
    if (sort === 'Price: Low to High')  list = [...list].sort((a,b) => a.price - b.price)
    if (sort === 'Price: High to Low')  list = [...list].sort((a,b) => b.price - a.price)
    if (sort === 'Newest First')        list = [...list].sort((a,b) => b.year - a.year)
    return list
  }, [watches, brand, type, sort, search])

  const fmt = (n) => `MYR ${Number(n).toLocaleString()}`

  // ── Admin handlers ──────────────────────────────────────────
  function openAdd() {
    setEditWatch(EMPTY_WATCH)
    setError('')
    setModal('add')
  }

  function openEdit(w) {
    setEditWatch({
      ...w,
      features: Array.isArray(w.features) ? w.features.join(', ') : (w.features || ''),
    })
    setError('')
    setModal('edit')
  }

  async function handleSave() {
    if (!editWatch.brand || !editWatch.model) {
      setError('Brand and model are required.')
      return
    }
    setSaving(true)
    setError('')
    const payload = {
      brand: editWatch.brand.trim(),
      model: editWatch.model.trim(),
      reference: editWatch.reference?.trim() || null,
      price: parseFloat(editWatch.price) || null,
      condition: editWatch.condition || 'excellent',
      year: parseInt(editWatch.year) || null,
      description: editWatch.description?.trim() || null,
      features: editWatch.features
        ? editWatch.features.split(',').map(f => f.trim()).filter(Boolean)
        : [],
      is_featured: Boolean(editWatch.is_featured),
      is_sold: Boolean(editWatch.is_sold),
      updated_at: new Date().toISOString(),
    }

    let err
    if (modal === 'add') {
      ;({ error: err } = await supabase.from('watches').insert(payload))
    } else {
      ;({ error: err } = await supabase.from('watches').update(payload).eq('id', editWatch.id))
    }

    if (err) {
      setError(err.message)
    } else {
      setModal(null)
      fetchWatches()
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    setDeleteId(id)
    const { error: err } = await supabase.from('watches').delete().eq('id', id)
    if (!err) fetchWatches()
    setDeleteId(null)
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <>
      {/* Header */}
      <section className="pt-28 pb-10 md:pt-36 md:pb-14 border-b border-[#0d0d0d]">
        <div className="container flex items-end justify-between">
          <div>
            <p className="eyebrow mb-3">Curated Inventory</p>
            <h1 className="heading">The Collection</h1>
          </div>
          {isAdmin && (
            <button
              onClick={openAdd}
              className="flex items-center gap-2 btn btn-gold mb-2"
              style={{ fontSize: '0.65rem', padding: '0.5rem 1rem' }}
            >
              <Plus size={13} /> Add Watch
            </button>
          )}
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-[#0d0d0d] sticky top-16 z-40 bg-black">
        <div className="container">
          {/* Mobile toggle */}
          <div className="flex items-center justify-between py-3 md:hidden">
            <span className="eyebrow">{filtered.length} piece{filtered.length !== 1 ? 's' : ''}</span>
            <button
              onClick={() => setShowFilter(v => !v)}
              className="flex items-center gap-2 eyebrow hover:text-white transition-colors"
              style={{ fontSize: '0.6rem' }}
            >
              {showFilter ? <><X size={12} /> Close</> : <><SlidersHorizontal size={12} /> Filter</>}
            </button>
          </div>

          {/* Mobile panel */}
          {showFilter && (
            <div className="pb-4 md:hidden space-y-4">
              <input className="input" placeholder="Search brand or model..." value={search} onChange={e => setSearch(e.target.value)} />
              <div>
                <p className="eyebrow mb-2" style={{fontSize:'0.55rem'}}>Brand</p>
                <select className="input" value={brand} onChange={e => setBrand(e.target.value)}>
                  {allBrands.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="eyebrow mb-2" style={{fontSize:'0.55rem'}}>Sort</p>
                  <select className="input" value={sort} onChange={e => setSort(e.target.value)}>
                    {sortOpts.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Desktop inline */}
          <div className="hidden md:flex items-center gap-4 py-3 flex-wrap">
            <input
              className="input"
              style={{ maxWidth: '200px' }}
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select className="input" style={{ maxWidth: '160px' }} value={brand} onChange={e => setBrand(e.target.value)}>
              {allBrands.map(b => <option key={b}>{b}</option>)}
            </select>
            <select className="input" style={{ maxWidth: '180px' }} value={sort} onChange={e => setSort(e.target.value)}>
              {sortOpts.map(s => <option key={s}>{s}</option>)}
            </select>
            <span className="eyebrow ml-auto">{filtered.length} piece{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section">
        <div className="container">
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 size={32} className="text-[#B08D57] animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-[#222] serif font-light text-3xl mb-4">No results</p>
              <button
                onClick={() => { setBrand('All'); setType('All'); setSearch('') }}
                className="eyebrow hover:text-white transition-colors"
                style={{fontSize:'0.6rem'}}
              >
                Clear filters &rarr;
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-[#0d0d0d]">
              {filtered.map(w => (
                <div key={w.id} className="bg-black p-6 hover:bg-[#050505] transition-colors group cursor-pointer relative">
                  {/* Admin controls */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex gap-1 z-10">
                      <button
                        onClick={() => openEdit(w)}
                        className="p-1.5 bg-[#111] hover:bg-[#B08D57] transition-colors rounded"
                        title="Edit"
                      >
                        <Pencil size={10} className="text-[#888] hover:text-black" />
                      </button>
                      <button
                        onClick={() => handleDelete(w.id)}
                        disabled={deleteId === w.id}
                        className="p-1.5 bg-[#111] hover:bg-red-900 transition-colors rounded"
                        title="Delete"
                      >
                        {deleteId === w.id
                          ? <Loader2 size={10} className="text-red-400 animate-spin" />
                          : <Trash2 size={10} className="text-[#888]" />}
                      </button>
                    </div>
                  )}

                  {/* Image area */}
                  <div className="aspect-square bg-[#060606] border border-[#0d0d0d] flex items-center justify-center mb-5 overflow-hidden">
                    {w.images && w.images[0] ? (
                      <img
                        src={w.images[0]}
                        alt={`${w.brand} ${w.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="serif font-light text-[#0f0f0f] group-hover:text-[#1a1a1a] transition-colors" style={{ fontSize: '4rem' }}>
                        {w.brand.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-start mb-1">
                    <span className="eyebrow" style={{fontSize:'0.55rem'}}>{w.brand}</span>
                    {w.condition && (
                      <span className="text-[#1a1a1a] text-[9px] tracking-[0.2em] uppercase border border-[#111] px-1.5 py-0.5 capitalize">
                        {w.condition}
                      </span>
                    )}
                  </div>
                  <h3 className="text-white text-sm font-light serif mb-1">{w.model}</h3>
                  {w.reference && (
                    <p className="text-[#1a1a1a] text-[10px] tracking-wider mb-3">Ref. {w.reference}</p>
                  )}
                  <div className="flex items-center justify-between border-t border-[#0d0d0d] pt-3">
                    <span className="text-white text-sm font-light">
                      {w.price ? fmt(w.price) : 'P.O.A.'}
                    </span>
                    <Link href="/contact" className="eyebrow hover:text-white transition-colors" style={{fontSize:'0.55rem'}}>
                      Enquire &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trade-in CTA */}
      <section className="border-t border-[#0d0d0d] py-16">
        <div className="container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="eyebrow mb-2">Selling a watch?</p>
            <h3 className="text-white serif font-light text-xl">We Buy Pre-Owned Timepieces</h3>
          </div>
          <Link href="/trade-in" className="btn btn-border whitespace-nowrap">
            Get a Valuation <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* ── Add / Edit Modal ── */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setModal(null) }}
        >
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
            style={{ background: '#0a0a0a', border: '1px solid #1a1a1a' }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-[#1a1a1a]">
              <h2 className="serif font-light text-white text-lg">
                {modal === 'add' ? 'Add New Watch' : 'Edit Watch'}
              </h2>
              <button onClick={() => setModal(null)} className="text-[#444] hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-4">
              {error && (
                <p className="text-red-400 text-xs border border-red-900 px-3 py-2">{error}</p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="eyebrow block mb-1" style={{fontSize:'0.55rem'}}>Brand *</label>
                  <input
                    className="input w-full"
                    value={editWatch.brand}
                    onChange={e => setEditWatch(p => ({...p, brand: e.target.value}))}
                    placeholder="e.g. Rolex"
                  />
                </div>
                <div>
                  <label className="eyebrow block mb-1" style={{fontSize:'0.55rem'}}>Model *</label>
                  <input
                    className="input w-full"
                    value={editWatch.model}
                    onChange={e => setEditWatch(p => ({...p, model: e.target.value}))}
                    placeholder="e.g. Submariner Date"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="eyebrow block mb-1" style={{fontSize:'0.55rem'}}>Reference</label>
                  <input
                    className="input w-full"
                    value={editWatch.reference}
                    onChange={e => setEditWatch(p => ({...p, reference: e.target.value}))}
                    placeholder="e.g. 126610LN"
                  />
                </div>
                <div>
                  <label className="eyebrow block mb-1" style={{fontSize:'0.55rem'}}>Price (MYR)</label>
                  <input
                    className="input w-full"
                    type="number"
                    value={editWatch.price}
                    onChange={e => setEditWatch(p => ({...p, price: e.target.value}))}
                    placeholder="e.g. 65000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="eyebrow block mb-1" style={{fontSize:'0.55rem'}}>Condition</label>
                  <select
                    className="input w-full"
                    value={editWatch.condition}
                    onChange={e => setEditWatch(p => ({...p, condition: e.target.value}))}
                  >
                    {['new','unworn','excellent','good','fair'].map(c => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="eyebrow block mb-1" style={{fontSize:'0.55rem'}}>Year</label>
                  <input
                    className="input w-full"
                    type="number"
                    value={editWatch.year}
                    onChange={e => setEditWatch(p => ({...p, year: e.target.value}))}
                    placeholder="e.g. 2023"
                  />
                </div>
              </div>

              <div>
                <label className="eyebrow block mb-1" style={{fontSize:'0.55rem'}}>Description</label>
                <textarea
                  className="input w-full"
                  rows={3}
                  value={editWatch.description}
                  onChange={e => setEditWatch(p => ({...p, description: e.target.value}))}
                  placeholder="Watch description..."
                  style={{ resize: 'vertical', minHeight: '80px' }}
                />
              </div>

              <div>
                <label className="eyebrow block mb-1" style={{fontSize:'0.55rem'}}>Features (comma-separated)</label>
                <input
                  className="input w-full"
                  value={editWatch.features}
                  onChange={e => setEditWatch(p => ({...p, features: e.target.value}))}
                  placeholder="e.g. Box & Papers, Ceramic Bezel, Date Function"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editWatch.is_featured}
                    onChange={e => setEditWatch(p => ({...p, is_featured: e.target.checked}))}
                    className="accent-[#B08D57]"
                  />
                  <span className="eyebrow" style={{fontSize:'0.55rem'}}>Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editWatch.is_sold}
                    onChange={e => setEditWatch(p => ({...p, is_sold: e.target.checked}))}
                    className="accent-[#B08D57]"
                  />
                  <span className="eyebrow" style={{fontSize:'0.55rem'}}>Mark as Sold</span>
                </label>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-[#1a1a1a]">
              <button
                onClick={() => setModal(null)}
                className="eyebrow hover:text-white transition-colors px-4 py-2"
                style={{fontSize:'0.6rem'}}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-gold flex items-center gap-2"
                style={{ fontSize: '0.65rem', padding: '0.5rem 1.5rem' }}
              >
                {saving ? <><Loader2 size={12} className="animate-spin" /> Saving...</> : modal === 'add' ? 'Add Watch' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
