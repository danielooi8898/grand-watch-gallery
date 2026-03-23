import { readFileSync, writeFileSync } from 'fs'

// ── 1. blog/page.js ───────────────────────────────────────────────
// Remove image field from posts, remove both <img> blocks
{
  const path = 'src/app/blog/page.js'
  let f = readFileSync(path, 'utf8')

  // Remove image: '...' lines from posts array
  f = f.replace(/\n    image: 'https:\/\/images\.unsplash\.com[^']*',/g, '')

  // Remove featured hero image block (the whole div wrapping the <img>)
  f = f.replace(
    `            {/* Image block */}
            <div style={{ minHeight: '360px', overflow: 'hidden', borderBottom: '1px solid #1A1A1A', position: 'relative' }}
              className="md:border-b-0 md:border-r">
              <img src={hero.image} alt={hero.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8, position: 'absolute', inset: 0 }}
                onError={e => { e.target.style.display = 'none' }} />
            </div>`,
    `            {/* Placeholder block */}
            <div style={{ minHeight: '360px', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #1A1A1A' }}
              className="md:border-b-0 md:border-r">
              <span style={{ fontFamily: 'var(--sans)', fontWeight: 900, fontSize: 'clamp(4rem, 10vw, 8rem)', color: '#1A1A1A', letterSpacing: '-0.04em', userSelect: 'none' }}>GWG</span>
            </div>`
  )

  // Remove card image blocks (height:200px div with <img> inside)
  f = f.replace(
    /\s*\{\/\* Card image \*\/\}\s*<div style=\{\{ height: '200px', overflow: 'hidden', borderBottom: '1px solid #1A1A1A', position: 'relative' \}\}>\s*<img src=\{p\.image\}[^/]*\/>\s*<\/div>/,
    ''
  )

  writeFileSync(path, f, 'utf8')
  console.log('✓  blog/page.js')
}

// ── 2. page.js (homepage featured collection) ─────────────────────
// Revert back to letter-initial placeholder
{
  const path = 'src/app/page.js'
  let f = readFileSync(path, 'utf8')

  // Change map back to simple (w) =>
  f = f.replace(
    `featured.map((w, wi) => {
              const _imgs = ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80","https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80","https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&q=80","https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&q=80"]
              return (`,
    `featured.map((w) => (`
  )

  // Replace image div + img tag back to letter-initial placeholder
  f = f.replace(
    `<div style={{ background:'#111', aspectRatio:'1/1', marginBottom:'1.5rem', position:'relative', overflow:'hidden' }}>
                  <img src={_imgs[wi]} alt={w.brand} style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.85, transition:'transform 0.5s ease' }} className="group-hover:scale-105" onError={e=>{e.target.style.display='none'}} />
                  `,
    `<div style={{ background:'#111', aspectRatio:'1/1', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.5rem', position:'relative', overflow:'hidden' }}>
                  <span style={{ fontFamily:'var(--sans)', fontWeight:900, fontSize:'6rem', color:'#1a1a1a', lineHeight:1, userSelect:'none', letterSpacing:'-0.05em' }}>{w.brand.charAt(0)}</span>`
  )

  // Fix the map closing: revert from block-style back to expression-style
  f = f.replace(
    `              )
            })}`,
    `              ))}`
  )

  writeFileSync(path, f, 'utf8')
  console.log('✓  page.js')
}

// ── 3. find-us/page.js ────────────────────────────────────────────
// Restore GWG placeholder box
{
  const path = 'src/app/find-us/page.js'
  let f = readFileSync(path, 'utf8')

  f = f.replace(
    `<div style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1559535332-db9971090158?w=800&q=80" alt="Grand Watch Gallery Interior"
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                onError={e => { e.target.parentElement.style.background = '#111' }} />
            </div>`,
    `<div style={{ background: '#111', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--sans)', fontWeight: 900, fontSize: '4rem', color: '#1a1a1a', letterSpacing: '-0.05em' }}>GWG</div>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#fff', marginTop: '0.5rem' }}>Gallery Interior</p>
              </div>
            </div>`
  )

  writeFileSync(path, f, 'utf8')
  console.log('✓  find-us/page.js')
}

// ── 4. next.config.mjs ────────────────────────────────────────────
// Remove unsplash remotePatterns
{
  const path = 'next.config.mjs'
  let f = readFileSync(path, 'utf8')

  f = f.replace(
    `const nextConfig = {\n  reactCompiler: true,\n  images: {\n    remotePatterns: [\n      { protocol: 'https', hostname: 'images.unsplash.com' },\n    ],\n  },\n}`,
    `const nextConfig = {\n  reactCompiler: true,\n}`
  )

  writeFileSync(path, f, 'utf8')
  console.log('✓  next.config.mjs')
}

console.log('\n✅  All images removed — ready to push!')
