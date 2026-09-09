import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ExternalLink } from 'lucide-react'
import type { ServiceRequest } from '@/lib/supabase/types'
import RequestStatusSelect from './_components/RequestStatusSelect'

export const metadata: Metadata = { title: 'Leads' }

interface SeoLead {
  id: string
  email: string
  url: string
  created_at: string
}

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  created_at: string
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function LeadsPage() {
  const supabase = await createClient()

  const [requestRes, seoRes, contactRes] = await Promise.all([
    supabase
      .from('service_requests')
      .select('*, customer:customers(id, name)')
      .order('created_at', { ascending: false }),
    supabase
      .from('seo_test_leads')
      .select('*')
      .order('created_at', { ascending: false }),
    supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false }),
  ])

  const seoLeads = (seoRes.data ?? []) as SeoLead[]
  const contactSubmissions = (contactRes.data ?? []) as ContactSubmission[]
  const portalRequests = (requestRes.data ?? []) as ServiceRequest[]
  const openRequests = portalRequests.filter((r) => r.status === 'new' || r.status === 'in_progress').length

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Leads</h1>
        <p className="text-gray-500 text-sm mt-1">
          Inkomna förfrågningar från kundportalen och sajten
        </p>
      </div>

      {/* Requests from the customer portal */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Från kundportalen</h2>
            <p className="text-gray-500 text-xs mt-0.5">
              Tjänsteförfrågningar och meddelanden från inloggade kunder
            </p>
          </div>
          <span className="text-sm text-gray-400">{openRequests} öppna av {portalRequests.length}</span>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
          {portalRequests.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-gray-400 text-sm">Inga förfrågningar från kundportalen ännu.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    {['Kund', 'Ärende', 'Meddelande', 'Status', 'Inkom'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-600"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {portalRequests.map((r) => (
                    <tr key={r.id} className={`transition-colors align-top ${r.status === 'done' || r.status === 'declined' ? 'opacity-60' : 'hover:bg-gray-50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {r.customer ? (
                          <Link href={`/admin/customers/${r.customer.id}`} className="font-semibold text-gray-900 hover:text-brand-green transition-colors">
                            {r.customer.name}
                          </Link>
                        ) : (
                          <span className="text-gray-400">Okänd kund</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-medium text-gray-900">{r.service_name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{r.kind === 'service' ? 'Tjänsteförfrågan' : 'Meddelande'}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-700 max-w-xl">
                        {r.message ? <p className="whitespace-pre-wrap">{r.message}</p> : <span className="text-gray-300">–</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <RequestStatusSelect id={r.id} status={r.status} />
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs whitespace-nowrap">
                        {formatDate(r.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* SEO-test leads */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">SEO-test leads</h2>
            <p className="text-gray-500 text-xs mt-0.5">
              Besökare som testat sin hemsida via SEO-verktyget
            </p>
          </div>
          <span className="text-sm text-gray-400">{seoLeads.length} totalt</span>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
          {seoLeads.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-gray-400 text-sm">Inga SEO-test leads ännu.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    {['E-post', 'Hemsida', 'Inkom'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-600"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {seoLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <a
                          href={`mailto:${lead.email}`}
                          className="font-semibold text-gray-900 hover:text-brand-green transition-colors"
                        >
                          {lead.email}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={lead.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-gray-700 hover:text-brand-green transition-colors"
                        >
                          {lead.url}
                          <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                        </a>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {formatDate(lead.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Kontaktförfrågningar */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Kontaktförfrågningar</h2>
            <p className="text-gray-500 text-xs mt-0.5">
              Meddelanden via kontaktformuläret
            </p>
          </div>
          <span className="text-sm text-gray-400">
            {contactSubmissions.length} totalt
          </span>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
          {contactSubmissions.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-gray-400 text-sm">Inga kontaktförfrågningar ännu.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    {['Namn', 'Kontakt', 'Meddelande', 'Inkom'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-600"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {contactSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors align-top">
                      <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                        {sub.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`mailto:${sub.email}`}
                          className="text-gray-700 hover:text-brand-green transition-colors block"
                        >
                          {sub.email}
                        </a>
                        {sub.phone && (
                          <a
                            href={`tel:${sub.phone}`}
                            className="text-gray-400 text-xs mt-0.5 hover:text-gray-600 transition-colors block"
                          >
                            {sub.phone}
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-700 max-w-xl">
                        <p className="whitespace-pre-wrap">{sub.message}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs whitespace-nowrap">
                        {formatDate(sub.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
