import Link from 'next/link'
import { ArrowRight, Package, Sparkles, MessageCircle, FolderKanban, CalendarClock, Inbox, Globe } from 'lucide-react'
import type { CustomerService, ServiceRequest } from '@/lib/supabase/types'
import { serviceTypeLabels, serviceIntervalLabels, formatDate } from '@/lib/services'
import { requestStatusLabels, requestStatusBadge, recommendServices } from '@/lib/portal'
import { getPortalContext } from '../_lib/context'
import PageHeader from '../_components/PageHeader'
import NotLinked from '../_components/NotLinked'
import ContactCard from '../_components/ContactCard'
import Recommendations from '../_components/Recommendations'
import { serviceTypeIcons } from '../_components/ServiceCard'

const projectStatusBadge: Record<string, string> = {
  active:    'bg-brand-green/20 text-brand-green-dark',
  completed: 'bg-blue-400/15 text-blue-600',
  paused:    'bg-yellow-400/15 text-yellow-700',
  cancelled: 'bg-red-400/15 text-red-500',
}
const projectStatusLabel: Record<string, string> = {
  active: 'Pågående', completed: 'Levererat', paused: 'Pausat', cancelled: 'Avbrutet',
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' }).replace('.', '')
}

const shortcuts = [
  { title: 'Era tjänster', desc: 'Allt ni har hos oss och när det förnyas.', href: '/customer/tjanster', Icon: Package },
  { title: 'Fler tjänster', desc: 'Beställ SEO, Google Ads, sociala medier och mer.', href: '/customer/bestall', Icon: Sparkles },
  { title: 'Kontakt', desc: 'Skicka ett meddelande direkt till oss.', href: '/customer/kontakt', Icon: MessageCircle },
]

