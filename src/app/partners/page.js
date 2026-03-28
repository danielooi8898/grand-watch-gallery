'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ArrowRight, CheckCircle } from 'lucide-react'

const DEF_TYPES = [
  { title:'Watch Dealers',         desc:'Trade stock, source specific references, and access our authenticated inventory for your own clients.' },
  { title:'Corporate Gifting',     desc:'Source authenticated luxury timepieces for corporate milestones, awards, and executive gifts.' },
  { title:'Estate & Consignment',  desc:'We handle the sale of inherited or consigned watches with full discretion and fair valuation.' },
  { title:'Referral Programme',    desc:'Earn a commission by referring clients who complete a purchase. Simple, transparent, rewarding.' },
]

const ey  = { fontFamily:'var(--sans)', fontSize:'0.65rem', letterSpacing:'0.25em', textTransform:'uppercase', color:'#B08D57', display:'block', marginBottom:'0.5rem', fontWeight:600 }
const inp = { width:'100%', padding:'0.75rem 1rem', fontFamily:'var(--sans)', fontSize:'0.85rem', border:'1px solid #222', background:'#0d0d0d', outline:'none', color:'#fff', boxSizing:'border-box', transition:'border-color 0.15s' }

export default function PartnersPage() {
  const [partnerTypes, setPartnerTypes] = useState(DEF_TYPES)
  const [form, setForm]   = useState({ name:'', email:'', phone:'', company:'', type:'', message:'' })
  const [sent, setSent]   = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key','partner_types').single()
      .then(({ data }) => {
        if (!data?.value) return
        try {
          const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value
          if (Array.isArray(parsed) && parsed.length > 0) setPartnerTypes(parsed)
        } catch {}
      })
  }, [])

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.from('partner_enquiries').insert([form])
      if (!error) {
        setSent(true)
        fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'partner', data: form }),
        }).catch(() => {})
      }
    } catch(err) { console.error(err) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ background:'#0A0A0A', minHeight:'100vh' }}>

      {/* Header */}
      <section style={{ paddingTop:'9rem', paddingBottom:'4rem', borderBottom:'1px solid #111' }}>
        <div className="container">
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.68rem', letterSpacing:'0.35em', textTransform:'uppercase', color:'#B08D57', marginBottom:'1rem' }}>Collaborate</p>
          <h1 style={{ fontFamily:'var(--sans)', fontWeight:900, fontSize:'clamp(2.5rem,6vw,5rem)', color:'#fff', textTransform:'uppercase', lineHeight:1, letterSpacing:'-0.01em', marginBottom:'1.5rem' }}>
            Partner With Us
          </h1>
          <div style={{ width:'40px', height:'1px', background:'#B08D57', margin:'1.5rem 0' }} />
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.95rem', color:'#888', lineHeight:1.8, fontWeight:300, maxWidth:'520px' }}>
            We work with dealers, corporates, estates, and referral partners across Malaysia and beyond. If you see an opportunity to work together, we want to hear from you.
          </p>
        </div>
      </section>

      {/* Partner Types Grid */}
      <section style={{ borderBottom:'1px solid #111' }}>
        <div className="container" style={{ padding:'0' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'1px', background:'#111' }}>
            {partnerTypes.map(({ title, desc }, i) => (
              <div key={i} style={{ background:'#0A0A0A', padding:'3rem', transition:'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background='#050505'}
                onMouseLeave={e => e.currentTarget.style.background='#0A0A0A'}>
                <h3 style={{ fontFamily:'var(--sans)', fontWeight:300, fontSize:'1.1rem', color:'#fff', marginBottom:'1rem' }}>{title}</h3>
                <p style={{ fontFamily:'var(--sans)', fontSize:'0.85rem', color:'#888', lineHeight:1.8 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section style={{ padding:'5rem 0' }}>
        <div className="container" style={{ maxWidth:'560px' }}>
          {sent ? (
            <div style={{ textAlign:'center', padding:'4rem 0' }}>
              <CheckCircle size={36} style={{ color:'#B08D57', margin:'0 auto 1.5rem', display:'block' }} />
              <h2 style={{ fontFamily:'var(--sans)', fontWeight:900, fontSize:'2rem', color:'#fff', textTransform:'uppercase', marginBottom:'1rem' }}>Enquiry Received</h2>
              <p style={{ fontFamily:'var(--sans)', fontSize:'0.9rem', color:'#888', lineHeight:1.8, maxWidth:'340px', margin:'0 auto' }}>
                Thank you for reaching out. A member of our team will be in touch within one business day.
              </p>
            </div>
          ) : (
            <>
              <p style={{ fontFamily:'var(--sans)', fontSize:'0.68rem', letterSpacing:'0.35em', textTransform:'uppercase', color:'#B08D57', marginBottom:'2rem' }}>Get in Touch</p>
              <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem' }}>
                  <div>
                    <label style={ey}>Name *</label>
                    <input style={inp} name="name" value={form.name} onChange={set} required placeholder="Full name"
                      onFocus={e => e.target.style.borderColor='#B08D57'} onBlur={e => e.target.style.borderColor='#222'} />
                  </div>
                  <div>
                    <label style={ey}>Email *</label>
                    <input style={inp} name="email" type="email" value={form.email} onChange={set} required
                      onFocus={e => e.target.style.borderColor='#B08D57'} onBlur={e => e.target.style.borderColor='#222'} />
                  </div>
                  <div>
                    <label style={ey}>Phone</label>
                    <input style={inp} name="phone" value={form.phone} onChange={set} placeholder="+601X-XXX XXXX"
                      onFocus={e => e.target.style.borderColor='#B08D57'} onBlur={e => e.target.style.borderColor='#222'} />
                  </div>
                  <div>
                    <label style={ey}>Company / Organisation</label>
                    <input style={inp} name="company" value={form.company} onChange={set} placeholder="Optional"
                      onFocus={e => e.target.style.borderColor='#B08D57'} onBlur={e => e.target.style.borderColor='#222'} />
                  </div>
                </div>
                <div>
                  <label style={ey}>Partnership Type *</label>
                  <select style={inp} name="type" value={form.type} onChange={set} required
                    onFocus={e => e.target.style.borderColor='#B08D57'} onBlur={e => e.target.style.borderColor='#222'}>
                    <option value="">Select type</option>
                    {partnerTypes.map((p,i) => <option key={i}>{p.title}</option>)}
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label style={ey}>Tell Us More *</label>
                  <textarea
                    style={{ ...inp, minHeight:'110px', resize:'vertical' }}
                    name="message" value={form.message} onChange={set} required
                    placeholder="Brief description of the opportunity or how you'd like to work together..."
                    onFocus={e => e.target.style.borderColor='#B08D57'} onBlur={e => e.target.style.borderColor='#222'}
                  />
                </div>
                <button type="submit" disabled={loading}
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.75rem', padding:'1rem 2rem', background:'#B08D57', color:'#fff', border:'none', fontFamily:'var(--sans)', fontSize:'0.72rem', letterSpacing:'0.2em', textTransform:'uppercase', fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, width:'100%', marginTop:'0.5rem' }}>
                  {loading ? 'Sending\u2026' : <><span>Send Enquiry</span> <ArrowRight size={13} /></>}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
