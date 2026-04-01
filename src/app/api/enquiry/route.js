import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bixfadawesdhvvyacnec.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpeGZhZGF3ZXNkaHZ2eWFjbmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNjczODEsImV4cCI6MjA4OTc0MzM4MX0.QNhnymCy_hTHPp3r0w6Nx3VFQecU62L_XPutgyDIvyY'
)

export async function POST(req) {
  try {
    const body = await req.json()
    const { type, name, email, data } = body
    await supabase.from('enquiries').insert([{ type, name, email, data }])
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
