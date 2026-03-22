# Grand Watch Gallery — Website

Modern luxury watch website for Grand Watch Gallery, Kuala Lumpur.

## Tech Stack
- **Next.js 16** (App Router)
- **Tailwind CSS 4**
- **Supabase** (database for forms)
- **Vercel** (deployment)

## Pages
- `/` — Home (hero, featured collection, brands, testimonials)
- `/collection` — Filterable watch gallery
- `/brands` — All luxury brands
- `/trade-in` — Trade-in & sell form
- `/appointment` — Book a private viewing
- `/blog` — The Journal
- `/careers` — Work with us
- `/partners` — Partner with us
- `/contact` — Contact & location

## Getting Started

### 1. Set up Supabase
1. Open [supabase.com](https://supabase.com) → your project
2. Go to **SQL Editor** and run the contents of `supabase-setup.sql`
3. Go to **Settings → API** and copy your Project URL and anon key

### 2. Configure Environment Variables
```bash
cp .env.local.example .env.local
```
Then edit `.env.local` with your Supabase credentials.

### 3. Run Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel
1. Push this folder to a new GitHub repository
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo
3. Add your environment variables in Vercel project settings
4. Deploy!

## Customisation
- **Colors** — Edit CSS variables in `src/app/globals.css`
- **Watch inventory** — Edit the `allWatches` array in `src/app/collection/page.js`
- **Brands** — Edit `src/app/brands/page.js`
- **Contact info** — Phone/WhatsApp numbers are in `src/components/Navbar.js`, `Footer.js`, `WhatsAppButton.js`

## Contact Info in Code
- Phone: +6016-682 4848
- WhatsApp: +6016-224 1804
- Instagram: @gwg_gallery
- Facebook: @GWGmy
