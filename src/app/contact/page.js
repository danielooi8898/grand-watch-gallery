'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ArrowRight, CheckCircle } from 'lucide-react'

const D_CONTACT = {
  phone:    '+6016-682 4848',
  whatsapp: '60162241804',
  email:    'info@grandwatchgallery.com',
  address:  'Lot G31, Ground Floor\nAtria Shopping Gallery\nJalan SS 22/23, Damansara Jaya\n47400 Petaling Jaya, Selangor',
  hours:    'Mon – Sat: 10:00am – 7:00pm\nSunday: By appointment only',
}

const labelStyle = {
  fontFamily:'var(--sans)', fontSize:'0.7rem', fontWeight:600,
  letterSpacing:'0.22em', textTransform:'uppercase', color:'#B08D57',
  display:'block', marginBottom:'0.6rem',
}

export default function ContactPage() {
  const [info, setInfo]   = useState(D_CONTACT)
  const [form, setForm]   = useState({ name:'', email:'', phone:'', subject:'', message:'' })
  const [sent, setSent]   = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('site_settings').select('key,value')
      .in('key', ['phone','whatsapp','email','address','hours'])
      .then(({ data }) => {
        if (!data) return
        const loaded = { ...D_CONTACT }
        data.forEach(r => { if (r.value != null) loaded[r.key] = typeof r.value === 'string' ? r.value : String(r.value) })
        setInfo(loaded)
      })
  }, [])

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault(); setLoading(true)
    try {
      const { error } = await supabase.from('contact_messages').insert([form])
      if (!error) setSent(true)
    } catch {}
    finally { setLoading(false) }
  }

  const addressLines = (info.address || '').split('\n').filter(Boolean)
  const hourLines    = (info.hours   || '').split('\n').filter(Boolean)

  return (
    <>
      <section style={{ paddingTop:'9rem', paddingBottom:'4rem', background:'#0A0A0A', borderBottom:'1px solid #1a1a1a' }}>
        <div className="container">
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', letterSpacing:'0.35em', textTransform:'uppercase', color:'#B08D57', marginBottom:'1rem' }}>Get in Touch</p>
          <h1 style={{ fontFamily:'var(--sans)', fontWeight:900, fontSize:'clamp(2.5rem,6vw,5rem)', color:'#fff', textTransform:'uppercase', lineHeight:1, letterSpacing:'-0.01em' }}>
            Contact Us
          </h1>
        </div>
      </section>

      <section style={{ background:'#0A0A0A', padding:'5rem 0 6rem' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            {/* Left – Info */}
            <div style={{ display:'flex', flexDirection:'column', gap:'2.5rem' }}>

              <div style={{ paddingBottom:'2.5rem', borderBottom:'1px solid #1a1a1a' }}>
                <p style={labelStyle}>Location</p>
                {addressLines.map((l,i) => (
                  <p key={i} style={{ fontFamily:'var(--sans)', fontSize:'0.95rem', color:'#fff', lineHeight:2, fontWeight:300 }}>{l}</p>
                ))}
              </div>

              <div style={{ paddingBottom:'2.5rem', borderBottom:'1px solid #1a1a1a' }}>
                <p style={labelStyle}>Opening Hours</p>
                {hourLines.map((l,i) => (
                  <p key={i} style={{ fontFamily:'var(--sans)', fontSize:'0.95rem', color:'#fff', lineHeight:2, fontWeight:300 }}>{l}</p>
                ))}
              </div>

              <div style={{ paddingBottom:'2.5rem', borderBottom:'1px solid #1a1a1a' }}>
                <p style={labelStyle}>Phone & WhatsApp</p>
                <p style={{ fontFamily:'var(--sans)', fontSize:'0.95rem', color:'#fff', lineHeight:2, fontWeight:300 }}>{info.phone}</p>
                {info.email && <p style={{ fontFamily:'var(--sans)', fontSize:'0.95rem', color:'#fff', lineHeight:2, fontWeight:300 }}>{info.email}</p>}
              </div>

              <div style={{ paddingBottom:'2.5rem', borderBottom:'1px solid #1a1a1a' }}>
                <p style={labelStyle}>Follow</p>
                <div style={{ display:'flex', gap:'2rem', flexWrap:'wrap', marginTop:'0.5rem' }}>
                  {[
                    { label:'Instagram', href:'https://www.instagram.com/gwg_gallery/' },
                    { label:'Facebook',  href:'https://www.facebook.com/GWGmy' },
                    { label:'WhatsApp',  href:`https://wa.me/${info.whatsapp}` },
                  ].map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'#fff', textDecoration:'none', transition:'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color='#B08D57'}
                      onMouseLeave={e => e.target.style.color='#fff'}>
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                <a href={`https://wa.me/${info.whatsapp}?text=Hello%20Grand%20Watch%20Gallery%2C%20I%20have%20an%20enquiry.`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.5rem', background:'#B08D57', color:'#fff', textDecoration:'none', fontFamily:'var(--sans)', fontSize:'0.72rem', letterSpacing:'0.2em', textTransform:'uppercase', fontWeight:600 }}>
                  Chat on WhatsApp <ArrowRight size={14} />
                </a>
                <a href={`tel:${info.phone.replace(/\s/g,'')}`}
                  style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.5rem', border:'1px solid rgba(255,255,255,0.2)', color:'#fff', textDecoration:'none', fontFamily:'var(--sans)', fontSize:'0.72rem', letterSpacing:'0.2em', textTransform:'uppercase', fontWeight:500 }}>
                  Call Us Now <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Right – Form */}
            <div>
              {sent ? (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'400px', textAlign:'center' }}>
                  <CheckCircle size={40} style={{ color:'#B08D57', marginBottom:'1.5rem' }} />
                  <h2 style={{ fontFamily:'var(--sans)', fontWeight:900, fontSize:'2rem', color:'#fff', textTransform:'uppercase', marginBottom:'1rem' }}>Message Sent</h2>
                  <p style={{ fontFamily:'var(--sans)', fontSize:'0.95rem', color:'#fff', lineHeight:1.8, maxWidth:'300px' }}>
                    We will get back to you within one business day. For faster response, WhatsApp us directly.
                  </p>
                </div>
              ) : (
                <>
                  <p style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#B08D57', marginBottom:'2rem' }}>Send a Message</p>
                  <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap:'1.5rem' }}>
                      <div><label style={labelStyle}>Name *</label><input className="input" name="name" value={form.name} onChange={set} required placeholder="Your name" /></div>
                      <div><label style={labelStyle}>Email *</label><input className="input" name="email" type="email" value={form.email} onChange={set} required /></div>
                      <div><label style={labelStyle}>Phone</label><input className="input" name="phone" value={form.phone} onChange={set} placeholder="+601X-XXX XXXX" /></div>
                      <div>
                        <label style={labelStyle}>Subject *</label>
                        <select className="input" name="subject" value={form.subject} onChange={set} required>
                          <option value="">Select subject</option>
                          <option>Watch Enquiry</option><option>Trade-In / Sell</option>
                          <option>Book Appointment</option><option>Pricing & Availability</option>
                          <option>Partnership</option><option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Message *</label>
                      <textarea className="input resize-none" name="message" value={form.message} onChange={set} required placeholder="How can we help you?" style={{ height:'8rem' }} />
                    </div>
                    <button type="submit" disabled={loading}
                      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.75rem', padding:'1rem 2rem', background:'#fff', color:'#0A0A0A', border:'none', fontFamily:'var(--sans)', fontSize:'0.72rem', letterSpacing:'0.2em', textTransform:'uppercase', fontWeight:700, cursor:'pointer', width:'100%' }}>
                      {loading ? 'Sending…' : <><span>Send Message</span><ArrowRight size={13} /></>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
