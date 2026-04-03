'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowDown } from 'lucide-react'
import AnimateIn from '@/components/AnimateIn'
import { useCounter } from '@/hooks/useCounter'
import { useStickyProgress } from '@/hooks/useStickyProgress'
import { supabase } from '@/lib/supabase'

/* ─── Defaults ───────────────────────────────────────────────────────────── */
const D_BRANDS = ['Rolex','Patek Philippe','Audemars Piguet','Richard Mille','Vacheron Constantin','A. Lange & Söhne','IWC Schaffhausen','Omega','Hublot','Panerai','Breguet','Cartier','Chopard','Tudor','MB&F','Jacob & Co']
const D_HERO   = { title:'The Right\nTime For Life', subtitle:'EST. 2020 · AUTHENTICATED TIMEPIECES', description:'Rolex. Patek Philippe. Audemars Piguet. Richard Mille.\nEvery watch authenticated. Every detail considered.' }
const D_STATS  = [{ n:'500',s:'+',l:'Watches Sold' },{ n:'17',s:'',l:'Luxury Brands' },{ n:'5',s:'+',l:'Years Est.' }]
const D_SVCS   = [
  { num:'01', title:'Every Watch Authenticated', body:'Each timepiece is inspected by our in-house experts. We verify serial numbers, movements, dials, and cases - so you buy with absolute confidence.' },
  { num:'02', title:'Trade-In at Fair Value',    body:'Upgrading your collection? We offer competitive, transparent valuations for pre-owned watches. No haggling, no surprises.' },
  { num:'03', title:'Private Gallery Viewings',  body:'Experience our collection one-on-one with an expert. Book an exclusive consultation at our gallery - by appointment only.' },
]
const D_TESTI  = [
  { name:'Dato Ahmad R.', text:'Grand Watch Gallery has an exceptional collection. The team was knowledgeable and made finding my Patek Philippe effortless.' },
  { name:'Michelle T.',   text:'I traded in my Rolex and received an outstanding valuation. Transparent, professional, and genuinely fair.' },
  { name:'James Lim',     text:'The best pre-owned watch experience in KL. My Royal Oak arrived perfectly serviced with full authentication documents.' },
]

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function parse(val, fallback) {
  if (val == null) return fallback
  if (typeof val === 'string') { try { return JSON.parse(val) } catch { return fallback } }
  return val
}
function fmtPrice(n) {
  return n ? 'MYR ' + Number(n).toLocaleString() : 'P.O.A.'
}
function conditionTag(w) {
  if (w.is_featured) return 'Featured'
  const map = { new:'New', unworn:'Unworn', excellent:'In Stock', good:'In Stock', fair:'In Stock' }
  return map[w.condition] || 'In Stock'
}
// Get up to 2 key details for the spotlight spec grid
function spotlightSpecs(w) {
  const specs = []
  if (w.year)      specs.push(['Year', w.year])
  if (w.condition) specs.push(['Condition', w.condition.charAt(0).toUpperCase() + w.condition.slice(1)])
  const features = Array.isArray(w.features) ? w.features : (w.features ? [w.features] : [])
  features.slice(0, 2).forEach((f, i) => specs.push([`Detail ${i+1}`, f]))
  // Pad to 4 if needed
  while (specs.length < 4) specs.push(null)
  return specs.slice(0, 4)
}

/* ─── Videos for sticky services ────────────────────────────────────────── */
const serviceVideos = [
  'https://videos.pexels.com/video-files/6230464/6230464-hd_1920_1080_24fps.mp4',
  'https://videos.pexels.com/video-files/6328383/6328383-uhd_2732_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/8322334/8322334-uhd_2732_1440_25fps.mp4',
]

