'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const brands = [
  { name: 'Rolex',              origin: 'Switzerland', founded: '1905', desc: 'The world\'s most recognised luxury watch brand. From the iconic Submariner to the timeless Datejust.', slug: 'rolex',               logo: 'https://logo.clearbit.com/rolex.com' },
  { name: 'Patek Philippe',     origin: 'Switzerland', founded: '1839', desc: 'You never actually own a Patek Philippe — you merely look after it for the next generation.', slug: 'patek-philippe',      logo: 'https://logo.clearbit.com/patek.com' },
  { name: 'Audemars Piguet',    origin: 'Switzerland', founded: '1875', desc: 'Creators of the legendary Royal Oak, the world\'s first luxury sports watch in stainless steel.', slug: 'audemars-piguet',    logo: 'https://logo.clearbit.com/audemarspiguet.com' },
  { name: 'Richard Mille',      origin: 'Switzerland', founded: '2001', desc: 'Ultra-high-end avant-garde watchmaking with tourbillons worn on the wrists of champions.', slug: 'richard-mille',        logo: 'https://logo.clearbit.com/richardmille.com' },
  { name: 'Vacheron Constantin',origin: 'Switzerland', founded: '1755', desc: 'The oldest Swiss watch manufacturer in continuous operation — a paragon of refinement.', slug: 'vacheron-constantin',  logo: 'https://logo.clearbit.com/vacheron-constantin.com' },
  { name: 'A. Lange & Söhne',   origin: 'Germany',     founded: '1845', desc: 'The pinnacle of German haute horlogerie, celebrated for the Lange 1 and Zeitwerk.', slug: 'a-lange-sohne',          logo: 'https://logo.clearbit.com/alange-soehne.com' },
  { name: 'IWC Schaffhausen',   origin: 'Switzerland', founded: '1868', desc: 'Engineering excellence — home of the Portugieser, Pilot and Aquatimer collections.', slug: 'iwc-schaffhausen',      logo: 'https://logo.clearbit.com/iwc.com' },
  { name: 'Omega',              origin: 'Switzerland', founded: '1848', desc: 'Moon landing legends. The Speedmaster and Seamaster are icons of precision and adventure.', slug: 'omega',               logo: 'https://logo.clearbit.com/omegawatches.com' },
  { name: 'Hublot',             origin: 'Switzerland', founded: '1980', desc: 'The art of fusion — bold, avant-garde timepieces redefining modern luxury watchmaking.', slug: 'hublot',               logo: 'https://logo.clearbit.com/hublot.com' },
  { name: 'Panerai',            origin: 'Italy',       founded: '1860', desc: 'Italian soul with Swiss precision. The oversized Luminor and Radiomir command a cult following.', slug: 'panerai',             logo: 'https://logo.clearbit.com/panerai.com' },
  { name: 'Breguet',            origin: 'Switzerland', founded: '1775', desc: 'Founded by the inventor of the tourbillon. The oldest name in fine watchmaking.', slug: 'breguet',               logo: 'https://logo.clearbit.com/breguet.com' },
  { name: 'Cartier',            origin: 'France',      founded: '1847', desc: 'The jeweller of kings. The Santos, Tank and Ballon Bleu are icons of Parisian elegance.', slug: 'cartier',               logo: 'https://logo.clearbit.com/cartier.com' },
  { name: 'Chopard',            origin: 'Switzerland', founded: '1860', desc: 'Blending watchmaking mastery with haute joaillerie. Known for Happy Diamonds and L.U.C.', slug: 'chopard',               logo: 'https://logo.clearbit.com/chopard.com' },
  { name: 'Harry Winston',      origin: 'USA',         founded: '1932', desc: 'The King of Diamonds brings that same brilliance to exceptional timepieces and fine jewellery.', slug: 'harry-winston',        logo: 'https://logo.clearbit.com/harrywinston.com' },
  { name: 'MB&F',               origin: 'Switzerland', founded: '2005', desc: 'Maximilian Büsser\'s creative machines — sculptural, mechanical art that tells time.', slug: 'mbf',                   logo: 'https://logo.clearbit.com/mbandف.com' },
  { name: 'Tudor',              origin: 'Switzerland', founded: '1926', desc: 'Born from Rolex DNA, Tudor offers exceptional quality at a more accessible price point.', slug: 'tudor',                 logo: 'https://logo.clearbit.com/tudorwatch.com' },
  { name: 'Jacob & Co',         origin: 'USA',         founded: '1986', desc: 'Extravagant high-jewellery watches fusing diamond craftsmanship with complex complications.', slug: 'jacob-co',              logo: 'https://logo.clearbit.com/jacobandco.com' },
]

