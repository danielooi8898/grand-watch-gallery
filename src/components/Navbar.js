'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { label: 'Collection', href: '/collection' },
  { label: 'Brands',     href: '/brands'     },
  { label: 'Trade-In',   href: '/trade-in'   },
  { label: 'Journal',    href: '/blog'        },
  { label: 'Contact',    href: '/contact'     },
  { label: 'Find Us',    href: '/find-us'    },
]

export default function Navbar() {
  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  const navBg = scrolled || open ? 'rgba(10,10,10,0.97)' : 'transparent'
  const navBorder = scrolled ? 'rgba(255,255,255,0.06)' : 'transparent'

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: navBg,
          borderBottom: `1px solid ${navBorder}`,
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
        }}
      >
        <div className="container flex items-center justify-between" style={{ height: '72px' }}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 select-none" style={{ textDecoration: 'none' }}>
            {/* PNG logo â€” cropped via background-image to show just the seal circle */}
            <div style={{
              width: '56px',
              height: '56px',
              flexShrink: 0,
              backgroundImage: 'url("/GWG_LOGO.png")',
              backgroundSize: '116px auto',
              backgroundPosition: '50% 50%',
              backgroundRepeat: 'no-repeat',
            }} />
            <div className="flex flex-col leading-none gap-[4px]">
              <span style={{
                fontFamily: 'var(--sans)',
                fontSize: '1rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#fff',
                lineHeight: 1,
              }}>
                Grand Watch Gallery
              </span>
              <span style={{
                fontFamily: 'var(--sans)',
                fontSize: '0.62rem',
                fontWeight: 400,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: '#B08D57',
                lineHeight: 1,
              }}>
                Kuala Lumpur
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  color: pathname === l.href ? '#B08D57' : 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = pathname === l.href ? '#B08D57' : 'rgba(255,255,255,0.8)'}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <Link href="/appointment"
              className="hidden md:inline-flex items-center"
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '0.68rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: '#fff',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '0.65rem 1.5rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#B08D57'; e.currentTarget.style.color = '#B08D57' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = '#fff' }}
            >
              Book Appointment
            </Link>

            <button
              aria-label="Menu"
              onClick={() => setOpen(v => !v)}
              className="md:hidden flex flex-col justify-center items-center gap-[5px] w-10 h-10"
            >
              <span className="block h-px w-5 transition-all duration-300"
                style={{ background: '#fff', transform: open ? 'translateY(6px) rotate(45deg)' : 'none' }} />
              <span className="block h-px transition-all duration-300"
                style={{ background: '#fff', width: open ? '20px' : '14px', opacity: open ? 0 : 1 }} />
              <span className="block h-px w-5 transition-all duration-300"
                style={{ background: '#fff', transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none' }} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden overflow-hidden transition-all duration-400"
          style={{
            maxHeight: open ? '400px' : '0',
            background: 'rgba(10,10,10,0.98)',
            borderTop: open ? '1px solid rgba(255,255,255,0.06)' : 'none'
          }}>
          <nav className="container py-6 flex flex-col">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                className="py-4 border-b flex justify-between items-center"
                style={{
                  borderColor: 'rgba(255,255,255,0.06)',
                  fontFamily: 'var(--sans)',
                  fontSize: '0.82rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  color: pathname === l.href ? '#B08D57' : '#fff',
                  textDecoration: 'none',
                }}>
                {l.label}
                <span style={{ color: '#B08D57' }}>â†’</span>
              </Link>
            ))}
            <Link href="/appointment"
              className="py-4 flex justify-between items-center"
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '0.82rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: '#B08D57',
                textDecoration: 'none',
              }}>
              Book Appointment
              <span>â†’</span>
            </Link>
          </nav>
        </div>
      </header>

      {!['/', '/collection', '/brands', '/blog', '/trade-in', '/contact', '/appointment', '/find-us'].includes(pathname) && (
        <div style={{ height: '72px' }} />
      )}
    </>
  )
}

