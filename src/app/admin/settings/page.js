'use client'
import Spinner from '@/components/Spinner'
import { useEffect, useState } from 'react'
import { Save, CheckCircle, Lock, Upload, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

const OWNER_EMAIL = 'ooimunhong8898@gmail.com'

const inp  = { width:'100%', padding:'0.65rem 0.85rem', fontFamily:'var(--sans)', fontSize:'0.82rem', border:'1px solid #E0DDD8', background:'#fff', outline:'none', borderRadius:'4px', color:'#111', boxSizing:'border-box', transition:'border-color 0.15s' }
const lbl  = { fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#6B6560', display:'block', marginBottom:'0.4rem', fontWeight:600 }

const DEF = {
  phone:             '+6016-682 4848',
  whatsapp:          '60162241804',
  email:             'info@grandwatchgallery.com',
  address:           'Lot G31, Ground Floor\nAtria Shopping Gallery\nJalan SS 22/23, Damansara Jaya\n47400 Petaling Jaya, Selangor',
  hours:             'Mon \u2013 Sat: 10:00am \u2013 7:00pm\nSunday: By appointment only',
  about_headline:    'A Curated Gallery of Authenticated Luxury Timepieces',
  about_body:        'Grand Watch Gallery was founded in 2020 with a singular mission \u2014 to bring transparency, trust, and expertise to the pre-owned luxury watch market in Malaysia.',
  map_embed:         'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.254497!2d101.6139191!3d3.1270963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc494ca537b9f1%3A0x887c4a6a2ca357ac!2sAtria%20Shopping%20Gallery!5e0!3m2!1sen!2smy!4v1711700000000!5m2!1sen!2smy',
  meta_title:        'Grand Watch Gallery | The Right Time For Life',
  meta_desc:         "Malaysia's premier authenticated pre-owned luxury watch gallery.",
  gallery_image_url: '',
}

const TABS = ['Contact', 'Location', 'About', 'Gallery', 'SEO']

export default function AdminSettings() {
  const { user, isOwner } = useAuth()
  const [form,      setForm]    = useState(DEF)
  const [saving,    setSaving]  = useState('')
  const [saved,     setSaved]   = useState(false)
  const [activeTab, setActive]  = useState('Contact')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    supabase.from('site_settings').select('key,value').in('key', Object.keys(DEF))
      .then(({ data }) => {
        if (!data) return
        const loaded = { ...DEF }
        data.forEach(row => {
          if (row.value !== null) {
            loaded[row.key] = typeof row.value === 'string' ? row.value : JSON.stringify(row.value)
          }
        })
        setForm(loaded)
      })
  }, [])

  /* ── Owner-only guard ─────────────────────────────────────────────────── */
  if (!isOwner) {
    return (
      <div style={{ padding:'2rem', maxWidth:'600px' }}>
        <div style={{ background:'#FFF9F0', border:'1px solid rgba(176,141,87,0.3)', borderRadius:'8px', padding:'2rem', display:'flex', gap:'1rem', alignItems:'flex-start' }}>
          <Lock size={20} style={{ color:'#B08D57', flexShrink:0, marginTop:'2px' }} />
          <div>
            <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.9rem', color:'#111', marginBottom:'0.4rem' }}>Owner Access Only</p>
            <p style={{ fontFamily:'var(--sans)', fontSize:'0.8rem', color:'#6B6560', lineHeight:1.7, marginBottom:'0.75rem' }}>
              Site settings can only be edited by the gallery owner. Please contact{' '}
              <strong style={{ color:'#111' }}>{OWNER_EMAIL}</strong> to request changes.
            </p>
            <p style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#999', lineHeight:1.6 }}>
              You are signed in as <strong>{user?.email}</strong>.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const saveGroup = async (key, keys) => {
    setSaving(key)
    const rows = keys.map(k => ({ key: k, value: form[k] }))
    await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
    setSaving('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleGalleryUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const path = `gallery/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const { data, error: upErr } = await supabase.storage.from('media').upload(path, file, { upsert: true })
    if (upErr) { alert('Upload failed: ' + upErr.message); setUploading(false); return }
    const { data: urlData } = supabase.storage.from('media').getPublicUrl(data.path)
    set('gallery_image_url', urlData.publicUrl)
    setUploading(false)
  }

  const focusStyle  = e => { e.target.style.borderColor = '#B08D57' }
  const blurStyle   = e => { e.target.style.borderColor = '#E0DDD8' }

  const card = { background:'#fff', borderRadius:'8px', border:'1px solid #EDE9E3', padding:'1.75rem', boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }

  const SaveBtn = ({ group, keys }) => (
    <div style={{ display:'flex', justifyContent:'flex-end', paddingTop:'1.5rem', marginTop:'1.5rem', borderTop:'1px solid #EDE9E3' }}>
      <button
        onClick={() => saveGroup(group, keys)}
        disabled={!!saving}
        style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'#B08D57', color:'#fff', padding:'0.65rem 1.5rem', border:'none', cursor: saving ? 'not-allowed' : 'pointer', fontFamily:'var(--sans)', fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', borderRadius:'4px', opacity: saving === group ? 0.7 : 1 }}>
        {saving === group ? <><Spinner size={13} /> Saving\u2026</> : <><Save size={13}/> Save</>}
      </button>
    </div>
  )

  return (
    <div style={{ padding:'2rem 2rem 4rem', maxWidth:'860px' }}>
      {/* Header */}
      <div style={{ marginBottom:'2rem', paddingBottom:'1.5rem', borderBottom:'1px solid #EDE9E3' }}>
        <p style={{ fontFamily:'var(--sans)', fontSize:'0.62rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#B08D57', marginBottom:'0.35rem' }}>Admin \u00b7 Settings</p>
        <h1 style={{ fontFamily:'var(--sans)', fontWeight:800, fontSize:'1.6rem', letterSpacing:'-0.02em', color:'#111' }}>Site Settings</h1>
        <p style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', color:'#888', marginTop:'0.2rem' }}>Contact details, location, about content, gallery image, and SEO settings.</p>
      </div>

      {/* Toast */}
      {saved && (
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'#ECFDF5', border:'1px solid #A7F3D0', color:'#065F46', padding:'0.75rem 1rem', borderRadius:'6px', fontFamily:'var(--sans)', fontSize:'0.8rem', marginBottom:'1.5rem' }}>
          <CheckCircle size={15} style={{ flexShrink:0 }} /> Saved! Changes are now live.
        </div>
      )}

      {/* Tabs */}
      <div style={{ display:'flex', gap:'0.25rem', marginBottom:'1.5rem', background:'#EDE9E3', padding:'0.25rem', borderRadius:'6px', flexWrap:'wrap' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActive(tab)} style={{
            flex:1, minWidth:'70px', padding:'0.5rem 0.5rem', border:'none', cursor:'pointer', borderRadius:'4px',
            fontFamily:'var(--sans)', fontSize:'0.72rem', fontWeight: activeTab === tab ? 600 : 400,
            background: activeTab === tab ? '#fff' : 'transparent',
            color: activeTab === tab ? '#111' : '#888',
            boxShadow: activeTab === tab ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
            transition:'all 0.15s',
          }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Contact Tab */}
      {activeTab === 'Contact' && (
        <div style={card}>
          <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.9rem', color:'#111', marginBottom:'0.25rem' }}>Contact Information</p>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#999', marginBottom:'1.25rem', paddingBottom:'1rem', borderBottom:'1px solid #EDE9E3' }}>
            Phone, WhatsApp and email used across the Contact and Find Us pages.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1rem' }}>
            <div>
              <label style={lbl}>Phone Number</label>
              <input style={inp} value={form.phone} placeholder="+6016-682 4848"
                onChange={e => set('phone', e.target.value)} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div>
              <label style={lbl}>WhatsApp Number (digits only)</label>
              <input style={inp} value={form.whatsapp} placeholder="60162241804"
                onChange={e => set('whatsapp', e.target.value)} onFocus={focusStyle} onBlur={blurStyle} />
              <p style={{ fontFamily:'var(--sans)', fontSize:'0.68rem', color:'#A09890', marginTop:'0.3rem' }}>Used to build the wa.me/ link</p>
            </div>
            <div>
              <label style={lbl}>Email Address</label>
              <input style={inp} value={form.email} placeholder="info@grandwatchgallery.com"
                onChange={e => set('email', e.target.value)} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
          </div>
          <SaveBtn group="contact" keys={['phone','whatsapp','email']} />
        </div>
      )}

      {/* Location Tab */}
      {activeTab === 'Location' && (
        <div style={card}>
          <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.9rem', color:'#111', marginBottom:'0.25rem' }}>Location &amp; Hours</p>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#999', marginBottom:'1.25rem', paddingBottom:'1rem', borderBottom:'1px solid #EDE9E3' }}>
            Physical address, opening hours, and Google Maps embed shown on the Find Us page.
          </p>
          <div style={{ display:'grid', gap:'1rem' }}>
            <div>
              <label style={lbl}>Address (one line per row)</label>
              <textarea style={{ ...inp, minHeight:'100px', resize:'vertical' }} value={form.address}
                onChange={e => set('address', e.target.value)} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div>
              <label style={lbl}>Opening Hours</label>
              <textarea style={{ ...inp, minHeight:'72px', resize:'vertical' }} value={form.hours}
                onChange={e => set('hours', e.target.value)} onFocus={focusStyle} onBlur={blurStyle} />
              <p style={{ fontFamily:'var(--sans)', fontSize:'0.68rem', color:'#A09890', marginTop:'0.3rem' }}>Use a new line for each hours entry</p>
            </div>
            <div>
              <label style={lbl}>Google Maps Embed URL</label>
              <textarea style={{ ...inp, minHeight:'80px', resize:'vertical', fontFamily:'monospace', fontSize:'0.72rem' }}
                value={form.map_embed} onChange={e => set('map_embed', e.target.value)} onFocus={focusStyle} onBlur={blurStyle} />
              <p style={{ fontFamily:'var(--sans)', fontSize:'0.68rem', color:'#A09890', marginTop:'0.3rem' }}>Paste the iframe src URL from Google Maps &rarr; Share &rarr; Embed</p>
            </div>
          </div>
          <SaveBtn group="location" keys={['address','hours','map_embed']} />
        </div>
      )}

      {/* About Tab */}
      {activeTab === 'About' && (
        <div style={card}>
          <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.9rem', color:'#111', marginBottom:'0.25rem' }}>About Page Content</p>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#999', marginBottom:'1.25rem', paddingBottom:'1rem', borderBottom:'1px solid #EDE9E3' }}>
            Headline and body text shown on the About page.
          </p>
          <div style={{ display:'grid', gap:'1rem' }}>
            <div>
              <label style={lbl}>Headline</label>
              <input style={inp} value={form.about_headline}
                onChange={e => set('about_headline', e.target.value)} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div>
              <label style={lbl}>Body Text</label>
              <textarea style={{ ...inp, minHeight:'140px', resize:'vertical' }} value={form.about_body}
                onChange={e => set('about_body', e.target.value)} onFocus={focusStyle} onBlur={blurStyle} />
            </div>
          </div>
          <SaveBtn group="about" keys={['about_headline','about_body']} />
        </div>
      )}

      {/* Gallery Tab */}
      {activeTab === 'Gallery' && (
        <div style={card}>
          <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.9rem', color:'#111', marginBottom:'0.25rem' }}>Gallery Interior Image</p>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#999', marginBottom:'1.25rem', paddingBottom:'1rem', borderBottom:'1px solid #EDE9E3' }}>
            The image shown in the &ldquo;A Private Gallery Experience&rdquo; section on the Find Us page. Leave blank to show the default GWG placeholder.
          </p>
          <div>
            <label style={lbl}>Upload Image</label>
            <label style={{
              display:'inline-flex', alignItems:'center', gap:'0.6rem',
              padding:'0.75rem 1.25rem', background:'#F7F6F3',
              border:'2px dashed #B08D57', borderRadius:'6px',
              cursor: uploading ? 'not-allowed' : 'pointer',
              fontFamily:'var(--sans)', fontSize:'0.8rem', color:'#555',
              opacity: uploading ? 0.7 : 1, transition:'opacity 0.15s',
            }}>
              <Upload size={15} style={{ color:'#B08D57', flexShrink:0 }} />
              {uploading ? 'Uploading…' : form.gallery_image_url ? 'Replace Image' : 'Choose Image File'}
              <input type="file" accept="image/*" style={{ display:'none' }}
                onChange={handleGalleryUpload} disabled={uploading} />
            </label>
            <p style={{ fontFamily:'var(--sans)', fontSize:'0.68rem', color:'#A09890', marginTop:'0.5rem' }}>
              JPG, PNG or WebP · Recommended aspect ratio 4:3
            </p>
          </div>
          {form.gallery_image_url && (
            <div style={{ marginTop:'1.25rem', position:'relative', borderRadius:'6px', overflow:'hidden', height:'200px', background:'#F7F6F3' }}>
              <img src={form.gallery_image_url} alt="Gallery preview"
                style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              <button
                onClick={() => set('gallery_image_url', '')}
                title="Remove image"
                style={{
                  position:'absolute', top:'0.5rem', right:'0.5rem',
                  background:'rgba(0,0,0,0.55)', border:'none', borderRadius:'50%',
                  width:'26px', height:'26px', display:'flex', alignItems:'center',
                  justifyContent:'center', cursor:'pointer', color:'#fff',
                }}>
                <X size={13} />
              </button>
            </div>
          )}
          <SaveBtn group="gallery" keys={['gallery_image_url']} />
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'SEO' && (
        <div style={card}>
          <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.9rem', color:'#111', marginBottom:'0.25rem' }}>SEO &amp; Metadata</p>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#999', marginBottom:'1.25rem', paddingBottom:'1rem', borderBottom:'1px solid #EDE9E3' }}>
            Page title and meta description used by Google search results and social previews.
          </p>
          <div style={{ display:'grid', gap:'1rem' }}>
            <div>
              <label style={lbl}>Page Title</label>
              <input style={inp} value={form.meta_title}
                onChange={e => set('meta_title', e.target.value)} onFocus={focusStyle} onBlur={blurStyle} />
              <p style={{ fontFamily:'var(--sans)', fontSize:'0.68rem', color: form.meta_title.length > 60 ? '#DC2626' : '#A09890', marginTop:'0.3rem' }}>
                {form.meta_title.length}/60 characters {form.meta_title.length > 60 ? '\u2014 too long' : '(recommended)'}
              </p>
            </div>
            <div>
              <label style={lbl}>Meta Description</label>
              <textarea style={{ ...inp, minHeight:'90px', resize:'vertical' }} value={form.meta_desc}
                onChange={e => set('meta_desc', e.target.value)} onFocus={focusStyle} onBlur={blurStyle} />
              <p style={{ fontFamily:'var(--sans)', fontSize:'0.68rem', color: form.meta_desc.length > 160 ? '#DC2626' : '#A09890', marginTop:'0.3rem' }}>
                {form.meta_desc.length}/160 characters {form.meta_desc.length > 160 ? '\u2014 too long' : '(recommended)'}
              </p>
            </div>
          </div>
          <SaveBtn group="seo" keys={['meta_title','meta_desc']} />
        </div>
      )}

      {/* Admin Access info */}
      <div style={{ ...card, marginTop:'1.5rem', background:'#FFFBF5', borderColor:'rgba(176,141,87,0.2)' }}>
        <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.85rem', color:'#111', marginBottom:'0.5rem' }}>Admin Access</p>
        <p style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', color:'#6B6560', lineHeight:1.7, marginBottom:'0.75rem' }}>
          To add or remove admin users, go to your Supabase dashboard &rarr; Table Editor &rarr; admin_users table.
        </p>
        <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer"
          style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#B08D57', textDecoration:'none', fontWeight:600 }}>
          Open Supabase Dashboard &rarr;
        </a>
      </div>
    </div>
  )
}
