import type { Metadata } from 'next'
import { Check, ExternalLink } from 'lucide-react'
import type { CustomerService, ServiceRequest } from '@/lib/supabase/types'
import { serviceCatalog, requestStatusLabels, requestStatusBadge, ownsCatalogService } from '@/lib/portal'
import { formatDate } from '@/lib/services'
import { getPortalContext } from '../../_lib/context'
import PageHeader from '../../_components/PageHeader'
import NotLinked from '../../_components/NotLinked'
import ContactCard from '../../_components/ContactCard'
import RequestServiceButton from './_components/RequestServiceButton'

export const metadata: Metadata = { title: 'Fler tjänster' }

export default async function MoreServicesPage() {
  const { supabase, user, customer } = await getPortalContext()
  if (!customer) return <NotLinked email={user.email} />

  const [{ data: services }, { data: requests }] = await Promise.all([
    supabase.from('customer_services').select('name, type, status').eq('customer_id', customer.id).neq('status', 'ended'),
    supabase.from('service_requests').select('*').eq('customer_id', customer.id).eq('kind', 'service').order('created_at', { ascending: false }),
  ])

  const active = (services ?? []) as Pick<CustomerService, 'name' | 'type' | 'status'>[]
  const allRequests = (requests ?? []) as ServiceRequest[]
  const openByKey = new Map<string, ServiceRequest>()
  for (const r of allRequests) {
    if ((r.status === 'new' || r.status === 'in_progress') && r.service_key && !openByKey.has(r.service_key)) {
      openByKey.set(r.service_key, r)
    }
  }

  return (
    <div className="space-y-12">
      <PageHeader
        title="Fler tjänster"
        description="Allt vi kan hjälpa er med. Klicka på Skicka förfrågan så hör vi av oss inom en arbetsdag med ett förslag och en offert. Inga bindningar."
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {serviceCatalog.map((item) => {
          const owned = ownsCatalogService(item, active)
          const open = openByKey.get(item.key)
          return (
            <div
              key={item.key}
              className={`bg-white rounded-2xl border shadow-sm p-6 flex flex-col ${owned ? 'border-brand-green/60' : 'border-black/6'}`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-black/35">{item.tagline}</p>
                {owned && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-green/20 text-brand-green-dark shrink-0">
                    <Check className="w-3 h-3" /> Ni har denna
                  </span>
                )}
                {!owned && open && (
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${requestStatusBadge[open.status]}`}>
                    Förfrågan {requestStatusLabels[open.status].toLowerCase()}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-black text-xl leading-tight mb-2">{item.name}</h3>
              <p className="text-sm text-black/55 leading-relaxed">{item.description}</p>
              <ul className="mt-4 space-y-1.5">
                {item.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-black/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-black/6 flex items-center justify-between gap-3">
                <RequestServiceButton
                  serviceKey={item.key}
                  serviceName={item.name}
                  owned={owned}
                  hasOpenRequest={Boolean(open)}
                />
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-black/40 hover:text-black transition-colors"
                >
                  Läs mer <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )
        })}
      </div>

      {allRequests.length > 0 && (
        <section>
          <h2 className="font-playfair font-black text-2xl text-black mb-4">Era förfrågningar</h2>
          <div className="bg-white rounded-2xl border border-black/6 shadow-sm divide-y divide-black/6">
            {allRequests.map((r) => (
              <div key={r.id} className="px-5 py-4 flex items-start gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-black text-sm">{r.service_name}</p>
                  {r.message && <p className="text-sm text-black/55 mt-1 whitespace-pre-wrap">{r.message}</p>}
                  <p className="text-xs text-black/40 mt-1">Skickad {formatDate(r.created_at)}</p>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${requestStatusBadge[r.status]}`}>
                  {requestStatusLabels[r.status]}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <ContactCard />
    </div>
  )
}
