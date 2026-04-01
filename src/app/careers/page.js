'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ArrowRight, CheckCircle, ChevronDown } from 'lucide-react'

const DEF_ROLES = [
  { title:'Watch Specialist',            dept:'Sales',       type:'Full-time', location:'Kuala Lumpur', desc:'Advise clients on timepiece selection, authenticate watches, and build long-term relationships with collectors.' },
  { title:'Jewellery Consultant',        dept:'Sales',       type:'Full-time', location:'Kuala Lumpur', desc:'Guide clients through our jewellery collection, from engagement rings to fine pieces. GIA certification preferred.' },
  { title:'Marketing Executive',         dept:'Marketing',   type:'Full-time', location:'Kuala Lumpur', desc:'Drive digital marketing campaigns, manage social media presence, and grow our online community of watch enthusiasts.' },
  { title:'Watch Technician',            dept:'Operations',  type:'Full-time', location:'Kuala Lumpur', desc:'Authenticate, service, and assess pre-owned timepieces. Watchmaking qualification or equivalent experience required.' },
  { title:'Customer Relations Associate',dept:'Operations',  type:'Full-time', location:'Kuala Lumpur', desc:'First point of contact for enquiries via WhatsApp, email and phone. Passion for luxury goods essential.' },
]

const ey = { fontFamily:'var(--sans)', fontSize:'0.68rem', letterSpacing:'0.25em', textTransform:'uppercase', color:'#B08D57', display:'block', marginBottom:'0.5rem', fontWeight:600 }
const inp = { width:'100%', padding:'0.75rem 1rem', fontFamily:'var(--sans)', fontSize:'0.85rem', border:'1px solid #222', background:'#0d0d0d', outline:'none', color:'#fff', boxSizing:'border-box', transition:'border-color 0.15s' }

