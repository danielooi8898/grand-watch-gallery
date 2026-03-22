-- ================================================================
-- Grand Watch Gallery — Supabase Database Setup
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ================================================================

-- 1. WATCHES TABLE
-- ================================================================
create table if not exists watches (
  id           uuid primary key default gen_random_uuid(),
  brand        text not null,
  model        text not null,
  ref          text,
  price        text,
  year         integer,
  type         text default 'Watch',
  condition    text default 'Excellent',
  tag          text,
  description  text,
  image_url    text,
  is_featured  boolean default false,
  is_sold      boolean default false,
  created_at   timestamptz default now()
);

-- 2. ADMIN USERS TABLE
-- ================================================================
create table if not exists admin_users (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  created_at timestamptz default now()
);

-- INSERT YOUR ADMIN EMAIL HERE:
insert into admin_users (email) values ('ooimunhong8898@gmail.com');

-- 3. APPOINTMENTS TABLE
-- ================================================================
create table if not exists appointments (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  phone        text,
  date         date,
  time         text,
  interest     text,
  notes        text,
  status       text default 'pending',
  created_at   timestamptz default now()
);

-- 4. TRADE-IN REQUESTS TABLE
-- ================================================================
create table if not exists trade_in_requests (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null,
  phone         text,
  watch_brand   text,
  watch_model   text,
  watch_ref     text,
  watch_year    integer,
  condition     text,
  has_papers    boolean default false,
  has_box       boolean default false,
  notes         text,
  status        text default 'pending',
  created_at    timestamptz default now()
);

-- 5. CONTACT MESSAGES TABLE
-- ================================================================
create table if not exists contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  subject    text,
  message    text,
  status     text default 'unread',
  created_at timestamptz default now()
);

-- 6. CAREER APPLICATIONS TABLE
-- ================================================================
create table if not exists career_applications (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  phone        text,
  role         text,
  experience   text,
  message      text,
  status       text default 'pending',
  created_at   timestamptz default now()
);

-- 7. PARTNER ENQUIRIES TABLE
-- ================================================================
create table if not exists partner_enquiries (
  id               uuid primary key default gen_random_uuid(),
  company_name     text not null,
  contact_name     text,
  email            text not null,
  phone            text,
  partnership_type text,
  message          text,
  status           text default 'pending',
  created_at       timestamptz default now()
);

-- ================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

-- Enable RLS on all tables
alter table watches          enable row level security;
alter table admin_users      enable row level security;
alter table appointments     enable row level security;
alter table trade_in_requests enable row level security;
alter table contact_messages enable row level security;
alter table career_applications enable row level security;
alter table partner_enquiries enable row level security;

-- WATCHES: Public can read; anyone can insert (admin controls via app)
create policy "Public read watches"
  on watches for select using (true);

create policy "Service role manage watches"
  on watches for all using (true);

-- ADMIN USERS: Public can read (for auth check)
create policy "Public read admin_users"
  on admin_users for select using (true);

-- FORM SUBMISSIONS: Anyone can insert (public forms)
create policy "Anyone can submit appointment"
  on appointments for insert with check (true);

create policy "Anyone can submit trade_in"
  on trade_in_requests for insert with check (true);

create policy "Anyone can submit contact"
  on contact_messages for insert with check (true);

create policy "Anyone can submit career_application"
  on career_applications for insert with check (true);

create policy "Anyone can submit partner_enquiry"
  on partner_enquiries for insert with check (true);

-- ================================================================
-- 9. STORAGE BUCKET: watch-images
-- ================================================================
-- Run this separately in Supabase Storage settings, or via:
insert into storage.buckets (id, name, public)
values ('watch-images', 'watch-images', true)
on conflict (id) do nothing;

-- Allow public read on watch-images
create policy "Public read watch images"
  on storage.objects for select
  using (bucket_id = 'watch-images');

-- Allow authenticated users to upload
create policy "Authenticated upload watch images"
  on storage.objects for insert
  with check (bucket_id = 'watch-images' and auth.role() = 'authenticated');

create policy "Authenticated delete watch images"
  on storage.objects for delete
  using (bucket_id = 'watch-images' and auth.role() = 'authenticated');

-- ================================================================
-- 10. SEED DATA — 6 Sample Watches
-- ================================================================
insert into watches (brand, model, ref, price, year, type, condition, tag, description, is_featured) values
  ('Rolex', 'Submariner Date', '126610LN', 'MYR 58,000', 2023, 'Watch', 'Mint', 'In Stock', 'Black dial, black ceramic bezel. Full set with box and papers dated 2023. No scratches, unworn condition.', true),
  ('Patek Philippe', 'Nautilus', '5711/1A-010', 'MYR 420,000', 2022, 'Watch', 'Mint', 'Rare', 'Blue dial, stainless steel. Complete set with original box and papers. One of the most sought-after references in modern watchmaking.', true),
  ('Audemars Piguet', 'Royal Oak', '15510ST.OO.1320ST.06', 'MYR 185,000', 2023, 'Watch', 'Excellent', 'New Arrival', 'Blue dial, stainless steel bracelet. Self-winding, 41mm. Full set with original documentation.', true),
  ('Richard Mille', 'RM 011', 'RM011-03', 'MYR 690,000', 2021, 'Watch', 'Excellent', 'Limited', 'Titanium case, flyback chronograph. Annual calendar function. Comes with original Richard Mille box and papers.', true),
  ('Rolex', 'Daytona', '116500LN', 'MYR 145,000', 2022, 'Watch', 'Excellent', 'In Stock', 'Panda white dial, stainless steel. Oystersteel case, ceramic bezel. Full set box and papers 2022.', false),
  ('Omega', 'Speedmaster Professional', '311.30.42.30.01.005', 'MYR 28,000', 2021, 'Watch', 'Good', 'In Stock', 'The iconic Moonwatch. Manual wind, 42mm. Hesalite crystal. Full set with inner and outer box.', false);
