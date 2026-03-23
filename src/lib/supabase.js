import { createClient } from '@supabase/supabase-js'

// Fallback to hardcoded values in case env vars are not embedded at build time
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://bixfadawesdhvvyacnec.supabase.co'

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpeGZhZGF3ZXNkaHZ2eWFjbmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNjczODEsImV4cCI6MjA4OTc0MzM4MX0.QNhnymCy_hTHPp3r0w6Nx3VFQecU62L_XPutgyDIvyY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