function StickyServices({ services }) {
  const [containerRef, prog] = useStickyProgress()
  const step = prog < 0.35 ? 0 : prog < 0.68 ? 1 : 2
  const s = services[Math.min(step, services.length - 1)] || services[0]

  return (
    <div ref={containerRef} style={{ height:'280vh' }}>
      <div className="sticky top-0 overflow-hidden flex flex-col md:flex-row"
        style={{ height:'100vh', background:'#0D0D0D' }}>

        {serviceVideos.map((src, i) => (
          <video key={src} src={src} autoPlay muted loop playsInline style={{
            position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover',
            opacity: i === step ? 0.48 : 0, transition:'opacity 0.8s ease', zIndex:0, pointerEvents:'none',
          }} />
        ))}

        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right,rgba(13,13,13,0.88) 33%,rgba(13,13,13,0.60))', zIndex:1, pointerEvents:'none' }} />

        <div className="hidden md:flex items-center justify-center w-1/3 border-r"
          style={{ borderColor:'#1a1a1a', position:'relative', zIndex:2 }}>
          <span className="serif font-light" style={{ fontSize:'clamp(6rem,14vw,14rem)', color:'#1a1a1a', lineHeight:1, userSelect:'none' }}>{s.num}</span>
        </div>

        <div className="flex flex-col justify-center flex-1 px-8 md:px-16 lg:px-24" style={{ position:'relative', zIndex:2 }}>
          <div className="flex gap-2 mb-10 md:mb-14">
            {services.map((_, i) => (
              <div key={i} className="transition-all duration-500"
                style={{ width:i===step?'24px':'6px', height:'2px', background:i===step?'#B08D57':'#2a2a2a', borderRadius:'1px' }} />
            ))}
          </div>
          <p style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#B08D57', marginBottom:'1.5rem' }}>
            {s.num} of {services.length.toString().padStart(2,'0')}
          </p>
          <h2 key={`h-${step}`} className="serif font-light" style={{ fontFamily:'var(--serif)', fontSize:'clamp(2rem,4vw,3.5rem)', color:'#fff', lineHeight:1.1, letterSpacing:'-0.01em', marginBottom:'2rem' }}>
            {s.title}
          </h2>
          <div style={{ width:'36px', height:'1px', background:'#B08D57', marginBottom:'2rem' }} />
          <p key={`p-${step}`} style={{ fontFamily:'var(--sans)', fontSize:'1rem', color:'#fff', lineHeight:1.8, maxWidth:'500px', fontWeight:300, marginBottom:'2.5rem' }}>
            {s.body}
          </p>
          <Link href="/appointment" className="btn btn-outline-white" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem' }}>
            Book a Viewing <ArrowRight size={13} />
          </Link>
        </div>

        {step === 0 && (
          <div className="absolute bottom-8 right-8 flex-col items-center gap-2 opacity-30 hidden md:flex" style={{ zIndex:2 }}>
            <span style={{ fontFamily:'var(--sans)', fontSize:'0.8rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#fff', writingMode:'vertical-rl' }}>Scroll</span>
            <ArrowDown size={12} color="#fff" />
          </div>
        )}
      </div>
    </div>
  )
}

