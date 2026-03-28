'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ArrowRight, CheckCircle } from 'lucide-react'

const labelStyle = {
  fontFamily: 'var(--sans)',
  fontSize: '0.7rem',
  fontWeight: 600,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: '#B08D57',
  display: 'block',
  marginBottom: '0.6rem',
}

const steps = [
  { n: '01', title: 'Submit Details', desc: 'Fill out the form below with your watch details \u2014 brand, model, condition, and any relevant history.' },
  { n: '02', title: 'We Assess',      desc: 'Our experts review your submission and provide a competitive, transparent valuation within 24 hours.' },
  { n: '03', title: 'Get Paid',       desc: 'Accept our offer and receive payment swiftly and securely. No hassle, no hidden fees.' },
]

export default function TradeInPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', brand:'', model:'', ref:'', year:'', condition:'', papers:'', box:'', notes:'' })
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.from('trade_in_requests').insert([form])
      if (!error) {
        setSent(true)
        fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'trade_in', data: form }),
        }).catch(() => {})
      }
    } catch(err) { console.error(err) }
    finally { setLoading(false) }
  }

  return (
    <>
      {/* Header */}
      <section style={{ paddingTop: '9rem', paddingBottom: '4rem', background: '#0A0A0A', borderBottom: '1px solid #1a1a1a' }}>
        <div className="container">
          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.72rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#B08D57', marginBottom: '1rem' }}>
            Sell or Exchange
          </p>
          <h1 style={{ fontFamily: 'var(--sans)', fontWeight: 900, fontSize: 'clamp(2.5rem,6vw,5rem)', color: '#fff', textTransform: 'uppercase', lineHeight: 1, letterSpacing: '-0.01em', marginBottom: '1.5rem' }}>
            Trade-In Programme
          </h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '1rem', color: '#888', lineHeight: 1.8, fontWeight: 300, maxWidth: '480px' }}>
            We offer competitive, transparent valuations for pre-owned luxury watches. No obligation \u2014 just honest pricing from experts who care.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section style={{ background: '#0D0D0D', padding: '5rem 0', borderBottom: '1px solid #1a1a1a' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '0' }}>
            {steps.map(({ n, title, desc }, i) => (
              <div key={n} style={{
                padding: '3rem',
                borderRight: i < 2 ? '1px solid #1a1a1a' : 'none',
                borderBottom: '1px solid #1a1a1a',
              }}>
                <div style={{ fontFamily: 'var(--sans)', fontWeight: 900, fontSize: '5rem', color: '#B08D57', opacity: 0.25, lineHeight: 1, marginBottom: '2rem', letterSpacing: '-0.02em' }}>
                  {n}
                </div>
                <h3 style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: '1.1rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                  {title}
                </h3>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9rem', color: '#888', lineHeight: 1.8, fontWeight: 300 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section style={{ background: '#0A0A0A', padding: '6rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                <CheckCircle size={40} style={{ color: '#B08D57', margin: '0 auto 1.5rem' }} />
                <h2 style={{ fontFamily: 'var(--sans)', fontWeight: 900, fontSize: '2rem', color: '#fff', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  Request Received
                </h2>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.95rem', color: '#888', lineHeight: 1.8, maxWidth: '340px', margin: '0 auto' }}>
                  Our team will contact you within one business day with a valuation. For faster response, WhatsApp us directly.
                </p>
              </div>
            ) : (
              <>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.72rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#B08D57', marginBottom: '2.5rem' }}>
                  Watch Details
                </p>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.5rem' }}>
                    <div>
                      <label style={labelStyle}>Your Name *</label>
                      <input className="input" name="name" value={form.name} onChange={set} required placeholder="Full name" />
                    </div>
                    <div>
                      <label style={labelStyle}>Email *</label>
                      <input className="input" name="email" type="email" value={form.email} onChange={set} required />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone / WhatsApp *</label>
                      <input className="input" name="phone" value={form.phone} onChange={set} required placeholder="+601X-XXX XXXX" />
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '1.5rem' }} />

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.5rem' }}>
                    <div>
                      <label style={labelStyle}>Brand *</label>
                      <input className="input" name="brand" value={form.brand} onChange={set} required placeholder="e.g. Rolex" />
                    </div>
                    <div>
                      <label style={labelStyle}>Model *</label>
                      <input className="input" name="model" value={form.model} onChange={set} required placeholder="e.g. Submariner" />
                    </div>
                    <div>
                      <label style={labelStyle}>Reference Number</label>
                      <input className="input" name="ref" value={form.ref} onChange={set} placeholder="e.g. 126610LN" />
                    </div>
                    <div>
                      <label style={labelStyle}>Year</label>
                      <input className="input" name="year" value={form.year} onChange={set} placeholder="e.g. 2021" />
                    </div>
                    <div>
                      <label style={labelStyle}>Condition *</label>
                      <select className="input" name="condition" value={form.condition} onChange={set} required>
                        <option value="">Select condition</option>
                        <option>Mint / Unworn</option>
                        <option>Excellent</option>
                        <option>Very Good</option>
                        <option>Good</option>
                        <option>Fair</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Box &amp; Papers</label>
                      <select className="input" name="papers" value={form.papers} onChange={set}>
                        <option value="">Select</option>
                        <option>Full Set (Box + Papers)</option>
                        <option>Papers Only</option>
                        <option>Box Only</option>
                        <option>No Box or Papers</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Additional Notes</label>
                    <textarea className="input resize-none" name="notes" value={form.notes} onChange={set}
                      placeholder="Any other details \u2014 servicing history, modifications, urgency, etc."
                      style={{ height: '7rem' }} />
                  </div>

                  <button type="submit" disabled={loading}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1.1rem 2rem', background: '#B08D57', color: '#fff', border: 'none', fontFamily: 'var(--sans)', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', width: '100%', marginTop: '0.5rem' }}>
                    {loading ? 'Submitting...' : <><span>Submit for Valuation</span> <ArrowRight size={13} /></>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
