'use client'
import { useEffect, useState } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const inp  = { width:'100%', padding:'0.65rem 0.85rem', fontFamily:'var(--sans)', fontSize:'0.82rem', border:'1px solid #E8E2D8', background:'#fff', outline:'none', borderRadius:'2px', color:'#111', boxSizing:'border-box' }
const lbl  = { fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#777', display:'block', marginBottom:'0.4rem' }
const card = { background:'#fff', border:'1px solid #E8E2D8', borderRadius:'2px', padding:'1.75rem', marginBottom:'1.5rem' }
const hdr  = { fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.9rem', color:'#111', marginBottom:'0.4rem' }
const sub  = { fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#999', marginBottom:'1.25rem', paddingBottom:'1rem', borderBottom:'1px solid #F4EFE9' }

const DEF = {
  phone:     '+6016-682 4848',
  whatsapp:  '+60162241804',
  email:     'info@grandwatchgallery.com',
  address:   'Atria Shopping Gallery, Damansara Jaya, 47400 Petaling Jaya, Selangor',
  hours:     'Mon – Sun: 10:00am – 9:00pm',
  about_headline: 'A Curated Gallery of Authenticated Luxury Timepieces',
  about_body: 'Grand Watch Gallery was founded in 2020 with a singular mission — to bring transparency, trust, and expertise to the pre-owned luxury watch market in Malaysia. Every timepiece in our collection is hand-selected and rigorously authenticated by our in-house specialists.',
  map_embed:  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.254497!2d101.6139191!3d3.1270963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc494ca537b9f1%3A0x887c4a6a2ca357ac!2sAtria%20Shopping%20Gallery!5e0!3m2!1sen!2smy!4v1711700000000!5m2!1sen!2smy',
  meta_title: 'Grand Watch Gallery | The Right Time For Life',
  meta_desc:  "Malaysia's premier authenticated pre-owned luxury watch gallery. Rolex, Patek Philippe, Audemars Piguet, Richard Mille and more.",
}

export default function AdminSettings() {
  const [form, setForm]   = useState(DEF)
  const [saving, setSaving] = useState('')
  const [toast, setToast]   = useState('')

  useEffect(() => {
    supabase.from('site_settings').select('key,value').in('key', Object.keys(DEF))
      .then(({ data }) => {
        if (!data) return
        const loaded = { ...DEF }
        data.forEach(row => { if (row.value !== null) loaded[row.key] = row.value })
        setForm(loaded)
      })
  }, [])

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const saveGroup = async (keys) => {
    const rows = keys.map(k => ({ key: k, value: form[k] }))
    await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
    setToast('Saved!'); setTimeout(() => setToast(''), 2500)
  }

  const S = (key) => ({ style: saveBtn(saving === key) })
  const saveBtn = (active) => ({ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'#B08D57', color:'#fff', padding:'0.7rem 1.5rem', border:'none', cursor:'pointer', fontFamily:'var(--sans)', fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', opacity: active?0.7:1, marginTop:'1.25rem' })

  const doSave = async (key, keys) => { setSaving(key); await saveGroup(keys); setSaving('') }

  return (
    <div style={{ padding:'2.5rem 2.5rem 4rem', maxWidth:'860px' }}>
      {toast && <div style={{ position:'fixed', top:'1.5rem', right:'1.5rem', zIndex:999, background:'#166534', color:'#fff', padding:'0.75rem 1.25rem', fontFamily:'var(--sans)', fontSize:'0.8rem', borderRadius:'4px' }}>✓ {toast}</div>}

      <div style={{ marginBottom:'2rem', paddingBottom:'1.5rem', borderBottom:'1px solid #E8E2D8' }}>
        <p style={{ fontFamily:'var(--sans)', fontSize:'0.65rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#B08D57', marginBottom:'0.4rem' }}>Admin</p>
        <h1 style={{ fontFamily:'var(--sans)', fontWeight:800, fontSize:'1.75rem', letterSpacing:'-0.02em', color:'#111' }}>Site Settings</h1>
        <p style={{ fontFamily:'var(--sans)', fontSize:'0.8rem', color:'#888', marginTop:'0.25rem' }}>Contact details, business info, about content, and SEO settings.</p>
      </div>

      {/* Contact */}
      <div style={card}>
        <p style={hdr}>Contact Information</p>
        <p style={sub}>Phone numbers, WhatsApp, and email used across the site.</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
          <div><label style={lbl}>Phone Number</label><input style={inp} value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+6016-682 4848" /></div>
          <div><label style={lbl}>WhatsApp Number (digits only)</label><input style={inp} value={form.whatsapp} onChange={e=>set('whatsapp',e.target.value)} placeholder="60162241804" /></div>
        </div>
        <div style={{ marginBottom:'1rem' }}>
          <label style={lbl}>Email Address</label>
          <input style={inp} value={form.email} onChange={e=>set('email',e.target.value)} placeholder="info@grandwatchgallery.com" />
        </div>
        <button style={saveBtn(saving==='contact')} onClick={() => doSave('contact', ['phone','whatsapp','email'])}>
          {saving==='contact' ? <><Loader2 size={13} style={{ animation:'spin 1s linear infinite' }}/> Saving…</> : <><Save size={13}/> Save Contact</>}
        </button>
      </div>

      {/* Location */}
      <div style={card}>
        <p style={hdr}>Location & Opening Hours</p>
        <p style={sub}>Physical address and hours shown on the Find Us page.</p>
        <div style={{ marginBottom:'1rem' }}>
          <label style={lbl}>Address</label>
          <textarea style={{ ...inp, minHeight:'70px', resize:'vertical' }} value={form.address} onChange={e=>set('address',e.target.value)} />
        </div>
        <div style={{ marginBottom:'1rem' }}>
          <label style={lbl}>Opening Hours</label>
          <input style={inp} value={form.hours} onChange={e=>set('hours',e.target.value)} placeholder="Mon – Sun: 10:00am – 9:00pm" />
        </div>
        <div style={{ marginBottom:'0.5rem' }}>
          <label style={lbl}>Google Maps Embed URL</label>
          <textarea style={{ ...inp, minHeight:'80px', resize:'vertical', fontFamily:'monospace', fontSize:'0.72rem' }} value={form.map_embed} onChange={e=>set('map_embed',e.target.value)} />
        </div>
        <button style={saveBtn(saving==='location')} onClick={() => doSave('location', ['address','hours','map_embed'])}>
          {saving==='location' ? <><Loader2 size={13} style={{ animation:'spin 1s linear infinite' }}/> Saving…</> : <><Save size={13}/> Save Location</>}
        </button>
      </div>

      {/* About */}
      <div style={card}>
        <p style={hdr}>About Page Content</p>
        <p style={sub}>Headline and body text shown on the About page.</p>
        <div style={{ marginBottom:'1rem' }}>
          <label style={lbl}>Headline</label>
          <input style={inp} value={form.about_headline} onChange={e=>set('about_headline',e.target.value)} />
        </div>
        <div style={{ marginBottom:'0.5rem' }}>
          <label style={lbl}>Body Text</label>
          <textarea style={{ ...inp, minHeight:'130px', resize:'vertical' }} value={form.about_body} onChange={e=>set('about_body',e.target.value)} />
        </div>
        <button style={saveBtn(saving==='about')} onClick={() => doSave('about', ['about_headline','about_body'])}>
          {saving==='about' ? <><Loader2 size={13} style={{ animation:'spin 1s linear infinite' }}/> Saving…</> : <><Save size={13}/> Save About</>}
        </button>
      </div>

      {/* SEO */}
      <div style={card}>
        <p style={hdr}>SEO & Metadata</p>
        <p style={sub}>Page title and meta description used by Google and social media previews.</p>
        <div style={{ marginBottom:'1rem' }}>
          <label style={lbl}>Meta Title</label>
          <input style={inp} value={form.meta_title} onChange={e=>set('meta_title',e.target.value)} />
        </div>
        <div style={{ marginBottom:'0.5rem' }}>
          <label style={lbl}>Meta Description</label>
          <textarea style={{ ...inp, minHeight:'80px', resize:'vertical' }} value={form.meta_desc} onChange={e=>set('meta_desc',e.target.value)} />
        </div>
        <button style={saveBtn(saving==='seo')} onClick={() => doSave('seo', ['meta_title','meta_desc'])}>
          {saving==='seo' ? <><Loader2 size={13} style={{ animation:'spin 1s linear infinite' }}/> Saving…</> : <><Save size={13}/> Save SEO</>}
        </button>
      </div>

      {/* Admin users */}
      <div style={card}>
        <p style={hdr}>Admin Access</p>
        <p style={sub}>To add or remove admin users, go to your Supabase dashboard → Table Editor → admin_users table. Add the user's email address there after they've registered an account.</p>
        <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer"
          style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#B08D57', textDecoration:'none', borderBottom:'1px solid #B08D57', paddingBottom:'1px' }}>
          Open Supabase Dashboard →
        </a>
      </div>
    </div>
  )
}
