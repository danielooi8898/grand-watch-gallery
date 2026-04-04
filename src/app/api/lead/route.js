import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bixfadawesdhvvyacnec.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpeGZhZGF3ZXNkaHZ2eWFjbmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNjczODEsImV4cCI6MjA4OTc0MzM4MX0.QNhnymCy_hTHPp3r0w6Nx3VFQecU62L_XPutgyDIvyY'
)

export async function POST(req) {
  try {
    const body = await req.json()
    const { source, name, email, phone, data } = body

    if (!source) return Response.json({ error: 'Missing source' }, { status: 400 })

    await supabase.from('leads').insert({
      source,
      name: name || null,
      email: email || null,
      phone: phone || null,
      data: data || {},
      status: 'new',
    })

    return Response.json({ ok: true })
  } catch (err) {
    console.error('Lead capture error:', err)
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
