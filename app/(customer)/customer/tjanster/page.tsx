import type { Metadata } from 'next'
import type { CustomerService, ServiceRequest } from '@/lib/supabase/types'
import { recommendServices } from '@/lib/portal'
import { getPortalContext } from '../../_lib/context'
import PageHeader from '../../_components/PageHeader'
import NotLinked from '../../_components/NotLinked'
import ServiceCard from '../../_components/ServiceCard'
import Recommendations from '../../_components/Recommendations'

export const metadata: Metadata = { title: 'Era tjänster' }

export default async function CustomerServicesPage() {
  const { supabase, user, customer } = await getPortalContext()
  if (!customer) return <NotLinked email={user.email} />

  const [{ data: services }, { data: requests }] = await Promise.all([
    supabase.from('customer_services').select('*').eq('customer_id', customer.id).order('status').order('name'),
    supabase.from('service_requests').select('service_key, status').eq('customer_id', customer.id).in('status', ['new', 'in_progress']),
  ])

  const allServices = (services ?? []) as CustomerService[]
  const activeServices = allServices.filter((s) => s.status !== 'ended')
  const endedServices = allServices.filter((s) => s.status === 'ended')

  const recommendations = recommendServices(activeServices.map((s) => ({ type: s.type, name: s.name })))
  const openKeys = new Set(
    ((requests ?? []) as Pick<ServiceRequest, 'service_key' | 'status'>[]).map((r) => r.service_key).filter((k): k is string => Boolean(k)),
  )

  return (
    <div className="space-y-12">
      <PageHeader
        title="Era tjänster"
        description="Allt ni har hos JT Media just nu: vad som ingår, hur det betalas och när det förnyas."
        aside={<span className="text-xs text-black/40 md:pb-2">{activeServices.length} aktiva</span>}
      />

      <section>
        {activeServices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/6 shadow-sm p-10 text-center">
            <p className="text-black/50 text-sm">Inga tjänster är registrerade ännu. Vi fyller på detta inom kort.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {activeServices.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        )}
        {endedServices.length > 0 && (
          <details className="mt-6">
            <summary className="text-xs font-semibold text-black/40 cursor-pointer hover:text-black transition-colors">
              Visa avslutade tjänster ({endedServices.length})
            </summary>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-4">
              {endedServices.map((s) => <ServiceCard key={s.id} service={s} />)}
            </div>
          </details>
        )}
      </section>

      <Recommendations recommendations={recommendations} openKeys={openKeys} />
    </div>
  )
}
