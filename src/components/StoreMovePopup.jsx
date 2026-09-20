'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

const PHOTOS = [
  '/store/gwg_mainentrance.png',
  '/store/gwg_interior.png',
  '/store/gwg_interior2.png',
  '/store/gwg_interior3.png',
  '/store/gwg_interior4.png',
]

export default function StoreMovePopup() {
  const [visible, setVisible] = useState(true)
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!visible) return
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % PHOTOS.length)
    }, 4000)
    return () => clearInterval(timerRef.current)
  }, [visible])

  if (!visible) return null

  const go = (n) => setIndex(i => (i + n + PHOTOS.length) % PHOTOS.length)

  return (
    <div
      role="dialog" aria-modal="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 3000,
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.25rem'
      }}
      onClick={() => setVisible(false)}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative', width: '100%', maxWidth: '900px',
          background: '#0A0A0A', border: '1px solid rgba(176,141,87,0.4)',
          display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1fr)',
          overflow: 'hidden', maxHeight: '90vh'
        }}
        className="store-move-popup"
      >
        <button
          onClick={() => setVisible(false)}
          aria-label="Close"
          style={{
            position: 'absolute', top: '1rem', right: '1rem', zIndex: 2,
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.25)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>

        {/* Image slideshow */}
        <div style={{ position: 'relative', minHeight: '280px', background: '#111' }}>
          {PHOTOS.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt="Grand Watch Gallery new store"
              fill
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, 450px"
              style={{
                objectFit: 'cover',
                opacity: i === index ? 1 : 0,
                transition: 'opacity 0.7s ease'
              }}
            />
          ))}

          {/* Prev / Next */}
          <button onClick={() => go(-1)} aria-label="Previous photo" style={navBtnStyle('left')}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => go(1)} aria-label="Next photo" style={navBtnStyle('right')}>
            <ChevronRight size={18} />
          </button>

          {/* Dots */}
          <div style={{ position: 'absolute', bottom: '1rem', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '0.4rem', zIndex: 2 }}>
            {PHOTOS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to photo ${i + 1}`}
                style={{
                  width: i === index ? '18px' : '6px', height: '6px', borderRadius: '3px',
                  background: i === index ? '#B08D57' : 'rgba(255,255,255,0.4)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0
                }}
              />
            ))}
          </div>
        </div>

        {/* Text content */}
        <div style={{ padding: '2.5rem 2.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#B08D57', marginBottom: '1rem' }}>
            Exciting News
          </p>
          <h2 style={{ fontFamily: 'var(--sans)', fontWeight: 900, fontSize: 'clamp(1.5rem,3vw,2rem)', textTransform: 'uppercase', color: '#fff', lineHeight: 1.1, marginBottom: '1.25rem' }}>
            We&apos;re Moving This October
          </h2>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.92rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontWeight: 300, marginBottom: '1.5rem' }}>
            Grand Watch Gallery is relocating to a beautiful new gallery space. Same passion for fine watches, new address starting October 2026.
          </p>

          <div style={{ borderLeft: '2px solid #B08D57', paddingLeft: '1rem', marginBottom: '2rem' }}>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
              Hextar World At Empire City
            </p>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontWeight: 300 }}>
              GF Lot73, Zone 3, Empire City<br />
              Jalan Damansara, PJU 8<br />
              47820, Petaling Jaya, Selangor
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <Link
              href="/find-us"
              onClick={() => setVisible(false)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: '#B08D57', color: '#0A0A0A', textDecoration: 'none',
                fontFamily: 'var(--sans)', fontSize: '0.72rem', fontWeight: 700,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                padding: '0.85rem 1.5rem'
              }}
            >
              View New Location <ArrowRight size={14} />
            </Link>
            <button
              onClick={() => setVisible(false)}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--sans)', fontSize: '0.72rem', fontWeight: 600,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.6)'
              }}
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 720px) {
          .store-move-popup { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

function navBtnStyle(side) {
  return {
    position: 'absolute', top: '50%', [side]: '0.75rem', transform: 'translateY(-50%)',
    width: '34px', height: '34px', borderRadius: '50%', zIndex: 2,
    background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.3)',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer'
  }
}
