'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitContact(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = (formData.get('phone') as string) || null
  const message = formData.get('message') as string

  if (!name || !email || !message) {
    return { success: false, error: 'Vänligen fyll i alla obligatoriska fält.' }
  }

  if (!email.includes('@')) {
    return { success: false, error: 'Ange en giltig e-postadress.' }
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase.from('contact_submissions').insert({
      name,
      email,
      phone,
      message,
    })

    if (error) {
      console.error('Supabase error:', error)
      return { success: false, error: 'Något gick fel. Försök igen eller kontakta oss direkt.' }
    }

    return { success: true }
  } catch (err) {
    console.error('Contact submission error:', err)
    return { success: false, error: 'Något gick fel. Försök igen eller kontakta oss direkt.' }
  }
}
