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

All server actions live in `app/actions/`. They use `'use server'` at the top and call `await createClient()` from the server lib. Pattern: return `{ success: boolean, error?: string }`. Existing actions: `auth.ts`, `billing.ts`, `contact.ts`, `customers.ts`, `portal-access.ts` (create/reset/delete customer logins, uses the service-role client), `projects.ts`, `prospects.ts` (pipeline prospects CRUD + convert to customer), `requests.ts` (customer portal requests + admin status), `seo-test.ts`, `services.ts` (customer services CRUD), `time.ts`.

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

All admin pages are under `app/(admin)/admin/`. Sidebar: `app/(admin)/_components/SidebarNav.tsx`. Pages: dashboard, customers, projects, pipeline, billing, time, leads, settings. The customer detail page (`admin/customers/[id]`) queries Supabase and has panels for editing the customer, billing schedules, **customer services** (what the customer sees in the portal: type, domain, price, billing interval, renewal date) and **portal access** (create an e-mail + password login for the customer, reset the password, delete the login). Customers are created from `admin/customers` ("Ny kund") and deleted from the edit form on the detail page.

### Pipeline (kanban)

`admin/pipeline` shows one board: **Projekt** (columns = `projects.status`: pending "Väntar på godkännande", active, paused, completed, cancelled hidden behind a toggle). `_components/KanbanBoard.tsx` is a generic HTML5 drag-and-drop board (columns share the width, no horizontal scroll) with optimistic moves and a per-card `<select>` fallback; `ProjectBoard` wraps it and the sales board reuses it. Column definitions and project status labels are in `lib/pipeline.ts`. The former **Prospekt** tab was merged into `/admin/salj` on 2026-09-22 (migration `20260922100000_sales_single_board.sql`); the `prospects` table still exists but is empty and unused.

### Customer portal

`app/(customer)/` mirrors the admin layout: dark sidebar (`_components/PortalNav.tsx`, horizontal bar on mobile) + light content. Every page calls `getPortalContext()` from `app/(customer)/_lib/context.ts` (user, profile, linked customer) and renders `NotLinked` if the profile has no `customer_id`. Pages:

| Route | Purpose |
|---|---|
| `/customer` | Översikt: stat cards, kommande förnyelser, compact service list, shortcuts, recommendations, open requests, projects |
| `/customer/tjanster` | Era tjänster: service cards + "Vi rekommenderar" (customer-specific upsell) |
| `/customer/bestall` | Fler tjänster: catalogue from `lib/portal.ts` (`serviceCatalog`), "Skicka förfrågan" modal → `service_requests` |
| `/customer/kontakt` | Kontakt: team cards + message form → `service_requests` with `kind = 'message'` |

**No prices in the customer portal.** Amounts on `customer_services` are admin-only; the portal shows billing interval and renewal dates but never `amount`. The old "Vad ni betalar" table was removed on purpose (2026-09-09).

**Recommendations** (`recommendServices` in `lib/portal.ts`): rule list mapping owned service types to a catalogue key + a Swedish reason (e.g. has SEO → recommend Google Ads), with generic fallbacks; excludes services the customer already has. Rendered by `app/(customer)/_components/Recommendations.tsx` (3 cards on Era tjänster, 2 on Översikt).

**Resultat / Google Search Console was removed** (2026-09-09): JT Media sends manual monthly reports instead. The `customers.search_console_site` column still exists in the DB but is unused.

Customer actions live in `app/actions/requests.ts` (`requestService`, `sendPortalMessage`, admin `updateRequestStatus`). Requests show up in admin under Leads ("Från kundportalen") with a status dropdown. Service labels and cost helpers (`yearlyCost`, `monthlyCost`, `formatAmount`, admin use only) live in `lib/services.ts`; catalogue, recommendations, request status labels and team contact data in `lib/portal.ts`.

Customers log in at `/login` with e-mail + password created by an admin. New auth users get a `profiles` row via the `handle_new_user` trigger, auto-linked to a `customers` row with the same e-mail; admin can override the link.

**First accounts**: `npx tsx scripts/seed-portal-accounts.ts` creates the admin login and a test customer login for Hårds Transport (needs `SUPABASE_SERVICE_ROLE_KEY`). Safe to re-run.

### Database schema

Migrations in `supabase/migrations/` (run manually in the Supabase SQL Editor, there is no CLI setup). Tables: `customers`, `packages`, `customer_packages`, `projects`, `time_entries`, `billing_schedules`, `profiles`, `contact_submissions`, `seo_test_leads`, `customer_services`, `service_requests`, `prospects` (admin only), `report_clients` + `monthly_reports` (admin only). All have RLS enabled (admins via `is_admin()`, customers read their own rows through `profiles.customer_id`; customers may insert their own `service_requests` but not update them).

### Images

Optimized WebP versions live alongside originals in `public/images/`. Always reference `.webp` paths in code. Run `node scripts/optimize-images.mjs` after adding new images (uses sharp; resizes to max 1920px, team photos to max 800px, converts to WebP at quality 82).

### SEO infrastructure

- `app/sitemap.ts` — generates sitemap for all static + dynamic routes
- `public/robots.txt` — allows all, points to sitemap
- `next.config.mjs` — 301 redirects from old Wix URLs to new structure
- Every page exports `metadata` (or `generateMetadata` for dynamic routes) with unique title, description, and Open Graph tags
- City pages include Schema.org `LocalBusiness` JSON-LD via `<script type="application/ld+json">`

### Säljmaskin (admin)

