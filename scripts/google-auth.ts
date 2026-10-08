/**
 * One-time Google login for the report automation (Search Console, Analytics, Google Ads).
 *
 *   npx tsx scripts/google-auth.ts           # Search Console + Analytics + Google Ads
 *   npx tsx scripts/google-auth.ts --no-ads  # without Google Ads (its consent needs a security key)
 *
 * Reads the OAuth Desktop client from google-oauth-client.json (git-ignored), opens the
 * browser for consent, and writes GOOGLE_OAUTH_CLIENT_ID / _CLIENT_SECRET / _REFRESH_TOKEN
 * to .env.local. Re-run it if the login ever stops working.
 */
import { createServer } from 'node:http'
import { execFile } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import type { AddressInfo } from 'node:net'

const SCOPES = [
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/analytics.readonly',
  ...(process.argv.includes('--no-ads') ? [] : ['https://www.googleapis.com/auth/adwords']),
]

const raw = JSON.parse(readFileSync('google-oauth-client.json', 'utf8'))
const { client_id, client_secret } = raw.installed ?? raw.web

function setEnv(file: string, values: Record<string, string>) {
  let text = existsSync(file) ? readFileSync(file, 'utf8') : ''
  for (const [key, value] of Object.entries(values)) {
    const line = `${key}=${value}`
    const re = new RegExp(`^${key}=.*$`, 'm')
    text = re.test(text) ? text.replace(re, line) : `${text.replace(/\n?$/, '\n')}${line}\n`
  }
  writeFileSync(file, text)
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost')
  const code = url.searchParams.get('code')
  const err = url.searchParams.get('error')
  if (!code && !err) {
    res.writeHead(404).end()
    return
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  if (err) {
    res.end(`<p>Inloggningen avbröts: ${err}</p>`)
    console.error(`✗ Inloggningen avbröts: ${err}`)
    server.close()
    process.exit(1)
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ code: code!, client_id, client_secret, redirect_uri: redirectUri, grant_type: 'authorization_code' }),
  })
  const tokens = await tokenRes.json()
  if (!tokens.refresh_token) {
    res.end('<p>Något gick fel, se terminalen.</p>')
    console.error('✗ Fick ingen refresh token:', tokens)
    server.close()
    process.exit(1)
  }

  setEnv('.env.local', {
    GOOGLE_OAUTH_CLIENT_ID: client_id,
    GOOGLE_OAUTH_CLIENT_SECRET: client_secret,
    GOOGLE_OAUTH_REFRESH_TOKEN: tokens.refresh_token,
  })
  res.end('<p style="font-family:sans-serif">Klart! Du kan stänga fliken och gå tillbaka till Claude.</p>')
  console.log('✓ Inloggad. Nycklarna är sparade i .env.local')
  server.close()
  process.exit(0)
})

let redirectUri = ''
server.listen(0, '127.0.0.1', () => {
  const { port } = server.address() as AddressInfo
  redirectUri = `http://127.0.0.1:${port}`
  const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
    client_id,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent select_account',
  })
  console.log('Öppnar webbläsaren för inloggning. Om inget händer, öppna länken själv:\n')
  console.log(authUrl + '\n')
  execFile('open', [authUrl])
})

setTimeout(() => {
  console.error('✗ Ingen inloggning inom 10 minuter, avbryter.')
  process.exit(1)
}, 10 * 60 * 1000)