export default function BrandsPage() {
  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>

      {/* ── Header ── */}
      <section style={{ paddingTop: '10rem', paddingBottom: '5rem', borderBottom: '1px solid #1A1A1A' }}>
        <div className="container">
          <p className="eyebrow mb-6">Our Portfolio</p>
          <h1 style={{
            fontFamily: 'var(--sans)',
            fontWeight: 900,
            fontSize: 'clamp(3.5rem, 8vw, 8rem)',
            lineHeight: 0.9,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color: '#fff',
            marginBottom: '2.5rem',
          }}>
            Luxury<br />Brands
          </h1>
          <p className="body-sm" style={{ maxWidth: '520px' }}>
            We carry an authenticated selection of the world's most prestigious watch houses.
            Every brand tells a story — we help you find yours.
          </p>
        </div>
      </section>

      {/* ── Brand List ── */}
      <section>
        {brands.map((b, i) => (
          <Link
            key={b.slug}
            href={`/collection?brand=${b.slug}`}
            style={{ display: 'block', textDecoration: 'none', borderBottom: '1px solid #1A1A1A' }}
            className="group"
          >
            <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '3rem 5rem 1fr auto', gap: '2rem', alignItems: 'center' }}>

                {/* Number */}
                <span style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '0.75rem',
                  fontWeight: 400,
                  color: '#fff',
                  letterSpacing: '0.1em',
                  alignSelf: 'flex-start',
                  paddingTop: '0.5rem',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Logo */}
                <div style={{ width: '5rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {b.logo ? (
                    <img src={b.logo} alt={b.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.7, transition: 'opacity 0.2s' }}
                      className="group-hover:opacity-100"
                      onError={e => { e.target.style.display = 'none' }} />
                  ) : (
                    <span style={{ fontFamily: 'var(--sans)', fontWeight: 900, fontSize: '1.2rem', color: '#333', letterSpacing: '-0.02em' }}>{b.name.charAt(0)}</span>
                  )}
                </div>

                {/* Brand info */}
                <div>
                  <h2 style={{
                    fontFamily: 'var(--sans)',
                    fontWeight: 800,
                    fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
                    letterSpacing: '-0.02em',
                    textTransform: 'uppercase',
                    color: '#fff',
                    lineHeight: 1,
                    marginBottom: '0.6rem',
                    transition: 'color 0.2s',
                  }}
                  className="group-hover:text-[#B08D57]"
                  >
                    {b.name}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>
                      Est. {b.founded}
                    </span>
                    <span style={{ width: '1px', height: '12px', background: '#2A2A2A', display: 'inline-block' }} />
                    <span style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>
                      {b.origin}
                    </span>
                  </div>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9rem', color: '#fff', lineHeight: 1.6, fontWeight: 300, maxWidth: '520px' }}>
                    {b.desc}
                  </p>
                </div>

                {/* Arrow */}
                <ArrowRight
                  size={20}
                  style={{ color: '#2A2A2A', transition: 'color 0.2s, transform 0.2s', flexShrink: 0 }}
                  className="group-hover:text-[#B08D57] group-hover:translate-x-1"
                />
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '6rem 0', borderTop: '1px solid #1A1A1A' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <p className="eyebrow mb-4">Can't find your brand?</p>
              <h2 style={{
                fontFamily: 'var(--sans)',
                fontWeight: 800,
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: '#fff',
                lineHeight: 1,
              }}>
                We Source to Order
              </h2>
            </div>
            <Link href="/contact" className="btn btn-outline self-start">
              Contact Our Team <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
