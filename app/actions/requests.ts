'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { serviceCatalog } from '@/lib/portal'
import type { ServiceRequestStatus } from '@/lib/supabase/types'

/** Resolve the logged-in customer's profile, or an error message. */
async function requireCustomer() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Du är inte inloggad.' as string }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, customer_id')
    .eq('id', user.id)
    .single()

  if (!profile?.customer_id) return { error: 'Ditt konto är inte kopplat till något kundkonto ännu.' as string }
  return { supabase, profile: { id: profile.id, customerId: profile.customer_id as string } }
}

function revalidatePortal() {
  revalidatePath('/customer')
  revalidatePath('/customer/bestall')
  revalidatePath('/customer/tjanster')
  revalidatePath('/customer/kontakt')
  revalidatePath('/admin/leads')
}

/** A customer asks for one of the services in the catalogue. */
export async function requestService(serviceKey: string, message: string) {
  const guard = await requireCustomer()
  if ('error' in guard) return { success: false, error: guard.error }

  const service = serviceCatalog.find((s) => s.key === serviceKey)
  if (!service) return { success: false, error: 'Okänd tjänst.' }

  // One open request per service at a time.
  const { data: existing } = await guard.supabase
    .from('service_requests')
    .select('id')
    .eq('customer_id', guard.profile.customerId)
    .eq('service_key', serviceKey)
    .in('status', ['new', 'in_progress'])
    .limit(1)

  if (existing && existing.length > 0) {
    return { success: false, error: 'Ni har redan en öppen förfrågan på den här tjänsten. Vi hör av oss inom kort.' }
  }

  const { error } = await guard.supabase.from('service_requests').insert({
    customer_id: guard.profile.customerId,
    profile_id: guard.profile.id,
    kind: 'service',
    service_key: serviceKey,
    service_name: service.name,
    message: message.trim() || null,
  })
  if (error) return { success: false, error: 'Något gick fel. Försök igen eller mejla oss direkt.' }

  revalidatePortal()
  return { success: true }
}

/** Free-text message from the portal (contact page, Search Console request, etc). */
export async function sendPortalMessage(subject: string, message: string, serviceKey: string | null = null) {
  const guard = await requireCustomer()
  if ('error' in guard) return { success: false, error: guard.error }

  const trimmed = message.trim()
  if (!subject.trim()) return { success: false, error: 'Ange ett ämne.' }
  if (trimmed.length < 3) return { success: false, error: 'Skriv ett meddelande.' }

  const { error } = await guard.supabase.from('service_requests').insert({
    customer_id: guard.profile.customerId,
    profile_id: guard.profile.id,
    kind: 'message',
    service_key: serviceKey,
    service_name: subject.trim(),
    message: trimmed,
  })
  if (error) return { success: false, error: 'Något gick fel. Försök igen eller mejla oss direkt.' }

  revalidatePortal()
  return { success: true }
}

/** Admin: move a request between statuses. */
export async function updateRequestStatus(id: string, status: ServiceRequestStatus) {
  const supabase = await createClient()
  const { error } = await supabase.from('service_requests').update({ status }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePortal()
  return { success: true }
}
