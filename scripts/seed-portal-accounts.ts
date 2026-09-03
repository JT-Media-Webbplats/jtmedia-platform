#!/usr/bin/env npx tsx
/**
 * JT Media — Seed portal accounts
 *
 * Creates (or updates) the first logins for the platform:
 *   1. An admin login for JT Media (info@jtmediasweden.com)
 *   2. A customer login for Hårds Transport (johan@hardstransport.se),
 *      linked to the "Hårds Transport" customer row (created if missing)
 *      and seeded with their known services if they have none yet.
 *
 * Safe to run more than once: existing users get their password reset
 * and their profile re-linked, nothing is duplicated.
 *
 * Prerequisites:
 *   1. Run supabase/migrations/20260903000000_customer_services_and_portal.sql
 *      in the Supabase SQL Editor.
 *   2. Add SUPABASE_SERVICE_ROLE_KEY to .env.local
 *      → Supabase dashboard → Project Settings → API → service_role key
 *   3. Run: npx tsx scripts/seed-portal-accounts.ts
 *
 * Override the default passwords with env vars if you like:
 *   SEED_ADMIN_PASSWORD=... SEED_CUSTOMER_PASSWORD=... npx tsx scripts/seed-portal-accounts.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// ─── Load .env.local ─────────────────────────────────────────────────────────
function loadEnvFile(file: string) {
  const full = path.resolve(process.cwd(), file)
  if (!fs.existsSync(full)) return
  for (const line of fs.readFileSync(full, 'utf-8').split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/)
    if (!m) continue
    if (!process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
  }
}
loadEnvFile('.env.local')

const SUPABASE_URL         = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('\n❌  Missing env vars. Add to .env.local:')
  if (!SUPABASE_URL)         console.error('   NEXT_PUBLIC_SUPABASE_URL=...')
  if (!SUPABASE_SERVICE_KEY) console.error('   SUPABASE_SERVICE_ROLE_KEY=...')
  console.error('\n   Get the service role key from:')
  console.error('   Supabase dashboard → Project Settings → API → service_role\n')
  process.exit(1)
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ─── Accounts to create ──────────────────────────────────────────────────────
interface SeedService {
  name: string
  type: string
  domain?: string
  description?: string
  billing_interval: 'monthly' | 'quarterly' | 'semi-annual' | 'yearly' | 'one_time'
  amount: number
  renews_at?: string
}

interface SeedAccount {
  email: string
  password: string
  full_name: string
  role: 'admin' | 'customer'
  /** Only for customers: which customers row to link to (matched by name, then e-mail). */
  customer?: {
    name: string
    company?: string
    services: SeedService[]
  }
}

const thisYear = new Date().getFullYear()

