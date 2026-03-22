'use client'
import Link from 'next/link'
import { ArrowUpRight, Phone, Navigation, Clock } from 'lucide-react'

const hours = [
  { day: 'Monday',    time: '10:00am – 7:00pm' },
  { day: 'Tuesday',   time: '10:00am – 7:00pm' },
  { day: 'Wednesday', time: '10:00am – 7:00pm' },
  { day: 'Thursday',  time: '10:00am – 7:00pm' },
  { day: 'Friday',    time: '10:00am – 7:00pm' },
  { day: 'Saturday',  time: '10:00am – 7:00pm' },
  { day: 'Sunday',    time: 'By appointment only' },
]

export default function FindUsPage() {
  return (
    <>
      {/* Info Section */}
      <section style={{ background: '#0A0A0A', paddingTop: '8rem', paddingBottom: '5rem', minHeight: '55vh' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            {/* Left */}
            <div>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '0.72rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#B08D57', marginBottom: '1.5rem' }}>
                Our Location
              </p>
              <h1 style={{ fontFamily: 'var(--sans)', fontWeight: 900, fontSize: 'clamp(2rem,4vw,3.5rem)', color: '#fff', textTransform: 'uppercase', lineHeight: 1.05, letterSpacing: '-0.01em', marginBottom: '2.5rem' }}>
                Grand Watch Gallery
              </h1>

              <div style={{ marginBottom: '3rem' }}>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '1.05rem', color: '#fff', lineHeight: 2.2, fontWeight: 300 }}>
                  Lot G31, Ground Floor<br />
                  Atria Shopping Gallery<br />
                  Jalan SS 22/23, Damansara Jaya<br />
                  47400 Petaling Jaya, Selangor
                </p>
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <Link href="/appointment"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                    fontFamily: 'var(--sans)', fontSize: '0.75rem', fontWeight: 700,
                    letterSpacing: '0.25em', textTransform: 'uppercase',
                    color: '#fff', textDecoration: 'none', paddingBottom: '0.4rem',
                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                  }}>
                  Book an Appointment <ArrowUpRight size={14} />
                </Link>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <a href="https://www.google.com/maps/dir/?api=1&destination=Atria+Shopping+Gallery+Petaling+Jaya"
                  target="_blank" rel="noopener noreferrer"
                  style={{ width: '48px', height: '48px', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#B08D57'; e.currentTarget.style.color = '#B08D57' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff' }}>
                  <Navigation size={18} />
                </a>
                <a href="tel:+60166824848"
                  style={{ width: '48px', height: '48px', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#B08D57'; e.currentTarget.style.color = '#B08D57' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff' }}>
                  <Phone size={18} />
                </a>
              </div>
            </div>

            {/* Right — Hours */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <Clock size={14} style={{ color: '#B08D57' }} />
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.72rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#B08D57' }}>
                  Opening Hours
                </p>
              </div>
              <div>
                {hours.map(({ day, time }) => (
                  <div key={day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '1rem 0', borderBottom: '1px solid #1A1A1A' }}>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: '0.9rem', color: '#fff', fontWeight: 400 }}>{day}</span>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: '0.85rem', color: '#fff', fontWeight: 300 }}>{time}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid #1A1A1A' }}>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.68rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#B08D57', marginBottom: '0.75rem' }}>Phone & WhatsApp</p>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '1rem', color: '#fff', fontWeight: 300, lineHeight: 2 }}>
                  +6016-682 4848<br />+6016-311 3633<br />+6010-234 5100
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map — dark styled */}
      <section style={{ width: '100%', height: '480px', position: 'relative' }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.7953064960346!2d101.71305931475403!3d3.1488752977055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc362abd08e8b5%3A0x2e8e0dff80c0ef0e!2sAtria+Shopping+Gallery+Damansara+Jaya!5e0!3m2!1sen!2smy!4v1680000000000!5m2!1sen!2smy"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.85) contrast(1.1)', display: 'block' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Grand Watch Gallery Location"
        />
        <a href="https://www.google.com/maps/dir/?api=1&destination=Atria+Shopping+Gallery+Petaling+Jaya"
          target="_blank" rel="noopener noreferrer"
          style={{ position: 'absolute', bottom: '2rem', right: '2rem', background: '#0A0A0A', border: '1px solid #B08D57', color: '#B08D57', padding: '0.75rem 1.5rem', fontFamily: 'var(--sans)', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          Get Directions <ArrowUpRight size={13} />
        </a>
      </section>

      {/* Bottom CTA */}
      <section style={{ background: '#0A0A0A', padding: '5rem 0', borderTop: '1px solid #1A1A1A' }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '0.72rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#B08D57', marginBottom: '1.25rem' }}>Visit Us</p>
              <h2 style={{ fontFamily: 'var(--sans)', fontWeight: 900, fontSize: 'clamp(2rem,4vw,3rem)', color: '#fff', textTransform: 'uppercase', lineHeight: 1.05, marginBottom: '1.5rem' }}>
                A Private Gallery<br />Experience
              </h2>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '0.95rem', color: '#fff', lineHeight: 1.8, fontWeight: 300, maxWidth: '420px', marginBottom: '2.5rem' }}>
                Our gallery is designed for an unhurried, one-on-one experience. Browse authenticated timepieces with no pressure and full expert guidance.
              </p>
              <Link href="/appointment"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: '#B08D57', color: '#fff', padding: '0.9rem 2rem', fontFamily: 'var(--sans)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Book a Private Viewing <ArrowUpRight size={13} />
              </Link>
            </div>
            <div style={{ background: '#111', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--sans)', fontWeight: 900, fontSize: '4rem', color: '#1a1a1a', letterSpacing: '-0.05em' }}>GWG</div>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#333', marginTop: '0.5rem' }}>Gallery Interior</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
