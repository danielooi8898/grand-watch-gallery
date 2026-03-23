'use client'
import { useEffect, useState } from 'react'
import { Save, Loader2, Plus, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const inp   = { width:'100%', padding:'0.65rem 0.85rem', fontFamily:'var(--sans)', fontSize:'0.82rem', border:'1px solid #E8E2D8', background:'#fff', outline:'none', borderRadius:'2px', color:'#111', boxSizing:'border-box' }
const lbl   = { fontFamily:'var(--sans)', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#777', display:'block', marginBottom:'0.4rem' }
const card  = { background:'#fff', border:'1px solid #E8E2D8', borderRadius:'2px', padding:'1.75rem', marginBottom:'1.5rem' }
const hdr   = { fontFamily:'var(--sans)', fontWeight:700, fontSize:'0.9rem', color:'#111', marginBottom:'0.4rem' }
const sub   = { fontFamily:'var(--sans)', fontSize:'0.75rem', color:'#999', marginBottom:'1.25rem', paddingBottom:'1rem', borderBottom:'1px solid #F4EFE9' }
const saveBtn = (saving) => ({ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'#B08D57', color:'#fff', padding:'0.7rem 1.5rem', border:'none', cursor:'pointer', fontFamily:'var(--sans)', fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', opacity:saving?0.7:1 })

const DEF_SERVICES = [
  { num:'01', title:'Every Watch Authenticated', body:'Each timepiece is inspected by our in-house experts. We verify serial numbers, movements, dials, and cases - so you buy with absolute confidence.' },
  { num:'02', title:'Trade-In at Fair Value', body:'Upgrading your collection? We offer competitive, transparent valuations for pre-owned watches. No haggling, no surprises.' },
  { num:'03', title:'Private Gallery Viewings', body:'Experience our collection one-on-one with an expert. Book an exclusive consultation at our gallery - by appointment only.' },
]
const DEF_TESTIMONIALS = [
  { name:'Dato Ahmad R.', text:'Grand Watch Gallery has an exceptional collection. The team was knowledgeable and made finding my Patek Philippe effortless.' },
  { name:'Michelle T.',   text:'I traded in my Rolex and received an outstanding valuation. Transparent, professional, and genuinely fair.' },
  { name:'James Lim',     text:'The best pre-owned watch experience in KL. My Royal Oak arrived perfectly serviced with full authentication documents.' },
]

function useKV(key, def) {
  const [val, setVal] = useState(def)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', key).single()
      .then(({ data }) => { if (data?.value !== undefined) setVal(data.value); setLoading(false) })
  }, [key])
  const save = async () => {
    await supabase.from('site_settings').upsert({ key, value: val }, { onConflict:'key' })
  }
  return [val, setVal, save, loading]
}

export default function AdminContent() {
  // Hero
  const [hero, setHero, saveHero, heroLoading]             = useKV('hero', { title:'The Right\nTime For Life', subtitle:'EST. 2020 · AUTHENTICATED TIMEPIECES', description:'Rolex. Patek Philippe. Audemars Piguet. Richard Mille.\nEvery watch authenticated. Every detail considered.' })
  // Stats
  const [stats, setStats, saveStats]                       = useKV('stats', [{ n:'500', s:'+', l:'Watches Sold' },{ n:'17', s:'', l:'Luxury Brands' },{ n:'5', s:'+', l:'Years Est.' }])
  // Services
  const [services, setServices, saveServices]              = useKV('services', DEF_SERVICES)
  // Testimonials
  const [testimonials, setTestimonials, saveTestimonials]  = useKV('testimonials', DEF_TESTIMONIALS)
  // Brands
  const [brands, setBrands, saveBrands]                    = useKV('brands', ['Rolex','Patek Philippe','Audemars Piguet','Richard Mille','Vacheron Constantin','A. Lange & Söhne','IWC Schaffhausen','Omega','Hublot','Panerai','Breguet','Cartier','Chopard','Tudor','MB&F','Jacob & Co'])

  const [saving, setSaving] = useState('')
  const [toast,  setToast]  = useState('')
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const doSave = async (key, fn) => {
    setSaving(key); await fn(); setSaving(''); showToast('Saved!')
  }

  return (
    <div style={{ padding:'2.5rem 2.5rem 4rem', maxWidth:'860px' }}>
      {toast && <div style={{ position:'fixed', top:'1.5rem', right:'1.5rem', zIndex:999, background:'#166534', color:'#fff', padding:'0.75rem 1.25rem', fontFamily:'var(--sans)', fontSize:'0.8rem', borderRadius:'4px' }}>✓ {toast}</div>}

      <div style={{ marginBottom:'2rem', paddingBottom:'1.5rem', borderBottom:'1px solid #E8E2D8' }}>
        <p style={{ fontFamily:'var(--sans)', fontSize:'0.65rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#B08D57', marginBottom:'0.4rem' }}>Admin</p>
        <h1 style={{ fontFamily:'var(--sans)', fontWeight:800, fontSize:'1.75rem', letterSpacing:'-0.02em', color:'#111' }}>Homepage Content</h1>
        <p style={{ fontFamily:'var(--sans)', fontSize:'0.8rem', color:'#888', marginTop:'0.25rem' }}>Edit text and content displayed on the homepage. Changes go live immediately after saving.</p>
      </div>

      {/* Hero */}
      <div style={card}>
        <p style={hdr}>Hero Section</p>
        <p style={sub}>The large headline and intro text at the top of the homepage.</p>
        <div style={{ marginBottom:'1rem' }}>
          <label style={lbl}>Headline (use \n for line break)</label>
          <textarea style={{ ...inp, minHeight:'60px', resize:'vertical' }} value={hero.title} onChange={e=>setHero(p=>({...p,title:e.target.value}))} />
        </div>
        <div style={{ marginBottom:'1rem' }}>
          <label style={lbl}>Sub-label (small text above headline)</label>
          <input style={inp} value={hero.subtitle} onChange={e=>setHero(p=>({...p,subtitle:e.target.value}))} />
        </div>
        <div style={{ marginBottom:'1.25rem' }}>
          <label style={lbl}>Description paragraph</label>
          <textarea style={{ ...inp, minHeight:'70px', resize:'vertical' }} value={hero.description} onChange={e=>setHero(p=>({...p,description:e.target.value}))} />
        </div>
        <button style={saveBtn(saving==='hero')} onClick={() => doSave('hero', saveHero)}>
          {saving==='hero' ? <><Loader2 size={13} style={{ animation:'spin 1s linear infinite' }}/> Saving…</> : <><Save size={13}/> Save Hero</>}
        </button>
      </div>

      {/* Stats */}
      <div style={card}>
        <p style={hdr}>KPI Stats</p>
        <p style={sub}>The three numbers shown below the hero buttons.</p>
        {(stats||[]).map((s,i) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'80px 60px 1fr', gap:'0.75rem', marginBottom:'0.75rem', alignItems:'end' }}>
            <div><label style={lbl}>Number</label><input style={inp} value={s.n} onChange={e=>{const a=[...stats];a[i]={...a[i],n:e.target.value};setStats(a)}} /></div>
            <div><label style={lbl}>Suffix</label><input style={inp} value={s.s} onChange={e=>{const a=[...stats];a[i]={...a[i],s:e.target.value};setStats(a)}} /></div>
            <div><label style={lbl}>Label</label><input style={inp} value={s.l} onChange={e=>{const a=[...stats];a[i]={...a[i],l:e.target.value};setStats(a)}} /></div>
          </div>
        ))}
        <button style={{ ...saveBtn(saving==='stats'), marginTop:'0.5rem' }} onClick={() => doSave('stats', saveStats)}>
          {saving==='stats' ? <><Loader2 size={13} style={{ animation:'spin 1s linear infinite' }}/> Saving…</> : <><Save size={13}/> Save Stats</>}
        </button>
      </div>

      {/* Services */}
      <div style={card}>
        <p style={hdr}>Sticky Services Slides</p>
        <p style={sub}>The 3 scrolling service cards in the middle of the homepage.</p>
        {(services||[]).map((s,i) => (
          <div key={i} style={{ paddingBottom:'1.25rem', marginBottom:'1.25rem', borderBottom: i<services.length-1?'1px solid #F4EFE9':'none' }}>
            <div style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:'0.75rem', marginBottom:'0.75rem' }}>
              <div><label style={lbl}>Number</label><input style={inp} value={s.num} onChange={e=>{const a=[...services];a[i]={...a[i],num:e.target.value};setServices(a)}} /></div>
              <div><label style={lbl}>Title</label><input style={inp} value={s.title} onChange={e=>{const a=[...services];a[i]={...a[i],title:e.target.value};setServices(a)}} /></div>
            </div>
            <div><label style={lbl}>Body text</label><textarea style={{ ...inp, minHeight:'70px', resize:'vertical' }} value={s.body} onChange={e=>{const a=[...services];a[i]={...a[i],body:e.target.value};setServices(a)}} /></div>
          </div>
        ))}
        <button style={saveBtn(saving==='services')} onClick={() => doSave('services', saveServices)}>
          {saving==='services' ? <><Loader2 size={13} style={{ animation:'spin 1s linear infinite' }}/> Saving…</> : <><Save size={13}/> Save Services</>}
        </button>
      </div>

      {/* Testimonials */}
      <div style={card}>
        <p style={hdr}>Client Testimonials</p>
        <p style={sub}>Quotes shown in the testimonials section on the homepage.</p>
        {(testimonials||[]).map((t,i) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 2fr auto', gap:'0.75rem', alignItems:'start', marginBottom:'0.75rem' }}>
            <div><label style={lbl}>Name</label><input style={inp} value={t.name} onChange={e=>{const a=[...testimonials];a[i]={...a[i],name:e.target.value};setTestimonials(a)}} /></div>
            <div><label style={lbl}>Quote</label><textarea style={{ ...inp, minHeight:'60px', resize:'vertical' }} value={t.text} onChange={e=>{const a=[...testimonials];a[i]={...a[i],text:e.target.value};setTestimonials(a)}} /></div>
            <div style={{ paddingTop:'1.4rem' }}>
              <button onClick={() => setTestimonials(testimonials.filter((_,j)=>j!==i))} style={{ padding:'0.5rem', border:'1px solid #fca5a5', background:'#fff', cursor:'pointer', color:'#dc2626' }}><Trash2 size={13}/></button>
            </div>
          </div>
        ))}
        <div style={{ display:'flex', gap:'0.75rem', marginTop:'0.75rem' }}>
          <button onClick={() => setTestimonials([...testimonials,{name:'',text:''}])} style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', padding:'0.6rem 1rem', border:'1px solid #E8E2D8', background:'#fff', cursor:'pointer', fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#555' }}>
            <Plus size={13}/> Add Testimonial
          </button>
          <button style={saveBtn(saving==='testimonials')} onClick={() => doSave('testimonials', saveTestimonials)}>
            {saving==='testimonials' ? <><Loader2 size={13} style={{ animation:'spin 1s linear infinite' }}/> Saving…</> : <><Save size={13}/> Save Testimonials</>}
          </button>
        </div>
      </div>

      {/* Brands */}
      <div style={card}>
        <p style={hdr}>Brand Marquee Strip</p>
        <p style={sub}>Brands shown in the scrolling strip. One brand per line.</p>
        <textarea style={{ ...inp, minHeight:'160px', resize:'vertical', fontFamily:'monospace' }}
          value={(brands||[]).join('\n')} onChange={e=>setBrands(e.target.value.split('\n').map(s=>s.trim()).filter(Boolean))} />
        <button style={{ ...saveBtn(saving==='brands'), marginTop:'1rem' }} onClick={() => doSave('brands', saveBrands)}>
          {saving==='brands' ? <><Loader2 size={13} style={{ animation:'spin 1s linear infinite' }}/> Saving…</> : <><Save size={13}/> Save Brands</>}
        </button>
      </div>
    </div>
  )
}
