import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const brands = [
  { name: 'Rolex', origin: 'Switzerland', founded: '1905', desc: 'The world\'s most recognised luxury watch brand. From the iconic Submariner to the timeless Datejust.', slug: 'rolex' },
  { name: 'Patek Philippe', origin: 'Switzerland', founded: '1839', desc: 'You never actually own a Patek Philippe — you merely look after it for the next generation.', slug: 'patek-philippe' },
  { name: 'Audemars Piguet', origin: 'Switzerland', founded: '1875', desc: 'Creators of the legendary Royal Oak, the world\'s first luxury sports watch in stainless steel.', slug: 'audemars-piguet' },
  { name: 'Richard Mille', origin: 'Switzerland', founded: '2001', desc: 'Ultra-high-end avant-garde watchmaking with tourbillons worn on the wrists of champions.', slug: 'richard-mille' },
  { name: 'Vacheron Constantin', origin: 'Switzerland', founded: '1755', desc: 'The oldest Swiss watch manufacturer in continuous operation — a paragon of refinement.', slug: 'vacheron-constantin' },
  { name: 'A. Lange & Söhne', origin: 'Germany', founded: '1845', desc: 'The pinnacle of German haute horlogerie, celebrated for the Lange 1 and Zeitwerk.', slug: 'a-lange-sohne' },
  { name: 'IWC Schaffhausen', origin: 'Switzerland', founded: '1868', desc: 'Engineering excellence — home of the Portugieser, Pilot and Aquatimer collections.', slug: 'iwc-schaffhausen' },
  { name: 'Omega', origin: 'Switzerland', founded: '1848', desc: 'Moon landing legends. The Speedmaster and Seamaster are icons of precision and adventure.', slug: 'omega' },
  { name: 'Hublot', origin: 'Switzerland', founded: '1980', desc: 'The art of fusion — bold, avant-garde timepieces redefining modern luxury watchmaking.', slug: 'hublot' },
  { name: 'Panerai', origin: 'Italy', founded: '1860', desc: 'Italian soul with Swiss precision. The oversized Luminor and Radiomir command a cult following.', slug: 'panerai' },
  { name: 'Breguet', origin: 'Switzerland', founded: '1775', desc: 'Founded by the inventor of the tourbillon. The oldest name in fine watchmaking.', slug: 'breguet' },
  { name: 'Cartier', origin: 'France', founded: '1847', desc: 'The jeweller of kings. The Santos, Tank and Ballon Bleu are icons of Parisian elegance.', slug: 'cartier' },
  { name: 'Chopard', origin: 'Switzerland', founded: '1860', desc: 'Blending watchmaking mastery with haute joaillerie. Known for Happy Diamonds and L.U.C.', slug: 'chopard' },
  { name: 'Harry Winston', origin: 'USA', founded: '1932', desc: 'The King of Diamonds brings that same brilliance to exceptional timepieces and fine jewellery.', slug: 'harry-winston' },
  { name: 'MB&F', origin: 'Switzerland', founded: '2005', desc: 'Maximilian Büsser\'s creative machines — sculptural, mechanical art that tells time.', slug: 'mbf' },
  { name: 'Tudor', origin: 'Switzerland', founded: '1926', desc: 'Born from Rolex DNA, Tudor offers exceptional quality at a more accessible price point.', slug: 'tudor' },
  { name: 'Jacob & Co', origin: 'USA', founded: '1986', desc: 'Extravagant high-jewellery watches fusing diamond craftsmanship with complex complications.', slug: 'jacob-co' },
]

export default function BrandsPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-40 pb-20 px-6 border-b border-[#111]">
        <div className="max-w-7xl mx-auto">
          <p className="section-label mb-4">Our Portfolio</p>
          <h1 className="section-title mb-6">Luxury Brands</h1>
          <div className="thin-line left" />
          <p className="text-[#444] text-sm leading-relaxed max-w-lg mt-6">
            We carry an authenticated selection of the world's most prestigious watch houses. Every brand tells a story — we help you find yours.
          </p>
        </div>
      </section>

      {/* Brand grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#0D0D0D]">
          {brands.map((b) => (
            <Link key={b.slug} href={`/collection?brand=${b.slug}`}
              className="bg-black p-8 block group hover:bg-[#050505] transition-colors border border-[#0D0D0D] hover:border-[#1A1A1A]">
              <div className="flex items-start justify-between mb-6">
                <div className="w-10 h-10 border border-[#1A1A1A] flex items-center justify-center group-hover:border-[#333] transition-colors">
                  <span className="text-[#333] text-sm font-light group-hover:text-white transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {b.name.charAt(0)}
                  </span>
                </div>
                <ArrowRight size={14} className="text-[#1A1A1A] group-hover:text-[#555] transition-colors mt-1" />
              </div>
              <h3 className="text-white text-base font-light mb-1 group-hover:text-white" style={{ fontFamily: 'Playfair Display, serif' }}>{b.name}</h3>
              <p className="text-[#333] text-[9px] tracking-[0.25em] uppercase mb-4">Est. {b.founded} · {b.origin}</p>
              <p className="text-[#333] text-xs leading-relaxed group-hover:text-[#444] transition-colors">{b.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#111] py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <p className="section-label mb-3">Can't find your brand?</p>
            <h2 className="text-white text-2xl font-light" style={{ fontFamily: 'Playfair Display, serif' }}>We Source to Order</h2>
          </div>
          <Link href="/contact" className="btn-outline self-start">Contact Our Team <ArrowRight size={14} /></Link>
        </div>
      </section>
    </>
  )
}
