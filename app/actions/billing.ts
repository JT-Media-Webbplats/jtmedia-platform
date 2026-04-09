'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { BillingInterval } from '@/lib/supabase/types'

function advanceDate(dateStr: string, interval: BillingInterval): string {
  const d = new Date(dateStr)
  switch (interval) {
    case 'monthly':     d.setMonth(d.getMonth() + 1); break
    case 'quarterly':   d.setMonth(d.getMonth() + 3); break
    case 'semi-annual': d.setMonth(d.getMonth() + 6); break
    case 'yearly':      d.setFullYear(d.getFullYear() + 1); break
  }
  return d.toISOString().split('T')[0]
}

export async function markAsBilled(scheduleId: string) {
  const supabase = await createClient()

  const { data: schedule, error: fetchErr } = await supabase
    .from('billing_schedules')
    .select('next_billing_date, billing_interval')
    .eq('id', scheduleId)
    .single()

  if (fetchErr || !schedule) return { error: 'Hittades inte.' }

  const today = new Date().toISOString().split('T')[0]
  const nextDate = advanceDate(
    schedule.next_billing_date,
    schedule.billing_interval as BillingInterval
  )

  const { error } = await supabase
    .from('billing_schedules')
    .update({
      last_billed_date:  today,
      next_billing_date: nextDate,
    })
    .eq('id', scheduleId)

  if (error) return { error: error.message }

  revalidatePath('/admin/billing')
  return { success: true }
}

export async function createBillingSchedule(formData: FormData) {
  const supabase = await createClient()

  const payload = {
    customer_id:       formData.get('customer_id') as string,
    amount:            Number(formData.get('amount')),
    currency:          'SEK',
    billing_interval:  formData.get('billing_interval') as string,
    billing_day:       Number(formData.get('billing_day')) || 1,
    next_billing_date: formData.get('next_billing_date') as string,
    notes:             (formData.get('notes') as string) || null,
    is_active:         true,
  }

  if (!payload.customer_id || !payload.amount || !payload.next_billing_date) {
    return { error: 'Kund, belopp och nästa fakturadatum krävs.' }
  }

  const { error } = await supabase.from('billing_schedules').insert(payload)
  if (error) return { error: error.message }

  revalidatePath('/admin/billing')
  revalidatePath(`/admin/customers/${payload.customer_id}`)
  return { success: true }
}

export async function deleteBillingSchedule(id: string, customerId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('billing_schedules').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/billing')
  revalidatePath(`/admin/customers/${customerId}`)
  return { success: true }
}

export async function updateBillingSchedule(id: string, customerId: string, formData: FormData) {
  const supabase = await createClient()

  const payload = {
    notes:             (formData.get('notes') as string) || null,
    amount:            Number(formData.get('amount')),
    billing_interval:  formData.get('billing_interval') as string || 'monthly',
    billing_day:       Number(formData.get('billing_day')) || 1,
    next_billing_date: formData.get('next_billing_date') as string,
    is_active:         formData.get('is_active') === 'true',
  }

  const { error } = await supabase.from('billing_schedules').update(payload).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/billing')
  revalidatePath(`/admin/customers/${customerId}`)
  return { success: true }
}
