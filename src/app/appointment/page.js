'use client'
import { useState } from 'react'
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
  const [form, setForm]       = useState({ name:'', email:'', phone:'', date:'', time:'', interest:'', notes:'' })
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  const handleSubmit = async () => {
    setError('')
    if (!form.name || !form.email || !form.phone || !form.date || !form.time || !form.interest) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'appointment', data: form }),
      })
      // Fire-and-forget DB save via API route
      fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'appointment', name: form.name, email: form.email, data: form }),
      }).catch(() => {})
      fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'appointment', name: form.name, email: form.email, phone: form.phone, data: form }),
      }).catch(() => {})
    } catch (err) {
      console.error('Appointment submit error:', err)
    } finally {
      setLoading(false)
      setSent(true)
    }
  }

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>

      {/* Header */}
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
            Arrange a one-on-one session with our experts at our gallery.
            We&apos;ll prepare a curated selection based on your preferences.
          </p>
        </div>
      </section>

      {/* What to expect */}
      <section style={{ borderBottom: '1px solid #1A1A1A' }}>
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '2.5rem' }}>
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
                <p className="body-sm" style={{ marginTop:'0.75rem' }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '640px' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '6rem 0' }}>
                <CheckCircle size={48} style={{ color: '#B08D57', display: 'block', margin: '0 auto 2rem' }} />
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.5rem' }}>
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input className="input" name="name" value={form.name} onChange={set} placeholder="Your full name" />
                    </div>
                    <div>
                      <label style={labelStyle}>Email Address *</label>
                      <input className="input" name="email" type="email" value={form.email} onChange={set} placeholder="your@email.com" />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Phone / WhatsApp *</label>
                    <input className="input" name="phone" value={form.phone} onChange={set} placeholder="+601X-XXX XXXX" />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.5rem' }}>
                    <div>
                      <label style={labelStyle}>Preferred Date *</label>
                      <input className="input" type="date" name="date" value={form.date} onChange={set} min={minDateStr} />
                    </div>
                    <div>
                      <label style={labelStyle}>Preferred Time *</label>
                      <select className="input" name="time" value={form.time} onChange={set}>
                        <option value="">Select a time</option>
                        {timeSlots.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Purpose of Visit *</label>
                    <select className="input" name="interest" value={form.interest} onChange={set}>
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

                  {error && (
                    <p style={{ fontFamily: 'var(--sans)', fontSize: '0.8rem', color: '#e05a5a', textAlign: 'center' }}>
                      {error}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn btn-gold w-full justify-center"
                    style={{ marginTop: '2rem' }}
                  >
                    {loading ? 'Submitting…' : <><span>Request Appointment</span><ArrowRight size={14} /></>}
                  </button>

                  <p style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', fontWeight: 400, letterSpacing: '0.12em', color: '#fff', textAlign: 'center' }}>
                    Mon-Sat &middot; 10:00 AM - 7:00 PM
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