export default async function CustomerOverviewPage() {
  const { supabase, user, customer, displayName, firstName } = await getPortalContext()
  if (!customer) return <NotLinked email={user.email} />

  const [{ data: services }, { data: projects }, { data: requests }] = await Promise.all([
    supabase.from('customer_services').select('*').eq('customer_id', customer.id).order('status').order('name'),
    supabase.from('projects').select('id, name, description, status, started_at, ended_at').eq('customer_id', customer.id).order('updated_at', { ascending: false }).limit(4),
    supabase.from('service_requests').select('*').eq('customer_id', customer.id).order('created_at', { ascending: false }),
  ])

  const allServices = (services ?? []) as CustomerService[]
  const activeServices = allServices.filter((s) => s.status !== 'ended')
  const domains = activeServices.filter((s) => s.domain)
  const upcoming = activeServices
    .filter((s) => s.renews_at)
    .sort((a, b) => (a.renews_at! < b.renews_at! ? -1 : 1))
  const nextRenewal = upcoming[0]
  const allRequests = (requests ?? []) as ServiceRequest[]
  const openRequests = allRequests.filter((r) => r.status === 'new' || r.status === 'in_progress')
  const openKeys = new Set(openRequests.map((r) => r.service_key).filter((k): k is string => Boolean(k)))
  const recommendations = recommendServices(activeServices.map((s) => ({ type: s.type, name: s.name })), 2)

  const stats = [
    { label: 'Aktiva tjänster', value: String(activeServices.length), sub: null, Icon: Package, accent: true },
    { label: 'Domäner', value: String(domains.length), sub: domains[0]?.domain ?? null, Icon: Globe, accent: false },
    { label: 'Nästa förnyelse', value: nextRenewal ? shortDate(nextRenewal.renews_at!) : 'Inga', sub: nextRenewal?.name ?? null, Icon: CalendarClock, accent: false },
    { label: 'Öppna ärenden', value: String(openRequests.length), sub: openRequests[0]?.service_name ?? 'Inga just nu', Icon: Inbox, accent: false },
  ]

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow={`Hej ${firstName}`}
        title={displayName}
        description="Här har ni koll på allt ni har hos JT Media, kan beställa mer och når oss direkt."
        aside={
          <span className="text-xs text-black/40 md:pb-2">
            {new Date().toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, Icon, accent }) => (
          <div
            key={label}
            className={`rounded-2xl border p-5 ${accent ? 'bg-brand-green border-brand-green' : 'bg-white border-black/6 shadow-sm'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <p className={`text-[11px] font-bold uppercase tracking-widest ${accent ? 'text-black/60' : 'text-black/40'}`}>{label}</p>
              <Icon className={`w-4 h-4 ${accent ? 'text-black/50' : 'text-black/25'}`} />
            </div>
            <p className="font-black text-2xl text-black leading-none truncate">{value}</p>
            {sub && <p className={`text-xs mt-2 truncate ${accent ? 'text-black/55' : 'text-black/40'}`}>{sub}</p>}
          </div>
        ))}
      </div>

      {/* Upcoming renewals */}
      {upcoming.length > 0 && (
        <section className="bg-black text-white rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-green">Kommande förnyelser</p>
            <Link href="/customer/tjanster" className="text-xs text-white/50 hover:text-white transition-colors">Alla tjänster</Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {upcoming.slice(0, 3).map((s) => (
              <div key={s.id} className="bg-white/8 border border-white/10 rounded-2xl p-4">
                <p className="text-sm font-semibold truncate">{s.name}</p>
                <p className="text-xs text-white/50 mt-0.5">
                  {serviceTypeLabels[s.type]}{s.billing_interval ? ` · ${serviceIntervalLabels[s.billing_interval]}` : ''}
                </p>
                <p className="text-sm font-bold text-brand-green mt-3">{formatDate(s.renews_at)}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/40 mt-4">Förnyelser sker automatiskt. Vill ni ändra något, hör av er innan förnyelsedatumet.</p>
        </section>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Services, compact */}
        <section className="lg:col-span-3">
          <div className="flex items-end justify-between mb-4">
            <h2 className="font-playfair font-black text-2xl text-black">Era tjänster</h2>
            <Link href="/customer/tjanster" className="text-xs font-semibold text-brand-green-dark hover:text-black transition-colors inline-flex items-center gap-1">
              Visa alla <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="bg-white rounded-2xl border border-black/6 shadow-sm divide-y divide-black/6">
            {activeServices.length === 0 ? (
              <p className="p-8 text-center text-sm text-black/50">Inga tjänster är registrerade ännu. Vi fyller på detta inom kort.</p>
            ) : (
              activeServices.slice(0, 5).map((s) => {
                const Icon = serviceTypeIcons[s.type] ?? Package
                return (
                  <div key={s.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-green/15 flex items-center justify-center shrink-0">
                      <Icon className="w-[18px] h-[18px] text-brand-green-dark" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-black text-sm truncate">{s.name}</p>
                      <p className="text-xs text-black/45 truncate">
                        {serviceTypeLabels[s.type]}{s.domain ? ` · ${s.domain}` : ''}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      {s.billing_interval && (
                        <p className="text-xs font-semibold text-black/60">{serviceIntervalLabels[s.billing_interval]}</p>
                      )}
                      {s.renews_at && <p className="text-[11px] text-black/40">Förnyas {formatDate(s.renews_at)}</p>}
                    </div>
                  </div>
                )
              })
            )}
            {activeServices.length > 5 && (
              <Link href="/customer/tjanster" className="block px-5 py-3 text-xs font-semibold text-black/50 hover:text-black transition-colors">
                + {activeServices.length - 5} till
              </Link>
            )}
          </div>
        </section>

        {/* Shortcuts */}
        <section className="lg:col-span-2">
          <h2 className="font-playfair font-black text-2xl text-black mb-4">Snabbt till</h2>
          <div className="grid gap-3">
            {shortcuts.map(({ title, desc, href, Icon }) => (
              <Link
                key={href}
                href={href}
                className="group bg-white rounded-2xl border border-black/6 shadow-sm p-4 flex items-center gap-4 hover:border-brand-green hover:shadow-[0_8px_24px_rgba(168,213,112,0.2)] transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-black/5 group-hover:bg-brand-green flex items-center justify-center shrink-0 transition-colors">
                  <Icon className="w-[18px] h-[18px] text-black/60 group-hover:text-black transition-colors" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-black text-sm">{title}</p>
                  <p className="text-xs text-black/45">{desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-black/25 group-hover:text-black transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      <Recommendations recommendations={recommendations} openKeys={openKeys} compact />

      {/* Open requests */}
      {openRequests.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-4">
            <h2 className="font-playfair font-black text-2xl text-black">Era ärenden</h2>
            <span className="text-xs text-black/40">{openRequests.length} öppna</span>
          </div>
          <div className="bg-white rounded-2xl border border-black/6 shadow-sm divide-y divide-black/6">
            {openRequests.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center gap-4 px-5 py-4">
                <div className="w-10 h-10 rounded-xl bg-brand-green/15 flex items-center justify-center shrink-0">
                  <Inbox className="w-[18px] h-[18px] text-brand-green-dark" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-black text-sm truncate">{r.service_name}</p>
                  <p className="text-xs text-black/45">Skickad {formatDate(r.created_at)}</p>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${requestStatusBadge[r.status]}`}>
                  {requestStatusLabels[r.status]}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {(projects ?? []).length > 0 && (
        <section>
          <h2 className="font-playfair font-black text-2xl text-black mb-4">Projekt</h2>
          <div className="bg-white rounded-2xl border border-black/6 shadow-sm divide-y divide-black/6">
            {projects!.map((p) => (
              <div key={p.id} className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-green/15 flex items-center justify-center shrink-0">
                  <FolderKanban className="w-5 h-5 text-brand-green-dark" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-semibold text-black">{p.name}</p>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${projectStatusBadge[p.status] ?? projectStatusBadge.active}`}>
                      {projectStatusLabel[p.status] ?? p.status}
                    </span>
                  </div>
                  {p.description && <p className="text-sm text-black/55 mt-1">{p.description}</p>}
                  {(p.started_at || p.ended_at) && (
                    <p className="text-xs text-black/40 mt-2">
                      {p.started_at && `Startat ${formatDate(p.started_at)}`}
                      {p.started_at && p.ended_at && ' · '}
                      {p.ended_at && `Klart ${formatDate(p.ended_at)}`}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <ContactCard />
    </div>
  )
}
