'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTimeEntry(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const payload = {
    project_id:  formData.get('project_id') as string,
    user_id:     user?.id ?? null,
    hours:       Number(formData.get('hours')),
    description: (formData.get('description') as string) || null,
    logged_on:   (formData.get('logged_on') as string) || new Date().toISOString().split('T')[0],
  }

  if (!payload.project_id || !payload.hours || payload.hours <= 0) {
    return { error: 'Projekt och timmar krävs.' }
  }

  const { error } = await supabase.from('time_entries').insert(payload)
  if (error) return { error: error.message }

  revalidatePath('/admin/time')
  revalidatePath('/admin')
  return { success: true }
}

export async function deleteTimeEntry(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('time_entries').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/time')
  return { success: true }
}
