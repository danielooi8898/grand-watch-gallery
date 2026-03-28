import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bixfadawesdhvvyacnec.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpeGZhZGF3ZXNkaHZ2eWFjbmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNjczODEsImV4cCI6MjA4OTc0MzM4MX0.QNhnymCy_hTHPp3r0w6Nx3VFQecU62L_XPutgyDIvyY'
)

const FEEDS = [
  { url: 'https://www.watchpro.com/feed/',          source: 'WatchPro' },
  { url: 'https://www.fratellowatches.com/feed/',   source: 'Fratello Watches' },
  { url: 'https://robbreport.com/watches/feed/',    source: 'Robb Report' },
]

/* ── XML helpers ─────────────────────────────────────────────────────────── */
function extract(block, tag) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
  if (!m) return ''
  return m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim()
}

function extractAttr(block, tag, attr) {
  const m = block.match(new RegExp(`<${tag}[^>]*\\s${attr}=["']([^"']+)["']`, 'i'))
  return m ? m[1].trim() : ''
}

function stripHTML(str) {
  return str
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s{2,}/g, ' ').trim()
}

function formatDate(pubDate) {
  if (!pubDate) return ''
  const d = new Date(pubDate)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}


function guessCategory(text) {
  const t = text.toLowerCase()
  if (/new release|debut|launch|introduc|unveil|announc|presented/.test(t)) return 'New Release'
  if (/auction|invest|value|return|appreciation|collectib|sotheby|phillips|christies|hammer/.test(t)) return 'Investment'
  if (/interview|ceo|founder|watchmaker|spoke with|sat down|in conversation/.test(t)) return 'Interview'
  if (/history|heritage|anniversary|founded|origin|story of|tradition|legacy/.test(t)) return 'History'
  return 'Market Update'
}

function parseRSS(xml, source) {
  const items = []
  const itemRx = /<item[^>]*>([\s\S]*?)<\/item>/g
  let m
  while ((m = itemRx.exec(xml)) !== null) {
    const block = m[1]
    const title    = stripHTML(extract(block, 'title')).substring(0, 200)
    const rawLink  = extract(block, 'link')
    const link     = rawLink.includes('http') ? rawLink.match(/https?:\/\/[^\s<"']+/)?.[0] || rawLink : rawLink
    const desc     = stripHTML(extract(block, 'description')).substring(0, 500)
    const pubDate  = extract(block, 'pubDate') || extract(block, 'dc:date')
    const imageUrl =
      extractAttr(block, 'media:content', 'url') ||
      extractAttr(block, 'media:thumbnail', 'url') ||
      extractAttr(block, 'enclosure', 'url') ||
      block.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] || ''

    if (!title || !link) continue
    items.push({
      title,
      source_url:  link.trim(),
      excerpt:     desc,
      date:        formatDate(pubDate),
      source,
      image_url:   imageUrl.startsWith('http') ? imageUrl : '',
      category:    guessCategory(title + ' ' + desc),
      read_time:   '5 min',
      is_published: true,
    })
  }
  return items
}


async function runFetch() {
  /* 1. existing URLs so we don't double-insert */
  const { data: existing } = await supabase.from('blog_posts').select('source_url')
  const seen = new Set((existing || []).map(p => p.source_url))

  /* 2. next order_index */
  const { data: top } = await supabase
    .from('blog_posts').select('order_index')
    .order('order_index', { ascending: false }).limit(1)
  let nextOrder = (top?.[0]?.order_index ?? 0) + 1

  const toInsert = []

  for (const feed of FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GWGBot/1.0)' },
        signal:  AbortSignal.timeout(10_000),
      })
      if (!res.ok) { console.warn(`RSS ${feed.url} returned ${res.status}`); continue }
      const xml   = await res.text()
      const items = parseRSS(xml, feed.source)

      for (const item of items.slice(0, 15)) {
        if (!seen.has(item.source_url)) {
          // Strip image_url — column doesn't exist in blog_posts schema
          const { image_url: _img, ...safeItem } = item
          toInsert.push({ ...safeItem, order_index: nextOrder++ })
          seen.add(item.source_url)
        }
      }
    } catch (err) {
      console.error(`RSS fetch failed [${feed.source}]:`, err.message)
    }
  }

  if (toInsert.length > 0) {
    const { error } = await supabase.from('blog_posts').insert(toInsert)
    if (error) throw new Error(error.message)
  }

  return toInsert.length
}

/* ── GET  – called by Vercel Cron (daily) ────────────────────────────────── */
export async function GET(req) {
  const cronSecret = process.env.CRON_SECRET
  const authHeader = req.headers.get('authorization')
  const queryKey   = req.nextUrl.searchParams.get('key')

  /* Allow: Vercel cron bearer OR manual ?key=<CRON_SECRET> */
  const allowed =
    (cronSecret && authHeader === `Bearer ${cronSecret}`) ||
    (cronSecret && queryKey === cronSecret) ||
    (!cronSecret) // dev: no secret set → open

  if (!allowed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const added = await runFetch()
    return NextResponse.json({ ok: true, added })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

/* ── POST – called by admin UI "Fetch Latest" button ─────────────────────── */
export async function POST() {
  try {
    const added = await runFetch()
    return NextResponse.json({ ok: true, added })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
