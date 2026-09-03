import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Service-role client. Bypasses RLS and can manage auth users.
 * Server-only: never import this from a client component.
 * Requires SUPABASE_SERVICE_ROLE_KEY in the environment.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY saknas i .env.local. Hämta den under Project Settings → API i Supabase.')
  }
  return createSupabaseClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
