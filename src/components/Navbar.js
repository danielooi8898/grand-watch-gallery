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
]

export default function Navbar() {
  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome   = pathname === '/'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  // On homepage: transparent when at top, white when scrolled
  // On all other pages: always white
  const atTop = isHome && !scrolled && !open
  const navBg = atTop ? 'transparent' : 'rgba(255,255,255,0.97)'
  const navBorder = atTop ? 'transparent' : '#E4DDD3'
  const textColor = atTop ? '#fff' : '#111'
  const logoSub   = atTop ? 'rgba(255,255,255,0.45)' : '#B08D57'

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: navBg,
          borderBottom: `1px solid ${navBorder}`,
          backdropFilter: !atTop ? 'blur(16px)' : 'none',
        }}
      >
        <div className="container flex items-center justify-between" style={{ height: '64px' }}>

          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none select-none">
            <span className="serif font-light tracking-[0.18em] uppercase transition-colors duration-500"
              style={{ fontSize: '1rem', color: textColor, letterSpacing: '0.18em' }}>
              Grand Watch
            </span>
            <span className="font-light tracking-[0.45em] uppercase transition-colors duration-500"
              style={{ fontSize: '0.5rem', color: logoSub, fontFamily: 'var(--sans)' }}>
              Gallery · Kuala Lumpur
            </span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                className="transition-colors duration-300 hover:opacity-70"
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 400,
                  color: pathname === l.href ? (atTop ? '#B08D57' : '#B08D57') : textColor,
                  textDecoration: 'none',
                }}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <Link href="/appointment"
              className="hidden md:inline-flex items-center transition-all duration-300"
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: 400,
                color: textColor,
                textDecoration: 'none',
                border: `1px solid ${atTop ? 'rgba(255,255,255,0.35)' : '#E4DDD3'}`,
                padding: '0.55rem 1.25rem',
              }}>
              Book Appointment
            </Link>

            {/* Hamburger */}
            <button
              aria-label="Menu"
              onClick={() => setOpen(v => !v)}
              className="md:hidden flex flex-col justify-center items-center gap-[5px] w-10 h-10"
            >
              <span className="block h-px w-5 transition-all duration-300"
                style={{ background: textColor, transform: open ? 'translateY(6px) rotate(45deg)' : 'none' }} />
              <span className="block h-px transition-all duration-300"
                style={{ background: textColor, width: open ? '20px' : '14px', opacity: open ? 0 : 1 }} />
              <span className="block h-px w-5 transition-all duration-300"
                style={{ background: textColor, transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none' }} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden overflow-hidden transition-all duration-400"
          style={{ maxHeight: open ? '360px' : '0', background: 'rgba(255,255,255,0.98)', borderTop: open ? '1px solid #E4DDD3' : 'none' }}>
          <nav className="container py-6 flex flex-col">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                className="py-4 border-b flex justify-between items-center transition-colors"
                style={{ borderColor: '#F0EAE0', fontFamily: 'var(--sans)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#111', textDecoration: 'none' }}>
                {l.label}
                <span style={{ color: '#B08D57', fontSize: '0.7rem' }}>→</span>
              </Link>
            ))}
            <Link href="/appointment"
              className="py-4 flex justify-between items-center"
              style={{ fontFamily: 'var(--sans)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B08D57', textDecoration: 'none' }}>
              Book Appointment
              <span style={{ fontSize: '0.7rem' }}>→</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Push content down on non-home pages */}
      {!isHome && <div style={{ height: '64px' }} />}
    </>
  )
}
