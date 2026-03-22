import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const posts = [
  { slug: 'rolex-submariner-guide',   cat: 'Buying Guide',  title: 'The Complete Rolex Submariner Buyer Guide for 2025',          excerpt: 'From reference numbers to dial variants — everything you need to know before purchasing a pre-owned Submariner in Malaysia.', date: '15 Mar 2025', read: '8 min', featured: true },
  { slug: 'patek-nautilus-history',   cat: 'Brand Story',   title: 'The Patek Philippe Nautilus: A Legacy Forged in Steel',        excerpt: 'Designed by Gerald Genta in 1976, the Nautilus changed luxury watchmaking forever. We trace its evolution from sketch to icon.', date: '2 Mar 2025', read: '6 min' },
  { slug: 'authentication-process',   cat: 'Watch Care',    title: 'How We Authenticate Every Watch at Grand Watch Gallery',       excerpt: 'Our rigorous multi-step inspection process ensures every timepiece we sell is 100% genuine. Here is exactly what we check.', date: '20 Feb 2025', read: '5 min' },
  { slug: 'richard-mille-investment', cat: 'Investment',    title: 'Are Richard Mille Watches a Good Investment in 2025?',         excerpt: 'With prices reaching into the millions, is the RM brand still a smart buy? We analyse market trends and resale data.', date: '8 Feb 2025', read: '7 min' },
  { slug: 'watch-care-tips',          cat: 'Watch Care',    title: '10 Essential Tips to Keep Your Luxury Watch in Perfect Condition', excerpt: 'From winding habits to storage — expert tips to preserve the value and beauty of your timepiece for decades.', date: '25 Jan 2025', read: '4 min' },
  { slug: 'royal-oak-50-years',       cat: 'Brand Story',   title: 'Royal Oak at 50: Why the Sports Watch Remains Undefeated',    excerpt: 'Half a century after its controversial debut, the Royal Oak is more coveted than ever. We look at why it defied all odds.', date: '10 Jan 2025', read: '6 min' },
]

export default function BlogPage() {
  const [hero, ...rest] = posts
  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>

      {/* ── Header ── */}
      <section style={{ paddingTop: '10rem', paddingBottom: '5rem', borderBottom: '1px solid #1A1A1A' }}>
        <div className="container">
          <p className="eyebrow mb-6">Insights &amp; Stories</p>
          <h1 style={{
            fontFamily: 'var(--sans)',
            fontWeight: 900,
            fontSize: 'clamp(3.5rem, 8vw, 8rem)',
            lineHeight: 0.9,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color: '#fff',
          }}>
            The<br />Journal
          </h1>
        </div>
      </section>

      {/* ── Featured article ── */}
      <section style={{ borderBottom: '1px solid #1A1A1A' }}>
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '0',
          }}
          className="md:grid-cols-2"
          >
            {/* Image block */}
            <div style={{
              background: '#111',
              minHeight: '360px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderBottom: '1px solid #1A1A1A',
            }}
            className="md:border-b-0 md:border-r"
            >
              <span style={{
                fontFamily: 'var(--sans)',
                fontWeight: 900,
                fontSize: 'clamp(4rem, 10vw, 8rem)',
                color: '#1A1A1A',
                letterSpacing: '-0.04em',
                userSelect: 'none',
              }}>GWG</span>
            </div>

            {/* Content block */}
            <div style={{ padding: '3rem 3rem 3rem 3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <span className="eyebrow">Featured</span>
                <span style={{ width: '1px', height: '12px', background: '#2A2A2A' }} />
                <span style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#444' }}>
                  {hero.cat}
                </span>
              </div>

              <h2 style={{
                fontFamily: 'var(--sans)',
                fontWeight: 800,
                fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: '#fff',
                lineHeight: 1.1,
                marginBottom: '1.5rem',
              }}>
                {hero.title}
              </h2>

              <p className="body-sm" style={{ marginBottom: '2rem', maxWidth: '440px' }}>{hero.excerpt}</p>

              <div style={{ borderTop: '1px solid #1A1A1A', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', fontWeight: 400, letterSpacing: '0.15em', color: '#444' }}>
                  {hero.date} · {hero.read} read
                </span>
                <Link href={`/blog/${hero.slug}`} style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#B08D57',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  Read Article <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Article grid ── */}
      <section style={{ borderBottom: '1px solid #1A1A1A' }}>
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)',
            gap: '0',
          }}
          className="sm:grid-cols-2 lg:grid-cols-3"
          >
            {rest.map((p, i) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  padding: '2.5rem',
                  borderRight: i < rest.length - 1 ? '1px solid #1A1A1A' : 'none',
                  borderBottom: '1px solid #1A1A1A',
                  transition: 'background 0.2s',
                }}
                className="hover:bg-[#111] group"
              >
                <span style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: '#B08D57',
                  display: 'block',
                  marginBottom: '1.25rem',
                }}>
                  {p.cat}
                </span>

                <h3 style={{
                  fontFamily: 'var(--sans)',
                  fontWeight: 700,
                  fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                  letterSpacing: '-0.01em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  lineHeight: 1.2,
                  marginBottom: '1rem',
                  transition: 'color 0.2s',
                }}
                className="group-hover:text-[#B08D57]"
                >
                  {p.title}
                </h3>

                <p style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '0.9rem',
                  color: '#666',
                  lineHeight: 1.7,
                  fontWeight: 300,
                  marginBottom: '1.75rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {p.excerpt}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1A1A1A', paddingTop: '1.25rem' }}>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', fontWeight: 400, letterSpacing: '0.12em', color: '#444' }}>
                    {p.date} · {p.read}
                  </span>
                  <ArrowRight size={14} style={{ color: '#2A2A2A', transition: 'color 0.2s' }} className="group-hover:text-[#B08D57]" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '540px' }}>
            <p className="eyebrow mb-6">Stay Informed</p>
            <h2 style={{
              fontFamily: 'var(--sans)',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: '#fff',
              lineHeight: 1.05,
              marginBottom: '1rem',
            }}>
              Get the Journal<br />Delivered
            </h2>
            <p className="body-sm" style={{ marginBottom: '2.5rem' }}>
              New articles and market insights — straight to your inbox.
            </p>
            <form style={{ display: 'flex', gap: '0' }}>
              <input
                type="email"
                className="input"
                placeholder="Your email address"
                style={{ flex: 1, borderRight: 'none' }}
              />
              <button
                type="submit"
                className="btn btn-gold"
                style={{ borderRadius: 0, flexShrink: 0 }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
