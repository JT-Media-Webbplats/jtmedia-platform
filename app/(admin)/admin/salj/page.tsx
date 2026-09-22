import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import type { SalesAgentRun, SalesOpportunity } from '@/lib/supabase/types'
import SalesBoard from './_components/SalesBoard'
import AgentPanel from './_components/AgentPanel'

export const metadata: Metadata = { title: 'Sälj' }

export default async function SalesPage() {
  const supabase = await createClient()

  const [{ data: opportunities, error }, { data: runs }, { data: customers }] = await Promise.all([
    supabase
      .from('sales_opportunities')
      .select('*, customer:customers(id, name)')
      .order('updated_at', { ascending: false }),
    supabase.from('sales_agent_runs').select('*').order('ran_at', { ascending: false }).limit(5),
    supabase.from('customers').select('id, name').eq('status', 'active').order('name'),
  ])

  const rows = (opportunities ?? []) as SalesOpportunity[]

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Sälj</h1>
        <p className="text-gray-500 text-sm mt-1">
          Säljagenten läser mejlen, hittar var det finns mer att sälja och skriver ett första utkast. Du granskar, justerar och skickar.
        </p>
      </div>

      {error && (
        <p className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          Säljtabellerna finns inte ännu. Kör migrationen <code className="font-mono text-xs">20260922000000_sales_machine.sql</code> i Supabase SQL Editor.
        </p>
      )}

      <AgentPanel runs={(runs ?? []) as SalesAgentRun[]} opportunities={rows} />

      <SalesBoard opportunities={rows} customers={customers ?? []} />
    </div>
  )
}
