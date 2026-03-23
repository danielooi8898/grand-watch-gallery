-- ============================================================
-- Grand Watch Gallery — Supabase Setup Script
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Admin users table (if not already created)
CREATE TABLE IF NOT EXISTS admin_users (
  id    uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL
);

-- 2. Site settings (key-value store for all editable content)
CREATE TABLE IF NOT EXISTS site_settings (
  key   text PRIMARY KEY,
  value jsonb
);

-- 3. Blog / Journal posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title        text NOT NULL,
  category     text DEFAULT 'Market Update',
  excerpt      text,
  source_url   text NOT NULL,
  source       text,
  date         text,
  read_time    text DEFAULT '5 min',
  is_published boolean DEFAULT true,
  order_index  integer DEFAULT 0,
  created_at   timestamptz DEFAULT now()
);

-- 4. Watches table (if not already created — skip if it exists)
CREATE TABLE IF NOT EXISTS watches (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  brand       text NOT NULL,
  model       text NOT NULL,
  reference   text,
  price       numeric,
  condition   text DEFAULT 'excellent',
  year        integer,
  description text,
  features    jsonb DEFAULT '[]',
  images      text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  is_sold     boolean DEFAULT false,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- ============================================================
-- 5. Row Level Security — allow public reads, auth writes
-- ============================================================

ALTER TABLE watches      ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users  ENABLE ROW LEVEL SECURITY;

-- Public can read watches, blog posts, site_settings
CREATE POLICY "public_read_watches"       ON watches       FOR SELECT USING (true);
CREATE POLICY "public_read_blog"          ON blog_posts    FOR SELECT USING (true);
CREATE POLICY "public_read_settings"      ON site_settings FOR SELECT USING (true);

-- Authenticated users can do all operations (admin check is done in app)
CREATE POLICY "auth_all_watches"          ON watches       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_blog"             ON blog_posts    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_settings"         ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_read_admin_users"     ON admin_users   FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================
-- 6. Storage bucket for watch images
-- ============================================================
-- Run this separately or create via Supabase dashboard:
-- Storage → New bucket → Name: "watch-images" → Public: ON

INSERT INTO storage.buckets (id, name, public) VALUES ('watch-images', 'watch-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public_read_images" ON storage.objects FOR SELECT USING (bucket_id = 'watch-images');
CREATE POLICY "auth_upload_images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'watch-images' AND auth.role() = 'authenticated');
CREATE POLICY "auth_delete_images" ON storage.objects FOR DELETE USING  (bucket_id = 'watch-images' AND auth.role() = 'authenticated');

-- ============================================================
-- 7. Seed default blog posts
-- ============================================================
INSERT INTO blog_posts (title, category, excerpt, source_url, source, date, read_time, is_published, order_index) VALUES
('The Secondary Watch Market Rebounds: $17 Billion in 2025','Market Update','After thirteen consecutive quarters of decline, the pre-owned luxury watch market staged its first positive year since 2022, with $17B in measured sales and prices rising 4.9%.','https://www.watchpro.com/pre-owned-watch-market/','WatchPro','Jan 2026','5 min',true,0),
('Patek Philippe Cuts U.S. Prices by 8% Following Tariff Relief','Market Update','Patek Philippe announced price reductions for U.S. customers starting February 2026, following a drop in Swiss import tariffs from 39% to 15%.','https://www.watchpro.com/patek-philippe/','WatchPro','Feb 2026','4 min',true,1),
('Phillips Watches Shatters Records with $370M in 2025 Sales','Investment','Phillips Watches achieved its highest annual total with $370M in global sales during its 10th anniversary year.','https://robbreport.com/watches/watch-news/','Robb Report','Dec 2025','6 min',true,2),
('Rolex and Audemars Piguet Raise Prices as Gold Hits Record Highs','Market Update','Rolex implemented price increases of approximately 7% in the U.S. at the start of 2026, with the steel Submariner officially crossing the $10,000 threshold.','https://robbreport.com/watches/watch-news/','Robb Report','Jan 2026','4 min',true,3),
('Audemars Piguet Marks 150th Anniversary with Perpetual Calendar Innovations','New Release','Audemars Piguet celebrated 150 years with the Royal Oak Perpetual Calendar Openworked (limited to 150 pieces).','https://www.fratellowatches.com/audemars-piguet/','Fratello Watches','Mid 2025','6 min',true,4),
('Christie''s Surpasses $1 Billion in Luxury Auctions with 90% Sell-Through','Investment','Christie''s Luxury division broke the billion-dollar barrier in 2025 global sales, with 85% of bids placed online.','https://www.watchpro.com/auctions/','WatchPro','Dec 2025','5 min',true,5)
ON CONFLICT DO NOTHING;

-- Done! Now register your admin user:
-- 1. Create a user in Supabase Auth → Authentication → Users → Add User
-- 2. Then insert their email into admin_users:
--    INSERT INTO admin_users (email) VALUES ('your@email.com');
