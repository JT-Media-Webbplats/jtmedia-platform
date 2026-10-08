import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { MonthlyReport, ReportClient, SeoWorkLog } from '@/lib/supabase/types'
import { periodFromParam, periodLabel, reportState, shiftPeriod } from '@/lib/reports'
import ReportList from './_components/ReportList'

export const metadata: Metadata = { title: 'Rapporter' }

export default async function ReportsPage({ searchParams }: { searchParams: { m?: string } }) {
  const period = periodFromParam(searchParams.m)
  const currentPeriod = periodFromParam(undefined)
  const supabase = await createClient()

  const [{ data: clients, error }, { data: reports }, { data: customers }, { data: seoLogs }] = await Promise.all([
    supabase.from('report_clients').select('*, customer:customers(id, name)'),
    supabase.from('monthly_reports').select('*').eq('period', period),
    supabase.from('customers').select('id, name').order('name'),
    supabase.from('seo_work_log').select('*').eq('period', period).order('done_at'),
  ])

  const rows = ((clients ?? []) as ReportClient[]).sort(
    (a, b) => (a.report_day ?? 99) - (b.report_day ?? 99) || (a.customer?.name ?? '').localeCompare(b.customer?.name ?? '', 'sv'),
  )
  const reportByClient = Object.fromEntries(((reports ?? []) as MonthlyReport[]).map((r) => [r.report_client_id, r]))
  const seoByClient: Record<string, SeoWorkLog[]> = {}
  for (const log of (seoLogs ?? []) as SeoWorkLog[]) (seoByClient[log.report_client_id] ??= []).push(log)

  const active = rows.filter((c) => c.status === 'active')
  const sent = active.filter((c) => reportByClient[c.id]?.sent_at).length
  const overdue = active.filter((c) => reportState(period, c.report_day, !!reportByClient[c.id]?.sent_at) === 'overdue').length
  const pct = active.length ? Math.round((sent / active.length) * 100) : 0

  const linked = new Set(rows.map((c) => c.customer_id))
  const availableCustomers = (customers ?? []).filter((c) => !linked.has(c.id))

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Rapporter</h1>
        <p className="text-gray-500 text-sm mt-1">
          Kunder med Digital Boost som får en statistikrapport varje månad. Bocka av när rapporten är skickad.
        </p>
      </div>

      {error && (
        <p className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          Rapporttabellerna finns inte ännu. Kör migrationen <code className="font-mono text-xs">20261008000000_monthly_reports.sql</code> i Supabase SQL Editor.
        </p>
      )}

      {/* Month navigation + progress */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl px-6 py-5 mb-6 flex flex-col md:flex-row md:items-center gap-5">
        <div className="flex items-center gap-2">
          <Link href={`/admin/rapporter?m=${shiftPeriod(period, -1)}`} className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors" aria-label="Föregående månad">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <p className="text-lg font-bold text-gray-900 w-40 text-center">{periodLabel(period)}</p>
          <Link href={`/admin/rapporter?m=${shiftPeriod(period, 1)}`} className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors" aria-label="Nästa månad">
            <ChevronRight className="w-4 h-4" />
          </Link>
          {period !== currentPeriod && (
            <Link href="/admin/rapporter" className="ml-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">
              Denna månad
            </Link>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between text-sm mb-2">
            <span className="font-semibold text-gray-900">{sent} av {active.length} skickade</span>
            {overdue > 0 && <span className="text-red-500 font-semibold text-xs">{overdue} försenade</span>}
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full bg-brand-green transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <ReportList period={period} clients={rows} reports={reportByClient} seoLogs={seoByClient} customers={availableCustomers} />
    </div>
  )
}
