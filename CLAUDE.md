# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Next.js on http://localhost:3000)
npm run build     # Production build (also type-checks)
npm run lint      # ESLint via next lint
npm run start     # Run production build locally
node scripts/optimize-images.mjs  # Compress/resize images in public/images/
```

No test runner is configured. There are no test files in this repo.

## Environment

Two env vars are required — create a `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Architecture

### Route groups

The app uses three Next.js route groups, each with its own layout:

| Group | URL prefix | Auth | Purpose |
|---|---|---|---|
| `(website)` | `/`, `/login`, `/tjanster/*`, etc. | Public | Marketing site + login form |
| `(customer)` | `/customer/*` | Required | Customer-facing portal |
| `(admin)` | `/admin/*` | Required | Internal admin dashboard |

Auth protection is enforced in `middleware.ts` — unauthenticated requests to `/admin/*` or `/customer/*` redirect to `/login?redirectTo=[original-path]`. The middleware creates its own inline Supabase client (cannot use the lib files due to edge runtime).

### Supabase clients — two different files, never mix them

- `lib/supabase/client.ts` — browser client (`createBrowserClient`). Use in `'use client'` components.
- `lib/supabase/server.ts` — server client (`createServerClient`). Use in Server Components, Route Handlers, and Server Actions. It is `async` because it awaits `cookies()`.

### Server Actions

All server actions live in `app/actions/`. They use `'use server'` at the top and call `await createClient()` from the server lib. Pattern: return `{ success: boolean, error?: string }`. Existing actions: `auth.ts`, `billing.ts`, `contact.ts`, `customers.ts`, `projects.ts`, `seo-test.ts`, `time.ts`.

### Styling

- Tailwind CSS with a custom `brand` palette: `brand-black`, `brand-white`, `brand-green` (#A8D570), `brand-green-dark` (#8fc455), `brand-green-light` (#c4e49a)
- Font families: `font-playfair` (headings, Playfair Display via next/font), `font-sans` (body, DM Sans via next/font), `font-bakerie` (accent labels — local file at `public/fonts/bakerie.woff2`, declared via `@font-face` in `globals.css`)
- CSS animation utilities (float, marquee, glow) defined in `globals.css` under `@layer utilities`
- Scroll-reveal animations: `app/(website)/_components/ScrollReveal.tsx` — `'use client'` IntersectionObserver wrapper that toggles `.reveal-hidden` → `.reveal-visible`

### Website design conventions

- Green gradient CTA button: `style={{ background: 'linear-gradient(135deg, #A8D570 0%, #7dc435 100%)' }}` + `text-black font-bold`
- Section containers: `max-w-7xl mx-auto px-6`
- Cards: `rounded-2xl border border-black/6 shadow-sm`
- Alternating backgrounds: white → `bg-[#F8F8F8]` → `bg-black` (dark sections)
- All user-facing copy is in **Swedish**

### Website route structure

```
/                          → Startsida (homepage)
/tjanster                  → Tjänsteöversikt
/tjanster/[webb|ai|seo|google-ads|sociala-medier|digital-boost|grafisk-design]
/hemsida/[stad]            → Hemsida + stad (10 cities, static generated)
/seo/[stad]                → SEO + stad (10 cities, static generated)
/google-ads/[stad]         → Google Ads + stad (10 cities, static generated)
/kundcase                  → Alla kundcase
/kundcase/[slug]           → Enskilt kundcase (6 cases, static generated)
/om-oss                    → Om oss
/kontakt                   → Kontakt (form → Supabase contact_submissions)
/seo-test                  → Gratis SEO-test (PageSpeed Insights + lead capture)
/villkor                   → Villkor
/login                     → Login form
```

**Cities** (used as slug values): `ljungby`, `varnamo`, `vaxjo`, `markaryd`, `halmstad`, `helsingborg`, `jonkoping`, `almhult`, `lagan`, `lessebo`. City display names with Swedish characters are mapped inside each `[stad]/page.tsx`.

**Case slugs**: `ams-sweden`, `hards-transport`, `ljungby-fiber`, `molico`, `pekuma`, `smefast`.

Dynamic pages use `generateStaticParams` and `generateMetadata`. All city/case data is hardcoded in the page files (no CMS).

### Navbar

`app/(website)/_components/Navbar.tsx` — `'use client'` component used in the website layout. Has a hover dropdown for Tjänster (desktop) and a hamburger menu (mobile). Imported and rendered in `app/(website)/layout.tsx` which also contains the site-wide footer.

### Admin portal

All admin pages are under `app/(admin)/admin/` and use **mock/hardcoded data** (no live Supabase queries in admin pages yet). Sidebar: `app/(admin)/_components/SidebarNav.tsx`. Pages: dashboard, customers, projects, billing, time, settings. Customer and project detail pages have edit forms that do call real server actions.

### Database schema

Migrations in `supabase/migrations/`. Tables: `customers`, `packages`, `customer_packages`, `projects`, `time_entries`, `billing_schedules`, `profiles`, `contact_submissions`, `seo_test_leads`. All have RLS enabled. The migration has not been applied to a live Supabase project yet — most admin pages still use hardcoded mock data.

### Images

Optimized WebP versions live alongside originals in `public/images/`. Always reference `.webp` paths in code. Run `node scripts/optimize-images.mjs` after adding new images (uses sharp; resizes to max 1920px, team photos to max 800px, converts to WebP at quality 82).

### SEO infrastructure

- `app/sitemap.ts` — generates sitemap for all static + dynamic routes
- `public/robots.txt` — allows all, points to sitemap
- `next.config.mjs` — 301 redirects from old Wix URLs to new structure
- Every page exports `metadata` (or `generateMetadata` for dynamic routes) with unique title, description, and Open Graph tags
- City pages include Schema.org `LocalBusiness` JSON-LD via `<script type="application/ld+json">`
