'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const CONDITION_LABELS = {
  new: 'New', unworn: 'Unworn', excellent: 'Excellent', good: 'Good', fair: 'Fair',
}

export default function WatchDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [watch, setWatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetchWatch() {
      const { data, error } = await supabase.from('watches').select('*').eq('id', id).single()
      if (error || !data) { setNotFound(true) } else { setWatch(data) }
      setLoading(false)
    }
    if (id) fetchWatch()
  }, [id])

  const fmt = (n) => `MYR ${Number(n).toLocaleString()}`

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={32} style={{ color: '#B08D57', animation: 'spin 1s linear infinite' }} />
    </div>
  )

  if (notFound) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
      <p style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#222' }}>Watch Not Found</p>
      <Link href="/collection" style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B08D57', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={13} /> Back to Collection
      </Link>
    </div>
  )

  const w = watch
  const features = Array.isArray(w.features) ? w.features : []

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>

      {/* Back nav */}
      <div style={{ paddingTop: '7rem', paddingBottom: '2rem', borderBottom: '1px solid #1A1A1A' }}>
        <div className="container">
          <Link href="/collection" style={{ fontFamily: 'var(--sans)', fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', opacity: 0.5, transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}>
            <ArrowLeft size={13} /> Collection
          </Link>
        </div>
      </div>

      {/* Main content */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Left - Image */}
            <div style={{ position: 'sticky', top: '6rem', alignSelf: 'start' }}>
              <div style={{ background: '#0D0D0D', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #1A1A1A' }}>
                {w.images && w.images[0] ? (
                  <img src={w.images[0]} alt={`${w.brand} ${w.model}`}
                    style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontFamily: 'var(--sans)', fontWeight: 900, fontSize: 'clamp(4rem,12vw,8rem)', color: '#1A1A1A', letterSpacing: '-0.05em', userSelect: 'none' }}>
                    {w.brand.charAt(0)}
                  </span>
                )}
              </div>
            </div>

            {/* Right - Details */}
            <div>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '0.72rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#B08D57', marginBottom: '1rem' }}>
                {w.brand}
              </p>
              <h1 style={{ fontFamily: 'var(--sans)', fontWeight: 900, fontSize: 'clamp(2rem,4vw,3.5rem)', color: '#fff', textTransform: 'uppercase', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                {w.model}
              </h1>
              {w.reference && (
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.85rem', color: '#fff', letterSpacing: '0.15em', marginBottom: '2rem', opacity: 0.6 }}>
                  Ref. {w.reference}
                </p>
              )}

              <div style={{ width: '36px', height: '1px', background: '#B08D57', marginBottom: '2rem' }} />

              {/* Price */}
              <div style={{ marginBottom: '2.5rem' }}>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#B08D57', marginBottom: '0.5rem' }}>Price</p>
                <p style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: 'clamp(1.5rem,3vw,2.25rem)', color: '#fff', letterSpacing: '-0.01em' }}>
                  {w.price ? fmt(w.price) : 'Price on Application'}
                </p>
              </div>

              {/* Specs grid */}
              <div className="grid grid-cols-2" style={{ gap: '0', marginBottom: '2.5rem', borderTop: '1px solid #1A1A1A' }}>
                {[
                  ['Year', w.year || '—'],
                  ['Condition', CONDITION_LABELS[w.condition] || w.condition || '—'],
                  w.reference ? ['Reference', w.reference] : null,
                ].filter(Boolean).map(([k, v]) => (
                  <div key={k} style={{ padding: '1.25rem 0', borderBottom: '1px solid #1A1A1A', paddingRight: '1rem' }}>
                    <p style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B08D57', marginBottom: '0.35rem' }}>{k}</p>
                    <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9rem', color: '#fff', fontWeight: 400 }}>{v}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              {w.description && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#B08D57', marginBottom: '1rem' }}>About this piece</p>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '0.95rem', color: '#fff', lineHeight: 1.8, fontWeight: 300 }}>
                    {w.description}
                  </p>
                </div>
              )}

              {/* Features */}
              {features.length > 0 && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#B08D57', marginBottom: '1rem' }}>Includes</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {features.map((f, i) => (
                      <span key={i} style={{ fontFamily: 'var(--sans)', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff', border: '1px solid #2A2A2A', padding: '0.4rem 0.85rem' }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem' }}>
                <Link href={'/contact?watch=' + encodeURIComponent(w.brand + ' ' + w.model + (w.reference ? ' Ref.' + w.reference : ''))}
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', background: '#B08D57', color: '#fff', padding: '1rem 1.75rem', fontFamily: 'var(--sans)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', textDecoration: 'none' }}>
                  Enquire About This Watch <ArrowRight size={13} />
                </Link>
                <Link href="/appointment"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', background: 'transparent', color: '#fff', padding: '1rem 1.75rem', fontFamily: 'var(--sans)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
                  Book a Private Viewing <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
