'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCustomer(formData: FormData) {
  const supabase = await createClient()

  const payload = {
    name:       formData.get('name') as string,
    email:      formData.get('email') as string,
    phone:      (formData.get('phone') as string) || null,
    company:    (formData.get('company') as string) || null,
    org_number: (formData.get('org_number') as string) || null,
    address:    (formData.get('address') as string) || null,
    notes:      (formData.get('notes') as string) || null,
    status:     'active' as const,
  }

  if (!payload.name || !payload.email) {
    return { error: 'Namn och e-post krävs.' }
  }

  const { error } = await supabase.from('customers').insert(payload)
  if (error) return { error: error.message }

  revalidatePath('/admin/customers')
  return { success: true }
}

export async function updateCustomerStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('customers').update({ status }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/customers')
  revalidatePath(`/admin/customers/${id}`)
  return { success: true }
}

export async function updateCustomer(id: string, formData: FormData) {
  const supabase = await createClient()

  const payload: Record<string, unknown> = {
    name:       formData.get('name') as string,
    email:      formData.get('email') as string,
    phone:      (formData.get('phone') as string) || null,
    org_number: (formData.get('org_number') as string) || null,
    address:    (formData.get('address') as string) || null,
    postal_code:(formData.get('postal_code') as string) || null,
    city:       (formData.get('city') as string) || null,
    notes:      (formData.get('notes') as string) || null,
    status:     (formData.get('status') as string) || 'active',
  }

  if (!payload.name) return { error: 'Namn krävs.' }

  const { error } = await supabase.from('customers').update(payload).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/customers')
  revalidatePath(`/admin/customers/${id}`)
  return { success: true }
}

export async function deleteCustomer(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('customers').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/customers')
  return { success: true }
}
