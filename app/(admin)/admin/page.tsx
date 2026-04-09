import { createClient } from '@/lib/supabase/server'
import { Users, FolderKanban, TrendingUp, Clock } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

function startOfMonth() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]
}
function endOfMonth() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0]
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const som = startOfMonth()
  const eom = endOfMonth()

  const [
    { count: customerCount },
    { count: projectCount },
    { data: billingSchedules },
    { data: timeData },
    { data: recentProjects },
    { data: recentCustomers },
    { data: recentTime },
  ] = await Promise.all([
    supabase.from('customers').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('billing_schedules')
      .select('amount, billing_interval')
      .eq('is_active', true),
    supabase.from('time_entries').select('hours').gte('logged_on', som),
    supabase.from('projects')
      .select('id, name, status, created_at, customers(name)')
      .order('created_at', { ascending: false })
      .limit(4),
    supabase.from('customers')
      .select('id, name, email, created_at')
      .order('created_at', { ascending: false })
      .limit(4),
    supabase.from('time_entries')
      .select('id, hours, description, logged_on, projects(name, customers(name))')
      .order('created_at', { ascending: false })
      .limit(4),
  ])

  const totalHours = (timeData ?? []).reduce((s: number, r: { hours: number }) => s + Number(r.hours), 0)

  // MRR: monthly×1, quarterly÷3, semi-annual÷6, yearly÷12
  type RawSchedule = { amount: number | string; billing_interval?: string | null }
  const mrr = (billingSchedules ?? []).reduce((sum: number, s: RawSchedule) => {
    const amt = Number(s.amount)
    switch (s.billing_interval) {
      case 'monthly':       return sum + amt
      case 'quarterly':     return sum + amt / 3
      case 'semi-annual':   return sum + amt / 6
      case 'yearly':        return sum + amt / 12
      default:              return sum + amt
    }
  }, 0)
  const arr = mrr * 12

  const fmtKr = (n: number) => `${Math.round(n).toLocaleString('sv-SE')} kr`

  const stats = [
    { label: 'Aktiva kunder',  value: customerCount ?? 0,           sub: null,         Icon: Users,        accent: false },
    { label: 'Aktiva projekt', value: projectCount  ?? 0,           sub: null,         Icon: FolderKanban, accent: false },
    { label: 'MRR',            value: fmtKr(mrr),                   sub: 'Månadsintäkt', Icon: TrendingUp, accent: true  },
    { label: 'ARR',            value: fmtKr(arr),                   sub: 'Årsintäkt',  Icon: TrendingUp,   accent: false },
    { label: 'Timmar / mån',   value: `${totalHours.toFixed(1)}h`,  sub: null,         Icon: Clock,        accent: false },
  ]

  // Build activity feed
  type FeedItem = { key: string; who: string; what: string; when: string }
  const feed: FeedItem[] = []

  for (const p of recentProjects ?? []) {
    const c = (p.customers as unknown as { name: string } | null)
    feed.push({
      key:  `proj-${p.id}`,
      who:  c?.name ?? '—',
      what: `Nytt projekt: ${p.name}`,
      when: new Date(p.created_at).toLocaleDateString('sv-SE'),
    })
  }
  for (const c of recentCustomers ?? []) {
    feed.push({
      key:  `cust-${c.id}`,
      who:  c.name,
      what: `Ny kund registrerad`,
      when: new Date(c.created_at).toLocaleDateString('sv-SE'),
    })
  }
  for (const t of recentTime ?? []) {
    const proj = (t.projects as unknown as { name: string; customers: { name: string } | null } | null)
    feed.push({
      key:  `time-${t.id}`,
      who:  proj?.customers?.name ?? '—',
      what: `${t.hours}h loggade — ${proj?.name ?? ''}${t.description ? ` (${t.description})` : ''}`,
      when: t.logged_on,
    })
  }
  feed.sort((a, b) => (a.when < b.when ? 1 : -1))

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Inloggad som <span className="text-gray-700">{user?.email}</span>
          </p>
        </div>
        <span className="text-xs text-gray-400 pt-1">
          {new Date().toLocaleDateString('sv-SE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-10">
        {stats.map(({ label, value, sub, Icon, accent }) => (
          <div
            key={label}
            className={`rounded-2xl p-6 border ${
              accent ? 'bg-brand-green border-brand-green' : 'bg-white border-gray-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <p className={`text-xs font-semibold uppercase tracking-widest ${accent ? 'text-black/50' : 'text-gray-500'}`}>
                {label}
              </p>
              <Icon className={`w-4 h-4 ${accent ? 'text-black/40' : 'text-gray-300'}`} />
            </div>
            <p className={`text-3xl font-black ${accent ? 'text-black' : 'text-gray-900'}`}>
              {value}
            </p>
            {sub && <p className={`text-xs mt-1 ${accent ? 'text-black/40' : 'text-gray-400'}`}>{sub}</p>}
          </div>
        ))}
      </div>

      {/* Activity feed */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
            Senaste aktivitet
          </h2>
          <span className="text-xs text-brand-green font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
            Live
          </span>
        </div>

        {feed.length === 0 ? (
          <p className="px-6 py-8 text-gray-400 text-sm text-center">
            Ingen aktivitet ännu. Lägg till kunder och projekt för att komma igång.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {feed.slice(0, 10).map((item) => (
              <div key={item.key} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.who}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.what}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0 ml-8">{item.when}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
