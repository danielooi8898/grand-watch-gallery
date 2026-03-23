import { readFileSync, writeFileSync } from 'fs'

// ── Navbar.js: change brand name font to Times New Roman ──
{
  const path = 'src/components/Navbar.js'
  let f = readFileSync(path, 'utf8')
  f = f.replace(
    `fontFamily: 'var(--sans)',\n              fontSize: '1rem',\n              fontWeight: 800,`,
    `fontFamily: '"Times New Roman", Times, serif',\n              fontSize: '1rem',\n              fontWeight: 800,`
  )
  writeFileSync(path, f, 'utf8')
  console.log('Navbar.js ✓')
}

// ── page.js: grey text → white ──
{
  const path = 'src/app/page.js'
  let f = readFileSync(path, 'utf8')
  // hero subtitle opacity
  f = f.replace(`color:'rgba(255,255,255,0.45)'`, `color:'rgba(255,255,255,0.8)'`)
  // services body text #aaa
  f = f.replaceAll(`color:'#aaa'`, `color:'#fff'`)
  // spotlight description #aaa
  // already caught above
  // spotlight watch detail keys #bbb
  f = f.replaceAll(`color:'#bbb'`, `color:'#fff'`)
  // watch ref #777
  f = f.replaceAll(`color:'#777'`, `color:'#fff'`)
  // testimonials + visit section #999
  f = f.replaceAll(`color:'#999'`, `color:'#fff'`)
  writeFileSync(path, f, 'utf8')
  console.log('page.js ✓')
}

// ── contact/page.js: grey text → white ──
{
  const path = 'src/app/contact/page.js'
  let f = readFileSync(path, 'utf8')
  // location/hours/phone lines #ccc
  f = f.replaceAll(`color: '#ccc'`, `color: '#fff'`)
  // social links #888 default + onMouseLeave: change default to #fff, hover to #B08D57
  f = f.replace(
    `style={{ fontFamily: 'var(--sans)', fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', textDecoration: 'none', transition: 'color 0.2s' }}\n                      onMouseEnter={e => e.target.style.color = '#fff'}\n                      onMouseLeave={e => e.target.style.color = '#888'}`,
    `style={{ fontFamily: 'var(--sans)', fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }}\n                      onMouseEnter={e => e.target.style.color = '#B08D57'}\n                      onMouseLeave={e => e.target.style.color = '#fff'}`
  )
  // message sent #888
  f = f.replaceAll(`color: '#888'`, `color: '#fff'`)
  writeFileSync(path, f, 'utf8')
  console.log('contact/page.js ✓')
}

// ── find-us/page.js: grey text → white ──
{
  const path = 'src/app/find-us/page.js'
  let f = readFileSync(path, 'utf8')
  // hours time column #888
  f = f.replaceAll(`color: '#888'`, `color: '#fff'`)
  writeFileSync(path, f, 'utf8')
  console.log('find-us/page.js ✓')
}

// ── appointment/page.js: #444 note → white ──
{
  const path = 'src/app/appointment/page.js'
  let f = readFileSync(path, 'utf8')
  f = f.replaceAll(`color: '#444'`, `color: '#fff'`)
  writeFileSync(path, f, 'utf8')
  console.log('appointment/page.js ✓')
}

// ── Footer.js: grey text → white ──
{
  const path = 'src/components/Footer.js'
  let f = readFileSync(path, 'utf8')
  // brand description #888
  f = f.replace(`color: '#888',\n              fontSize: '0.88rem'`, `color: '#fff',\n              fontSize: '0.88rem'`)
  // social links #777 → #fff, update onMouseLeave
  f = f.replace(
    `color: '#777',\n                    fontSize: '0.72rem',\n                    letterSpacing: '0.18em',\n                    textTransform: 'uppercase',\n                    textDecoration: 'none',\n                    fontFamily: 'var(--sans)',\n                    transition: 'color 0.2s',\n                  }}\n                  onMouseEnter={e => e.target.style.color = '#B08D57'}\n                  onMouseLeave={e => e.target.style.color = '#777'}`,
    `color: '#fff',\n                    fontSize: '0.72rem',\n                    letterSpacing: '0.18em',\n                    textTransform: 'uppercase',\n                    textDecoration: 'none',\n                    fontFamily: 'var(--sans)',\n                    transition: 'color 0.2s',\n                  }}\n                  onMouseEnter={e => e.target.style.color = '#B08D57'}\n                  onMouseLeave={e => e.target.style.color = '#fff'}`
  )
  // nav links #888 → #fff, update onMouseLeave
  f = f.replace(
    `color: '#888',\n                        fontSize: '0.85rem',\n                        textDecoration: 'none',\n                        fontFamily: 'var(--sans)',\n                        fontWeight: 300,\n                        transition: 'color 0.2s',\n                      }}\n                      onMouseEnter={e => e.target.style.color = '#fff'}\n                      onMouseLeave={e => e.target.style.color = '#888'}`,
    `color: '#fff',\n                        fontSize: '0.85rem',\n                        textDecoration: 'none',\n                        fontFamily: 'var(--sans)',\n                        fontWeight: 300,\n                        transition: 'color 0.2s',\n                      }}\n                      onMouseEnter={e => e.target.style.color = '#B08D57'}\n                      onMouseLeave={e => e.target.style.color = '#fff'}`
  )
  // phone numbers #777 → #fff
  f = f.replaceAll(`color: '#777',`, `color: '#fff',`)
  // copyright #555 → #aaa (slightly subdued is fine for legal text)
  f = f.replace(`color: '#555'`, `color: '#aaa'`)
  writeFileSync(path, f, 'utf8')
  console.log('Footer.js ✓')
}

console.log('\nAll done!')
