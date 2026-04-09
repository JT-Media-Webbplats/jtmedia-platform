# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Next.js on http://localhost:3000)
npm run build     # Production build (also type-checks)
npm run lint      # ESLint via next lint
npm run start     # Run production build locally
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
| `(website)` | `/`, `/login` | Public | Marketing site + login form |
| `(customer)` | `/customer/*` | Required | Customer-facing portal |
| `(admin)` | `/admin/*` | Required | Internal admin dashboard |

Auth protection is enforced in `middleware.ts` — unauthenticated requests to `/admin/*` or `/customer/*` redirect to `/login?redirectTo=[original-path]`.

### Supabase clients — two different files, never mix them

- `lib/supabase/client.ts` — browser client (`createBrowserClient`). Use in `'use client'` components.
- `lib/supabase/server.ts` — server client (`createServerClient`). Use in Server Components, Route Handlers, and Server Actions. It is `async` because it awaits `cookies()`.

The middleware also creates its own Supabase client inline (it cannot import from either lib file due to the edge runtime cookie API differing from the server one).

### Styling

- Tailwind CSS with a custom `brand` palette: `brand-black`, `brand-white`, `brand-green` (#A8D570), `brand-green-dark`, `brand-green-light`
- Two font families configured: `font-playfair` (loaded via `next/font/google` in root layout) and `font-bakerie` (local file at `public/fonts/bakerie.woff2`, `@font-face` declared in `globals.css`)
- CSS animation utilities (float, marquee, glow) are defined in `globals.css` under `@layer utilities`
- Scroll-reveal animations use `app/(website)/_components/ScrollReveal.tsx` — a `'use client'` IntersectionObserver wrapper that toggles `.reveal-hidden` → `.reveal-visible`

### Admin portal

All admin pages are under `app/(admin)/admin/` and use mock/hardcoded data. The sidebar navigation is defined in `app/(admin)/layout.tsx`. Pages built so far: dashboard (`/admin`), customers (`/admin/customers`), projects (`/admin/projects`).

### Database schema

Migration file at `supabase/migrations/20260409000000_initial_schema.sql`. Tables: `customers`, `packages`, `customer_packages`, `projects`, `time_entries`, `billing_schedules`. All have RLS enabled; no permissive policies are set yet (service role only). The migration has not been applied to a live Supabase project yet — admin pages use hardcoded mock data.

### Content language

All user-facing copy is in Swedish.
