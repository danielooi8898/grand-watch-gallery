'use client'
import Spinner from '@/components/Spinner'
import { useEffect, useState } from 'react'
import { Save, Plus, Trash2, CheckCircle, Eye } from 'lucide-react'
import { supabase } from '@/lib/supabase'

/* ─── Shared styles ─────────────────────────────────────────────────────── */
const inp = {
  width:'100%', padding:'0.65rem 0.85rem', fontFamily:'var(--sans)', fontSize:'0.82rem',
  border:'1px solid #E0DDD8', background:'#fff', outline:'none', borderRadius:'4px',
  color:'#111', boxSizing:'border-box', transition:'border-color 0.15s'
}
const lbl = {
  fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase',
  color:'#6B6560', display:'block', marginBottom:'0.4rem', fontWeight:600
}
const hint = { fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#A09890', marginTop:'0.35rem' }

function Field({ label, children, hint: h }) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      {children}
      {h && <p style={hint}>{h}</p>}
    </div>
  )
}

function SaveBar({ saving, onSave }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'0.75rem', paddingTop:'1.5rem', marginTop:'1.5rem', borderTop:'1px solid #EDE9E3' }}>
      <button onClick={onSave} disabled={saving} style={{
        display:'inline-flex', alignItems:'center', gap:'0.5rem',
        background:'#B08D57', color:'#fff', padding:'0.65rem 1.5rem',
        border:'none', cursor: saving ? 'not-allowed' : 'pointer',
        fontFamily:'var(--sans)', fontSize:'0.72rem', fontWeight:700,
        letterSpacing:'0.12em', textTransform:'uppercase', borderRadius:'4px',
        opacity: saving ? 0.7 : 1, transition:'opacity 0.15s'
      }}>
        {saving
          ? <><Spinner size={13} style={{ animation:'spin 1s linear infinite' }}/> Saving…</>
          : <><Save size={13}/> Save Changes</>}
      </button>
    </div>
  )
}

/* ─── useKV hook ─────────────────────────────────────────────────────────── */
function useKV(key, def) {
  const [val, setVal] = useState(def)
  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', key).single()
      .then(({ data }) => {
        if (data?.value !== undefined && data.value !== null) {
          setVal(typeof data.value === 'string'
            ? (() => { try { return JSON.parse(data.value) } catch { return data.value } })()
            : data.value)
        }
      })
  }, [key])
  const save = () => supabase.from('site_settings').upsert({ key, value: val }, { onConflict:'key' })
  return [val, setVal, save]
}

const DEF_SERVICES = [
  { num:'01', title:'Every Watch Authenticated', body:'Each timepiece is inspected by our in-house experts. We verify serial numbers, movements, dials, and cases - so you buy with absolute confidence.' },
  { num:'02', title:'Trade-In at Fair Value',    body:'Upgrading your collection? We offer competitive, transparent valuations for pre-owned watches. No haggling, no surprises.' },
  { num:'03', title:'Private Gallery Viewings',  body:'Experience our collection one-on-one with an expert. Book an exclusive consultation at our gallery - by appointment only.' },
]
const DEF_TESTIMONIALS = [
  { name:'Dato Ahmad R.', text:'Grand Watch Gallery has an exceptional collection. The team was knowledgeable and made finding my Patek Philippe effortless.' },
  { name:'Michelle T.',   text:'I traded in my Rolex and received an outstanding valuation. Transparent, professional, and genuinely fair.' },
  { name:'James Lim',     text:'The best pre-owned watch experience in KL. My Royal Oak arrived perfectly serviced with full authentication documents.' },
]
const TABS = ['Hero', 'Stats', 'Services', 'Testimonials', 'Brands']

