'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { OpportunityKind, OpportunityStage, OpportunityValueType } from '@/lib/supabase/types'

const STAGES: OpportunityStage[] = ['identified', 'to_contact', 'contacted', 'dialog', 'proposal', 'won', 'lost']
const KINDS: OpportunityKind[] = ['upsell', 'new', 'reactivation']

function str(formData: FormData, key: string): string | null {
  const v = formData.get(key)
  if (typeof v !== 'string') return null
  const t = v.trim()
  return t ? t : null
}

function opportunityPayload(formData: FormData) {
  const stageRaw = str(formData, 'stage') ?? 'identified'
  const stage = (STAGES.includes(stageRaw as OpportunityStage) ? stageRaw : 'identified') as OpportunityStage
  const kind = str(formData, 'kind') ?? 'upsell'
  const priority = Number(str(formData, 'priority') ?? 2)
  const value = str(formData, 'estimated_value')
  const serviceKey = str(formData, 'service_key')
  const valueType = str(formData, 'value_type')
  return {
    company:         str(formData, 'company'),
    contact_name:    str(formData, 'contact_name'),
    email:           str(formData, 'email')?.toLowerCase() ?? null,
    phone:           str(formData, 'phone'),
    website:         str(formData, 'website'),
    city:            str(formData, 'city'),
    customer_id:     str(formData, 'customer_id'),
    kind:            KINDS.includes(kind as OpportunityKind) ? kind : 'upsell',
    service_key:     serviceKey,
    service_name:    serviceKey === 'other' || !serviceKey ? str(formData, 'service_name') : null,
    stage,
    priority:        [1, 2, 3].includes(priority) ? priority : 2,
    lead_source:     str(formData, 'lead_source'),
    summary:         str(formData, 'summary'),
    evidence:        str(formData, 'evidence'),
    gmail_thread_id: str(formData, 'gmail_thread_id'),
    draft_subject:   str(formData, 'draft_subject'),
    draft_body:      str(formData, 'draft_body'),
    estimated_value: value ? Number(value) : null,
    value_type:      (valueType === 'one_time' ? 'one_time' : 'recurring') as OpportunityValueType,
    notes:           str(formData, 'notes'),
  }
}

function revalidate() {
  revalidatePath('/admin/salj')
  revalidatePath('/admin')
}

export async function createOpportunity(formData: FormData) {
  const supabase = await createClient()
  const payload = opportunityPayload(formData)
  if (!payload.company) return { error: 'Företagsnamn krävs.' }

  const { error } = await supabase.from('sales_opportunities').insert({ ...payload, source: 'manual' })
  if (error) return { error: error.message }
  revalidate()
  return { success: true }
}

export async function updateOpportunity(id: string, formData: FormData) {
  const supabase = await createClient()
  const payload = opportunityPayload(formData)
  if (!payload.company) return { error: 'Företagsnamn krävs.' }

  const { error } = await supabase.from('sales_opportunities').update(payload).eq('id', id)
  if (error) return { error: error.message }
  revalidate()
  return { success: true }
}

export async function updateOpportunityStage(id: string, stage: OpportunityStage) {
  if (!STAGES.includes(stage)) return { error: 'Ogiltigt steg.' }
  const supabase = await createClient()

  const { data: current } = await supabase
    .from('sales_opportunities')
    .select('sent_at, replied_at')
    .eq('id', id)
    .single()

  // stage_changed_at is set by a database trigger when the stage changes.
  const now = new Date().toISOString()
  const patch: Record<string, unknown> = { stage }
  if (stage === 'contacted' && !current?.sent_at) patch.sent_at = now
  if (stage === 'dialog' && !current?.replied_at) patch.replied_at = now

  const { error } = await supabase.from('sales_opportunities').update(patch).eq('id', id)
  if (error) return { error: error.message }
  revalidate()
  return { success: true }
}

export async function deleteOpportunity(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('sales_opportunities').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidate()
  return { success: true }
}

/**
 * A won opportunity becomes a customer (created, or matched on e-mail / name)
 * and a project in "Väntar på godkännande" so delivery can start in Pipeline.
 */
export async function convertOpportunityToCustomer(id: string) {
  const supabase = await createClient()
  const { data: opp, error: readErr } = await supabase.from('sales_opportunities').select('*').eq('id', id).single()
  if (readErr || !opp) return { error: 'Möjligheten hittades inte.' }

  let customerId: string | null = opp.customer_id ?? null

  if (!customerId && opp.email) {
    const { data: byEmail } = await supabase.from('customers').select('id').ilike('email', opp.email).limit(1).maybeSingle()
    if (byEmail) customerId = byEmail.id
  }
  if (!customerId) {
    const { data: byName } = await supabase.from('customers').select('id').ilike('name', opp.company).limit(1).maybeSingle()
    if (byName) customerId = byName.id
  }
  if (!customerId) {
    const slug = String(opp.company).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const { data: created, error: createErr } = await supabase
      .from('customers')
      .insert({
        name: opp.company,
        company: opp.company,
        email: opp.email ?? `noemail-${slug}@import.jtmedia.se`,
        phone: opp.phone,
        city: opp.city,
        notes: [opp.contact_name ? `Kontakt: ${opp.contact_name}` : null, opp.notes].filter(Boolean).join('\n') || null,
        status: 'active',
      })
      .select('id')
      .single()
    if (createErr || !created) return { error: createErr?.message ?? 'Kunde inte skapa kund.' }
    customerId = created.id
  }

  const projectName = opp.service_name ?? opp.service_key ?? 'Nytt uppdrag'
  const { error: projErr } = await supabase.from('projects').insert({
    customer_id: customerId,
    name: `${projectName.charAt(0).toUpperCase()}${projectName.slice(1)}`,
    description: opp.summary,
    status: 'pending',
  })
  if (projErr) return { error: projErr.message }

  const { error } = await supabase
    .from('sales_opportunities')
    .update({ stage: 'won', customer_id: customerId })
    .eq('id', id)
  if (error) return { error: error.message }

  revalidate()
  revalidatePath('/admin/pipeline')
  revalidatePath('/admin/customers')
  revalidatePath('/admin/projects')
  return { success: true, customerId }
}
