'use server'

import { createClient } from '@/lib/supabase/server'

export async function saveSeoLead(email: string, url: string) {
  if (!email || !url) {
    return { success: false, error: 'E-post och URL krävs.' }
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase.from('seo_test_leads').insert({ email, url })

    if (error) {
      console.error('Supabase error:', error)
      return { success: false, error: 'Kunde inte spara, men analysen fortsätter.' }
    }

    return { success: true }
  } catch (err) {
    console.error('SEO lead save error:', err)
    return { success: false, error: 'Kunde inte spara lead.' }
  }
}
