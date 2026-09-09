'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ProspectStage } from '@/lib/supabase/types'

const STAGES: ProspectStage[] = ['to_contact', 'contacted', 'meeting', 'proposal', 'won', 'lost']

function prospectPayload(formData: FormData) {
  const value = formData.get('estimated_value') as string
  const stage = (formData.get('stage') as string) || 'to_contact'
  return {
    company:         (formData.get('company') as string)?.trim(),
    contact_name:    (formData.get('contact_name') as string)?.trim() || null,
    email:           (formData.get('email') as string)?.trim().toLowerCase() || null,
    phone:           (formData.get('phone') as string)?.trim() || null,
    website:         (formData.get('website') as string)?.trim() || null,
    city:            (formData.get('city') as string)?.trim() || null,
    stage:           STAGES.includes(stage as ProspectStage) ? stage : 'to_contact',
    source:          (formData.get('source') as string) || null,
    interest:        (formData.get('interest') as string)?.trim() || null,
    estimated_value: value ? Number(value) : null,
    notes:           (formData.get('notes') as string)?.trim() || null,
    next_action_at:  (formData.get('next_action_at') as string) || null,
  }
}

function revalidate() {
  revalidatePath('/admin/pipeline')
  revalidatePath('/admin')
}

export async function createProspect(formData: FormData) {
  const supabase = await createClient()
  const payload = prospectPayload(formData)
  if (!payload.company) return { error: 'Företagsnamn krävs.' }

  const { error } = await supabase.from('prospects').insert(payload)
  if (error) return { error: error.message }
  revalidate()
  return { success: true }
}

export async function updateProspect(id: string, formData: FormData) {
  const supabase = await createClient()
  const payload = prospectPayload(formData)
  if (!payload.company) return { error: 'Företagsnamn krävs.' }

  const { error } = await supabase.from('prospects').update(payload).eq('id', id)
  if (error) return { error: error.message }
  revalidate()
  return { success: true }
}

export async function updateProspectStage(id: string, stage: ProspectStage) {
  if (!STAGES.includes(stage)) return { error: 'Ogiltigt steg.' }
  const supabase = await createClient()
  const { error } = await supabase.from('prospects').update({ stage }).eq('id', id)
  if (error) return { error: error.message }
  revalidate()
  return { success: true }
}

export async function deleteProspect(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('prospects').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidate()
  return { success: true }
}

/**
 * Turn a won prospect into a customer row (or link to an existing one with the
 * same e-mail). The prospect is kept in "Vunnen" with a link to the customer.
 */
export async function convertProspectToCustomer(id: string) {
  const supabase = await createClient()
  const { data: prospect, error: readErr } = await supabase.from('prospects').select('*').eq('id', id).single()
  if (readErr || !prospect) return { error: 'Prospektet hittades inte.' }
  if (prospect.customer_id) return { success: true, customerId: prospect.customer_id as string }

  let customerId: string | null = null
  if (prospect.email) {
    const { data: existing } = await supabase.from('customers').select('id').ilike('email', prospect.email).limit(1).maybeSingle()
    if (existing) customerId = existing.id
  }

  if (!customerId) {
    const slug = String(prospect.company).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const { data: created, error: createErr } = await supabase
      .from('customers')
      .insert({
        name: prospect.company,
        company: prospect.company,
        email: prospect.email ?? `noemail-${slug}@import.jtmedia.se`,
        phone: prospect.phone,
        city: prospect.city,
        notes: [prospect.contact_name ? `Kontakt: ${prospect.contact_name}` : null, prospect.notes].filter(Boolean).join('\n') || null,
        status: 'active',
      })
      .select('id')
      .single()
    if (createErr || !created) return { error: createErr?.message ?? 'Kunde inte skapa kund.' }
    customerId = created.id
  }

  const { error } = await supabase.from('prospects').update({ stage: 'won', customer_id: customerId }).eq('id', id)
  if (error) return { error: error.message }

  revalidate()
  revalidatePath('/admin/customers')
  return { success: true, customerId }
}
