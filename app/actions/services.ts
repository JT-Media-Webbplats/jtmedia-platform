'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function servicePayload(formData: FormData) {
  const interval = (formData.get('billing_interval') as string) || null
  const amountRaw = formData.get('amount') as string
  return {
    name:             (formData.get('name') as string)?.trim(),
    type:             (formData.get('type') as string) || 'other',
    domain:           (formData.get('domain') as string)?.trim() || null,
    description:      (formData.get('description') as string)?.trim() || null,
    status:           (formData.get('status') as string) || 'active',
    billing_interval: interval,
    amount:           amountRaw ? Number(amountRaw) : null,
    started_at:       (formData.get('started_at') as string) || new Date().toISOString().split('T')[0],
    renews_at:        (formData.get('renews_at') as string) || null,
    ended_at:         (formData.get('ended_at') as string) || null,
  }
}

function revalidateCustomer(customerId: string) {
  revalidatePath(`/admin/customers/${customerId}`)
  revalidatePath('/customer')
}

export async function createCustomerService(formData: FormData) {
  const supabase = await createClient()
  const customerId = formData.get('customer_id') as string
  const payload = { customer_id: customerId, ...servicePayload(formData) }

  if (!customerId || !payload.name) return { error: 'Kund och tjänstens namn krävs.' }

  const { error } = await supabase.from('customer_services').insert(payload)
  if (error) return { error: error.message }

  revalidateCustomer(customerId)
  return { success: true }
}

export async function updateCustomerService(id: string, customerId: string, formData: FormData) {
  const supabase = await createClient()
  const payload = servicePayload(formData)
  if (!payload.name) return { error: 'Tjänstens namn krävs.' }

  const { error } = await supabase.from('customer_services').update(payload).eq('id', id)
  if (error) return { error: error.message }

  revalidateCustomer(customerId)
  return { success: true }
}

export async function deleteCustomerService(id: string, customerId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('customer_services').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidateCustomer(customerId)
  return { success: true }
}
