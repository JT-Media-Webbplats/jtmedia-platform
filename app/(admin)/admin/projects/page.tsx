import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Projekt' }

const projects = [
  {
    name: 'Reklamfilm Q2 2025',
    customer: 'Volvo Cars AB',
    status: 'active',
    hoursLogged: 48,
    hoursTotal: 80,
    updated: '2026-04-08',
  },
  {
    name: 'Social Media Pack April',
    customer: 'Volvo Cars AB',
    status: 'active',
    hoursLogged: 12,
    hoursTotal: 20,
    updated: '2026-04-07',
  },
  {
    name: 'Rebrand 2025',
    customer: 'Bergström & Co',
    status: 'active',
    hoursLogged: 6,
    hoursTotal: 60,
    updated: '2026-04-06',
  },
  {
    name: 'Google Ads Q1',
    customer: 'Nordic Supply AB',
    status: 'completed',
    hoursLogged: 30,
    hoursTotal: 30,
    updated: '2026-03-31',
  },
  {
    name: 'Produktvideo Serie',
    customer: 'Falkenberg Energi',
    status: 'active',
    hoursLogged: 22,
    hoursTotal: 40,
    updated: '2026-04-05',
  },
  {
    name: 'Ny Webbidentitet',
    customer: 'Swecon AB',
    status: 'active',
    hoursLogged: 35,
    hoursTotal: 100,
    updated: '2026-04-04',
  },
  {
    name: 'Höst-kampanj 2024',
    customer: 'Linköpings Bygg',
    status: 'paused',
    hoursLogged: 18,
    hoursTotal: 40,
    updated: '2026-02-14',
  },
  {
    name: 'Årsrapport Film',
    customer: 'Göteborg Stads Fastigheter',
    status: 'completed',
    hoursLogged: 55,
    hoursTotal: 55,
    updated: '2026-03-20',
  },
  {
    name: 'E-handel Content',
    customer: 'Malmö Textil AB',
    status: 'paused',
    hoursLogged: 8,
    hoursTotal: 30,
    updated: '2026-01-30',
  },
]

const statusStyles: Record<string, string> = {
  active: 'bg-brand-green/20 text-brand-green',
  completed: 'bg-blue-400/15 text-blue-400',
  paused: 'bg-yellow-400/15 text-yellow-400',
}

const statusLabels: Record<string, string> = {
  active: 'Aktiv',
  completed: 'Avslutad',
  paused: 'Pausad',
}

function ProgressBar({ logged, total }: { logged: number; total: number }) {
  const pct = Math.round((logged / total) * 100)
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden min-w-[60px]">
        <div
          className="h-full bg-brand-green rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-white/30 shrink-0">
        {logged}/{total}h
      </span>
    </div>
  )
}

export default function ProjectsPage() {
  const activeCount = projects.filter((p) => p.status === 'active').length
  const completedCount = projects.filter((p) => p.status === 'completed').length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Projekt</h1>
          <p className="text-white/30 text-sm mt-1">
            {activeCount} aktiva · {completedCount} avslutade
          </p>
        </div>
        <button className="bg-brand-green text-black text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-brand-green-dark transition-colors">
          + Nytt projekt
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white/30">
                Projekt
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white/30">
                Kund
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white/30">
                Status
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white/30">
                Timmar
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white/30">
                Uppdaterad
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {projects.map((p) => (
              <tr
                key={`${p.name}-${p.customer}`}
                className="hover:bg-white/5 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4">
                  <p className="font-semibold text-white">{p.name}</p>
                </td>
                <td className="px-6 py-4 text-white/50">{p.customer}</td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[p.status]}`}
                  >
                    {statusLabels[p.status]}
                  </span>
                </td>
                <td className="px-6 py-4 min-w-[160px]">
                  <ProgressBar logged={p.hoursLogged} total={p.hoursTotal} />
                </td>
                <td className="px-6 py-4 text-white/30 text-xs">{p.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
