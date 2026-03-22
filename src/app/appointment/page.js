'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ArrowRight, CheckCircle } from 'lucide-react'

const timeSlots = ['10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM']
const interests = ['General Browse','Specific Reference','Trade-In Discussion','Investment Advice','Jewellery','Gift Consultation']

export default function AppointmentPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', date:'', time:'', interest:'', notes:'' })
  const [sent, setSent]       = useState(false)
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

  // Min date: tomorrow
  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  return (
    <>
      {/* Header */}
      <section className="pt-28 pb-10 md:pt-36 md:pb-14 border-b border-[#0d0d0d]">
        <div className="container">
          <p className="eyebrow mb-3">Exclusive Experience</p>
          <h1 className="heading">Book a Private Viewing</h1>
          <div className="rule mt-6 mb-4" />
          <p className="body-sm max-w-lg mt-4">
            Arrange a one-on-one session with our experts at our Kuala Lumpur gallery. We'll prepare a curated selection based on your preferences.
          </p>
        </div>
      </section>

      {/* What to expect */}
      <section className="border-b border-[#0d0d0d]">
        <div className="container py-10 md:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              ['Personalised', 'We tailor the viewing to your specific interests and budget.'],
              ['No Obligation', 'Browse freely with zero pressure to purchase.'],
              ['Expert Guidance', 'Our team provides honest, knowledgeable advice on every piece.'],
            ].map(([t, d]) => (
              <div key={t}>
                <h3 className="text-white text-sm font-light serif mb-2">{t}</h3>
                <p className="body-sm">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section">
        <div className="container">
          <div className="max-w-xl mx-auto">
            {sent ? (
              <div className="text-center py-16 md:py-24">
                <CheckCircle size={40} className="text-white mx-auto mb-6 opacity-50" />
                <h2 className="heading mb-4" style={{ fontSize: '2rem' }}>Appointment Requested</h2>
                <p className="body-sm max-w-sm mx-auto">We will confirm your appointment via WhatsApp or email within a few hours. We look forward to meeting you.</p>
              </div>
            ) : (
              <>
                <p className="eyebrow mb-8">Your Details</p>
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="eyebrow block mb-2" style={{fontSize:'0.55rem'}}>Name *</label>
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
                    <div>
                      <label className="eyebrow block mb-2" style={{fontSize:'0.55rem'}}>Preferred Date *</label>
                      <input className="input" type="date" name="date" value={form.date} onChange={set} required min={minDateStr} />
                    </div>
                    <div>
                      <label className="eyebrow block mb-2" style={{fontSize:'0.55rem'}}>Preferred Time *</label>
                      <select className="input" name="time" value={form.time} onChange={set} required>
                        <option value="">Select a time</option>
                        {timeSlots.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="eyebrow block mb-2" style={{fontSize:'0.55rem'}}>Purpose of Visit *</label>
                      <select className="input" name="interest" value={form.interest} onChange={set} required>
                        <option value="">What are you looking for?</option>
                        {interests.map(i => <option key={i}>{i}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="eyebrow block mb-2" style={{fontSize:'0.55rem'}}>Notes (optional)</label>
                    <textarea className="input h-24 resize-none" name="notes" value={form.notes} onChange={set}
                      placeholder="Any specific watches, references, or budget range you have in mind?" />
                  </div>

                  <button type="submit" disabled={loading} className="btn btn-white w-full justify-center mt-2">
                    {loading ? 'Submitting...' : <><span>Request Appointment</span> <ArrowRight size={13} /></>}
                  </button>

                  <p className="body-xs text-center mt-3">Mon–Sat · 10:00 AM – 7:00 PM · Kuala Lumpur</p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
