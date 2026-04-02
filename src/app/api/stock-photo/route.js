import { NextResponse } from 'next/server'

const HDR = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
}

async function fetchPage(url) {
  try {
    const res = await fetch(url, { headers: HDR, cache: 'no-store' })
    if (!res.ok) return null
    return res.text()
  } catch { return null }
}

function extractOgImage(html) {
  const m = html.match(/property="og:image"\s+content="([^"]+)"/) ||
            html.match(/content="([^"]+)"\s+property="og:image"/)
  return m ? m[1] : null
}

// ── ROLEX ─────────────────────────────────────────────────────────────────────
// Rolex CDN is fully predictable — no page fetch needed
async function getRolex(ref) {
  const r = ref.toLowerCase().replace(/\s+/g, '')
  const candidates = [
    `https://media.rolex.com/image/upload/q_auto/f_auto/t_v7-cover-majesty-landscape/c_limit,w_1920/v1/catalogue/2025/upright-c/${r}`,
    `https://media.rolex.com/image/upload/q_auto/f_auto/t_v7-cover-majesty-landscape/c_limit,w_1920/v1/catalogue/2024/upright-c/${r}`,
    `https://media.rolex.com/image/upload/q_auto/f_auto/t_v7/c_limit,w_1920/v1/catalogue/2025/upright-c/${r}`,
  ]
  for (const url of candidates) {
    try {
      const chk = await fetch(url, { method: 'HEAD', headers: HDR, cache: 'no-store' })
      if (chk.ok) return url
    } catch {}
  }
  return null
}

// ── PATEK PHILIPPE ────────────────────────────────────────────────────────────
const PATEK_COLS = [
  ['nautilus',            'nautilus'],
  ['aquanaut',            'aquanaut'],
  ['grand complications', 'grand-complications'],
  ['calatrava',           'calatrava'],
  ['gondolo',             'gondolo'],
  ['golden ellipse',      'golden-ellipse'],
  ['twenty',              'twenty-4'],
  ['complications',       'complications'],
]

