'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Loader2, Search, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const S = {
  page:  { padding: '2.5rem 2.5rem 4rem' },
  card:  { background: '#fff', border: '1px solid #E8E2D8', borderRadius: '2px' },
  th:    { fontFamily: 'var(--sans)', fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#aaa', textAlign: 'left', padding: '0 1rem 0.85rem 0', borderBottom: '1px solid #F0EBE3', whiteSpace: 'nowrap' },
  td:    { padding: '0.9rem 1rem 0.9rem 0', borderBottom: '1px solid #F4EFE9', verticalAlign: 'middle' },
}

export default function AdminCollection() {
  const [watches, setWatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [deleting, setDeleting] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('watches').select('*').order('created_at', { ascending: false })
    setWatches(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const filtered = watches.filter(w =>
    !search || `${w.brand} ${w.model} ${w.reference||''}`.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id) => {
    if (!confirm('Delete this watch? This cannot be undone.')) return
    setDeleting(id)
    await supabase.from('watches').delete().eq('id', id)
    setDeleting(null)
    fetch()
  }

  const fmt = n => n ? `MYR ${Number(n).toLocaleString()}` : 'P.O.A.'

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #E8E2D8' }}>
        <div>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#B08D57', marginBottom: '0.4rem' }}>Admin</p>
          <h1 style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.02em', color: '#111' }}>Watch Collection</h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.8rem', color: '#888', marginTop: '0.25rem' }}>
            {watches.length} watches · {watches.filter(w=>!w.is_sold).length} available
          </p>
        </div>
        <Link href="/admin/collection/new" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#B08D57', color: '#fff', padding: '0.7rem 1.25rem', fontFamily: 'var(--sans)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>
          <Plus size={14} /> Add Watch
        </Link>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: '320px', marginBottom: '1.5rem' }}>
        <Search size={14} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search brand, model, reference…"
          style={{ width: '100%', paddingLeft: '2.4rem', paddingRight: '1rem', paddingTop: '0.65rem', paddingBottom: '0.65rem',
            fontFamily: 'var(--sans)', fontSize: '0.8rem', border: '1px solid #E8E2D8', background: '#fff', outline: 'none', borderRadius: '2px', color: '#111' }} />
      </div>

      {/* Table */}
      <div style={S.card}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Loader2 size={24} style={{ color: '#B08D57', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#bbb', fontFamily: 'var(--sans)', fontSize: '0.85rem' }}>
            {search ? 'No watches match your search.' : 'No watches yet.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', padding: '0 1.5rem' }}>
              <thead>
                <tr style={{ padding: '0 1.5rem' }}>
                  <th style={{ ...S.th, paddingLeft: '1.5rem' }}>Watch</th>
                  <th style={S.th}>Brand</th>
                  <th style={S.th}>Reference</th>
                  <th style={S.th}>Year</th>
                  <th style={S.th}>Condition</th>
                  <th style={S.th}>Price</th>
                  <th style={S.th}>Status</th>
                  <th style={S.th}>Featured</th>
                  <th style={{ ...S.th, textAlign: 'right', paddingRight: '1.5rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(w => (
                  <tr key={w.id} style={{ transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#FDFAF7'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    {/* Watch thumb + model */}
                    <td style={{ ...S.td, paddingLeft: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '44px', height: '44px', background: '#F4EFE9', border: '1px solid #E8E2D8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                          {w.images?.[0]
                            ? <img src={w.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <span style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: '1.1rem', color: '#D4C5B0', userSelect: 'none' }}>{w.brand?.charAt(0)}</span>
                          }
                        </div>
                        <p style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '0.82rem', color: '#111' }}>{w.model}</p>
                      </div>
                    </td>
                    <td style={S.td}><p style={{ fontFamily: 'var(--sans)', fontSize: '0.8rem', color: '#444' }}>{w.brand}</p></td>
                    <td style={S.td}><p style={{ fontFamily: 'var(--sans)', fontSize: '0.78rem', color: '#666' }}>{w.reference||'—'}</p></td>
                    <td style={S.td}><p style={{ fontFamily: 'var(--sans)', fontSize: '0.78rem', color: '#666' }}>{w.year||'—'}</p></td>
                    <td style={S.td}><p style={{ fontFamily: 'var(--sans)', fontSize: '0.78rem', color: '#666', textTransform: 'capitalize' }}>{w.condition||'—'}</p></td>
                    <td style={S.td}><p style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: '0.8rem', color: '#111' }}>{fmt(w.price)}</p></td>
                    <td style={S.td}>
                      <span style={{ fontFamily: 'var(--sans)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.2rem 0.6rem',
                        background: w.is_sold ? '#fee2e2' : '#dcfce7', color: w.is_sold ? '#991b1b' : '#166534', borderRadius: '999px' }}>
                        {w.is_sold ? 'Sold' : 'Available'}
                      </span>
                    </td>
                    <td style={S.td}>
                      <span style={{ fontFamily: 'var(--sans)', fontSize: '0.62rem', color: w.is_featured ? '#B08D57' : '#ccc' }}>
                        {w.is_featured ? '★ Yes' : '—'}
                      </span>
                    </td>
                    <td style={{ ...S.td, textAlign: 'right', paddingRight: '1.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Link href={`/admin/collection/${w.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.75rem', border: '1px solid #E8E2D8', background: '#fff', textDecoration: 'none', fontFamily: 'var(--sans)', fontSize: '0.7rem', color: '#444', letterSpacing: '0.05em' }}>
                          <Pencil size={11} /> Edit
                        </Link>
                        <button onClick={() => handleDelete(w.id)} disabled={deleting === w.id}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.75rem', border: '1px solid #fca5a5', background: '#fff', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: '0.7rem', color: '#dc2626', letterSpacing: '0.05em' }}>
                          {deleting === w.id ? <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={11} />}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
