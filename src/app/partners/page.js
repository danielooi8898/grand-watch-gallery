'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ArrowRight, CheckCircle } from 'lucide-react'

const partnerTypes = [
  { title: 'Watch Dealers', desc: 'Trade stock, source specific references, and access our authenticated inventory for your own clients.' },
  { title: 'Corporate Gifting', desc: 'Source authenticated luxury timepieces for corporate milestones, awards, and executive gifts.' },
  { title: 'Estate & Consignment', desc: 'We handle the sale of inherited or consigned watches with full discretion and fair valuation.' },
  { title: 'Referral Programme', desc: 'Earn a commission by referring clients who complete a purchase. Simple, transparent, rewarding.' },
]

export default function PartnersPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', type: '', message: '' })
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.from('partner_enquiries').insert([form])
      if (!error) setSent(true)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  return (
    <>
      {/* Header */}
      <section className="pt-28 pb-10 md:pt-36 md:pb-14 border-b border-[#0d0d0d]">
        <div className="container">
          <p className="eyebrow mb-3">Collaborate</p>
          <h1 className="heading">Partner With Us</h1>
          <div className="rule mt-6" />
          <p className="body-sm max-w-lg mt-6">
            We work with dealers, corporates, estates, and referral partners across Malaysia and beyond. If you see an opportunity to work together, we want to hear from you.
          </p>
        </div>
      </section>

      {/* Partner types */}
      <section className="border-b border-[#0d0d0d]">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#0d0d0d]">
            {partnerTypes.map(({ title, desc }) => (
              <div key={title} className="bg-black p-8 md:p-10 hover:bg-[#050505] transition-colors">
                <h3 className="text-white serif font-light text-base mb-3">{title}</h3>
                <p className="body-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section">
        <div className="container max-w-xl mx-auto">
          {sent ? (
            <div className="text-center py-16 md:py-24">
              <CheckCircle size={36} className="text-white mx-auto mb-6 opacity-50" />
              <h2 className="heading mb-3" style={{ fontSize: '2rem' }}>Enquiry Received</h2>
              <p className="body-sm max-w-sm mx-auto">
                Thank you for reaching out. A member of our team will be in touch within one business day.
              </p>
            </div>
          ) : (
            <>
              <p className="eyebrow mb-8">Get in Touch</p>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="eyebrow block mb-2" style={{ fontSize: '0.55rem' }}>Name *</label>
                    <input className="input" name="name" value={form.name} onChange={set} required placeholder="Full name" />
                  </div>
                  <div>
                    <label className="eyebrow block mb-2" style={{ fontSize: '0.55rem' }}>Email *</label>
                    <input className="input" name="email" type="email" value={form.email} onChange={set} required />
                  </div>
                  <div>
                    <label className="eyebrow block mb-2" style={{ fontSize: '0.55rem' }}>Phone</label>
                    <input className="input" name="phone" value={form.phone} onChange={set} placeholder="+601X-XXX XXXX" />
                  </div>
                  <div>
                    <label className="eyebrow block mb-2" style={{ fontSize: '0.55rem' }}>Company / Organisation</label>
                    <input className="input" name="company" value={form.company} onChange={set} placeholder="Optional" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="eyebrow block mb-2" style={{ fontSize: '0.55rem' }}>Partnership Type *</label>
                    <select className="input" name="type" value={form.type} onChange={set} required>
                      <option value="">Select type</option>
                      {partnerTypes.map(p => <option key={p.title}>{p.title}</option>)}
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="eyebrow block mb-2" style={{ fontSize: '0.55rem' }}>Tell Us More *</label>
                  <textarea className="input h-28 resize-none" name="message" value={form.message} onChange={set} required
                    placeholder="Brief description of the opportunity or how you'd like to work together..." />
                </div>
                <button type="submit" disabled={loading} className="btn btn-white w-full justify-center">
                  {loading ? 'Sending...' : <><span>Send Enquiry</span> <ArrowRight size={13} /></>}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </>
  )
}
