import { readFileSync } from 'fs'

const checks = [
  ['src/app/page.js',             ['EST. 2020', '_imgs[wi]', 'Years Est.', '})}', 'return (', 'background:\'#0A0A0A\'']],
  ['src/components/Navbar.js',    ['"Times New Roman"', '72px', '100px auto']],
  ['src/components/Footer.js',    ['const YEAR = 2025']],
  ['src/app/blog/page.js',        ['$17 Billion', 'Phillips Watches', 'source.unsplash.com' ]],
  ['src/app/brands/page.js',      ['color: \'#fff\'']],
  ['src/app/find-us/page.js',     ['unsplash.com', 'color: \'#fff\'']],
  ['next.config.mjs',             ['unsplash.com']],
]

let ok = true
for (const [file, patterns] of checks) {
  const f = readFileSync(file, 'utf8')
  for (const p of patterns) {
    const found = f.includes(p)
    if (!found) {
      console.log(`MISSING in ${file}: ${p}`)
      ok = false
    }
  }
}

// Extra: verify the blog check doesn't have source.unsplash (that was a wrong check)
const blog = readFileSync('src/app/blog/page.js', 'utf8')
const hasUnsplash = blog.includes('images.unsplash.com')
console.log('blog has unsplash images:', hasUnsplash)
console.log('blog has real article titles:', blog.includes('Secondary Watch Market'))
console.log('blog has real article titles:', blog.includes('Phillips Watches'))

const page = readFileSync('src/app/page.js', 'utf8')
// count open/close curly of map -- just check the key markers
console.log('\npage.js key checks:')
console.log('  EST. 2020:', page.includes('EST. 2020'))
console.log('  _imgs[wi]:', page.includes('_imgs[wi]'))
console.log('  map block close })}:', page.includes('})}'))
console.log('  spotlight #0A0A0A:', page.includes("background:'#0A0A0A'"))
console.log('  StatCounter 5 years:', page.includes("label:'Years Est.'"))
console.log('  StatCounter old KL:', !page.includes("label:'Years in KL'"))

if (ok) console.log('\n✅ All checks passed!')
else console.log('\n⚠️  Some checks failed')
