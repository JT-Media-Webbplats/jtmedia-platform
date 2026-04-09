import { createClient } from '@/lib/supabase/server'

const stats = [
  {
    label: 'Totalt antal kunder',
    value: '24',
    delta: '+3 denna månad',
    accent: true,
  },
  {
    label: 'Aktiva projekt',
    value: '11',
    delta: '2 avslutas snart',
    accent: false,
  },
  {
    label: 'Fakturering denna månad',
    value: '87 500 kr',
    delta: '4 fakturor kommande',
    accent: false,
  },
]

const recentActivity = [
  { customer: 'Volvo Cars AB', action: 'Ny faktura skickad', time: 'Idag 09:14' },
  { customer: 'Bergström & Co', action: 'Projekt "Rebrand 2025" startat', time: 'Igår 15:40' },
  { customer: 'Nordic Supply AB', action: 'Paket uppgraderat', time: '7 apr' },
  { customer: 'Falkenberg Energi', action: 'Betalning mottagen 12 500 kr', time: '6 apr' },
  { customer: 'Swecon AB', action: 'Nytt projekt tillagt', time: '5 apr' },
]

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Dashboard</h1>
          <p className="text-white/30 text-sm mt-1">
            Inloggad som{' '}
            <span className="text-white/60">{user?.email ?? 'okänd'}</span>
          </p>
        </div>
        <span className="text-xs text-white/20 pt-1">
          {new Date().toLocaleDateString('sv-SE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl p-6 border ${
              stat.accent
                ? 'bg-brand-green border-brand-green'
                : 'bg-white/5 border-white/5'
            }`}
          >
            <p
              className={`text-xs font-semibold uppercase tracking-widest mb-3 ${
                stat.accent ? 'text-black/50' : 'text-white/30'
              }`}
            >
              {stat.label}
            </p>
            <p
              className={`text-4xl font-black mb-2 ${
                stat.accent ? 'text-black' : 'text-white'
              }`}
            >
              {stat.value}
            </p>
            <p
              className={`text-xs ${
                stat.accent ? 'text-black/50' : 'text-white/30'
              }`}
            >
              {stat.delta}
            </p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">
            Senaste aktivitet
          </h2>
          <span className="text-xs text-brand-green font-medium">Live</span>
        </div>
        <div className="divide-y divide-white/5">
          {recentActivity.map((item, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div>
                <p className="text-sm font-semibold text-white">{item.customer}</p>
                <p className="text-xs text-white/40 mt-0.5">{item.action}</p>
              </div>
              <span className="text-xs text-white/25 shrink-0 ml-8">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
