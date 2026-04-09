#!/usr/bin/env npx tsx
/**
 * JT Media — Deduplicate customers
 *
 * Finds customers with duplicate names (case-insensitive).
 * For each duplicate group:
 *   - Keeps the record with the most non-null fields (most complete data)
 *   - Reassigns billing_schedules and projects from duplicates to the keeper
 *   - Deletes the duplicate rows
 *
 * Run: npx tsx scripts/dedup-customers.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

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

const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

/** Count non-null / non-empty fields as a measure of record completeness */
function completeness(row: Record<string, unknown>): number {
  return Object.values(row).filter((v) => v !== null && v !== undefined && v !== '').length
}

async function main() {
  console.log('═══════════════════════════════════════════════')
  console.log('  JT Media — Customer Deduplication')
  console.log('═══════════════════════════════════════════════\n')

  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at')

  if (error) {
    console.error('❌  Failed to fetch customers:', error.message)
    process.exit(1)
  }

  // Group by lowercased name
  const byName = new Map<string, typeof customers>()
  for (const c of customers ?? []) {
    const key = (c.name as string).trim().toLowerCase()
    if (!byName.has(key)) byName.set(key, [])
    byName.get(key)!.push(c)
  }

  const duplicateGroups = Array.from(byName.entries()).filter(([, group]) => group.length > 1)

  if (duplicateGroups.length === 0) {
    console.log('✅  No duplicate customers found.\n')
    return
  }

  console.log(`Found ${duplicateGroups.length} duplicate group(s):\n`)

  let merged = 0
  let deleted = 0

  for (const [name, group] of duplicateGroups) {
    console.log(`  ── "${name}" (${group.length} records) ──`)
    group.forEach((c) => {
      console.log(`     [${c.id}] created ${c.created_at} — completeness: ${completeness(c as Record<string, unknown>)}`)
    })

    // Pick the most complete record as keeper
    const sorted = [...group].sort(
      (a, b) => completeness(b as Record<string, unknown>) - completeness(a as Record<string, unknown>)
    )
    const keeper = sorted[0]
    const duplicates = sorted.slice(1)

    console.log(`     → Keeping: ${keeper.id}`)

    for (const dup of duplicates) {
      console.log(`     → Merging ${dup.id} into keeper…`)

      // Reassign billing_schedules
      const { data: bData, error: bErr } = await supabase
        .from('billing_schedules')
        .update({ customer_id: keeper.id })
        .eq('customer_id', dup.id)
        .select('id')

      if (bErr) {
        console.error(`       ✗  billing_schedules reassign failed: ${bErr.message}`)
      } else {
        if (bData?.length) console.log(`       ✓  Reassigned ${bData.length} billing schedule(s)`)
      }

      // Reassign projects
      const { data: pData, error: pErr } = await supabase
        .from('projects')
        .update({ customer_id: keeper.id })
        .eq('customer_id', dup.id)
        .select('id')

      if (pErr) {
        console.error(`       ✗  projects reassign failed: ${pErr.message}`)
      } else {
        if (pData?.length) console.log(`       ✓  Reassigned ${pData.length} project(s)`)
      }

      // Delete duplicate
      const { error: dErr } = await supabase
        .from('customers')
        .delete()
        .eq('id', dup.id)

      if (dErr) {
        console.error(`       ✗  Delete failed: ${dErr.message}`)
      } else {
        console.log(`       ✓  Deleted duplicate ${dup.id}`)
        deleted++
      }
    }

    merged++
    console.log()
  }

  console.log(`✅  Done. Merged ${merged} group(s), deleted ${deleted} duplicate(s).\n`)
}

main().catch((err) => {
  console.error('\n❌  Unexpected error:', err)
  process.exit(1)
})
