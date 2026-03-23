import { readFileSync, writeFileSync } from 'fs'

const base = 'src'

function read(p)   { return readFileSync(`${base}/${p}`, 'utf8') }
function save(p,c) { writeFileSync(`${base}/${p}`, c, 'utf8'); console.log(`✓  ${p}`) }

// ══════════════════════════════════════════════════════════════════
// 1. page.js (homepage)
// ══════════════════════════════════════════════════════════════════
{
  let f = read('app/page.js')

  // Fix EST 2009 → EST 2020
  f = f.replace(`EST. 2009 `, `EST. 2020 `)

  // Fix StatCounter 15+ Years in KL → 5+ Years Est.
  f = f.replace(`{target:15,suffix:'+',label:'Years in KL'}`, `{target:5,suffix:'+',label:'Years Est.'}`)

  // Fix spotlight section grey box: make backgrounds #0A0A0A
  f = f.replace(
    `<section className="section" style={{ background:'#0D0D0D' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px" style={{ background:'#1A1A1A' }}>
            <AnimateIn direction="left" className="flex items-center justify-center" style={{ background:'#0D0D0D', minHeight:'360px' }}>`,
    `<section className="section" style={{ background:'#0A0A0A' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px" style={{ background:'#1A1A1A' }}>
            <AnimateIn direction="left" className="flex items-center justify-center" style={{ background:'#0A0A0A', minHeight:'360px' }}>`
  )
  f = f.replace(
    `style={{ background: '#0D0D0D', borderLeft: '1px solid #1A1A1A' }}`,
    `style={{ background: '#0A0A0A', borderLeft: '1px solid #1A1A1A' }}`
  )

  // Fix remaining grey text
  f = f.replaceAll(`color:'#777'`, `color:'#fff'`)
  f = f.replaceAll(`color:'#aaa'`, `color:'#fff'`)
  f = f.replaceAll(`color:'#999'`, `color:'#fff'`)
  f = f.replaceAll(`color:'#bbb'`, `color:'#fff'`)

  // Add images to featured collection cards (replace letter placeholder with watch image)
  const watchImages = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80',
    'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&q=80',
    'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&q=80',
  ]

  // Replace the featured array cards' image placeholder div
  f = f.replace(
    `{featured.map((w) => (
              <Link key={w.ref} href="/collection" style={{ textDecoration:'none', display:'block' }} className="group">
                <div style={{ background:'#111', aspectRatio:'1/1', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.5rem', position:'relative', overflow:'hidden' }}>
                  <span style={{ fontFamily:'var(--sans)', fontWeight:900, fontSize:'6rem', color:'#1a1a1a', lineHeight:1, userSelect:'none', letterSpacing:'-0.05em' }}>{w.brand.charAt(0)}</span>`,
    `{featured.map((w, wi) => {
              const imgs = ${JSON.stringify(watchImages)}
              return (
              <Link key={w.ref} href="/collection" style={{ textDecoration:'none', display:'block' }} className="group">
                <div style={{ background:'#111', aspectRatio:'1/1', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.5rem', position:'relative', overflow:'hidden' }}>
                  <img src={imgs[wi]} alt={w.brand} style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.85, transition:'transform 0.5s ease' }} className="group-hover:scale-105" onError={e=>{e.target.style.display='none'}} />`
  )
  // Close the map with }) instead of )
  // Find and replace the closing of the map
  f = f.replace(
    `            ))}
          </div>
        </div>
      </section>

      {/* `, 
    `            )
              )
            })}
          </div>
        </div>
      </section>

      {/* `
  )

  // Add button top-margin spacing: Enquire Now button in spotlight
  f = f.replace(
    `<div className="grid grid-cols-2 gap-3 mb-8">`,
    `<div className="grid grid-cols-2 gap-3 mb-10">`
  )

  save('app/page.js', f)
}

// ══════════════════════════════════════════════════════════════════
// 2. Footer.js – fix copyright year to 2025
// ══════════════════════════════════════════════════════════════════
{
  let f = read('components/Footer.js')
  f = f.replace(`const YEAR = new Date().getFullYear()`, `const YEAR = 2025`)
  save('components/Footer.js', f)
}

