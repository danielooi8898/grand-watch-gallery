'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ArrowRight, CheckCircle } from 'lucide-react'

const timeSlots = ['10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM']
const interests = ['General Browse','Specific Reference','Trade-In Discussion','Investment Advice','Jewellery','Gift Consultation']

const labelStyle = {
  fontFamily: 'var(--sans)',
  fontSize: '0.7rem',
  fontWeight: 500,
  letterSpacing: '0.25em',
  textTransform: 'uppercase',
  color: '#B08D57',
  display: 'block',
  marginBottom: '0.75rem',
}

export default function AppointmentPage() {
  const [form, setForm]     = useState({ name:'', email:'', phone:'', date:'', time:'', interest:'', notes:'' })
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.from('appointments').insert([form])
      if (!error) setSent(true)
    } catch(err) { console.error(err) }
    finally { setLoading(false) }
  }

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>

      {/* ── Header ── */}
      <section style={{ paddingTop: '10rem', paddingBottom: '5rem', borderBottom: '1px solid #1A1A1A' }}>
        <div className="container">
          <p className="eyebrow mb-6">Exclusive Experience</p>
          <h1 style={{
            fontFamily: 'var(--sans)',
            fontWeight: 900,
            fontSize: 'clamp(3rem, 7vw, 7rem)',
            lineHeight: 0.9,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color: '#fff',
            marginBottom: '2.5rem',
          }}>
            Book a<br />Private Viewing
          </h1>
          <p className="body-sm" style={{ maxWidth: '520px' }}>
            Arrange a one-on-one session with our experts at our Kuala Lumpur gallery.
            We'll prepare a curated selection based on your preferences.
          </p>
        </div>
      </section>

      {/* ── What to expect ── */}
      <section style={{ borderBottom: '1px solid #1A1A1A' }}>
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '2.5rem' }} className="sm:grid-cols-3">
            {[
              ['Personalised',    'We tailor the viewing to your specific interests and budget.'],
              ['No Obligation',   'Browse freely with zero pressure to purchase.'],
              ['Expert Guidance', 'Our team provides honest, knowledgeable advice on every piece.'],
            ].map(([t, d]) => (
              <div key={t} style={{ borderTop: '1px solid #1A1A1A', paddingTop: '2rem' }}>
                <h3 style={{
                  fontFamily: 'var(--sans)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  marginBottom: '0.75rem',
                }}>{t}</h3>
                <p className="body-sm">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form ── */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '640px' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '6rem 0' }}>
                <CheckCircle size={48} style={{ color: '#B08D57', margin: '0 auto 2rem' }} />
                <h2 style={{
                  fontFamily: 'var(--sans)',
                  fontWeight: 800,
                  fontSize: '2.5rem',
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  marginBottom: '1.5rem',
                }}>
                  Appointment Requested
                </h2>
                <p className="body-sm" style={{ maxWidth: '380px', margin: '0 auto' }}>
                  We will confirm your appointment via WhatsApp or email within a few hours.
                  We look forward to meeting you.
                </p>
              </div>
            ) : (
              <>
                <p className="eyebrow mb-10">Your Details</p>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input className="input" name="name" value={form.name} onChange={set} required placeholder="Your full name" />
                    </div>
                    <div>
                      <label style={labelStyle}>Email Address *</label>
                      <input className="input" name="email" type="email" value={form.email} onChange={set} required placeholder="your@email.com" />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Phone / WhatsApp *</label>
                    <input className="input" name="phone" value={form.phone} onChange={set} required placeholder="+601X-XXX XXXX" />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                      <label style={labelStyle}>Preferred Date *</label>
                      <input className="input" type="date" name="date" value={form.date} onChange={set} required min={minDateStr} />
                    </div>
                    <div>
                      <label style={labelStyle}>Preferred Time *</label>
                      <select className="input" name="time" value={form.time} onChange={set} required>
                        <option value="">Select a time</option>
                        {timeSlots.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Purpose of Visit *</label>
                    <select className="input" name="interest" value={form.interest} onChange={set} required>
                      <option value="">What are you looking for?</option>
                      {interests.map(i => <option key={i}>{i}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Notes (optional)</label>
                    <textarea
                      className="input"
                      name="notes"
                      value={form.notes}
                      onChange={set}
                      placeholder="Any specific watches, references, or budget range you have in mind?"
                      style={{ minHeight: '120px', resize: 'vertical' }}
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn btn-gold w-full justify-center" style={{ marginTop: '0.5rem' }}>
                    {loading ? 'Submitting...' : <><span>Request Appointment</span><ArrowRight size={14} /></>}
                  </button>

                  <p style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', fontWeight: 400, letterSpacing: '0.12em', color: '#444', textAlign: 'center' }}>
                    Mon–Sat · 10:00 AM – 7:00 PM · Kuala Lumpur
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
