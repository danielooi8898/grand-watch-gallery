'use client'
import Spinner from '@/components/Spinner'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const CONDITION_LABELS = {
  new: 'New', unworn: 'Unworn', excellent: 'Excellent', good: 'Good', fair: 'Fair',
}

function ImageMagnifier({ src, alt }) {
  const containerRef = useRef(null)
  const [lens, setLens] = useState({ show: false, x: 0, y: 0, bgX: 0, bgY: 0 })
  const ZOOM = 3
  const LENS_SIZE = 150

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const bgX = (x / rect.width) * 100
    const bgY = (y / rect.height) * 100
    setLens({ show: true, x, y, bgX, bgY })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setLens(l => ({ ...l, show: false }))
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative', background: '#0D0D0D', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #1A1A1A', cursor: 'crosshair', overflow: 'hidden' }}
    >
      <img src={src} alt={alt} style={{ width: '80%', height: '80%', objectFit: 'contain', display: 'block' }} />

      {lens.show && (
        <div style={{
          position: 'absolute',
          width: `${LENS_SIZE}px`,
          height: `${LENS_SIZE}px`,
          borderRadius: '50%',
          border: '2px solid #B08D57',
          pointerEvents: 'none',
          left: `${lens.x - LENS_SIZE / 2}px`,
          top: `${lens.y - LENS_SIZE / 2}px`,
          backgroundImage: `url(${src})`,
          backgroundSize: `${ZOOM * 80}% ${ZOOM * 80}%`,
          backgroundPosition: `${lens.bgX}% ${lens.bgY}%`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#0D0D0D',
          boxShadow: '0 0 0 1px rgba(176,141,87,0.3)',
          zIndex: 10,
        }} />
      )}

      {!lens.show && (
        <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.4 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          <span style={{ fontFamily: 'var(--sans)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>Hover to zoom</span>
        </div>
      )}
    </div>
  )
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
      <Spinner size={32} style={{ color: '#B08D57', animation: 'spin 1s linear infinite' }} />
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

            {/* Left - Image with magnifier */}
            <div style={{ position: 'sticky', top: '6rem', alignSelf: 'start' }}>
              {w.images && w.images[0] ? (
                <ImageMagnifier src={w.images[0]} alt={`${w.brand} ${w.model}`} />
              ) : (
                <div style={{ background: '#0D0D0D', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #1A1A1A' }}>
                  <span style={{ fontFamily: 'var(--sans)', fontWeight: 900, fontSize: 'clamp(4rem,12vw,8rem)', color: '#1A1A1A', letterSpacing: '-0.05em', userSelect: 'none' }}>
                    {w.brand.charAt(0)}
                  </span>
                </div>
              )}
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