const ACCOUNTS: SeedAccount[] = [
  {
    email:     'info@jtmediasweden.com',
    password:  process.env.SEED_ADMIN_PASSWORD ?? 'JTMedia2026!',
    full_name: 'Jakob Jolheden',
    role:      'admin',
  },
  {
    email:     'johan@hardstransport.se',
    password:  process.env.SEED_CUSTOMER_PASSWORD ?? 'Hards2026!',
    full_name: 'Johan',
    role:      'customer',
    customer: {
      name:    'Hårds Transport',
      company: 'Hårds Transport',
      // Taken from the billing schedules we imported earlier. Adjust in /admin if anything is off.
      services: [
        {
          name: 'Digital Boost',
          type: 'other',
          description: 'Löpande digital närvaro och stöd.',
          billing_interval: 'monthly',
          amount: 0,
        },
        {
          name: 'LinkedIn Management',
          type: 'social',
          description: 'Vi sköter företagets LinkedIn: inlägg, planering och uppföljning.',
          billing_interval: 'monthly',
          amount: 1009.99,
        },
        {
          name: 'Domän',
          type: 'domain',
          domain: 'hardstransport.se',
          description: 'Registrering och årlig förnyelse av domänen.',
          billing_interval: 'yearly',
          amount: 0,
          renews_at: `${thisYear + 1}-09-04`,
        },
      ],
    },
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function findAuthUserByEmail(email: string) {
  let page = 1
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const hit = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
    if (hit) return hit
    if (data.users.length < 200) return null
    page++
  }
}

async function ensureAuthUser(acc: SeedAccount): Promise<string> {
  const existing = await findAuthUserByEmail(acc.email)
  if (existing) {
    const { error } = await admin.auth.admin.updateUserById(existing.id, {
      password: acc.password,
      email_confirm: true,
      user_metadata: { full_name: acc.full_name },
    })
    if (error) throw error
    console.log(`   ↻ Login finns redan, lösenordet är uppdaterat: ${acc.email}`)
    return existing.id
  }

  const { data, error } = await admin.auth.admin.createUser({
    email: acc.email,
    password: acc.password,
    email_confirm: true,
    user_metadata: { full_name: acc.full_name },
  })
  if (error) throw error
  console.log(`   ✓ Login skapad: ${acc.email}`)
  return data.user.id
}

async function ensureCustomer(acc: SeedAccount): Promise<string> {
  const c = acc.customer!

  // 1. Match by name (the import script created customers by name)
  const { data: byName } = await admin
    .from('customers')
    .select('id, email')
    .ilike('name', c.name)
    .limit(1)
    .maybeSingle()

  if (byName) {
    // Replace a placeholder e-mail from the import with the real one
    if (!byName.email || byName.email.endsWith('@import.jtmedia.se')) {
      await admin.from('customers').update({ email: acc.email }).eq('id', byName.id)
    }
    console.log(`   ↻ Kund finns redan: ${c.name}`)
    return byName.id
  }

  // 2. Match by e-mail
  const { data: byEmail } = await admin
    .from('customers')
    .select('id')
    .ilike('email', acc.email)
    .limit(1)
    .maybeSingle()
  if (byEmail) {
    console.log(`   ↻ Kund finns redan (via e-post): ${acc.email}`)
    return byEmail.id
  }

  // 3. Create
  const { data, error } = await admin
    .from('customers')
    .insert({ name: c.name, company: c.company ?? null, email: acc.email, status: 'active' })
    .select('id')
    .single()
  if (error) throw error
  console.log(`   ✓ Kund skapad: ${c.name}`)
  return data.id
}

async function ensureServices(customerId: string, services: SeedService[]) {
  const { count } = await admin
    .from('customer_services')
    .select('id', { count: 'exact', head: true })
    .eq('customer_id', customerId)

  if ((count ?? 0) > 0) {
    console.log(`   ↻ Kunden har redan ${count} tjänster, hoppar över seed av tjänster`)
    return
  }

  const rows = services.map((s) => ({
    customer_id: customerId,
    name: s.name,
    type: s.type,
    domain: s.domain ?? null,
    description: s.description ?? null,
    status: 'active',
    billing_interval: s.billing_interval,
    amount: s.amount,
    renews_at: s.renews_at ?? null,
  }))
  const { error } = await admin.from('customer_services').insert(rows)
  if (error) throw error
  console.log(`   ✓ ${rows.length} tjänster tillagda`)
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🔐  Seedar portalkonton\n')
  const summary: { role: string; email: string; password: string; url: string }[] = []

  for (const acc of ACCOUNTS) {
    console.log(`▶ ${acc.role === 'admin' ? 'Admin' : 'Kund'}: ${acc.email}`)

    const userId = await ensureAuthUser(acc)
    const customerId = acc.role === 'customer' ? await ensureCustomer(acc) : null

    // The handle_new_user trigger creates the profile; make sure role + link are right.
    const { error: profileErr } = await admin.from('profiles').upsert({
      id: userId,
      email: acc.email,
      full_name: acc.full_name,
      role: acc.role,
      customer_id: customerId,
    })
    if (profileErr) throw profileErr

    if (acc.customer && customerId) await ensureServices(customerId, acc.customer.services)

    summary.push({
      role: acc.role === 'admin' ? 'Admin' : 'Kund',
      email: acc.email,
      password: acc.password,
      url: acc.role === 'admin' ? '/admin' : '/customer',
    })
    console.log()
  }

  console.log('✅  Klart. Inloggningsuppgifter (logga in på /login):\n')
  for (const s of summary) {
    console.log(`   ${s.role.padEnd(6)} ${s.email}`)
    console.log(`          Lösenord: ${s.password}`)
    console.log(`          Landar på: ${s.url}\n`)
  }
}

main().catch((err) => {
  console.error('\n❌  Fel:', err?.message ?? err)
  process.exit(1)
})
