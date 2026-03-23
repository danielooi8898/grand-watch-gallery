'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Loader2, Search, Star, Tag, Grid, List } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminCollection() {
  const [watches,  setWatches]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState('all') // all | available | sold | featured
  const [view,     setView]     = useState('grid') // grid | list
  const [deleting, setDeleting] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('watches').select('*').order('created_at', { ascending: false })
    setWatches(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = watches.filter(w => {
    const matchSearch = !search || `${w.brand} ${w.model} ${w.reference || ''}`.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all'
      || (filter === 'available' && !w.is_sold)
      || (filter === 'sold' && w.is_sold)
      || (filter === 'featured' && w.is_featured)
    return matchSearch && matchFilter
  })

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this watch? This cannot be undone.')) return
    setDeleting(id)
    await supabase.from('watches').delete().eq('id', id)
    setDeleting(null)
    load()
  }

  const fmt = n => n ? `MYR ${Number(n).toLocaleString()}` : 'P.O.A.'

  const stats = [
    { label: 'Total', value: watches.length, color: '#111' },
    { label: 'Available', value: watches.filter(w => !w.is_sold).length, color: '#16a34a' },
    { label: 'Sold', value: watches.filter(w => w.is_sold).length, color: '#9ca3af' },
    { label: 'Featured', value: watches.filter(w => w.is_featured).length, color: '#B08D57' },
  ]

  const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'available', label: 'Available' },
    { id: 'sold', label: 'Sold' },
    { id: 'featured', label: 'Featured' },
  ]

  return (
    <div style={{ padding: '2.5rem 2.5rem 5rem', minHeight: '100vh' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#B08D57', marginBottom: '0.4rem' }}>
              Admin
            </p>
            <h1 style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.03em', color: '#111', marginBottom: '1.5rem' }}>
              Watch Collection
            </h1>
            {/* Stats pills */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {stats.map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', border: '1px solid #E8E2D8', padding: '0.4rem 0.9rem', borderRadius: '999px' }}>
                  <span style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: '1rem', color: s.color, lineHeight: 1 }}>{s.value}</span>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <Link href="/admin/collection/new" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: '#111', color: '#fff', padding: '0.8rem 1.5rem',
            fontFamily: 'var(--sans)', fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none',
            borderRadius: '2px', whiteSpace: 'nowrap', transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#B08D57'}
            onMouseLeave={e => e.currentTarget.style.background = '#111'}
          >
            <Plus size={13} strokeWidth={2.5} /> Add Watch
          </Link>
        </div>
      </div>

      {/* ── Controls ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '340px' }}>
          <Search size={13} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#bbb', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search brand, model, reference..."
            style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.7rem', paddingBottom: '0.7rem',
              fontFamily: 'var(--sans)', fontSize: '0.8rem', border: '1px solid #E8E2D8',
              background: '#fff', outline: 'none', borderRadius: '2px', color: '#111', boxSizing: 'border-box' }} />
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', background: '#fff', border: '1px solid #E8E2D8', borderRadius: '2px', padding: '0.2rem' }}>
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              style={{ padding: '0.4rem 0.85rem', background: filter === f.id ? '#111' : 'transparent',
                color: filter === f.id ? '#fff' : '#777', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--sans)', fontSize: '0.68rem', letterSpacing: '0.08em',
                textTransform: 'uppercase', borderRadius: '1px', transition: 'all 0.15s' }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: '0.25rem', background: '#fff', border: '1px solid #E8E2D8', borderRadius: '2px', padding: '0.2rem', marginLeft: 'auto' }}>
          {[{ id: 'grid', Icon: Grid }, { id: 'list', Icon: List }].map(({ id, Icon }) => (
            <button key={id} onClick={() => setView(id)}
              style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: view === id ? '#111' : 'transparent', border: 'none', cursor: 'pointer',
                color: view === id ? '#fff' : '#aaa', borderRadius: '1px', transition: 'all 0.15s' }}>
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 0' }}>
          <Loader2 size={28} style={{ color: '#B08D57', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', background: '#fff', border: '1px solid #E8E2D8' }}>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.85rem', color: '#bbb' }}>
            {search ? 'No watches match your search.' : 'No watches yet — add your first piece.'}
          </p>
        </div>
      ) : view === 'grid' ? (
        /* ── Grid View ── */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {filtered.map(w => (
            <div key={w.id} style={{ background: '#fff', border: '1px solid #E8E2D8', borderRadius: '2px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#B08D57'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#E8E2D8'}
            >
              {/* Image */}
              <div style={{ position: 'relative', aspectRatio: '4/3', background: '#F4EFE9', overflow: 'hidden' }}>
                {w.images?.[0]
                  ? <img src={w.images[0]} alt={w.model} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'var(--serif)', fontSize: '3rem', fontWeight: 300, color: '#D4C5B0', userSelect: 'none' }}>{w.brand?.charAt(0)}</span>
                    </div>
                }
                {/* Status badge */}
                <span style={{ position: 'absolute', top: '0.75rem', left: '0.75rem',
                  fontFamily: 'var(--sans)', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                  padding: '0.25rem 0.6rem', borderRadius: '999px',
                  background: w.is_sold ? 'rgba(239,68,68,0.9)' : 'rgba(22,163,74,0.9)',
                  color: '#fff', backdropFilter: 'blur(4px)' }}>
                  {w.is_sold ? 'Sold' : 'Available'}
                </span>
                {/* Featured star */}
                {w.is_featured && (
                  <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem',
                    width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(176,141,87,0.9)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <Star size={13} fill="#fff" color="#fff" />
                  </span>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: '1rem 1rem 0.75rem', flex: 1 }}>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B08D57', marginBottom: '0.2rem' }}>{w.brand}</p>
                <p style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '0.95rem', color: '#111', marginBottom: '0.5rem', lineHeight: 1.25 }}>{w.model}</p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {w.reference && (
                    <span style={{ fontFamily: 'var(--sans)', fontSize: '0.72rem', color: '#888' }}>Ref. {w.reference}</span>
                  )}
                  {w.year && (
                    <span style={{ fontFamily: 'var(--sans)', fontSize: '0.72rem', color: '#888' }}>{w.year}</span>
                  )}
                  {w.condition && (
                    <span style={{ fontFamily: 'var(--sans)', fontSize: '0.72rem', color: '#888', textTransform: 'capitalize' }}>{w.condition}</span>
                  )}
                </div>
              </div>

              {/* Price + Actions */}
              <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #F0EBE3', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                <p style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: '0.9rem', color: '#111' }}>{fmt(w.price)}</p>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <Link href={`/admin/collection/${w.id}`} style={{
                    display: 'flex', alignItems: 'center', gap: '0.25rem',
                    padding: '0.4rem 0.7rem', background: '#F4EFE9', border: '1px solid #E8E2D8',
                    textDecoration: 'none', fontFamily: 'var(--sans)', fontSize: '0.68rem',
                    color: '#555', letterSpacing: '0.05em', borderRadius: '2px', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#111' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#F4EFE9'; e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#E8E2D8' }}
                  >
                    <Pencil size={11} /> Edit
                  </Link>
                  <button onClick={() => handleDelete(w.id)} disabled={deleting === w.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.25rem',
                      padding: '0.4rem 0.7rem', background: '#fff', border: '1px solid #fca5a5',
                      cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: '0.68rem',
                      color: '#dc2626', letterSpacing: '0.05em', borderRadius: '2px', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#dc2626' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.borderColor = '#fca5a5' }}
                  >
                    {deleting === w.id ? <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={11} />}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── List View ── */
        <div style={{ background: '#fff', border: '1px solid #E8E2D8', borderRadius: '2px', overflow: 'hidden' }}>
          {/* List header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1.2fr 0.8fr 0.8fr auto', gap: '1rem', padding: '0.75rem 1.5rem', borderBottom: '2px solid #F0EBE3', alignItems: 'center' }}>
            {['Watch', 'Reference', 'Year', 'Price', 'Status', 'Featured', 'Actions'].map(h => (
              <span key={h} style={{ fontFamily: 'var(--sans)', fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#aaa' }}>{h}</span>
            ))}
          </div>
          {filtered.map((w, i) => (
            <div key={w.id}
              style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1.2fr 0.8fr 0.8fr auto', gap: '1rem', padding: '0.85rem 1.5rem', borderBottom: i < filtered.length - 1 ? '1px solid #F4EFE9' : 'none', alignItems: 'center', transition: 'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#FDFAF7'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Watch */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: '48px', height: '48px', background: '#F4EFE9', border: '1px solid #E8E2D8', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {w.images?.[0]
                    ? <img src={w.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 300, color: '#D4C5B0' }}>{w.brand?.charAt(0)}</span>
                  }
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '0.82rem', color: '#111', marginBottom: '0.1rem' }}>{w.model}</p>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '0.72rem', color: '#B08D57', letterSpacing: '0.05em' }}>{w.brand}</p>
                </div>
              </div>
              {/* Reference */}
              <p style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', color: '#666' }}>{w.reference || '—'}</p>
              {/* Year */}
              <p style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', color: '#666' }}>{w.year || '—'}</p>
              {/* Price */}
              <p style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '0.8rem', color: '#111' }}>{fmt(w.price)}</p>
              {/* Status */}
              <span style={{ fontFamily: 'var(--sans)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.2rem 0.6rem', borderRadius: '999px',
                background: w.is_sold ? '#fee2e2' : '#dcfce7', color: w.is_sold ? '#991b1b' : '#166534', display: 'inline-block' }}>
                {w.is_sold ? 'Sold' : 'Available'}
              </span>
              {/* Featured */}
              <span style={{ color: w.is_featured ? '#B08D57' : '#ddd', display: 'flex', alignItems: 'center' }}>
                <Star size={15} fill={w.is_featured ? '#B08D57' : 'none'} />
              </span>
              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <Link href={`/admin/collection/${w.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.65rem', border: '1px solid #E8E2D8', background: '#fff', textDecoration: 'none', fontFamily: 'var(--sans)', fontSize: '0.67rem', color: '#444', borderRadius: '2px' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#111' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#444'; e.currentTarget.style.borderColor = '#E8E2D8' }}>
                  <Pencil size={11} /> Edit
                </Link>
                <button onClick={() => handleDelete(w.id)} disabled={deleting === w.id}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.65rem', border: '1px solid #fca5a5', background: '#fff', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: '0.67rem', color: '#dc2626', borderRadius: '2px' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#dc2626' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.borderColor = '#fca5a5' }}>
                  {deleting === w.id ? <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={11} />}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