// ══════════════════════════════════════════════════════════════════
// 3. Navbar.js – bigger logo
// ══════════════════════════════════════════════════════════════════
{
  let f = read('components/Navbar.js')
  // Container 52→72px, backgroundSize 88→100px, position recalculated
  f = f.replace(`width: '52px',\n              height: '52px',`, `width: '72px',\n              height: '72px',`)
  f = f.replace(`backgroundSize: '88px auto',`, `backgroundSize: '100px auto',`)
  f = f.replace(`backgroundPosition: '-18px -69px',`, `backgroundPosition: '-14px -72px',`)
  save('components/Navbar.js', f)
}

// ══════════════════════════════════════════════════════════════════
// 4. blog/page.js – real content + images + fix grey texts
// ══════════════════════════════════════════════════════════════════
{
  const newBlogContent = `import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const posts = [
  {
    slug: 'secondary-watch-market-rebound-2025',
    cat: 'Market Update',
    title: 'The Secondary Watch Market Rebounds: $17 Billion in 2025',
    excerpt: 'After thirteen consecutive quarters of decline, the pre-owned luxury watch market staged its first positive year since 2022, with $17B in measured sales and prices rising 4.9%. Millennials and Gen Z now account for 44% of all bidders.',
    date: 'Jan 2026',
    read: '5 min',
    featured: true,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80',
    source: 'WatchPro',
  },
  {
    slug: 'patek-philippe-price-cuts-tariff-2026',
    cat: 'Market Update',
    title: 'Patek Philippe Cuts U.S. Prices by 8% Following Tariff Relief',
    excerpt: 'Patek Philippe announced price reductions for U.S. customers starting February 2026, following a drop in Swiss import tariffs from 39% to 15%. Precious sports models like the Nautilus and Aquanaut see a 3.4% reduction.',
    date: 'Feb 2026',
    read: '4 min',
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80',
    source: 'WatchPro',
  },
  {
    slug: 'phillips-370-million-record-2025',
    cat: 'Investment',
    title: 'Phillips Watches Shatters Records with $370M in 2025 Sales',
    excerpt: 'Phillips Watches achieved its highest annual total with $370M in global sales during its 10th anniversary year. A Patek Philippe Ref. 1518 in stainless steel sold for $17.6M — the most valuable vintage Patek ever auctioned.',
    date: 'Dec 2025',
    read: '6 min',
    image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&q=80',
    source: 'Robb Report',
  },
  {
    slug: 'rolex-ap-tudor-price-increases-2026',
    cat: 'Market Update',
    title: 'Rolex and Audemars Piguet Raise Prices as Gold Hits Record Highs',
    excerpt: 'Rolex implemented price increases of approximately 7% in the U.S. at the start of 2026, with the steel Submariner officially crossing the $10,000 threshold. Audemars Piguet and Tudor followed with their own adjustments.',
    date: 'Jan 2026',
    read: '4 min',
    image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&q=80',
    source: 'Robb Report',
  },
  {
    slug: 'audemars-piguet-150th-anniversary-releases',
    cat: 'New Release',
    title: 'Audemars Piguet Marks 150th Anniversary with Perpetual Calendar Innovations',
    excerpt: 'Audemars Piguet celebrated 150 years with the Royal Oak Perpetual Calendar Openworked (limited to 150 pieces), new blue ceramic models inspired by the original Royal Oak, and the first Royal Oak flyback chronograph with flying tourbillon.',
    date: 'Mid 2025',
    read: '6 min',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80',
    source: 'Fratello Watches',
  },
  {
    slug: 'christies-luxury-billion-barrier-2025',
    cat: 'Investment',
    title: "Christie's Surpasses $1 Billion in Luxury Auctions with 90% Sell-Through",
    excerpt: "Christie's Luxury division broke the billion-dollar barrier in 2025 global sales, with 85% of bids placed online and hammer prices averaging 129% above low estimates — reflecting a new generation of digital-first collectors.",
    date: 'Dec 2025',
    read: '5 min',
    image: 'https://images.unsplash.com/photo-1566479179817-634e5b70bd4d?w=800&q=80',
    source: 'WatchPro',
  },
]

export default function BlogPage() {
  const [hero, ...rest] = posts
  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>

      {/* Header */}
      <section style={{ paddingTop: '10rem', paddingBottom: '5rem', borderBottom: '1px solid #1A1A1A' }}>
        <div className="container">
          <p className="eyebrow mb-6">Insights &amp; Stories</p>
          <h1 style={{
            fontFamily: 'var(--sans)',
            fontWeight: 900,
            fontSize: 'clamp(3.5rem, 8vw, 8rem)',
            lineHeight: 0.9,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color: '#fff',
          }}>
            The<br />Journal
          </h1>
        </div>
      </section>

      {/* Featured article */}
      <section style={{ borderBottom: '1px solid #1A1A1A' }}>
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div className="md:grid-cols-2" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0' }}>
            {/* Image block */}
            <div style={{ minHeight: '360px', overflow: 'hidden', borderBottom: '1px solid #1A1A1A', position: 'relative' }}
              className="md:border-b-0 md:border-r">
              <img src={hero.image} alt={hero.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8, position: 'absolute', inset: 0 }}
                onError={e => { e.target.style.display = 'none' }} />
            </div>

            {/* Content block */}
            <div style={{ padding: '3rem 3rem 3rem 3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <span className="eyebrow">Featured</span>
                <span style={{ width: '1px', height: '12px', background: '#2A2A2A' }} />
                <span style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>
                  {hero.cat}
                </span>
              </div>
              <h2 style={{
                fontFamily: 'var(--sans)', fontWeight: 800,
                fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
                letterSpacing: '-0.02em', textTransform: 'uppercase',
                color: '#fff', lineHeight: 1.1, marginBottom: '1.5rem',
              }}>
                {hero.title}
              </h2>
              <p className="body-sm" style={{ marginBottom: '2.5rem', maxWidth: '440px' }}>{hero.excerpt}</p>
              <div style={{ borderTop: '1px solid #1A1A1A', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', fontWeight: 400, letterSpacing: '0.15em', color: '#fff' }}>
                  {hero.date} · {hero.read} read · <span style={{ color: '#B08D57' }}>{hero.source}</span>
                </span>
                <Link href={'/blog/' + hero.slug} style={{
                  fontFamily: 'var(--sans)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: '#B08D57', textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}>
                  Read Article <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article grid */}
      <section style={{ borderBottom: '1px solid #1A1A1A' }}>
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div className="sm:grid-cols-2 lg:grid-cols-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '0' }}>
            {rest.map((p, i) => (
              <Link key={p.slug} href={'/blog/' + p.slug} style={{
                display: 'block', textDecoration: 'none',
                borderRight: i < rest.length - 1 ? '1px solid #1A1A1A' : 'none',
                borderBottom: '1px solid #1A1A1A',
                transition: 'background 0.2s',
              }}
              className="hover:bg-[#111] group"
              >
                {/* Card image */}
                <div style={{ height: '200px', overflow: 'hidden', borderBottom: '1px solid #1A1A1A', position: 'relative' }}>
                  <img src={p.image} alt={p.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75, transition: 'transform 0.4s ease' }}
                    className="group-hover:scale-105"
                    onError={e => { e.target.style.display = 'none' }} />
                </div>
                <div style={{ padding: '2.5rem' }}>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B08D57', display: 'block', marginBottom: '1.25rem' }}>
                    {p.cat}
                  </span>
                  <h3 style={{
                    fontFamily: 'var(--sans)', fontWeight: 700,
                    fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', letterSpacing: '-0.01em',
                    textTransform: 'uppercase', color: '#fff', lineHeight: 1.2,
                    marginBottom: '1rem', transition: 'color 0.2s',
                  }}
                  className="group-hover:text-[#B08D57]"
                  >
                    {p.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--sans)', fontSize: '0.9rem', color: '#fff',
                    lineHeight: 1.7, fontWeight: 300, marginBottom: '1.75rem',
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {p.excerpt}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1A1A1A', paddingTop: '1.25rem' }}>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', fontWeight: 400, letterSpacing: '0.12em', color: '#fff' }}>
                      {p.date} · {p.source}
                    </span>
                    <ArrowRight size={14} style={{ color: '#2A2A2A', transition: 'color 0.2s' }} className="group-hover:text-[#B08D57]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '540px' }}>
            <p className="eyebrow mb-6">Stay Informed</p>
            <h2 style={{
              fontFamily: 'var(--sans)', fontWeight: 800, fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#fff',
              lineHeight: 1.05, marginBottom: '1rem',
            }}>
              Get the Journal<br />Delivered
            </h2>
            <p className="body-sm" style={{ marginBottom: '3rem' }}>
              Market insights, new arrivals, and watch news — straight to your inbox.
            </p>
            <form style={{ display: 'flex', gap: '0' }}>
              <input type="email" className="input" placeholder="Your email address" style={{ flex: 1, borderRight: 'none' }} />
              <button type="submit" className="btn btn-gold" style={{ borderRadius: 0, flexShrink: 0 }}>Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
`
  save('app/blog/page.js', newBlogContent)
}

