import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const posts = [
  { slug:'rolex-submariner-guide', cat:'Buying Guide', title:'The Complete Rolex Submariner Buyer Guide for 2025', excerpt:'From reference numbers to dial variants — everything you need to know before purchasing a pre-owned Submariner in Malaysia.', date:'15 Mar 2025', read:'8 min', featured:true },
  { slug:'patek-nautilus-history', cat:'Brand Story', title:'The Patek Philippe Nautilus: A Legacy Forged in Steel', excerpt:'Designed by Gerald Genta in 1976, the Nautilus changed luxury watchmaking forever. We trace its evolution from sketch to icon.', date:'2 Mar 2025', read:'6 min' },
  { slug:'authentication-process', cat:'Watch Care', title:'How We Authenticate Every Watch at Grand Watch Gallery', excerpt:'Our rigorous multi-step inspection process ensures every timepiece we sell is 100% genuine. Here is exactly what we check.', date:'20 Feb 2025', read:'5 min' },
  { slug:'richard-mille-investment', cat:'Investment', title:'Are Richard Mille Watches a Good Investment in 2025?', excerpt:'With prices reaching into the millions, is the RM brand still a smart buy? We analyse market trends and resale data.', date:'8 Feb 2025', read:'7 min' },
  { slug:'watch-care-tips', cat:'Watch Care', title:'10 Essential Tips to Keep Your Luxury Watch in Perfect Condition', excerpt:'From winding habits to storage — expert tips to preserve the value and beauty of your timepiece for decades.', date:'25 Jan 2025', read:'4 min' },
  { slug:'royal-oak-50-years', cat:'Brand Story', title:'Royal Oak at 50: Why the Sports Watch Remains Undefeated', excerpt:'Half a century after its controversial debut, the Royal Oak is more coveted than ever. We look at why it defied all odds.', date:'10 Jan 2025', read:'6 min' },
]

export default function BlogPage() {
  const [hero, ...rest] = posts
  return (
    <>
      {/* Header */}
      <section className="pt-28 pb-10 md:pt-36 md:pb-14 border-b border-[#0d0d0d]">
        <div className="container">
          <p className="eyebrow mb-3">Insights &amp; Stories</p>
          <h1 className="heading">The Journal</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Featured */}
          <article className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#0d0d0d] mb-px">
            <div className="bg-[#060606] min-h-[200px] md:min-h-[320px] flex items-center justify-center">
              <span className="serif font-light text-[#0d0d0d]" style={{ fontSize: '8rem' }}>GWG</span>
            </div>
            <div className="bg-black p-8 md:p-12 flex flex-col justify-center">
              <span className="eyebrow mb-4">Featured · {hero.cat}</span>
              <h2 className="text-white font-light serif text-xl md:text-2xl mb-4 leading-snug">{hero.title}</h2>
              <p className="body-sm mb-6">{hero.excerpt}</p>
              <div className="flex items-center justify-between border-t border-[#0d0d0d] pt-4">
                <span className="eyebrow" style={{fontSize:'0.55rem'}}>{hero.date} · {hero.read} read</span>
                <span className="eyebrow hover:text-white transition-colors cursor-pointer" style={{fontSize:'0.55rem'}}>Read →</span>
              </div>
            </div>
          </article>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#0d0d0d]">
            {rest.map(p => (
              <article key={p.slug} className="bg-black p-6 md:p-8 group cursor-pointer hover:bg-[#050505] transition-colors">
                <span className="eyebrow block mb-4" style={{fontSize:'0.55rem'}}>{p.cat}</span>
                <h3 className="text-white font-light serif text-base leading-snug mb-3 group-hover:text-[#ccc] transition-colors">{p.title}</h3>
                <p className="body-sm mb-5 line-clamp-3">{p.excerpt}</p>
                <div className="flex items-center justify-between border-t border-[#0d0d0d] pt-4">
                  <span className="eyebrow" style={{fontSize:'0.5rem'}}>{p.date} · {p.read}</span>
                  <ArrowRight size={12} className="text-[#222] group-hover:text-[#555] transition-colors" />
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter */}
          <div className="mt-px bg-[#030303] border-t border-[#0d0d0d] p-8 md:p-12">
            <div className="max-w-md mx-auto text-center">
              <p className="eyebrow mb-4">Stay Informed</p>
              <h3 className="text-white serif font-light text-xl mb-3">Get the Journal Delivered</h3>
              <p className="body-sm mb-6">New articles and market insights — straight to your inbox.</p>
              <form className="flex gap-0">
                <input type="email" className="input flex-1" placeholder="Your email address" />
                <button type="submit" className="btn btn-white px-5 shrink-0" style={{fontSize:'0.6rem',letterSpacing:'0.2em'}}>Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
