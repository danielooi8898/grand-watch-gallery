import Link from 'next/link'
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
    source: 'WatchPro',
  },
  {
    slug: 'patek-philippe-price-cuts-tariff-2026',
    cat: 'Market Update',
    title: 'Patek Philippe Cuts U.S. Prices by 8% Following Tariff Relief',
    excerpt: 'Patek Philippe announced price reductions for U.S. customers starting February 2026, following a drop in Swiss import tariffs from 39% to 15%. Precious sports models like the Nautilus and Aquanaut see a 3.4% reduction.',
    date: 'Feb 2026',
    read: '4 min',
    source: 'WatchPro',
  },
  {
    slug: 'phillips-370-million-record-2025',
    cat: 'Investment',
    title: 'Phillips Watches Shatters Records with $370M in 2025 Sales',
    excerpt: 'Phillips Watches achieved its highest annual total with $370M in global sales during its 10th anniversary year. A Patek Philippe Ref. 1518 in stainless steel sold for $17.6M — the most valuable vintage Patek ever auctioned.',
    date: 'Dec 2025',
    read: '6 min',
    source: 'Robb Report',
  },
  {
    slug: 'rolex-ap-tudor-price-increases-2026',
    cat: 'Market Update',
    title: 'Rolex and Audemars Piguet Raise Prices as Gold Hits Record Highs',
    excerpt: 'Rolex implemented price increases of approximately 7% in the U.S. at the start of 2026, with the steel Submariner officially crossing the $10,000 threshold. Audemars Piguet and Tudor followed with their own adjustments.',
    date: 'Jan 2026',
    read: '4 min',
    source: 'Robb Report',
  },
  {
    slug: 'audemars-piguet-150th-anniversary-releases',
    cat: 'New Release',
    title: 'Audemars Piguet Marks 150th Anniversary with Perpetual Calendar Innovations',
    excerpt: 'Audemars Piguet celebrated 150 years with the Royal Oak Perpetual Calendar Openworked (limited to 150 pieces), new blue ceramic models inspired by the original Royal Oak, and the first Royal Oak flyback chronograph with flying tourbillon.',
    date: 'Mid 2025',
    read: '6 min',
    source: 'Fratello Watches',
  },
  {
    slug: 'christies-luxury-billion-barrier-2025',
    cat: 'Investment',
    title: "Christie's Surpasses $1 Billion in Luxury Auctions with 90% Sell-Through",
    excerpt: "Christie's Luxury division broke the billion-dollar barrier in 2025 global sales, with 85% of bids placed online and hammer prices averaging 129% above low estimates — reflecting a new generation of digital-first collectors.",
    date: 'Dec 2025',
    read: '5 min',
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
            {/* Placeholder block */}
            <div style={{ minHeight: '360px', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #1A1A1A' }}
              className="md:border-b-0 md:border-r">
              <span style={{ fontFamily: 'var(--sans)', fontWeight: 900, fontSize: 'clamp(4rem, 10vw, 8rem)', color: '#1A1A1A', letterSpacing: '-0.04em', userSelect: 'none' }}>GWG</span>
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
