import { readFileSync, writeFileSync } from 'fs'

// ── page.js: fix featured collection card images ──
{
  const path = 'src/app/page.js'
  let f = readFileSync(path, 'utf8')

  const watchImages = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80',
    'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&q=80',
    'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&q=80',
  ]

  // Step 1: change map signature to include index
  f = f.replace(`featured.map((w) => (`, `featured.map((w, wi) => {
              const _imgs = ${JSON.stringify(watchImages)}
              return (`)

  // Step 2: replace the grey background div + letter span with an img tag
  const oldDiv = `background:'#111', aspectRatio:'1/1', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.5rem', position:'relative', overflow:'hidden' }}>`
  const newDiv = `background:'#111', aspectRatio:'1/1', marginBottom:'1.5rem', position:'relative', overflow:'hidden' }}>
                  <img src={_imgs[wi]} alt={w.brand} style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.85, transition:'transform 0.5s ease' }} className="group-hover:scale-105" onError={e=>{e.target.style.display='none'}} />`
  f = f.replace(oldDiv, newDiv)

  // Step 3: remove the letter span
  const letterSpan = `<span style={{ fontFamily:'var(--sans)', fontWeight:900, fontSize:'6rem', color:'#1a1a1a', lineHeight:1, userSelect:'none', letterSpacing:'-0.05em' }}>{w.brand.charAt(0)}</span>`
  f = f.replace(letterSpan, '')

  // Step 4: close the map with }) instead of ))
  // Find the tag label/price row end and the closing ))} of the map
  // The pattern is: last </Link> of the featured map, then ))} then </div></div></section>
  // We need to change ))} to )}) 
  // Use indexOf to find the right one (there may be multiple ))} patterns)
  // Look for the featured map closing after the "Enquire" text
  const enquireEnd = `<span style={{ fontFamily:'var(--sans)', fontSize:'0.65rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'#B08D57' }}>Enquire </span>`
  const idx = f.indexOf(enquireEnd)
  if (idx !== -1) {
    // Find the next ))} after the Enquire span
    const closeIdx = f.indexOf('))}', idx)
    if (closeIdx !== -1) {
      f = f.substring(0, closeIdx) + ')\n            })}' + f.substring(closeIdx + 3)
      console.log('✓  map closing fixed')
    }
  }

  writeFileSync(path, f, 'utf8')
  console.log('✓  page.js featured images fixed')
}

console.log('Done!')
