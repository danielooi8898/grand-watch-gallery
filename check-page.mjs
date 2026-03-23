import { readFileSync, writeFileSync } from 'fs'
const f = readFileSync('src/app/page.js', 'utf8')

// StickyServices is defined BEFORE featured.map in page.js
// Need to find <StickyServices /> (JSX usage) not the function def
const mapStart = f.indexOf('featured.map')
const mapSectionEnd = f.indexOf('<StickyServices')
console.log('mapStart:', mapStart, '  mapSectionEnd:', mapSectionEnd)
const section = f.slice(mapStart, mapSectionEnd)
writeFileSync('C:/Users/user/Desktop/pg-map.txt', section, 'utf8')
console.log('map section length:', section.length)
console.log('has block close })}:', section.includes('})}\n'))
console.log('has expr close  ))}:', section.includes('))}'))