`admin/salj` is the single sales board: every company we are selling to before it becomes a customer, whether found by the agent or added by hand. Table `sales_opportunities`, stages `identified → to_contact → contacted → dialog → proposal → won / lost` (won/lost hidden behind "Visa avslutade"), kinds `upsell / new / reactivation` and source `agent / manual` as filter chips. Labels and helpers in `lib/sales.ts`, CRUD in `app/actions/sales.ts`. Rules that keep cards from going quiet: `next_action_at` is auto-set 7 days ahead when a card enters contacted/dialog/proposal without one, cards in contacted for 14+ days show "Tyst i N dagar", the dashboard counts open + overdue opportunities. `convertOpportunityToCustomer` (button "Gör till kund" on won cards, or "Vunnen, gör till kund" in the modal) creates/matches the customer and a `projects` row with status pending. The agent is Claude Code itself, not app code: skills `/salj-agent` (Gmail via MCP: upsell, reactivation, reply detection and reminder drafts for contacted cards) and `/prospektera` (web research for new companies, `scripts/analyze-sites.ts` for technical site checks + PageSpeed) write JSON and import it with `scripts/sales-agent-import.ts` (dedupe on company + service, `customer_id` by name/e-mail, `stage_update`/`followup_draft` for existing cards, logs `sales_agent_runs`). Nothing is ever sent automatically; the modal offers "Öppna i Gmail" (web compose URL) and copy. Example data: `scripts/sales-agent-example.json`.

### Rapporter (admin)

`admin/rapporter` tracks and builds the monthly statistics reports for Digital Boost customers. `report_clients` (one row per customer: `report_day`, `status` active/paused, website, notes, and data sources `gsc_site` / `ga4_property_id` / `ads_customer_id`) and `monthly_reports` (one row per client + `period` = first of month: `sent_at`, plus `stats` jsonb + `generated_at` once a report is built). Month navigation via `?m=YYYY-MM`; "Markera skickad" toggles `sent_at` (`setReportSent`). Status (Skickad/Idag/Kommande/Försenad) is derived in `lib/reports.ts`.

**Report generation**: "Skapa rapport" → `generateReport` (`app/actions/reports.ts`) → `collectReportStats` (`lib/report-data.ts`) fetches the last 30 days (ending 3 days ago, Search Console lag) vs the 30 days before via `lib/google.ts`: Search Console clicks/impressions counted `byPage` (matches Site Kit), Google Ads clicks/impressions (v25 REST; most customers' campaigns live in JT Media's shared account 767-093-0819 and are summed by `ads_campaign_match` = text the campaign name contains; Campus Ljungby and PT System have own accounts, match empty = all campaigns; no MCC), GA4 `totalUsers` filtered on the customer's `website` hostname ("Besökare på hemsidan"). Filtering is required: a shared tag sends hits from ~10 customer sites (Wimafritid, Jaliwi, Grimslöv, Pekuma, Perssons, Z-teknik, Hamneda, Garvaren, Molico, lpp, OptiTuning) into several GA4 properties at once, so an unfiltered property shows the sum. Paid/visitors sections are left out when both periods are 0. A failing source is skipped and listed in `stats.errors`. The PDF is rendered on demand by `app/(admin)/admin/rapporter/[id]/pdf/route.ts` with `@react-pdf/renderer` v3 (v4 is ESM-only and breaks with Next 14) from `lib/report-pdf.tsx`; fonts and the JT logo PNG live in `assets/report/` (traced via `outputFileTracingIncludes` in `next.config.mjs`). The modal also shows an e-mail suggestion (`reportEmail` in `lib/reports.ts`) to copy; nothing is sent from the app. Old Adobe Express reports showed GA "Alla besökare" as organic "Klick" (double-counting Ads); the new layout shows real organic clicks plus visitors separately.

**Google login**: one OAuth Desktop client in Cloud project `jt-media-rapporter` (Google Ads API Explorer access; developer tokens are sunset). `npx tsx scripts/google-auth.ts` (needs git-ignored `google-oauth-client.json`) writes `GOOGLE_OAUTH_*` to `.env.local`; `--no-ads` skips the Ads scope, whose consent needs the account's security key. `scripts/google-check.ts` lists reachable properties/accounts, `scripts/report-preview.tsx "<kund>" out.pdf` renders one report locally, `scripts/map-report-sources.ts` holds the initial customer → source mapping. Initial list seeded with `scripts/seed-report-clients.ts`. Migrations `20261008000000_monthly_reports.sql`, `20261008100000_report_sources.sql`, `20261008200000_report_ads_campaigns.sql`.

### SEO-jobbet (`/seo`)

Skill in `.claude/skills/seo/SKILL.md`, run from a local Claude Code session in this repo: `/seo <kund>` or `/seo` (lists customers due within 10 days via `scripts/seo-context.ts --due`). `scripts/seo-context.ts "<kund>"` prints the report client, SSH target (read from the Claude desktop app's `~/Library/Application Support/Claude/ssh_configs.json`; all sites are cPanel accounts on jtmedia-srv01.oderland.com with WP-CLI), the matching Elementor MCP server (by domain in `~/.claude.json`; Rethink's points to staging), earlier logs and Search Console insights. The agent proposes 3–5 actions, waits for Jakob's approval, changes Yoast/alt texts via WP-CLI and content via Elementor MCP, then logs with `scripts/seo-log.ts` into `seo_work_log` (`items` = customer-facing bullets, `details` = technical before/after, `pages` = changed URLs for next month's effect check). The report modal's e-mail suggestion fills "Det här har vi gjort" from the month's log; the e-mail body is editable before copying. Migration `20261008300000_seo_work_log.sql`.
