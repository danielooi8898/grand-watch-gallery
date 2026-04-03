import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function AboutPage() {
  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>

      {/* ── Header ── */}
      <section style={{ paddingTop: '10rem', paddingBottom: '5rem', borderBottom: '1px solid #1A1A1A', position: 'relative', overflow: 'hidden' }}>
        <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} src="/about-hero.mov" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,10,0.95) 50%, rgba(10,10,10,0.5))' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <p className="eyebrow mb-6">Our Story</p>
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
            About<br />Us
          </h1>
        </div>
      </section>

      {/* ── Story ── */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '780px' }}>

            <p style={{ fontFamily: 'var(--sans)', fontSize: '1.25rem', color: '#fff', lineHeight: 1.8, fontWeight: 300, marginBottom: '2.5rem', borderLeft: '2px solid #B08D57', paddingLeft: '1.5rem' }}>
              For over 10 years, Grand Watch Gallery (GWG) has been built on one simple foundation — a genuine passion for fine watches and jewellery.
            </p>

            <p style={{ fontFamily: 'var(--sans)', fontSize: '1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.9, fontWeight: 300, marginBottom: '2rem' }}>
              What began as a love for craftsmanship grew into our first retail store in Berjaya Times Square, Kuala Lumpur, in the early 2000s. From there, our journey expanded beyond retail into the international jewellery auction scene in Hong Kong, where we participated in prestigious houses such as Christie's and Phillips.
            </p>

            <p style={{ fontFamily: 'var(--sans)', fontSize: '1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.9, fontWeight: 300, marginBottom: '2rem' }}>
              These experiences deepened our expertise, strengthened our network, and refined our eye for timeless value. As our reputation grew, so did our reach — working with partners and clients across London, Hong Kong, Brunei, and Kuala Lumpur.
            </p>

            <p style={{ fontFamily: 'var(--sans)', fontSize: '1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.9, fontWeight: 300, marginBottom: '2rem' }}>
              With decades of knowledge in sourcing, trading, and valuing luxury pieces, we opened a new chapter with our store at Atria Shopping Gallery, Damansara, later expanding into a larger space within the same mall to better serve our community.
            </p>

            <p style={{ fontFamily: 'var(--sans)', fontSize: '1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.9, fontWeight: 300, marginBottom: '2rem' }}>
              Through economic downturns, including the challenges of COVID-19, we remained committed to our clients — continuing to buy, sell, trade, and service luxury watches and jewellery with honesty and care.
            </p>

            <p style={{ fontFamily: 'var(--sans)', fontSize: '1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.9, fontWeight: 300, marginBottom: '3rem' }}>
              Today, Grand Watch Gallery is proud to be a trusted name in Malaysia — built on heritage, relationships, and a passion that still drives us forward every day.
            </p>

            <p style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', color: '#B08D57', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '4rem' }}>
              "Thank you to every customer, partner, and friend who has been part of our journey."
            </p>

          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ borderTop: '1px solid #1A1A1A', borderBottom: '1px solid #1A1A1A', padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', textAlign: 'center' }}>
            {[
              { n: '10+', l: 'Years in Business' },
              { n: '500+', l: 'Watches Sold' },
              { n: '17', l: 'Luxury Brands' },
            ].map(s => (
              <div key={s.l}>
                <div style={{ fontFamily: 'var(--serif)', fontWeight: 300, fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: '0.78rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B08D57', marginTop: '0.5rem' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <p className="eyebrow mb-4">Visit Us</p>
              <h2 style={{
                fontFamily: 'var(--sans)',
                fontWeight: 800,
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: '#fff',
                lineHeight: 1,
              }}>
                Come Meet The Team
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/find-us" className="btn btn-gold">
                Find Us <ArrowRight size={14} />
              </Link>
              <Link href="/appointment" className="btn btn-outline">
                Book Appointment <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
