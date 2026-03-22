'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ArrowRight, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.from('contact_messages').insert([form])
      if (!error) setSent(true)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  return (
    <>
      {/* Header */}
      <section className="pt-28 pb-10 md:pt-36 md:pb-14 border-b border-[#0d0d0d]">
        <div className="container">
          <p className="eyebrow mb-3">Get in Touch</p>
          <h1 className="heading">Contact Us</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Left — Info */}
            <div className="space-y-10">

              {/* Info blocks */}
              {[
                { label: 'Location', lines: ['Grand Watch & Jewellery Sdn. Bhd.', 'Kuala Lumpur, Malaysia', 'Co. Reg. 624044-T'] },
                { label: 'Hours', lines: ['Monday – Saturday', '10:00 AM – 7:00 PM', 'Sunday by appointment only'] },
                { label: 'Phone & WhatsApp', lines: ['+6016-682 4848', '+6016-224 1804 (WhatsApp)'] },
                { label: 'Follow', lines: null },
              ].map(({ label, lines }) => (
                <div key={label}>
                  <p className="eyebrow mb-3" style={{ fontSize: '0.55rem' }}>{label}</p>
                  {lines ? (
                    lines.map((l, i) => <p key={i} className="body-sm">{l}</p>)
                  ) : (
                    <div className="flex flex-wrap gap-4 mt-1">
                      {[
                        { label: 'Instagram', href: 'https://www.instagram.com/gwg_gallery/' },
                        { label: 'Facebook', href: 'https://www.facebook.com/GWGmy' },
                        { label: 'WhatsApp', href: 'https://wa.me/60162241804' },
                      ].map(s => (
                        <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                          className="eyebrow hover:text-white transition-colors" style={{ fontSize: '0.6rem' }}>
                          {s.label} →
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Quick action links */}
              <div className="border-t border-[#0d0d0d] pt-8 space-y-2">
                <a href="https://wa.me/60162241804?text=Hello%20Grand%20Watch%20Gallery%2C%20I%20have%20an%20enquiry."
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-white w-full justify-between px-5 py-4">
                  Chat on WhatsApp <ArrowRight size={13} />
                </a>
                <a href="tel:+60166824848" className="btn btn-border w-full justify-between px-5 py-4">
                  Call Us Now <ArrowRight size={13} />
                </a>
              </div>
            </div>

            {/* Right — Form */}
            <div>
              {sent ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[360px] text-center">
                  <CheckCircle size={36} className="text-white mb-6 opacity-50" />
                  <h2 className="heading mb-3" style={{ fontSize: '2rem' }}>Message Sent</h2>
                  <p className="body-sm max-w-xs">We will get back to you within one business day. For faster response, WhatsApp us directly.</p>
                </div>
              ) : (
                <>
                  <p className="eyebrow mb-8">Send a Message</p>
                  <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="eyebrow block mb-2" style={{ fontSize: '0.55rem' }}>Name *</label>
                        <input className="input" name="name" value={form.name} onChange={set} required placeholder="Your name" />
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
                        <label className="eyebrow block mb-2" style={{ fontSize: '0.55rem' }}>Subject *</label>
                        <select className="input" name="subject" value={form.subject} onChange={set} required>
                          <option value="">Select subject</option>
                          <option>Watch Enquiry</option>
                          <option>Trade-In / Sell</option>
                          <option>Book Appointment</option>
                          <option>Pricing & Availability</option>
                          <option>Partnership</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="eyebrow block mb-2" style={{ fontSize: '0.55rem' }}>Message *</label>
                      <textarea className="input h-32 resize-none" name="message" value={form.message} onChange={set} required
                        placeholder="How can we help you?" />
                    </div>
                    <button type="submit" disabled={loading} className="btn btn-white w-full justify-center">
                      {loading ? 'Sending...' : <><span>Send Message</span> <ArrowRight size={13} /></>}
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
