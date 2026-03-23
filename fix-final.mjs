import { readFileSync, writeFileSync } from 'fs'

// ── page.js ────────────────────────────────────────────────────────
{
  const path = 'src/app/page.js'
  let f = readFileSync(path, 'utf8')

  // 1. Fix map closing: the map now uses { } block, so needs }) not ))
  //    Find the specific ))} that closes the featured collection map
  //    It appears right after </Link> at the featured grid section
  //    We can identify it by the text just before it
  const TAG_ANCHOR = `color:'#B08D57' }}>Enquire `
  const anchorIdx = f.indexOf(TAG_ANCHOR)
  if (anchorIdx !== -1) {
    const closeStart = f.indexOf('))}', anchorIdx)
    if (closeStart !== -1) {
      f = f.substring(0, closeStart) + ')\n            })}' + f.substring(closeStart + 3)
      console.log('  map closing fixed ✓')
    } else {
      console.log('  map closing not found, checking for already fixed...')
      if (f.indexOf('})}', anchorIdx) !== -1) console.log('  already fixed ✓')
    }
  }

  // 2. Button spacing — add more breathing room between text and CTAs
  //    Visit Us section: add marginTop to the button column
  f = f.replace(
    `<AnimateIn direction="right" className="flex flex-col gap-3">`,
    `<AnimateIn direction="right" className="flex flex-col gap-3" style={{ marginTop:'1rem' }}>`
  )

  // 3. Spotlight: add more space above Enquire Now button
  f = f.replace(
    `<div className="grid grid-cols-2 gap-3 mb-10">`,
    `<div className="grid grid-cols-2 gap-3 mb-12">`
  )
  f = f.replace(
    `display:'inline-flex', alignItems:'center', gap:'0.5rem', fontFamily:'var(--sans)', fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.22em', textTransform:'uppercase', textDecoration:'none', padding:'0.9rem 2rem', background:'#fff', color:'#0A0A0A', alignSelf:'flex-start'`,
    `display:'inline-flex', alignItems:'center', gap:'0.5rem', fontFamily:'var(--sans)', fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.22em', textTransform:'uppercase', textDecoration:'none', padding:'0.9rem 2rem', background:'#fff', color:'#0A0A0A', alignSelf:'flex-start', marginTop:'0.5rem'`
  )

  writeFileSync(path, f, 'utf8')
  console.log('page.js ✓')
}

// ── globals.css — also update .body-sm color and add spacing utility ──
{
  const path = 'src/app/globals.css'
  let f = readFileSync(path, 'utf8')
  // Increase section padding slightly for more breathing room
  // .section already at 6rem/8rem — leave as is, just bump btn margin
  // Add a utility for button group spacing
  if (!f.includes('.btn-group-top')) {
    f += `\n.btn-group-top { margin-top: 2.5rem; }\n`
    writeFileSync(path, f, 'utf8')
    console.log('globals.css utility added ✓')
  } else {
    console.log('globals.css already has utility ✓')
  }
}

// ── appointment/page.js — add spacing between body text and button ──
{
  const path = 'src/app/appointment/page.js'
  let f = readFileSync(path, 'utf8')
  // Add more padding between "What to Expect" body text and next section
  f = f.replace(
    `<p className="body-sm">{d}</p>`,
    `<p className="body-sm" style={{ marginTop:'0.75rem' }}>{d}</p>`
  )
  // Add spacing above the submit button
  f = f.replace(
    `className="btn btn-gold w-full justify-center" style={{ marginTop: '0.5rem' }}`,
    `className="btn btn-gold w-full justify-center" style={{ marginTop: '2rem' }}`
  )
  writeFileSync(path, f, 'utf8')
  console.log('appointment/page.js ✓')
}

// ── contact/page.js — add spacing above action buttons ──
{
  const path = 'src/app/contact/page.js'
  let f = readFileSync(path, 'utf8')
  // Add more spacing before the quick action buttons
  f = f.replace(
    `<div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a href="https://wa.me/`,
    `<div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <a href="https://wa.me/`
  )
  writeFileSync(path, f, 'utf8')
  console.log('contact/page.js ✓')
}

// ── find-us/page.js — spacing above Book Appointment link ──
{
  const path = 'src/app/find-us/page.js'
  let f = readFileSync(path, 'utf8')
  f = f.replace(
    `<div style={{ marginBottom: '2.5rem' }}>
                <Link href="/appointment"`,
    `<div style={{ marginBottom: '2.5rem', marginTop: '0.5rem' }}>
                <Link href="/appointment"`
  )
  writeFileSync(path, f, 'utf8')
  console.log('find-us/page.js ✓')
}

// ── next.config.mjs — add Unsplash image domain ──
{
  const path = 'next.config.mjs'
  let f = readFileSync(path, 'utf8')
  if (!f.includes('unsplash.com')) {
    f = f.replace(
      `const nextConfig = {\n  /* config options here */\n  reactCompiler: true,\n}`,
      `const nextConfig = {\n  reactCompiler: true,\n  images: {\n    remotePatterns: [\n      { protocol: 'https', hostname: 'images.unsplash.com' },\n    ],\n  },\n}`
    )
    writeFileSync(path, f, 'utf8')
    console.log('next.config.mjs ✓')
  } else {
    console.log('next.config.mjs already updated ✓')
  }
}

console.log('\n✅  All done!')
