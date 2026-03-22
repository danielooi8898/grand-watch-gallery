'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ArrowRight, CheckCircle } from 'lucide-react'

const steps = [
  { n: '01', title: 'Submit Details', desc: 'Fill out the form below with your watch details.' },
  { n: '02', title: 'We Assess',      desc: 'Our experts review and provide a competitive valuation within 24 hours.' },
  { n: '03', title: 'Get Paid',       desc: 'Accept our offer and receive payment swiftly and securely.' },
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
      if (!error) setSent(true)
    } catch(err) { console.error(err) }
    finally { setLoading(false) }
  }

  return (
    <>
      {/* Header */}
      <section className="pt-28 pb-10 md:pt-36 md:pb-14 border-b border-[#0d0d0d]">
        <div className="container">
          <p className="eyebrow mb-3">Sell or Exchange</p>
          <h1 className="heading">Trade-In Programme</h1>
          <div className="rule mt-6 mb-4" />
          <p className="body-sm max-w-lg mt-4">We offer competitive, transparent valuations for pre-owned luxury watches. No obligation — just honest pricing from experts who care.</p>
        </div>
      </section>

      {/* Steps */}
      <section className="border-b border-[#0d0d0d]">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#0d0d0d]">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="bg-black p-8 md:p-10">
                <div className="serif font-light text-[#0d0d0d] mb-6" style={{ fontSize: '3.5rem', lineHeight: 1 }}>{n}</div>
                <h3 className="text-white text-base font-light serif mb-3">{title}</h3>
                <p className="body-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            {sent ? (
              <div className="text-center py-16 md:py-24">
                <CheckCircle size={40} className="text-white mx-auto mb-6 opacity-50" />
                <h2 className="heading mb-4" style={{ fontSize: '2rem' }}>Request Received</h2>
                <p className="body-sm max-w-sm mx-auto">Our team will contact you within one business day with a valuation. For faster response, WhatsApp us directly.</p>
              </div>
            ) : (
              <>
                <p className="eyebrow mb-8 md:mb-10">Watch Details</p>
                <form onSubmit={submit} className="space-y-4">
                  {/* Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="eyebrow block mb-2" style={{fontSize:'0.55rem'}}>Your Name *</label>
                      <input className="input" name="name" value={form.name} onChange={set} required placeholder="Full name" />
                    </div>
                    <div>
                      <label className="eyebrow block mb-2" style={{fontSize:'0.55rem'}}>Email *</label>
                      <input className="input" name="email" type="email" value={form.email} onChange={set} required />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="eyebrow block mb-2" style={{fontSize:'0.55rem'}}>Phone / WhatsApp *</label>
                      <input className="input" name="phone" value={form.phone} onChange={set} required placeholder="+601X-XXX XXXX" />
                    </div>
                  </div>

                  <div className="border-t border-[#0d0d0d] pt-4" />

                  {/* Watch details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="eyebrow block mb-2" style={{fontSize:'0.55rem'}}>Brand *</label>
                      <input className="input" name="brand" value={form.brand} onChange={set} required placeholder="e.g. Rolex" />
                    </div>
                    <div>
                      <label className="eyebrow block mb-2" style={{fontSize:'0.55rem'}}>Model *</label>
                      <input className="input" name="model" value={form.model} onChange={set} required placeholder="e.g. Submariner" />
                    </div>
                    <div>
                      <label className="eyebrow block mb-2" style={{fontSize:'0.55rem'}}>Reference Number</label>
                      <input className="input" name="ref" value={form.ref} onChange={set} placeholder="e.g. 126610LN" />
                    </div>
                    <div>
                      <label className="eyebrow block mb-2" style={{fontSize:'0.55rem'}}>Year</label>
                      <input className="input" name="year" value={form.year} onChange={set} placeholder="e.g. 2021" />
                    </div>
                    <div>
                      <label className="eyebrow block mb-2" style={{fontSize:'0.55rem'}}>Condition *</label>
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
                      <label className="eyebrow block mb-2" style={{fontSize:'0.55rem'}}>Box & Papers</label>
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
                    <label className="eyebrow block mb-2" style={{fontSize:'0.55rem'}}>Additional Notes</label>
                    <textarea className="input h-28 resize-none" name="notes" value={form.notes} onChange={set}
                      placeholder="Any other details — servicing history, modifications, urgency, etc." />
                  </div>

                  <button type="submit" disabled={loading} className="btn btn-white w-full justify-center mt-2">
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
