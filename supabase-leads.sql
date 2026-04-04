-- Run this in your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard → Your Project → SQL Editor

CREATE TABLE IF NOT EXISTS leads (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  source      text NOT NULL,
  name        text,
  email       text,
  phone       text,
  data        jsonb DEFAULT '{}',
  status      text DEFAULT 'new',
  created_at  timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for form submissions)
CREATE POLICY "Anyone can insert leads" ON leads FOR INSERT WITH CHECK (true);

-- Only authenticated users can read/update/delete
CREATE POLICY "Admins can read leads"   ON leads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can update leads" ON leads FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete leads" ON leads FOR DELETE USING (auth.role() = 'authenticated');