function StatCounter({ target, suffix='', label }) {
  const [count, start] = useCounter(target)
  const ref     = useRef(null)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) { setStarted(true); start(); obs.disconnect() } }, { threshold:0.4 })
    obs.observe(el); return () => obs.disconnect()
  }, [started])
  return (
    <div ref={ref} className="text-center md:text-left">
      <div className="serif font-light" style={{ fontSize:'clamp(2.5rem,5vw,4rem)', color:'#fff', lineHeight:1 }}>{count}{suffix}</div>
      <div style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', letterSpacing:'0.25em', textTransform:'uppercase', color:'#B08D57', marginTop:'0.5rem' }}>{label}</div>
    </div>
  )
}

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const heroRef = useRef(null)

  const [hero,     setHero]     = useState(D_HERO)
  const [stats,    setStats]    = useState(D_STATS)
  const [services, setServices] = useState(D_SVCS)
  const [testi,    setTesti]    = useState(D_TESTI)
  const [brands,   setBrands]   = useState(D_BRANDS)
  const [watches,  setWatches]  = useState([])       // homepage collection preview
  const [spotlight,setSpotlight]= useState(null)     // piece of the month

  useEffect(() => {
    // Site settings
    supabase.from('site_settings').select('key,value')
      .in('key', ['hero','stats','services','testimonials','brands','spotlight_id'])
      .then(({ data }) => {
        if (!data) return
        let spotId = null
        data.forEach(({ key, value }) => {
          if (key === 'hero')         setHero(parse(value, D_HERO))
          if (key === 'stats')        setStats(parse(value, D_STATS))
          if (key === 'services')     setServices(parse(value, D_SVCS))
          if (key === 'testimonials') setTesti(parse(value, D_TESTI))
          if (key === 'brands')       setBrands(parse(value, D_BRANDS))
          if (key === 'spotlight_id') {
            // value may be stored as a JSON string with quotes
            spotId = typeof value === 'string' ? value.replace(/^"|"$/g,'') : value
          }
        })
        // Fetch spotlight watch once we have its ID
        if (spotId) {
          supabase.from('watches').select('*').eq('id', spotId).eq('is_sold', false).single()
            .then(({ data: w }) => { if (w) setSpotlight(w) })
        }
      })

    // Collection preview — featured first, newest next, max 4
    supabase.from('watches').select('*')
      .eq('is_sold', false)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(4)
      .then(({ data }) => { if (data && data.length > 0) setWatches(data) })
  }, [])

  useEffect(() => {
    const fn = () => { const img = heroRef.current; if (img) img.style.transform = `translateY(${window.scrollY*0.3}px)` }
    window.addEventListener('scroll', fn, { passive:true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const lines   = (hero.title||'').split('\n')
  const line1   = lines[0] || ''
  const l2parts = (lines[1]||'').split(' ')
  const goldW   = l2parts[0] || ''
  const rest    = l2parts.slice(1).join(' ')
  const descLines = (hero.description||'').split('\n')

  return (
    <>
      {/* 1. HERO */}
      <section className="relative flex flex-col justify-end overflow-hidden" style={{ minHeight:'100svh', background:'#0D0D0D' }}>
        <div className="absolute inset-0 overflow-hidden">
          <img ref={heroRef} src="/gwg-hero.jpg" alt="Grand Watch Gallery" className="w-full h-full object-cover"
            style={{ objectPosition:'center 25%', opacity:0.45, willChange:'transform', transform:'translateY(0)' }}
            onError={e => { e.target.style.display='none' }} />
          <div className="absolute inset-0" style={{ background:'linear-gradient(to top,#0D0D0D 20%,rgba(13,13,13,0.2) 80%)' }} />
        </div>
        <div className="relative z-10 container pb-16 md:pb-24 pt-32">
          <AnimateIn delay={100}>
            <p style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', letterSpacing:'0.35em', textTransform:'uppercase', color:'#B08D57', marginBottom:'1.5rem' }}>
              {hero.subtitle || D_HERO.subtitle}
            </p>
          </AnimateIn>
          <AnimateIn delay={250}>
            <h1 className="serif font-light" style={{ fontFamily:'var(--serif)', fontSize:'clamp(3.5rem,10vw,9rem)', color:'#fff', lineHeight:1.05, letterSpacing:'-0.02em', marginBottom:'2rem' }}>
              {line1}<br />
              <em style={{ color:'#B08D57', fontStyle:'normal' }}>{goldW}</em>{rest ? ` ${rest}` : ''}
            </h1>
          </AnimateIn>
          <AnimateIn delay={400}>
            <p style={{ fontFamily:'var(--sans)', fontSize:'1rem', color:'rgba(255,255,255,0.8)', fontWeight:300, maxWidth:'440px', lineHeight:1.7, marginBottom:'2.5rem' }}>
              {descLines.map((l,i) => <span key={i}>{l}{i < descLines.length-1 && <br/>}</span>)}
            </p>
          </AnimateIn>
          <AnimateIn delay={550} className="flex flex-col sm:flex-row gap-3">
            <Link href="/collection" className="btn btn-dark w-full sm:w-auto justify-center" style={{ background:'#B08D57', borderColor:'#B08D57', color:'#fff' }}>
              Explore Collection <ArrowRight size={13} />
            </Link>
            <Link href="/appointment" className="btn btn-outline-white w-full sm:w-auto justify-center">
              Book a Private Viewing
            </Link>
          </AnimateIn>
          <AnimateIn delay={700}>
            <div className="grid grid-cols-3 gap-4 pt-10 md:pt-14 border-t" style={{ borderColor:'rgba(255,255,255,0.06)', marginTop:'5rem' }}>
              {stats.map(st => (
                <div key={st.l}>
                  <div className="serif font-light" style={{ fontSize:'clamp(1.5rem,4vw,2.75rem)', color:'#fff', lineHeight:1 }}>{st.n}{st.s}</div>
                  <div style={{ fontFamily:'var(--sans)', fontSize:'0.8rem', letterSpacing:'0.25em', textTransform:'uppercase', color:'#B08D57', marginTop:'0.4rem' }}>{st.l}</div>
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* 2. BRAND STRIP */}
      <div style={{ borderTop:'1px solid #1A1A1A', borderBottom:'1px solid #1A1A1A', background:'#0D0D0D', overflow:'hidden', padding:'0.875rem 0' }}>
        <div style={{ display:'flex', gap:'3.5rem', whiteSpace:'nowrap', animation:'marquee 40s linear infinite', width:'max-content' }}>
          {[...brands,...brands].map((b,i) => (
            <span key={i} style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#C8B99A', fontWeight:400 }}>{b}</span>
          ))}
        </div>
      </div>

      {/* 3. FEATURED COLLECTION — live from Supabase */}
      {watches.length > 0 && (
        <section style={{ background:'#0A0A0A', padding:'6rem 0' }}>
          <div className="container">
            <div className="flex items-end justify-between mb-16" style={{ borderBottom:'1px solid #1A1A1A', paddingBottom:'2rem' }}>
              <div>
                <p style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', letterSpacing:'0.35em', textTransform:'uppercase', color:'#B08D57', marginBottom:'0.75rem' }}>Selected Pieces</p>
                <h2 style={{ fontFamily:'var(--sans)', fontWeight:900, fontSize:'clamp(2.5rem,5vw,4rem)', color:'#fff', textTransform:'uppercase', lineHeight:1 }}>The Collection</h2>
              </div>
              <Link href="/collection" style={{ fontFamily:'var(--sans)', fontSize:'0.7rem', letterSpacing:'0.25em', textTransform:'uppercase', color:'#B08D57', textDecoration:'none', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                View All <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap:'3rem 2rem' }}>
              {watches.map(w => (
                <Link key={w.id} href={`/collection/${w.id}`} style={{ textDecoration:'none', display:'block' }} className="group">
                  <div style={{ background:'#111', aspectRatio:'1/1', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.5rem', position:'relative', overflow:'hidden' }}>
                    {w.images && w.images[0] ? (
                      <img src={w.images[0]} alt={`${w.brand} ${w.model}`}
                        style={{ width:'85%', height:'85%', objectFit:'contain', transition:'transform 0.6s ease' }}
                        className="group-hover:scale-105" />
                    ) : (
                      <span style={{ fontFamily:'var(--sans)', fontWeight:900, fontSize:'6rem', color:'#1a1a1a', lineHeight:1, userSelect:'none', letterSpacing:'-0.05em' }}>
                        {w.brand.charAt(0)}
                      </span>
                    )}
                    <span style={{ position:'absolute', top:'1rem', right:'1rem', fontFamily:'var(--sans)', fontSize:'0.62rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'#B08D57', border:'1px solid rgba(176,141,87,0.5)', padding:'0.2rem 0.6rem' }}>
                      {conditionTag(w)}
                    </span>
                  </div>
                  <p style={{ fontFamily:'var(--sans)', fontSize:'0.68rem', letterSpacing:'0.25em', textTransform:'uppercase', color:'#B08D57', marginBottom:'0.4rem' }}>{w.brand}</p>
                  <h3 style={{ fontFamily:'var(--sans)', fontWeight:700, fontSize:'1rem', color:'#fff', textTransform:'uppercase', letterSpacing:'0.02em', marginBottom:'0.3rem' }}>{w.model}</h3>
                  {w.reference && <p style={{ fontFamily:'var(--sans)', fontSize:'0.72rem', color:'#fff', marginBottom:'0.75rem' }}>Ref. {w.reference}</p>}
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'0.75rem', borderTop:'1px solid #1a1a1a' }}>
                    <span style={{ fontFamily:'var(--sans)', fontWeight:600, fontSize:'0.9rem', color:'#fff' }}>{fmtPrice(w.price)}</span>
                    <span style={{ fontFamily:'var(--sans)', fontSize:'0.65rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'#B08D57' }}>Enquire</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. STICKY SERVICES */}
      <StickyServices services={services} />

      {/* 5. SPOTLIGHT — Piece of the Month, shown only when set by admin */}
      {spotlight && (
        <section className="section" style={{ background:'#0D0D0D' }}>
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-px" style={{ background:'#1A1A1A' }}>
              {/* Image panel */}
              <AnimateIn direction="left" className="flex items-center justify-center" style={{ background:'#0A0A0A', minHeight:'360px', position:'relative', overflow:'hidden' }}>
                {spotlight.images?.[0] ? (
                  <img src={spotlight.images[0]} alt={`${spotlight.brand} ${spotlight.model}`}
                    style={{ width:'75%', height:'75%', objectFit:'contain', position:'relative', zIndex:1 }} />
                ) : (
                  <span className="serif font-light" style={{ fontSize:'clamp(6rem,14vw,14rem)', color:'#2a2a2a', lineHeight:1, userSelect:'none' }}>
                    {spotlight.brand.substring(0,2).toUpperCase()}
                  </span>
                )}
              </AnimateIn>
              {/* Info panel */}
              <AnimateIn direction="right" className="p-10 md:p-14 lg:p-16 flex flex-col justify-center" style={{ background:'#0A0A0A' }}>
                <p style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#B08D57', marginBottom:'1.5rem' }}>Piece of the Month</p>
                <p style={{ fontFamily:'var(--sans)', fontSize:'0.65rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#fff', marginBottom:'0.75rem' }}>{spotlight.brand}</p>
                <h2 className="serif font-light" style={{ fontFamily:'var(--serif)', fontSize:'clamp(1.75rem,3vw,2.5rem)', color:'#fff', lineHeight:1.1, marginBottom:'1.5rem' }}>
                  {spotlight.model}{spotlight.reference ? <><br/><span style={{ fontSize:'0.7em', opacity:0.7 }}>{spotlight.reference}</span></> : null}
                </h2>
                <div style={{ width:'36px', height:'1px', background:'#B08D57', marginBottom:'1.5rem' }} />
                {spotlight.description && (
                  <p style={{ fontFamily:'var(--sans)', fontSize:'0.875rem', color:'#fff', lineHeight:1.8, fontWeight:300, marginBottom:'2rem' }}>
                    {spotlight.description}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-3 mb-12">
                  {spotlightSpecs(spotlight).map((spec, i) =>
                    spec ? (
                      <div key={i} style={{ borderTop:'1px solid #1A1A1A', paddingTop:'0.75rem' }}>
                        <p style={{ fontFamily:'var(--sans)', fontSize:'0.8rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#fff', marginBottom:'0.3rem' }}>{spec[0]}</p>
                        <p style={{ fontFamily:'var(--sans)', fontSize:'0.8rem', color:'#fff', fontWeight:400 }}>{spec[1]}</p>
                      </div>
                    ) : (
                      <div key={i} />
                    )
                  )}
                </div>
                <Link href={`/collection/${spotlight.id}`} style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', fontFamily:'var(--sans)', fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.22em', textTransform:'uppercase', textDecoration:'none', padding:'0.9rem 2rem', background:'#fff', color:'#0A0A0A', alignSelf:'flex-start' }}>
                  View Details <ArrowRight size={13} />
                </Link>
              </AnimateIn>
            </div>
          </div>
        </section>
      )}

      {/* 6. STATS */}
      <section className="section" style={{ background:'#0D0D0D' }}>
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-0 sm:divide-x" style={{ borderColor:'#1A1A1A' }}>
            {stats.map(st => (
              <div key={st.l} className="flex flex-col items-center sm:items-start sm:px-12 text-center sm:text-left">
                <StatCounter target={parseInt(st.n,10)||0} suffix={st.s} label={st.l} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="section" style={{ background:'#0D0D0D' }}>
        <div className="container">
          <AnimateIn className="mb-12 md:mb-16">
            <p style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#B08D57' }}>Client Stories</p>
          </AnimateIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {testi.map((t,i) => (
              <AnimateIn key={i} delay={i*120}>
                <p style={{ fontFamily:'var(--serif)', fontSize:'1.1rem', color:'#fff', lineHeight:1.75, fontWeight:300, fontStyle:'italic', marginBottom:'1.5rem' }}>"{t.text}"</p>
                <div style={{ width:'24px', height:'1px', background:'#B08D57', marginBottom:'0.75rem' }} />
                <p style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#B08D57' }}>— {t.name}</p>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <section className="section" style={{ background:'#0D0D0D' }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <AnimateIn direction="left">
              <p style={{ fontFamily:'var(--sans)', fontSize:'0.78rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'#B08D57', marginBottom:'1.25rem' }}>Visit Us</p>
              <h2 className="serif font-light" style={{ fontFamily:'var(--serif)', fontSize:'clamp(2rem,3.5vw,3rem)', color:'#fff', lineHeight:1.1, marginBottom:'1.25rem' }}>Our Gallery</h2>
              <p style={{ fontFamily:'var(--sans)', fontSize:'0.875rem', color:'#fff', lineHeight:1.8, fontWeight:300, maxWidth:'360px' }}>
                Schedule a private viewing and explore our curated collection of authenticated timepieces. No crowds, no pressure.
              </p>
            </AnimateIn>
            <AnimateIn direction="right" className="flex flex-col gap-3">
              <Link href="/appointment" className="btn w-full justify-between px-6 py-4" style={{ background:'#B08D57', color:'#fff', border:'1px solid #B08D57', fontSize:'0.65rem', letterSpacing:'0.2em' }}>
                Book a Private Appointment <ArrowRight size={13} />
              </Link>
              <a href="tel:+60166824848" className="btn btn-outline-white w-full justify-between px-6 py-4">
                Call +6016-682 4848 <ArrowRight size={13} />
              </a>
              <a href="https://wa.me/60162241804" target="_blank" rel="noopener noreferrer" className="btn btn-outline-white w-full justify-between px-6 py-4">
                Chat on WhatsApp <ArrowRight size={13} />
              </a>
            </AnimateIn>
          </div>
        </div>
      </section>
    </>
  )
}
