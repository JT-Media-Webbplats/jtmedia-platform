import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Clock, Trash2 } from 'lucide-react'
import TimeEntryForm from './_components/TimeEntryForm'
import { deleteTimeEntry } from '@/app/actions/time'

export const metadata: Metadata = { title: 'Tidrapportering' }

function getWeekRange() {
  const now = new Date()
  const day = now.getDay() || 7
  const mon = new Date(now)
  mon.setDate(now.getDate() - day + 1)
  mon.setHours(0, 0, 0, 0)
  const sun = new Date(mon)
  sun.setDate(mon.getDate() + 6)
  return {
    start: mon.toISOString().split('T')[0],
    end:   sun.toISOString().split('T')[0],
  }
}

function getMonthRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const end   = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
  return { start, end }
}

export default async function TimePage() {
  const supabase = await createClient()
  const week  = getWeekRange()
  const month = getMonthRange()

  const [
    { data: customers },
    { data: projects },
    { data: entries },
    { data: weekEntries },
    { data: monthEntries },
  ] = await Promise.all([
    supabase.from('customers').select('id, name').eq('status', 'active').order('name'),
    supabase.from('projects').select('id, name, customer_id').eq('status', 'active').order('name'),
    supabase
      .from('time_entries')
      .select('*, projects(name, customers(id, name))')
      .order('logged_on', { ascending: false })
      .limit(50),
    supabase
      .from('time_entries')
      .select('hours')
      .gte('logged_on', week.start)
      .lte('logged_on', week.end),
    supabase
      .from('time_entries')
      .select('hours')
      .gte('logged_on', month.start)
      .lte('logged_on', month.end),
  ])

  const hoursThisWeek  = (weekEntries  ?? []).reduce((s, e) => s + Number(e.hours), 0)
  const hoursThisMonth = (monthEntries ?? []).reduce((s, e) => s + Number(e.hours), 0)

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Tidrapportering</h1>
        <p className="text-white/30 text-sm mt-1">{(entries ?? []).length} poster senaste 50</p>
      </div>

      {/* Summary */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white/4 border border-white/6 rounded-2xl p-5">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Denna vecka</p>
          <p className="text-3xl font-black text-white">{hoursThisWeek.toFixed(1)}h</p>
          <p className="text-xs text-white/25 mt-1">{week.start} — {week.end}</p>
        </div>
        <div className="bg-brand-green/12 border border-brand-green/20 rounded-2xl p-5">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Denna månad</p>
          <p className="text-3xl font-black text-brand-green">{hoursThisMonth.toFixed(1)}h</p>
          <p className="text-xs text-white/25 mt-1">{month.start} — {month.end}</p>
        </div>
      </div>

      {/* Quick entry form */}
      <div className="bg-white/4 border border-white/6 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-5">
          <Clock className="w-4 h-4 text-white/30" />
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">Logga tid</h2>
        </div>
        <TimeEntryForm customers={customers ?? []} projects={projects ?? []} />
      </div>

      {/* Recent entries */}
      <div className="bg-white/4 border border-white/6 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/6">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">Senaste poster</h2>
        </div>

        {!entries || entries.length === 0 ? (
          <p className="px-6 py-8 text-white/30 text-sm text-center">Inga tidsloggningar ännu.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Datum', 'Projekt', 'Kund', 'Timmar', 'Beskrivning', ''].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white/25">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {entries.map((e) => {
                const project  = e.projects as { name: string; customers: { id: string; name: string } | null } | null
                const customer = project?.customers ?? null
                return (
                  <tr key={e.id} className="hover:bg-white/4 transition-colors group">
                    <td className="px-6 py-3 text-white/50 text-xs whitespace-nowrap">{e.logged_on}</td>
                    <td className="px-6 py-3 font-medium text-white/80">
                      {project?.name ?? '—'}
                    </td>
                    <td className="px-6 py-3 text-white/40 text-xs">
                      {customer ? (
                        <Link href={`/admin/customers/${customer.id}`} className="hover:text-brand-green transition-colors">
                          {customer.name}
                        </Link>
                      ) : '—'}
                    </td>
                    <td className="px-6 py-3">
                      <span className="font-bold text-white">{Number(e.hours).toFixed(1)}h</span>
                    </td>
                    <td className="px-6 py-3 text-white/40 max-w-[200px] truncate">{e.description ?? '—'}</td>
                    <td className="px-6 py-3">
                      <form action={async () => { 'use server'; await deleteTimeEntry(e.id) }}>
                        <button
                          type="submit"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-white/25 hover:text-red-400"
                          title="Ta bort"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