export default function CareersPage() {
  const [roles, setRoles]   = useState(DEF_ROLES)
  const [open, setOpen]     = useState(null)
  const [form, setForm]     = useState({ name:'', email:'', phone:'', role:'', message:'' })
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key','careers_roles').single()
      .then(({ data }) => {
        if (!data?.value) return
        try {
          const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value
          if (Array.isArray(parsed) && parsed.length > 0) setRoles(parsed)
        } catch {}
      })
  }, [])

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const apply = (role) => {
    setForm(f => ({ ...f, role }))
    setTimeout(() => document.getElementById('apply-form')?.scrollIntoView({ behavior:'smooth' }), 50)
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.role) return
    setLoading(true)
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'career', data: form }),
      })
      fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'career', name: form.name, email: form.email, data: form }),
      }).catch(() => {})
    } catch(err) { console.error(err) }
    finally { setLoading(false); setSent(true) }
  }

  return (
    <div style={{ background:'#0A0A0A', minHeight:'100vh' }}>

      {/* Header */}
      <section style={{ paddingTop:'9rem', paddingBottom:'4rem', borderBottom:'1px solid #111' }}>
        <div className="container">
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.68rem', letterSpacing:'0.35em', textTransform:'uppercase', color:'#B08D57', marginBottom:'1rem' }}>Join the Team</p>
          <h1 style={{ fontFamily:'var(--sans)', fontWeight:900, fontSize:'clamp(2.5rem,6vw,5rem)', color:'#fff', textTransform:'uppercase', lineHeight:1, letterSpacing:'-0.01em', marginBottom:'1.5rem' }}>
            Work With Us
          </h1>
          <div style={{ width:'40px', height:'1px', background:'#B08D57', margin:'1.5rem 0' }} />
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.95rem', color:'#888', lineHeight:1.8, fontWeight:300, maxWidth:'500px' }}>
            We are a small, passionate team dedicated to bringing the world of luxury timepieces to Malaysia. If you share that passion, we would love to hear from you.
          </p>
        </div>
      </section>

      {/* Values */}
      <section style={{ borderBottom:'1px solid #111' }}>
        <div className="container" style={{ padding:'4rem 0' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'2.5rem' }}>
            {[['Expertise','We invest in your knowledge.'],['Integrity','Honesty is our policy.'],['Passion','We hire people who love watches.']].map(([t,d]) => (
              <div key={t}>
                <h3 style={{ fontFamily:'var(--sans)', fontWeight:300, fontSize:'1.1rem', color:'#fff', marginBottom:'0.5rem' }}>{t}</h3>
                <p style={{ fontFamily:'var(--sans)', fontSize:'0.85rem', color:'#888', lineHeight:1.7 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section style={{ borderBottom:'1px solid #111', padding:'4rem 0' }}>
        <div className="container">
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.68rem', letterSpacing:'0.35em', textTransform:'uppercase', color:'#B08D57', marginBottom:'2.5rem' }}>Open Positions</p>
          <div>
            {roles.map((r, i) => (
              <div key={i} style={{ borderTop: i === 0 ? '1px solid #111' : 'none' }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', padding:'1.5rem 0', background:'none', border:'none', borderBottom:'1px solid #111', cursor:'pointer', textAlign:'left' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:'0.75rem' }}>
                      <span style={{ fontFamily:'var(--sans)', fontWeight:300, fontSize:'1rem', color:'#fff' }}>{r.title}</span>
                      <span style={{ fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#B08D57' }}>{r.dept} &middot; {r.type} &middot; {r.location}</span>
                    </div>
                  </div>
                  <ChevronDown size={14} style={{ color:'#555', flexShrink:0, transform: open === i ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }} />
                </button>
                {open === i && (
                  <div style={{ padding:'1.5rem 0 2rem', borderBottom:'1px solid #111' }}>
                    <p style={{ fontFamily:'var(--sans)', fontSize:'0.9rem', color:'#888', lineHeight:1.8, maxWidth:'540px', marginBottom:'1.5rem' }}>{r.desc}</p>
                    <button
                      onClick={() => apply(r.title)}
                      style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.65rem 1.25rem', border:'1px solid rgba(255,255,255,0.2)', background:'none', color:'#fff', fontFamily:'var(--sans)', fontSize:'0.65rem', letterSpacing:'0.15em', textTransform:'uppercase', cursor:'pointer', transition:'border-color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor='#B08D57'}
                      onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.2)'}>
                      Apply for this role <ArrowRight size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section style={{ padding:'5rem 0' }} id="apply-form">
        <div className="container" style={{ maxWidth:'560px' }}>
          {sent ? (
            <div style={{ textAlign:'center', padding:'4rem 0' }}>
              <CheckCircle size={36} style={{ color:'#B08D57', margin:'0 auto 1.5rem', display:'block' }} />
              <h2 style={{ fontFamily:'var(--sans)', fontWeight:900, fontSize:'2rem', color:'#fff', textTransform:'uppercase', marginBottom:'1rem' }}>Application Sent</h2>
              <p style={{ fontFamily:'var(--sans)', fontSize:'0.9rem', color:'#888', lineHeight:1.8, maxWidth:'340px', margin:'0 auto' }}>
                Thank you for your interest. We review every application and will be in touch if there is a fit.
              </p>
            </div>
          ) : (
            <>
              <p style={{ fontFamily:'var(--sans)', fontSize:'0.68rem', letterSpacing:'0.35em', textTransform:'uppercase', color:'#B08D57', marginBottom:'2rem' }}>Apply Now</p>
              <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem' }}>
                  <div>
                    <label style={ey}>Name *</label>
                    <input style={inp} name="name" value={form.name} onChange={set} required
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
                    <label style={ey}>Position *</label>
                    <select style={inp} name="role" value={form.role} onChange={set} required
                      onFocus={e => e.target.style.borderColor='#B08D57'} onBlur={e => e.target.style.borderColor='#222'}>
                      <option value="">Select a role</option>
                      {roles.map((r,i) => <option key={i}>{r.title}</option>)}
                      <option>General Application</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={ey}>Tell Us About Yourself *</label>
                  <textarea
                    style={{ ...inp, minHeight:'120px', resize:'vertical' }}
                    name="message" value={form.message} onChange={set} required
                    placeholder="Your background, passion for watches, and why you want to join GWG..."
                    onFocus={e => e.target.style.borderColor='#B08D57'} onBlur={e => e.target.style.borderColor='#222'}
                  />
                </div>
                <button type="button" onClick={handleSubmit} disabled={loading}
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.75rem', padding:'1rem 2rem', background:'#B08D57', color:'#fff', border:'none', fontFamily:'var(--sans)', fontSize:'0.72rem', letterSpacing:'0.2em', textTransform:'uppercase', fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, width:'100%', marginTop:'0.5rem' }}>
                  {loading ? 'Sending…' : <><span>Submit Application</span> <ArrowRight size={13} /></>}
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
