import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Kunder' }

const customers = [
  {
    name: 'Volvo Cars AB',
    email: 'kontakt@volvocars.se',
    phone: '031-59 00 00',
    packages: ['Videoproduktion', 'Digital strategi'],
    nextBilling: '2026-04-15',
    status: 'active',
  },
  {
    name: 'Bergström & Co',
    email: 'info@bergstrom.se',
    phone: '08-123 456 78',
    packages: ['Varumärkesutveckling'],
    nextBilling: '2026-04-20',
    status: 'active',
  },
  {
    name: 'Nordic Supply AB',
    email: 'hello@nordicsupply.se',
    phone: '040-22 33 44',
    packages: ['Digital strategi'],
    nextBilling: '2026-04-30',
    status: 'active',
  },
  {
    name: 'Falkenberg Energi',
    email: 'media@falkenbergenergi.se',
    phone: '0346-88 60 00',
    packages: ['Videoproduktion'],
    nextBilling: '2026-05-01',
    status: 'active',
  },
  {
    name: 'Swecon AB',
    email: 'marknad@swecon.se',
    phone: '08-555 000 10',
    packages: ['Varumärkesutveckling', 'Videoproduktion'],
    nextBilling: '2026-05-05',
    status: 'active',
  },
  {
    name: 'Linköpings Bygg',
    email: 'info@lkpgbygg.se',
    phone: '013-33 44 55',
    packages: ['Digital strategi'],
    nextBilling: '2026-05-10',
    status: 'paused',
  },
  {
    name: 'Göteborg Stads Fastigheter',
    email: 'kommunikation@gsf.goteborg.se',
    phone: '031-700 00 00',
    packages: ['Varumärkesutveckling', 'Digital strategi'],
    nextBilling: '2026-05-12',
    status: 'active',
  },
  {
    name: 'Malmö Textil AB',
    email: 'pr@malmotextil.se',
    phone: '040-77 88 99',
    packages: ['Videoproduktion'],
    nextBilling: '—',
    status: 'inactive',
  },
]

const statusStyles: Record<string, string> = {
  active: 'bg-brand-green/20 text-brand-green',
  paused: 'bg-yellow-400/15 text-yellow-400',
  inactive: 'bg-white/10 text-white/30',
}

const statusLabels: Record<string, string> = {
  active: 'Aktiv',
  paused: 'Pausad',
  inactive: 'Inaktiv',
}

export default function CustomersPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Kunder</h1>
          <p className="text-white/30 text-sm mt-1">{customers.length} kunder totalt</p>
        </div>
        <button className="bg-brand-green text-black text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-brand-green-dark transition-colors">
          + Ny kund
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white/30">
                Namn
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white/30">
                Kontakt
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white/30">
                Aktiva paket
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white/30">
                Nästa faktura
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white/30">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {customers.map((c) => (
              <tr
                key={c.name}
                className="hover:bg-white/5 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4">
                  <p className="font-semibold text-white">{c.name}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-white/70">{c.email}</p>
                  <p className="text-white/30 text-xs mt-0.5">{c.phone}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {c.packages.map((pkg) => (
                      <span
                        key={pkg}
                        className="text-xs bg-white/10 text-white/60 px-2.5 py-1 rounded-full"
                      >
                        {pkg}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-white/50">{c.nextBilling}</td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[c.status]}`}
                  >
                    {statusLabels[c.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
