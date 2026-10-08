/**
 * Lists what the saved Google login can read: Search Console properties
 * and (when the Ads scope is granted) the Google Ads accounts.
 *
 *   npx tsx scripts/google-check.ts
 */
import { readFileSync } from 'node:fs'
for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
}

async function main() {
  const { listSearchConsoleSites, listAdsAccounts } = await import('../lib/google')
  const sites = await listSearchConsoleSites()
  console.log(`Search Console (${sites.length}):`)
  for (const s of sites.sort()) console.log('  ' + s)

  try {
    const accounts = await listAdsAccounts()
    console.log(`\nGoogle Ads (${accounts.length}):`)
    for (const a of accounts) console.log(`  ${a.id}  ${a.name}`)
  } catch (e) {
    console.log(`\nGoogle Ads: ${(e as Error).message}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
