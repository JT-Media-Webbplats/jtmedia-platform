'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProject(formData: FormData) {
  const supabase = await createClient()

  const payload = {
    customer_id:  formData.get('customer_id') as string,
    name:         formData.get('name') as string,
    description:  (formData.get('description') as string) || null,
    status:       (formData.get('status') as string) || 'active',
    budget_hours: formData.get('budget_hours') ? Number(formData.get('budget_hours')) : null,
    started_at:   (formData.get('started_at') as string) || null,
  }

  if (!payload.customer_id || !payload.name) {
    return { error: 'Kund och projektnamn krävs.' }
  }

  const { error } = await supabase.from('projects').insert(payload)
  if (error) return { error: error.message }

  revalidatePath('/admin/projects')
  return { success: true }
}

export async function updateProjectStatus(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('projects').update({ status }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/projects')
  revalidatePath(`/admin/projects/${id}`)
  return { success: true }
}
