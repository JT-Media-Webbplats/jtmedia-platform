import type { Metadata } from 'next'
import { Mail, MapPin, Clock } from 'lucide-react'
import type { ServiceRequest } from '@/lib/supabase/types'
import { contactEmail, requestStatusLabels, requestStatusBadge } from '@/lib/portal'
import { formatDate } from '@/lib/services'
import { getPortalContext } from '../../_lib/context'
import PageHeader from '../../_components/PageHeader'
import NotLinked from '../../_components/NotLinked'
import ContactCard from '../../_components/ContactCard'
import MessageForm from './_components/MessageForm'

export const metadata: Metadata = { title: 'Kontakt' }

export default async function ContactPage() {
  const { supabase, user, customer } = await getPortalContext()
  if (!customer) return <NotLinked email={user.email} />

  const { data: messages } = await supabase
    .from('service_requests')
    .select('*')
    .eq('customer_id', customer.id)
    .eq('kind', 'message')
    .order('created_at', { ascending: false })
    .limit(10)

  const sent = (messages ?? []) as ServiceRequest[]

  return (
    <div className="space-y-12">
      <PageHeader
        title="Kontakt"
        description="Ni pratar alltid direkt med oss som bygger och sköter era tjänster. Ring, mejla eller skicka ett meddelande här."
      />

      <div className="grid lg:grid-cols-5 gap-6 items-start">
        <div className="lg:col-span-3">
          <MessageForm />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <ContactCard heading={false} compact stack />
          <div className="bg-white rounded-2xl border border-black/6 shadow-sm p-5 space-y-3 text-sm">
            <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 text-black/70 hover:text-black transition-colors">
              <Mail className="w-4 h-4 text-brand-green-dark shrink-0" /> {contactEmail}
            </a>
            <p className="flex items-center gap-3 text-black/70">
              <MapPin className="w-4 h-4 text-brand-green-dark shrink-0" /> Stationsgatan 2, 341 60 Ljungby
            </p>
            <p className="flex items-center gap-3 text-black/70">
              <Clock className="w-4 h-4 text-brand-green-dark shrink-0" /> Vi svarar normalt samma arbetsdag
            </p>
          </div>
        </div>
      </div>

      {sent.length > 0 && (
        <section>
          <h2 className="font-playfair font-black text-2xl text-black mb-4">Skickade meddelanden</h2>
          <div className="bg-white rounded-2xl border border-black/6 shadow-sm divide-y divide-black/6">
            {sent.map((m) => (
              <div key={m.id} className="px-5 py-4 flex items-start gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-black text-sm">{m.service_name}</p>
                  {m.message && <p className="text-sm text-black/55 mt-1 whitespace-pre-wrap">{m.message}</p>}
                  <p className="text-xs text-black/40 mt-1">Skickat {formatDate(m.created_at)}</p>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${requestStatusBadge[m.status]}`}>
                  {m.status === 'done' ? 'Besvarat' : requestStatusLabels[m.status]}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
