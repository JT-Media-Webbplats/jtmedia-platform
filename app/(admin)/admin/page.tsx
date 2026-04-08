import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
      <p className="text-gray-400 text-sm mb-8">
        Inloggad som{' '}
        <span className="text-gray-200">{user?.email ?? 'okänd'}</span>
      </p>

      <div className="grid sm:grid-cols-3 gap-6">
        {[
          { label: 'Aktiva kunder', value: '—' },
          { label: 'Pågående projekt', value: '—' },
          { label: 'Öppna ärenden', value: '—' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
          >
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
              {stat.label}
            </p>
            <p className="text-4xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
