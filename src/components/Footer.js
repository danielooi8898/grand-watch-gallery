'use client'
import Link from 'next/link'

const col1 = [
  { label: 'Collection',      href: '/collection'  },
  { label: 'Our Brands',      href: '/brands'      },
  { label: 'The Journal',     href: '/blog'         },
  { label: 'Trade-In',        href: '/trade-in'    },
]
const col2 = [
  { label: 'Book Appointment', href: '/appointment' },
  { label: 'Contact Us',       href: '/contact'     },
  { label: 'Careers',          href: '/careers'     },
  { label: 'Partner With Us',  href: '/partners'   },
]

const social = [
  { label: 'Instagram', href: 'https://www.instagram.com/gwg_gallery/' },
  { label: 'Facebook',  href: 'https://www.facebook.com/GWGmy' },
  { label: 'WhatsApp',  href: 'https://wa.me/60162241804' },
]

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer style={{ background: '#0D0D0D', borderTop: '1px solid #1a1a1a' }}>
      <div className="container" style={{ padding: '5rem 1.5rem 3rem' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div className="serif font-light tracking-[0.18em] uppercase mb-1"
                style={{ color: '#fff', fontSize: '1.1rem', fontFamily: 'var(--serif)' }}>
                Grand Watch Gallery
              </div>
              <div className="uppercase tracking-[0.4em] mb-6"
                style={{ color: '#B08D57', fontSize: '0.5rem', fontFamily: 'var(--sans)', fontWeight: 400 }}>
                Kuala Lumpur &middot; Malaysia
              </div>
            </Link>
            <p style={{ color: '#555', fontSize: '0.8rem', lineHeight: 1.75, maxWidth: '300px', fontWeight: 300, fontFamily: 'var(--sans)' }}>
              Authenticated pre-owned luxury timepieces. Curated with precision, guaranteed with confidence.
            </p>
            <div className="flex gap-6 mt-8">
              {social.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="footer-social-link"
                  style={{ color: '#444', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--sans)', transition: 'color 0.2s' }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {[{ title: 'Explore', links: col1 }, { title: 'Services', links: col2 }].map(({ title, links }) => (
            <div key={title}>
              <p style={{ color: '#333', fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1.25rem', fontFamily: 'var(--sans)' }}>
                {title}
              </p>
              <ul style={{ listStyle: 'none' }}>
                {links.map(l => (
                  <li key={l.href} style={{ marginBottom: '0.75rem' }}>
                    <Link href={l.href} className="footer-nav-link"
                      style={{ color: '#555', fontSize: '0.8rem', textDecoration: 'none', fontFamily: 'var(--sans)', fontWeight: 300, transition: 'color 0.2s' }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact bar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 py-6"
          style={{ borderTop: '1px solid #1a1a1a' }}>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <a href="tel:+60166824848"
              style={{ color: '#444', fontSize: '0.7rem', textDecoration: 'none', fontFamily: 'var(--sans)', letterSpacing: '0.05em' }}>
              +6016-682 4848
            </a>
            <a href="https://wa.me/60162241804" target="_blank" rel="noopener noreferrer"
              style={{ color: '#444', fontSize: '0.7rem', textDecoration: 'none', fontFamily: 'var(--sans)', letterSpacing: '0.05em' }}>
              +6016-224 1804 (WhatsApp)
            </a>
          </div>
          <p suppressHydrationWarning style={{ color: '#333', fontSize: '0.65rem', fontFamily: 'var(--sans)', fontWeight: 300 }}>
            {'\u00A9'} {YEAR} Grand Watch &amp; Jewellery Sdn. Bhd. (624044-T)
          </p>
        </div>
      </div>
    </footer>
  )
}