export default function AdminContent() {
  const [hero,         setHero,         saveHero]         = useKV('hero', { title:'The Right\nTime For Life', subtitle:'EST. 2020 · AUTHENTICATED TIMEPIECES', description:'Rolex. Patek Philippe. Audemars Piguet. Richard Mille.\nEvery watch authenticated. Every detail considered.' })
  const [stats,        setStats,        saveStats]        = useKV('stats', [{ n:'500', s:'+', l:'Watches Sold' },{ n:'17', s:'', l:'Luxury Brands' },{ n:'5', s:'+', l:'Years Est.' }])
  const [services,     setServices,     saveServices]     = useKV('services', DEF_SERVICES)
  const [testimonials, setTestimonials, saveTestimonials] = useKV('testimonials', DEF_TESTIMONIALS)
  const [brands,       setBrands,       ]                 = useKV('brands', ['Rolex','Patek Philippe','Audemars Piguet','Richard Mille','Vacheron Constantin','A. Lange & Söhne','IWC Schaffhausen','Omega','Hublot','Panerai','Breguet','Cartier','Chopard','Tudor','MB&F','Jacob & Co'])

  // Separate raw text state for brands textarea — preserves newlines/cursor while typing
  const [brandsText,   setBrandsText]   = useState('')
  const [brandsLoaded, setBrandsLoaded] = useState(false)

  // Sync brandsText from DB on first load
  useEffect(() => {
    if (!brandsLoaded && brands && brands.length > 0) {
      setBrandsText(brands.join('\n'))
      setBrandsLoaded(true)
    }
  }, [brands, brandsLoaded])

  const [activeTab, setActiveTab] = useState('Hero')
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)

  const doSave = async (fn) => {
    setSaving(true)
    await fn()
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  // Direct brands save — reads brandsText, cleans, upserts
  const saveBrandsDirect = async () => {
    const cleaned = brandsText.split('\n').map(s => s.trim()).filter(Boolean)
    setBrands(cleaned)
    await supabase.from('site_settings').upsert({ key: 'brands', value: cleaned }, { onConflict:'key' })
  }

  const card = { background:'#fff', borderRadius:'8px', border:'1px solid #EDE9E3', padding:'1.75rem', boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }

  return (
    <div style={{ padding:'1.5rem 1.5rem 4rem', maxWidth:'900px' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'2rem', paddingBottom:'1.5rem', borderBottom:'1px solid #EDE9E3', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.62rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#B08D57', marginBottom:'0.35rem' }}>Admin · Content</p>
          <h1 style={{ fontFamily:'var(--sans)', fontWeight:800, fontSize:'1.6rem', letterSpacing:'-0.02em', color:'#111' }}>Homepage Editor</h1>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', color:'#888', marginTop:'0.2rem' }}>All changes go live immediately after saving.</p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" style={{
          display:'inline-flex', alignItems:'center', gap:'0.4rem', padding:'0.5rem 1rem',
          border:'1px solid #EDE9E3', borderRadius:'4px', background:'#fff', textDecoration:'none',
          fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#666', transition:'border-color 0.15s'
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor='#B08D57'}
          onMouseLeave={e => e.currentTarget.style.borderColor='#EDE9E3'}>
          <Eye size={13} /> Preview Site
        </a>
      </div>

      {/* Toast */}
      {saved && (
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'#ECFDF5', border:'1px solid #A7F3D0', color:'#065F46', padding:'0.75rem 1rem', borderRadius:'6px', fontFamily:'var(--sans)', fontSize:'0.8rem', marginBottom:'1.5rem' }}>
          <CheckCircle size={15} style={{ flexShrink:0 }} />
          Saved! Changes are now live on the website.
        </div>
      )}

      {/* Tabs */}
      <div style={{ display:'flex', gap:'0.25rem', marginBottom:'1.5rem', background:'#EDE9E3', padding:'0.25rem', borderRadius:'6px', flexWrap:'wrap' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex:1, minWidth:'60px', padding:'0.5rem 0.5rem', border:'none', cursor:'pointer',
            borderRadius:'4px', fontFamily:'var(--sans)', fontSize:'0.72rem',
            fontWeight: activeTab === tab ? 600 : 400,
            background: activeTab === tab ? '#fff' : 'transparent',
            color: activeTab === tab ? '#111' : '#888',
            boxShadow: activeTab === tab ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
            transition:'all 0.15s',
          }}>
            {tab}
          </button>
        ))}
      </div>

      {/* ── Hero Tab ── */}
      {activeTab === 'Hero' && (
        <div style={card}>
          <div style={{ marginBottom:'1.25rem' }}>
            <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.9rem', color:'#111', marginBottom:'0.25rem' }}>Hero Section</p>
            <p style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#999' }}>The large headline and intro text at the very top of the homepage.</p>
          </div>
          <div style={{ display:'grid', gap:'1rem' }}>
            <Field label="Small Label (above headline)" hint='Shown above the main headline in gold.'>
              <input style={inp} value={hero.subtitle || ''} onChange={e => setHero(p => ({ ...p, subtitle: e.target.value }))}
                onFocus={e => e.target.style.borderColor='#B08D57'} onBlur={e => e.target.style.borderColor='#E0DDD8'} />
            </Field>
            <Field label="Headline" hint='Use Enter to split into 2 lines. The first word of line 2 shows in gold.'>
              <textarea style={{ ...inp, minHeight:'72px', resize:'vertical' }} value={hero.title || ''} onChange={e => setHero(p => ({ ...p, title: e.target.value }))}
                onFocus={e => e.target.style.borderColor='#B08D57'} onBlur={e => e.target.style.borderColor='#E0DDD8'} />
            </Field>
            <Field label="Description Paragraph" hint='Short intro text below the headline.'>
              <textarea style={{ ...inp, minHeight:'80px', resize:'vertical' }} value={hero.description || ''} onChange={e => setHero(p => ({ ...p, description: e.target.value }))}
                onFocus={e => e.target.style.borderColor='#B08D57'} onBlur={e => e.target.style.borderColor='#E0DDD8'} />
            </Field>
          </div>
          <SaveBar saving={saving} onSave={() => doSave(saveHero)} />
        </div>
      )}

      {/* ── Stats Tab ── */}
      {activeTab === 'Stats' && (
        <div style={card}>
          <div style={{ marginBottom:'1.25rem' }}>
            <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.9rem', color:'#111', marginBottom:'0.25rem' }}>KPI Statistics</p>
            <p style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#999' }}>The three numbers shown below the hero buttons.</p>
          </div>
          <div style={{ display:'grid', gap:'1rem' }}>
            {(stats || []).map((s, i) => (
              <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 80px 2fr', gap:'0.75rem', alignItems:'end', padding:'1rem', background:'#F7F6F3', borderRadius:'6px' }}>
                <Field label={`Stat ${i+1} — Number`}>
                  <input style={inp} value={s.n} placeholder="500" onChange={e => { const a=[...stats]; a[i]={...a[i],n:e.target.value}; setStats(a) }}
                    onFocus={e => e.target.style.borderColor='#B08D57'} onBlur={e => e.target.style.borderColor='#E0DDD8'} />
                </Field>
                <Field label="Suffix">
                  <input style={inp} value={s.s} placeholder="+" onChange={e => { const a=[...stats]; a[i]={...a[i],s:e.target.value}; setStats(a) }}
                    onFocus={e => e.target.style.borderColor='#B08D57'} onBlur={e => e.target.style.borderColor='#E0DDD8'} />
                </Field>
                <Field label="Label">
                  <input style={inp} value={s.l} placeholder="Watches Sold" onChange={e => { const a=[...stats]; a[i]={...a[i],l:e.target.value}; setStats(a) }}
                    onFocus={e => e.target.style.borderColor='#B08D57'} onBlur={e => e.target.style.borderColor='#E0DDD8'} />
                </Field>
              </div>
            ))}
          </div>
          <SaveBar saving={saving} onSave={() => doSave(saveStats)} />
        </div>
      )}

      {/* ── Services Tab ── */}
      {activeTab === 'Services' && (
        <div style={card}>
          <div style={{ marginBottom:'1.25rem' }}>
            <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.9rem', color:'#111', marginBottom:'0.25rem' }}>Sticky Services Slides</p>
            <p style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#999' }}>The 3 full-screen scrolling panels in the middle of the homepage.</p>
          </div>
          <div style={{ display:'grid', gap:'1.25rem' }}>
            {(services || []).map((s, i) => (
              <div key={i} style={{ padding:'1.25rem', background:'#F7F6F3', borderRadius:'6px', border:'1px solid #EDE9E3' }}>
                <p style={{ ...lbl, marginBottom:'0.75rem', fontSize:'0.65rem' }}>Slide {i+1}</p>
                <div style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:'0.75rem', marginBottom:'0.75rem' }}>
                  <Field label="Number">
                    <input style={inp} value={s.num} onChange={e => { const a=[...services]; a[i]={...a[i],num:e.target.value}; setServices(a) }}
                      onFocus={e => e.target.style.borderColor='#B08D57'} onBlur={e => e.target.style.borderColor='#E0DDD8'} />
                  </Field>
                  <Field label="Title">
                    <input style={inp} value={s.title} onChange={e => { const a=[...services]; a[i]={...a[i],title:e.target.value}; setServices(a) }}
                      onFocus={e => e.target.style.borderColor='#B08D57'} onBlur={e => e.target.style.borderColor='#E0DDD8'} />
                  </Field>
                </div>
                <Field label="Body Text">
                  <textarea style={{ ...inp, minHeight:'80px', resize:'vertical' }} value={s.body} onChange={e => { const a=[...services]; a[i]={...a[i],body:e.target.value}; setServices(a) }}
                    onFocus={e => e.target.style.borderColor='#B08D57'} onBlur={e => e.target.style.borderColor='#E0DDD8'} />
                </Field>
              </div>
            ))}
          </div>
          <SaveBar saving={saving} onSave={() => doSave(saveServices)} />
        </div>
      )}

      {/* ── Testimonials Tab ── */}
      {activeTab === 'Testimonials' && (
        <div style={card}>
          <div style={{ marginBottom:'1.25rem' }}>
            <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.9rem', color:'#111', marginBottom:'0.25rem' }}>Client Testimonials</p>
            <p style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#999' }}>Quotes shown in the "Client Stories" section.</p>
          </div>
          <div style={{ display:'grid', gap:'1rem' }}>
            {(testimonials || []).map((t, i) => (
              <div key={i} style={{ padding:'1.25rem', background:'#F7F6F3', borderRadius:'6px', border:'1px solid #EDE9E3' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.75rem' }}>
                  <p style={{ ...lbl, marginBottom:0, fontSize:'0.65rem' }}>Testimonial {i+1}</p>
                  <button onClick={() => setTestimonials(testimonials.filter((_,j)=>j!==i))} style={{ padding:'0.3rem 0.6rem', border:'1px solid #FCA5A5', background:'#FFF5F5', cursor:'pointer', color:'#DC2626', borderRadius:'4px', display:'flex', alignItems:'center', gap:'0.3rem', fontFamily:'var(--sans)', fontSize:'0.68rem' }}>
                    <Trash2 size={11}/> Remove
                  </button>
                </div>
                <div style={{ display:'grid', gap:'0.75rem' }}>
                  <Field label="Client Name">
                    <input style={inp} value={t.name} placeholder="e.g. Dato Ahmad R." onChange={e => { const a=[...testimonials]; a[i]={...a[i],name:e.target.value}; setTestimonials(a) }}
                      onFocus={e => e.target.style.borderColor='#B08D57'} onBlur={e => e.target.style.borderColor='#E0DDD8'} />
                  </Field>
                  <Field label="Quote">
                    <textarea style={{ ...inp, minHeight:'80px', resize:'vertical' }} value={t.text} placeholder="Their quote here…" onChange={e => { const a=[...testimonials]; a[i]={...a[i],text:e.target.value}; setTestimonials(a) }}
                      onFocus={e => e.target.style.borderColor='#B08D57'} onBlur={e => e.target.style.borderColor='#E0DDD8'} />
                  </Field>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:'0.75rem', marginTop:'1rem' }}>
            <button onClick={() => setTestimonials([...(testimonials||[]),{name:'',text:''}])} style={{
              display:'inline-flex', alignItems:'center', gap:'0.4rem', padding:'0.6rem 1rem',
              border:'1px solid #EDE9E3', background:'#fff', cursor:'pointer',
              fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#555', borderRadius:'4px', transition:'border-color 0.15s'
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor='#B08D57'}
              onMouseLeave={e => e.currentTarget.style.borderColor='#EDE9E3'}>
              <Plus size={13}/> Add Testimonial
            </button>
          </div>
          <SaveBar saving={saving} onSave={() => doSave(saveTestimonials)} />
        </div>
      )}

      {/* ── Brands Tab ── */}
      {activeTab === 'Brands' && (
        <div style={card}>
          <div style={{ marginBottom:'1.25rem' }}>
            <p style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.9rem', color:'#111', marginBottom:'0.25rem' }}>Brand Marquee Strip</p>
            <p style={{ fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#999' }}>Brands shown in the scrolling strip. One brand per line. Press Enter to add a new brand.</p>
          </div>
          <Field label="Brand List (one per line)">
            <textarea
              style={{ ...inp, minHeight:'200px', resize:'vertical', fontFamily:'monospace', fontSize:'0.8rem', lineHeight:1.7 }}
              value={brandsText}
              onChange={e => setBrandsText(e.target.value)}
              onFocus={e => e.target.style.borderColor='#B08D57'}
              onBlur={e => e.target.style.borderColor='#E0DDD8'}
              placeholder={'Rolex\nPatek Philippe\nAudemars Piguet\n...'}
            />
          </Field>
          <p style={hint}>{brandsText.split('\n').filter(s => s.trim()).length} brands configured</p>
          <SaveBar saving={saving} onSave={() => doSave(saveBrandsDirect)} />
        </div>
      )}

    </div>
  )
}
