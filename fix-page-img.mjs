import { readFileSync, writeFileSync } from 'fs'

const path = 'src/app/page.js'
let f = readFileSync(path, 'utf8')

// Replace the whole image div + img tag (with any trailing whitespace/newline)
// with the letter-initial placeholder
f = f.replace(
  /<div style=\{\{ background:'#111', aspectRatio:'1\/1', marginBottom:'1\.5rem', position:'relative', overflow:'hidden' \}\}>\s*<img src=\{_imgs\[wi\]\}[^\n]+\/>\s*/,
  `<div style={{ background:'#111', aspectRatio:'1/1', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.5rem', position:'relative', overflow:'hidden' }}>\n                  <span style={{ fontFamily:'var(--sans)', fontWeight:900, fontSize:'6rem', color:'#1a1a1a', lineHeight:1, userSelect:'none', letterSpacing:'-0.05em' }}>{w.brand.charAt(0)}</span>\n                  `
)

// Verify
console.log('has _imgs:', f.includes('_imgs'))
console.log('has onError:', f.includes('onError'))
console.log('has brand.charAt:', f.includes('brand.charAt'))

writeFileSync(path, f, 'utf8')
console.log('✓  page.js fixed')
