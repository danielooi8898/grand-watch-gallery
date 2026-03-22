'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
        <div className="container flex items-center justify-between" style={{ height: '68px' }}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 select-none">
            <Image
              src="/gwg-logo.svg"
              alt="Grand Watch Gallery"
              width={40}
              height={40}
              className="invert"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <div className="flex flex-col leading-none">
              <span style={{
                fontFamily: 'var(--sans)',
                fontSize: '0.95rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#fff',
              }}>
                Grand Watch
              </span>
              <span style={{
                fontFamily: 'var(--sans)',
                fontSize: '0.55rem',
                fontWeight: 400,
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: '#B08D57',
              }}>
                Gallery · Kuala Lumpur
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  color: pathname === l.href ? '#B08D57' : 'rgba(255,255,255,0.75)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = pathname === l.href ? '#B08D57' : 'rgba(255,255,255,0.75)'}
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
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontWeight: 500,
                color: '#fff',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.25)',
                padding: '0.6rem 1.4rem',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
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
                  fontSize: '0.8rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  color: pathname === l.href ? '#B08D57' : '#fff',
                  textDecoration: 'none',
                }}>
                {l.label}
                <span style={{ color: '#B08D57', fontSize: '0.9rem' }}>→</span>
              </Link>
            ))}
            <Link href="/appointment"
              className="py-4 flex justify-between items-center"
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '0.8rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontWeight: 500,
                color: '#B08D57',
                textDecoration: 'none',
              }}>
              Book Appointment
              <span style={{ fontSize: '0.9rem' }}>→</span>
            </Link>
          </nav>
        </div>
      </header>

      {!['/', '/collection', '/brands', '/blog', '/trade-in', '/contact', '/appointment'].includes(pathname) && (
        <div style={{ height: '68px' }} />
      )}
    </>
  )
}
