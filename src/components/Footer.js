'use client'
import Link from 'next/link'

const col1 = [
  { label: 'Collection',  href: '/collection' },
  { label: 'Our Brands',  href: '/brands'     },
  { label: 'The Journal', href: '/blog'        },
  { label: 'Trade-In',    href: '/trade-in'   },
  { label: 'Find Us',     href: '/find-us'    },
]
const col2 = [
  { label: 'Book Appointment', href: '/appointment' },
  { label: 'Contact Us',       href: '/contact'     },
  { label: 'Careers',          href: '/careers'     },
  { label: 'Partner With Us',  href: '/partners'    },
]

const social = [
  { label: 'Instagram', href: 'https://www.instagram.com/gwg_gallery/' },
  { label: 'Facebook',  href: 'https://www.facebook.com/GWGmy' },
  { label: 'WhatsApp',  href: 'https://wa.me/60162241804' },
]

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer style={{ background: '#111', borderTop: '1px solid #222' }}>
      <div className="container" style={{ padding: '5rem 1.5rem 2.5rem' }}>

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8" style={{ marginBottom: '4rem' }}>

          {/* Brand column */}
          <div className="md:col-span-2">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{
                fontFamily: 'var(--sans)',
                fontWeight: 800,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#fff',
                fontSize: '1rem',
                marginBottom: '1.5rem',
              }}>
                Grand Watch Gallery
              </div>
            </Link>
            <p style={{
              color: '#888',
              fontSize: '0.88rem',
              lineHeight: 1.8,
              maxWidth: '300px',
              fontWeight: 300,
              fontFamily: 'var(--sans)',
              marginBottom: '2rem',
            }}>
              Authenticated pre-owned luxury timepieces.<br />
              Curated with precision, guaranteed with confidence.
            </p>
            <div style={{ display: 'flex', gap: '2rem' }}>
              {social.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{
                    color: '#777',
                    fontSize: '0.72rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    fontFamily: 'var(--sans)',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.target.style.color = '#B08D57'}
                  onMouseLeave={e => e.target.style.color = '#777'}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {[{ title: 'Navigate', links: col1 }, { title: 'Connect', links: col2 }].map(({ title, links }) => (
            <div key={title}>
              <p style={{
                color: '#B08D57',
                fontSize: '0.68rem',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
                fontFamily: 'var(--sans)',
                fontWeight: 600,
              }}>
                {title}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {links.map(l => (
                  <li key={l.href} style={{ marginBottom: '0.9rem' }}>
                    <Link href={l.href}
                      style={{
                        color: '#888',
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                        fontFamily: 'var(--sans)',
                        fontWeight: 300,
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={e => e.target.style.color = '#fff'}
                      onMouseLeave={e => e.target.style.color = '#888'}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #222',
          paddingTop: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <a href="tel:+60166824848"
                style={{ color: '#777', fontSize: '0.78rem', textDecoration: 'none', fontFamily: 'var(--sans)', letterSpacing: '0.03em' }}>
                +6016-682 4848
              </a>
              <a href="https://wa.me/60162241804" target="_blank" rel="noopener noreferrer"
                style={{ color: '#777', fontSize: '0.78rem', textDecoration: 'none', fontFamily: 'var(--sans)', letterSpacing: '0.03em' }}>
                +6016-224 1804 (WhatsApp)
              </a>
            </div>
            <p suppressHydrationWarning
              style={{ color: '#555', fontSize: '0.72rem', fontFamily: 'var(--sans)', fontWeight: 300 }}>
              &copy; {YEAR} Grand Watch &amp; Jewellery Sdn. Bhd. (624044-T)
            </p>
          </div>
        </div>

      </div>
    </footer>
  )
}
