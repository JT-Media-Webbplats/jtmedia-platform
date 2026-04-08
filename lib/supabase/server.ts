import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Derive the setAll parameter type directly from createServerClient's signature
// so it stays in sync automatically as @supabase/ssr updates.
type SetAllCookies = NonNullable<
  NonNullable<Parameters<typeof createServerClient>[2]['cookies']>['setAll']
>
type CookiesToSet = Parameters<SetAllCookies>[0]

/**
 * Server-side Supabase client.
 * Use in Server Components, Route Handlers, and Server Actions.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: CookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from a Server Component — cookies are read-only.
            // Middleware handles session refresh, so this is safe to ignore.
          }
        },
      },
    }
  )
}
