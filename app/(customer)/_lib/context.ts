import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export interface PortalCustomer {
  id: string
  name: string
  company: string | null
  email: string | null
}

/**
 * Shared loader for every customer portal page: the logged-in user, their
 * profile and the customer they belong to (null if not linked yet).
 */
export async function getPortalContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirectTo=/customer')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, role, customer_id')
    .eq('id', user.id)
    .single()

  let customer: PortalCustomer | null = null
  if (profile?.customer_id) {
    const { data } = await supabase
      .from('customers')
      .select('id, name, company, email')
      .eq('id', profile.customer_id)
      .single()
    customer = (data as PortalCustomer | null) ?? null
  }

  const displayName = customer?.company || customer?.name || profile?.full_name || 'kund'
  const firstName = customer?.name?.split(' ')[0] ?? ''

  return { supabase, user, profile, customer, displayName, firstName }
}
