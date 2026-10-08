'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { collectReportStats } from '@/lib/report-data'
import type { ReportClient, ReportStats } from '@/lib/supabase/types'

function str(formData: FormData, key: string): string | null {
  const v = formData.get(key)
  if (typeof v !== 'string') return null
  const t = v.trim()
  return t ? t : null
}

function clientPayload(formData: FormData) {
  const day = Number(str(formData, 'report_day'))
  return {
    report_day: Number.isInteger(day) && day >= 1 && day <= 31 ? day : null,
    status:     str(formData, 'status') === 'paused' ? 'paused' : 'active',
    website:    str(formData, 'website'),
    notes:      str(formData, 'notes'),
  }
}

/** Data source fields, only sent from the edit form. */
function sourcePayload(formData: FormData) {
  return {
    gsc_site:        str(formData, 'gsc_site'),
    ga4_property_id: str(formData, 'ga4_property_id')?.replace(/\D/g, '') || null,
    ads_customer_id: str(formData, 'ads_customer_id'),
    ads_campaign_match: str(formData, 'ads_campaign_match'),
  }
}

function revalidate() {
  revalidatePath('/admin/rapporter')
  revalidatePath('/admin')
}

/** Adds a customer to the monthly report list. Creates the customer if only a name is given. */
export async function addReportClient(formData: FormData) {
  const supabase = await createClient()
  let customerId = str(formData, 'customer_id')
  const company = str(formData, 'company')

  if (!customerId) {
    if (!company) return { error: 'Välj en kund eller skriv ett företagsnamn.' }
    const { data: byName } = await supabase.from('customers').select('id').ilike('name', company).limit(1).maybeSingle()
    if (byName) {
      customerId = byName.id
    } else {
      const slug = company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      const { data: created, error } = await supabase
        .from('customers')
        .insert({ name: company, company, email: `noemail-${slug}@import.jtmedia.se`, status: 'active' })
        .select('id')
        .single()
      if (error) return { error: error.message }
      customerId = created.id
    }
  }

  const { error } = await supabase.from('report_clients').insert({ customer_id: customerId, ...clientPayload(formData) })
  if (error) {
    if (error.code === '23505') return { error: 'Kunden finns redan i rapportlistan.' }
    return { error: error.message }
  }

  revalidate()
  revalidatePath('/admin/customers')
  return { success: true }
}

export async function updateReportClient(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('report_clients')
    .update({ ...clientPayload(formData), ...sourcePayload(formData) })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidate()
  return { success: true }
}

/** Removes the customer from the report list (the customer itself is kept). */
export async function deleteReportClient(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('report_clients').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidate()
  return { success: true }
}

/** Marks the report for a client and month ("YYYY-MM-01") as sent, or undoes it. */
export async function setReportSent(reportClientId: string, period: string, sent: boolean) {
  if (!/^\d{4}-\d{2}-01$/.test(period)) return { error: 'Ogiltig månad.' }
  const supabase = await createClient()

  const { error } = sent
    ? await supabase
        .from('monthly_reports')
        .upsert({ report_client_id: reportClientId, period, sent_at: new Date().toISOString() }, { onConflict: 'report_client_id,period' })
    : await supabase
        .from('monthly_reports')
        .update({ sent_at: null })
        .eq('report_client_id', reportClientId)
        .eq('period', period)
  if (error) return { error: error.message }

  revalidate()
  return { success: true }
}

/**
 * Fetches fresh figures from Search Console, Google Ads and Analytics and stores them on
 * the month's report row, so the PDF and the e-mail suggestion can be built from them.
 */
export async function generateReport(reportClientId: string, period: string): Promise<{ stats?: ReportStats; error?: string }> {
  if (!/^\d{4}-\d{2}-01$/.test(period)) return { error: 'Ogiltig månad.' }
  const supabase = await createClient()

  const { data: client, error } = await supabase.from('report_clients').select('*').eq('id', reportClientId).single()
  if (error || !client) return { error: error?.message ?? 'Kunden hittades inte.' }
  if (!client.gsc_site && !client.ga4_property_id && !client.ads_customer_id) {
    return { error: 'Kunden saknar datakällor. Fyll i Search Console, Analytics eller Google Ads under Redigera.' }
  }

  let stats: ReportStats
  try {
    stats = await collectReportStats(client as ReportClient)
  } catch (e) {
    return { error: (e as Error).message }
  }
  if (!stats.organic && !stats.paid && !stats.visitors) {
    return { error: `Kunde inte hämta några siffror (${stats.errors.join(', ')}).` }
  }

  const { error: saveErr } = await supabase
    .from('monthly_reports')
    .upsert(
      { report_client_id: reportClientId, period, stats, generated_at: new Date().toISOString() },
      { onConflict: 'report_client_id,period' },
    )
  if (saveErr) return { error: saveErr.message }

  revalidatePath('/admin/rapporter')
  return { stats }
}
