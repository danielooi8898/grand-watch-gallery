'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ArrowRight, CheckCircle, ChevronDown } from 'lucide-react'

const roles = [
  { title:'Watch Specialist', dept:'Sales', type:'Full-time', location:'Kuala Lumpur', desc:'Advise clients on timepiece selection, authenticate watches, and build long-term relationships with collectors.' },
  { title:'Jewellery Consultant', dept:'Sales', type:'Full-time', location:'Kuala Lumpur', desc:'Guide clients through our jewellery collection, from engagement rings to fine pieces. GIA certification preferred.' },
  { title:'Marketing Executive', dept:'Marketing', type:'Full-time', location:'Kuala Lumpur', desc:'Drive digital marketing campaigns, manage social media presence, and grow our online community of watch enthusiasts.' },
  { title:'Watch Technician', dept:'Operations', type:'Full-time', location:'Kuala Lumpur', desc:'Authenticate, service, and assess pre-owned timepieces. Watchmaking qualification or equivalent experience required.' },
  { title:'Customer Relations Associate', dept:'Operations', type:'Full-time', location:'Kuala Lumpur', desc:'First point of contact for enquiries via WhatsApp, email and phone. Passion for luxury goods essential.' },
]

export default function CareersPage() {
  const [open, setOpen] = useState(null)
  const [selected, setSelected] = useState('')
  const [form, setForm] = useState({ name:'', email:'', phone:'', role:'', message:'' })
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const apply = (role) => {
    setSelected(role)
    setForm(f => ({ ...f, role }))
    document.getElementById('apply-form')?.scrollIntoView({ behavior:'smooth' })
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.from('career_applications').insert([form])
      if (!error) setSent(true)
    } catch(err) { console.error(err) }
    finally { setLoading(false) }
  }

  return (
    <>
      {/* Header */}
      <section className="pt-28 pb-10 md:pt-36 md:pb-14 border-b border-[#0d0d0d]">
        <div className="container">
          <p className="eyebrow mb-3">Join the Team</p>
          <h1 className="heading">Work With Us</h1>
          <div className="rule mt-6" />
          <p className="body-sm max-w-lg mt-6">We are a small, passionate team dedicated to bringing the world of luxury timepieces to Kuala Lumpur. If you share that passion, we would love to hear from you.</p>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-[#0d0d0d]">
        <div className="container py-10 md:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[['Expertise', 'We invest in your knowledge.'],['Integrity', 'Honesty is our policy.'],['Passion', 'We hire people who love watches.']].map(([t,d]) => (
              <div key={t}>
                <h3 className="text-white serif font-light text-base mb-2">{t}</h3>
                <p className="body-sm">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="section border-b border-[#0d0d0d]">
        <div className="container">
          <p className="eyebrow mb-10">Open Positions</p>
          <div className="divide-y divide-[#0d0d0d]">
            {roles.map((r, i) => (
              <div key={r.title}>
                <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-start sm:items-center justify-between gap-4 py-6 text-left">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <span className="text-white font-light serif text-base">{r.title}</span>
                      <span className="eyebrow" style={{fontSize:'0.55rem'}}>{r.dept} · {r.type} · {r.location}</span>
                    </div>
                  </div>
                  <ChevronDown size={14} className={`text-[#333] shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
                </button>
                {open === i && (
                  <div className="pb-6 pl-0">
                    <p className="body-sm mb-5 max-w-xl">{r.desc}</p>
                    <button onClick={() => apply(r.title)} className="btn btn-border" style={{fontSize:'0.6rem'}}>
                      Apply for this role <ArrowRight size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="section" id="apply-form">
        <div className="container max-w-xl mx-auto">
          {sent ? (
            <div className="text-center py-16">
              <CheckCircle size={36} className="text-white mx-auto mb-6 opacity-50" />
              <h2 className="heading mb-3" style={{fontSize:'2rem'}}>Application Sent</h2>
              <p className="body-sm max-w-sm mx-auto">Thank you for your interest. We review every application and will be in touch if there is a fit.</p>
            </div>
          ) : (
            <>
              <p className="eyebrow mb-8">Apply Now</p>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="eyebrow block mb-2" style={{fontSize:'0.55rem'}}>Name *</label>
                    <input className="input" name="name" value={form.name} onChange={set} required />
                  </div>
                  <div>
                    <label className="eyebrow block mb-2" style={{fontSize:'0.55rem'}}>Email *</label>
                    <input className="input" name="email" type="email" value={form.email} onChange={set} required />
                  </div>
                  <div>
                    <label className="eyebrow block mb-2" style={{fontSize:'0.55rem'}}>Phone</label>
                    <input className="input" name="phone" value={form.phone} onChange={set} placeholder="+601X-XXX XXXX" />
                  </div>
                  <div>
                    <label className="eyebrow block mb-2" style={{fontSize:'0.55rem'}}>Position *</label>
                    <select className="input" name="role" value={form.role} onChange={set} required>
                      <option value="">Select a role</option>
                      {roles.map(r => <option key={r.title}>{r.title}</option>)}
                      <option>General Application</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="eyebrow block mb-2" style={{fontSize:'0.55rem'}}>Tell Us About Yourself *</label>
                  <textarea className="input h-32 resize-none" name="message" value={form.message} onChange={set} required
                    placeholder="Your background, passion for watches, and why you want to join GWG..." />
                </div>
                <button type="submit" disabled={loading} className="btn btn-white w-full justify-center">
                  {loading ? 'Sending...' : <><span>Submit Application</span> <ArrowRight size={13} /></>}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </>
  )
}
