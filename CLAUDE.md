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

Create a `.env.local` (see `.env.local.example`):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # server-only; needed to create customer logins from /admin and for scripts
NEXT_PUBLIC_SITE_URL=        # optional, shown in admin when handing over login details
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
- `lib/supabase/admin.ts` — service-role client (bypasses RLS, manages auth users). Server-only, needs `SUPABASE_SERVICE_ROLE_KEY`. Only used by `app/actions/portal-access.ts` and scripts.

### Server Actions

All server actions live in `app/actions/`. They use `'use server'` at the top and call `await createClient()` from the server lib. Pattern: return `{ success: boolean, error?: string }`. Existing actions: `auth.ts`, `billing.ts`, `contact.ts`, `customers.ts`, `portal-access.ts` (create/reset/delete customer logins, uses the service-role client), `projects.ts`, `seo-test.ts`, `services.ts` (customer services CRUD), `time.ts`.

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
- **No prices on the website.** Service pages push "offert inom 24 timmar" instead of amounts.

### Website route structure

```
/                          → Startsida (homepage)
/tjanster                  → Tjänsteöversikt
/tjanster/[webb|ai|seo|geo|google-ads|sociala-medier|digital-boost|grafisk-design]
/hemsida/[stad]            → Hemsida + stad (10 cities, static generated)
/seo/[stad]                → SEO + stad (10 cities, static generated)
/google-ads/[stad]         → Google Ads + stad (10 cities, static generated)
/kundcase                  → Alla kundcase
/kundcase/[slug]           → Enskilt kundcase (6 cases, static generated)
/om-oss                    → Om oss
/kontakt                   → Kontakt (form → Supabase contact_submissions)
/seo-test                  → Gratis SEO-test (PageSpeed Insights + lead capture)
/villkor                   → Villkor
/login                     → Login form (e-mail + password, redirects to /admin or /customer by role)
```

**Cities** (used as slug values): `ljungby`, `varnamo`, `vaxjo`, `markaryd`, `halmstad`, `helsingborg`, `jonkoping`, `almhult`, `lagan`, `lessebo`. City display names with Swedish characters are mapped inside each `[stad]/page.tsx`.

**Case slugs**: `ams-sweden`, `hards-transport`, `ljungby-fiber`, `molico`, `pekuma`, `smefast`.

Dynamic pages use `generateStaticParams` and `generateMetadata`. All city/case data is hardcoded in the page files (no CMS).

### Navbar

`app/(website)/_components/Navbar.tsx` — `'use client'` component used in the website layout. Has a hover dropdown for Tjänster (desktop) and a hamburger menu (mobile). Imported and rendered in `app/(website)/layout.tsx` which also contains the site-wide footer.

### Admin portal

All admin pages are under `app/(admin)/admin/`. Sidebar: `app/(admin)/_components/SidebarNav.tsx`. Pages: dashboard, customers, projects, billing, time, leads, settings. The customer detail page (`admin/customers/[id]`) queries Supabase and has panels for editing the customer, billing schedules, **customer services** (what the customer sees in the portal: type, domain, price, billing interval, renewal date) and **portal access** (create an e-mail + password login for the customer, reset the password, delete the login). Customers are created from `admin/customers` ("Ny kund") and deleted from the edit form on the detail page.

### Customer portal

`app/(customer)/customer/page.tsx` is a server component that reads the logged-in user's `profiles.customer_id` and shows the customer's `customer_services` (grouped active/ended, upcoming renewals, a "Vad ni betalar" cost table with monthly/yearly totals), `projects`, and a contact card. Customers log in at `/login` with e-mail + password created by an admin. New auth users get a `profiles` row via the `handle_new_user` trigger, auto-linked to a `customers` row with the same e-mail; admin can override the link. Service labels and cost helpers (`yearlyCost`, `monthlyCost`, `formatAmount`) live in `lib/services.ts`.

**First accounts**: `npx tsx scripts/seed-portal-accounts.ts` creates the admin login and a test customer login for Hårds Transport (needs `SUPABASE_SERVICE_ROLE_KEY`). Safe to re-run.

### Database schema

Migrations in `supabase/migrations/`. Tables: `customers`, `packages`, `customer_packages`, `projects`, `time_entries`, `billing_schedules`, `profiles`, `contact_submissions`, `seo_test_leads`, `customer_services`. All have RLS enabled (admins via `is_admin()`, customers read their own rows through `profiles.customer_id`).

### Images

Optimized WebP versions live alongside originals in `public/images/`. Always reference `.webp` paths in code. Run `node scripts/optimize-images.mjs` after adding new images (uses sharp; resizes to max 1920px, team photos to max 800px, converts to WebP at quality 82).

### SEO infrastructure

- `app/sitemap.ts` — generates sitemap for all static + dynamic routes
- `public/robots.txt` — allows all, points to sitemap
- `next.config.mjs` — 301 redirects from old Wix URLs to new structure
- Every page exports `metadata` (or `generateMetadata` for dynamic routes) with unique title, description, and Open Graph tags
- City pages include Schema.org `LocalBusiness` JSON-LD via `<script type="application/ld+json">`