// ══════════════════════════════════════════════════════════════════
// 5. brands/page.js – fix grey texts
// ══════════════════════════════════════════════════════════════════
{
  let f = read('app/brands/page.js')
  f = f.replaceAll(`color: '#333'`, `color: '#fff'`)
  f = f.replaceAll(`color: '#444'`, `color: '#fff'`)
  f = f.replaceAll(`color: '#555'`, `color: '#fff'`)
  save('app/brands/page.js', f)
}

// ══════════════════════════════════════════════════════════════════
// 6. collection/page.js – fix grey texts
// ══════════════════════════════════════════════════════════════════
{
  let f = read('app/collection/page.js')
  f = f.replaceAll(`color: '#444'`, `color: '#fff'`)
  f = f.replaceAll(`color: '#888'`, `color: '#fff'`)
  save('app/collection/page.js', f)
}

// ══════════════════════════════════════════════════════════════════
// 7. find-us/page.js – fix gallery placeholder image + grey text
// ══════════════════════════════════════════════════════════════════
{
  let f = read('app/find-us/page.js')
  // Replace grey placeholder box with real image
  f = f.replace(
    `<div style={{ background: '#111', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--sans)', fontWeight: 900, fontSize: '4rem', color: '#1a1a1a', letterSpacing: '-0.05em' }}>GWG</div>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#333', marginTop: '0.5rem' }}>Gallery Interior</p>
              </div>
            </div>`,
    `<div style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1559535332-db9971090158?w=800&q=80" alt="Grand Watch Gallery Interior"
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                onError={e => { e.target.parentElement.style.background = '#111' }} />
            </div>`
  )
  f = f.replaceAll(`color: '#888'`, `color: '#fff'`)
  f = f.replaceAll(`color: '#333'`, `color: '#fff'`)
  save('app/find-us/page.js', f)
}

// ══════════════════════════════════════════════════════════════════
// 8. contact/page.js – remaining grey texts + spacing
// ══════════════════════════════════════════════════════════════════
{
  let f = read('app/contact/page.js')
  f = f.replaceAll(`color: '#888'`, `color: '#fff'`)
  f = f.replaceAll(`color: '#ccc'`, `color: '#fff'`)
  save('app/contact/page.js', f)
}

// ══════════════════════════════════════════════════════════════════
// 9. appointment/page.js – remaining grey texts
// ══════════════════════════════════════════════════════════════════
{
  let f = read('app/appointment/page.js')
  f = f.replaceAll(`color: '#444'`, `color: '#fff'`)
  save('app/appointment/page.js', f)
}

console.log('\n✅  All done!')