async function getPatek(ref, model) {
  const ml = (model || '').toLowerCase()
  let col = 'complications'
  for (const [k, v] of PATEK_COLS) {
    if (ml.includes(k)) { col = v; break }
  }

  const html = await fetchPage(`https://www.patek.com/en/collection/${col}/${ref}`)
  if (!html) return null

  // Best: image with _SDT in alt = main front-facing studio shot
  const rSDT = [
    /src="(https:\/\/patek-res\.cloudinary\.com\/[^"]+)"[^>]*alt="[^"]*_SDT/,
    /alt="[^"]*_SDT[^"]*"[^>]*src="(https:\/\/patek-res\.cloudinary\.com\/[^"]+)"/,
  ]
  for (const rx of rSDT) { const m = html.match(rx); if (m) return m[1] }

  // Fallback: first Cloudinary image on page
  const fall = html.match(/https:\/\/patek-res\.cloudinary\.com\/dfsmedia\/[^"'\s]+/)
  return fall ? fall[0] : null
}

// ── AUDEMARS PIGUET ───────────────────────────────────────────────────────────
const AP_COLS = [
  ['royal oak offshore', 'royal-oak-offshore'],
  ['offshore',           'royal-oak-offshore'],
  ['concept',            'concept'],
  ['millenary',          'millenary'],
  ['code 11.59',         'code-1159'],
  ['jules audemars',     'jules-audemars'],
  ['royal oak',          'royal-oak'],
]

async function getAP(ref, model) {
  const ml = (model || '').toLowerCase()
  let col = 'royal-oak'
  for (const [k, v] of AP_COLS) {
    if (ml.includes(k)) { col = v; break }
  }
  const r = ref.replace(/\s/g, '')
  const html = await fetchPage(`https://www.audemarspiguet.com/com/en/watch-collection/${col}/${r}.html`)
  if (!html) return null
  const og = extractOgImage(html)
  if (og) return og
  const dam = html.match(/https:\/\/www\.audemarspiguet\.com\/content\/dam\/[^"'\s]+\.(?:jpg|png|webp)/i)
  return dam ? dam[0] : null
}

// ── TUDOR ─────────────────────────────────────────────────────────────────────
async function getTudor(ref) {
  const r = ref.toLowerCase().replace(/\s+/g, '')
  const html = await fetchPage(`https://www.tudorwatch.com/en/watches/${r}`)
  if (!html) return null
  return extractOgImage(html)
}

// ── OMEGA ─────────────────────────────────────────────────────────────────────
async function getOmega(ref) {
  const html = await fetchPage(`https://www.omegawatches.com/en-us/search?q=${encodeURIComponent(ref)}`)
  if (!html) return null
  const og = extractOgImage(html)
  if (og) return og
  const med = html.match(/https:\/\/www\.omegawatches\.com\/media\/catalog\/[^"'\s]+\.(?:jpg|png)/i)
  return med ? med[0] : null
}

// ── IWC ───────────────────────────────────────────────────────────────────────
async function getIWC(ref) {
  const html = await fetchPage(`https://www.iwc.com/en/search.html?q=${encodeURIComponent(ref)}`)
  if (!html) return null
  return extractOgImage(html)
}

// ── CARTIER ───────────────────────────────────────────────────────────────────
async function getCartier(ref) {
  const html = await fetchPage(`https://www.cartier.com/en-us/all-watches.html?q=${encodeURIComponent(ref)}`)
  if (!html) return null
  return extractOgImage(html)
}

// ── JAEGER-LECOULTRE ──────────────────────────────────────────────────────────
async function getJLC(ref) {
  const html = await fetchPage(`https://www.jaeger-lecoultre.com/int-en/search?q=${encodeURIComponent(ref)}`)
  if (!html) return null
  return extractOgImage(html)
}

// ── BREITLING ─────────────────────────────────────────────────────────────────
async function getBreitling(ref) {
  const html = await fetchPage(`https://www.breitling.com/en-us/search/?q=${encodeURIComponent(ref)}`)
  if (!html) return null
  return extractOgImage(html)
}

// ── HUBLOT ────────────────────────────────────────────────────────────────────
async function getHublot(ref) {
  const html = await fetchPage(`https://www.hublot.com/en-US/search?q=${encodeURIComponent(ref)}`)
  if (!html) return null
  return extractOgImage(html)
}

// ── PANERAI ───────────────────────────────────────────────────────────────────
async function getPanerai(ref) {
  const html = await fetchPage(`https://www.panerai.com/en/watches/${ref.toLowerCase()}.html`)
  if (!html) return null
  return extractOgImage(html)
}

// ── VACHERON CONSTANTIN ───────────────────────────────────────────────────────
async function getVacheron(ref) {
  const html = await fetchPage(`https://www.vacheron-constantin.com/en/search?q=${encodeURIComponent(ref)}`)
  if (!html) return null
  return extractOgImage(html)
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const brand = (searchParams.get('brand') || '').trim()
  const ref   = (searchParams.get('reference') || '').trim()
  const model = (searchParams.get('model') || '').trim()

  if (!brand || !ref) {
    return NextResponse.json({ error: 'brand and reference are required' }, { status: 400 })
  }

  const b = brand.toLowerCase()
  let imageUrl = null

  if      (b.includes('rolex'))                          imageUrl = await getRolex(ref)
  else if (b.includes('patek'))                          imageUrl = await getPatek(ref, model)
  else if (b.includes('audemars'))                       imageUrl = await getAP(ref, model)
  else if (b.includes('tudor'))                          imageUrl = await getTudor(ref)
  else if (b.includes('omega'))                          imageUrl = await getOmega(ref)
  else if (b.includes('iwc'))                            imageUrl = await getIWC(ref)
  else if (b.includes('cartier'))                        imageUrl = await getCartier(ref)
  else if (b.includes('jaeger') || b.includes('jlc'))   imageUrl = await getJLC(ref)
  else if (b.includes('breitling'))                      imageUrl = await getBreitling(ref)
  else if (b.includes('hublot'))                         imageUrl = await getHublot(ref)
  else if (b.includes('panerai'))                        imageUrl = await getPanerai(ref)
  else if (b.includes('vacheron'))                       imageUrl = await getVacheron(ref)

  if (imageUrl) {
    return NextResponse.json({ imageUrl, brand, reference: ref })
  }
  return NextResponse.json(
    { error: `No official image found for ${brand} ref. ${ref}. Please upload manually.` },
    { status: 404 }
  )
}
