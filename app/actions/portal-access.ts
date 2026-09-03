'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

/** Only admins may manage customer logins. Returns the admin client or an error. */
async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Inte inloggad.' as string }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Endast administratörer kan hantera inloggningar.' as string }

  try {
    return { admin: createAdminClient() }
  } catch (e) {
    return { error: (e as Error).message }
  }
}

function revalidateCustomer(customerId: string) {
  revalidatePath(`/admin/customers/${customerId}`)
  revalidatePath('/admin/customers')
  revalidatePath('/customer')
}

function validatePassword(password: string) {
  if (!password || password.length < 8) return 'Lösenordet måste vara minst 8 tecken.'
  return null
}

/**
 * Create a customer login (e-mail + password) and link it to the customer.
 * The e-mail is confirmed immediately so the customer can log in right away.
 */
export async function createPortalLogin(customerId: string, formData: FormData) {
  const guard = await requireAdmin()
  if ('error' in guard) return { error: guard.error }
  const admin = guard.admin!

  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = (formData.get('password') as string) ?? ''
  const fullName = (formData.get('full_name') as string)?.trim() || null

  if (!email) return { error: 'E-postadress krävs.' }
  const pwError = validatePassword(password)
  if (pwError) return { error: pwError }

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  })
  if (createErr) {
    if (/already|registered|exists/i.test(createErr.message)) {
      return { error: 'Det finns redan ett konto med den e-postadressen. Använd "Nytt lösenord" istället.' }
    }
    return { error: createErr.message }
  }

  // The handle_new_user trigger creates the profile; make sure it points at this customer.
  const { error: profileErr } = await admin
    .from('profiles')
    .upsert({ id: created.user.id, email, full_name: fullName, role: 'customer', customer_id: customerId })
  if (profileErr) return { error: profileErr.message }

  revalidateCustomer(customerId)
  return { success: true }
}

/** Set a new password for an existing customer login. */
export async function resetPortalPassword(profileId: string, customerId: string, password: string) {
  const guard = await requireAdmin()
  if ('error' in guard) return { error: guard.error }
  const pwError = validatePassword(password)
  if (pwError) return { error: pwError }

  const { error } = await guard.admin!.auth.admin.updateUserById(profileId, { password })
  if (error) return { error: error.message }

  revalidateCustomer(customerId)
  return { success: true }
}

/** Delete a customer login completely (auth user + profile via cascade). */
export async function deletePortalLogin(profileId: string, customerId: string) {
  const guard = await requireAdmin()
  if ('error' in guard) return { error: guard.error }

  const { error } = await guard.admin!.auth.admin.deleteUser(profileId)
  if (error) return { error: error.message }

  revalidateCustomer(customerId)
  return { success: true }
}
