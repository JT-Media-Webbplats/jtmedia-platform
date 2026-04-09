import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Building2, Users, Receipt, Plug } from 'lucide-react'

export const metadata: Metadata = { title: 'Inställningar' }

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, created_at')
    .order('created_at')

  const admins   = (profiles ?? []).filter((p) => p.role === 'admin')
  const customers = (profiles ?? []).filter((p) => p.role === 'customer')

  const inputCls = 'w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 focus:outline-none transition'
  const labelCls = 'block text-xs font-semibold text-gray-600 mb-1.5'
  const sectionHeader = 'flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-widest mb-5'

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Inställningar</h1>
        <p className="text-gray-500 text-sm mt-1">Företagsinformation och systemkonfiguration</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Company info */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
          <h2 className={sectionHeader}>
            <Building2 className="w-4 h-4 text-gray-400" />
            Företagsinformation
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Företagsnamn</label>
              <input defaultValue="JT Media Sweden AB" className={inputCls} readOnly />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Organisationsnummer</label>
                <input defaultValue="" placeholder="556xxx-xxxx" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Momsregistreringsnummer</label>
                <input defaultValue="" placeholder="SE556xxxxxxxx01" className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Adress</label>
              <input defaultValue="" placeholder="Gatuadress, stad" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>E-post</label>
                <input type="email" defaultValue="" placeholder="info@jtmedia.se" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Telefon</label>
                <input type="tel" defaultValue="" placeholder="+46 xxx xxx xx xx" className={inputCls} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Inställningar kan inte sparas ännu — koppla till databasen i en kommande uppdatering.</p>
          </div>
        </div>

        {/* Billing defaults */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
          <h2 className={sectionHeader}>
            <Receipt className="w-4 h-4 text-gray-400" />
            Faktureringsstandard
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Standardvaluta</label>
              <select className={inputCls} defaultValue="SEK">
                <option value="SEK">SEK — Svensk krona</option>
                <option value="EUR">EUR — Euro</option>
                <option value="USD">USD — US Dollar</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Standard faktureringsdag</label>
              <input type="number" min="1" max="28" defaultValue="1" className={inputCls} />
              <p className="text-xs text-gray-400 mt-1">Dag i månaden (1–28) som används som standard för nya fakturor.</p>
            </div>
            <div>
              <label className={labelCls}>Standardintervall</label>
              <select className={inputCls} defaultValue="monthly">
                <option value="monthly">Månadsvis</option>
                <option value="quarterly">Kvartalsvis</option>
                <option value="yearly">Årsvis</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Betalningsvillkor (dagar)</label>
              <input type="number" min="0" defaultValue="30" className={inputCls} />
            </div>
          </div>
        </div>

        {/* Users */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
          <h2 className={sectionHeader}>
            <Users className="w-4 h-4 text-gray-400" />
            Användarhantering
          </h2>

          {admins.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Admins ({admins.length})</p>
              <div className="divide-y divide-gray-100">
                {admins.map((u) => (
                  <div key={u.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{u.full_name ?? u.email ?? '—'}</p>
                      {u.full_name && <p className="text-xs text-gray-400">{u.email}</p>}
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-green/15 text-brand-green">Admin</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {customers.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Kund-inloggningar ({customers.length})</p>
              <div className="divide-y divide-gray-100">
                {customers.map((u) => (
                  <div key={u.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{u.full_name ?? u.email ?? '—'}</p>
                      {u.full_name && <p className="text-xs text-gray-400">{u.email}</p>}
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">Kund</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!profiles || profiles.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">Inga användare hittades.</p>
          ) : null}

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Lägg till nya användare via{' '}
              <span className="font-medium text-gray-600">Supabase Authentication</span>{' '}
              och tilldela rätt roll i tabellen <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">profiles</code>.
            </p>
          </div>
        </div>

        {/* Fortnox integration */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
          <h2 className={sectionHeader}>
            <Plug className="w-4 h-4 text-gray-400" />
            Fortnox-integration
          </h2>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-yellow-700">Ej konfigurerat</p>
              <p className="text-xs text-yellow-600 mt-0.5">Fortnox API-koppling är inte aktiv. Fyll i uppgifterna nedan när du är redo.</p>
            </div>
            <div>
              <label className={labelCls}>Client ID</label>
              <input type="text" className={inputCls} placeholder="Fortnox Client ID" />
            </div>
            <div>
              <label className={labelCls}>Client Secret</label>
              <input type="password" className={inputCls} placeholder="••••••••••••" />
            </div>
            <div>
              <label className={labelCls}>API-nyckel</label>
              <input type="password" className={inputCls} placeholder="••••••••••••" />
            </div>
            <div>
              <label className={labelCls}>Redirect URI</label>
              <input type="url" className={inputCls} placeholder="https://ditt-domän.se/api/fortnox/callback" />
            </div>
            <button
              type="button"
              disabled
              className="w-full border border-gray-200 text-gray-400 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-not-allowed"
            >
              Anslut till Fortnox (kommer snart)
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
