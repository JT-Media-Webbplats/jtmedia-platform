import Image from 'next/image'
import {
  Globe, Server, Link as LinkIcon, Mail, Wrench, Search, Sparkles, Target, Share2, Bot, Palette, Package,
  CalendarClock, FolderKanban, Receipt, type LucideIcon,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { CustomerService, ServiceType } from '@/lib/supabase/types'
import { serviceTypeLabels, serviceIntervalLabels, serviceStatusLabels, formatDate, formatAmount, yearlyCost, monthlyCost, intervalShortLabels } from '@/lib/services'

const typeIcons: Record<ServiceType, LucideIcon> = {
  website: Globe, hosting: Server, domain: LinkIcon, email: Mail, maintenance: Wrench,
  seo: Search, geo: Sparkles, google_ads: Target, social: Share2, ai: Bot, design: Palette, other: Package,
}

const statusBadge: Record<string, string> = {
  active:    'bg-brand-green/20 text-brand-green-dark',
  paused:    'bg-yellow-400/15 text-yellow-700',
  ended:     'bg-black/5 text-black/40',
  completed: 'bg-blue-400/15 text-blue-600',
  cancelled: 'bg-red-400/15 text-red-500',
}
const projectStatusLabel: Record<string, string> = {
  active: 'Pågående', completed: 'Levererat', paused: 'Pausat', cancelled: 'Avbrutet',
}

const team = [
  { name: 'Theo Brandt', role: 'Grundare & Webb', phone: '076-768 02 02', tel: '+46767680202', img: '/images/team/theo.webp' },
  { name: 'Jakob Jolheden', role: 'Grundare & Digital strategi', phone: '073-698 01 31', tel: '+46736980131', img: '/images/team/jakob.webp' },
]

function ContactCard() {
  return (
    <section>
      <h2 className="font-playfair font-black text-2xl text-black mb-4">Din kontakt hos oss</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {team.map((person) => (
          <div key={person.name} className="bg-white rounded-2xl border border-black/6 shadow-sm p-5 flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
              <Image src={person.img} alt={person.name} fill sizes="56px" className="object-cover" />
            </div>
            <div>
              <p className="font-semibold text-black text-sm">{person.name}</p>
              <p className="text-black/45 text-xs mb-1.5">{person.role}</p>
              <a href={`tel:${person.tel}`} className="text-black/60 text-sm hover:text-black transition-colors">
                {person.phone}
              </a>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-black/40 mt-4">
        Saknas något, eller vill du beställa en ny tjänst? Mejla{' '}
        <a href="mailto:info@jtmediasweden.com" className="underline hover:text-black">info@jtmediasweden.com</a>{' '}
        så återkommer vi samma dag.
      </p>
    </section>
  )
}

function ServiceCard({ service }: { service: CustomerService }) {
  const Icon = typeIcons[service.type] ?? Package
  const ended = service.status === 'ended'
  return (
    <div className={`bg-white rounded-2xl border border-black/6 shadow-sm p-6 flex flex-col ${ended ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-brand-green/15 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-brand-green-dark" />
        </div>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusBadge[service.status]}`}>
          {serviceStatusLabels[service.status]}
        </span>
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-black/35 mb-1">
        {serviceTypeLabels[service.type]}
      </p>
      <h3 className="font-bold text-black text-lg leading-tight mb-1">{service.name}</h3>
      {service.domain && (
        <a
          href={`https://${service.domain.replace(/^https?:\/\//, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-brand-green-dark font-medium hover:underline break-all"
        >
          {service.domain}
        </a>
      )}
      {service.description && (
        <p className="text-sm text-black/55 leading-relaxed mt-2">{service.description}</p>
      )}
      <dl className="mt-5 pt-4 border-t border-black/6 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
        {service.billing_interval && (
          <div>
            <dt className="text-black/40 mb-0.5">Betalning</dt>
            <dd className="font-semibold text-black">{serviceIntervalLabels[service.billing_interval]}</dd>
          </div>
        )}
        {service.amount != null && Number(service.amount) > 0 && (
          <div>
            <dt className="text-black/40 mb-0.5">Pris</dt>
            <dd className="font-semibold text-black">
              {formatAmount(service.amount)}
              {service.billing_interval && service.billing_interval !== 'one_time' && (
                <span className="text-black/40 font-normal"> /{intervalShortLabels[service.billing_interval]}</span>
              )}
            </dd>
          </div>
        )}
        <div>
          <dt className="text-black/40 mb-0.5">Sedan</dt>
          <dd className="font-semibold text-black">{formatDate(service.started_at)}</dd>
        </div>
        {service.renews_at && !ended && (
          <div className="col-span-2 flex items-center gap-1.5 bg-[#F8F8F8] rounded-lg px-3 py-2">
            <CalendarClock className="w-3.5 h-3.5 text-brand-green-dark shrink-0" />
            <span className="text-black/60">Förnyas</span>
            <span className="font-semibold text-black">{formatDate(service.renews_at)}</span>
          </div>
        )}
        {ended && service.ended_at && (
          <div>
            <dt className="text-black/40 mb-0.5">Avslutad</dt>
            <dd className="font-semibold text-black">{formatDate(service.ended_at)}</dd>
          </div>
        )}
      </dl>
    </div>
  )
}

export default async function CustomerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, customer_id')
    .eq('id', user!.id)
    .single()

  if (!profile?.customer_id) {
    return (
      <div className="max-w-2xl">
        <h1 className="font-playfair font-black text-3xl md:text-4xl text-black mb-3">Välkommen!</h1>
        <p className="text-black/55 leading-relaxed mb-8">
          Ditt konto <span className="font-semibold text-black">{user?.email}</span> är ännu inte kopplat till
          något kundkonto hos JT Media. Det brukar bero på att du loggat in med en annan e-postadress än den vi
          har registrerad. Hör av dig så kopplar vi ihop det på en gång.
        </p>
        <ContactCard />
      </div>
    )
  }

  const [{ data: customer }, { data: services }, { data: projects }] = await Promise.all([
    supabase.from('customers').select('name, company, email').eq('id', profile.customer_id).single(),
    supabase.from('customer_services').select('*').eq('customer_id', profile.customer_id).order('status').order('name'),
    supabase.from('projects').select('id, name, description, status, started_at, ended_at').eq('customer_id', profile.customer_id).order('updated_at', { ascending: false }),
  ])

  const allServices = (services ?? []) as CustomerService[]
  const activeServices = allServices.filter((s) => s.status !== 'ended')
  const endedServices = allServices.filter((s) => s.status === 'ended')
  const domains = activeServices.filter((s) => s.domain)
  const upcoming = activeServices
    .filter((s) => s.renews_at)
    .sort((a, b) => (a.renews_at! < b.renews_at! ? -1 : 1))
    .slice(0, 3)

  const paidServices = activeServices.filter((s) => s.amount != null && Number(s.amount) > 0 && s.billing_interval && s.billing_interval !== 'one_time')
  const totalPerYear = paidServices.reduce((sum, s) => sum + yearlyCost(s), 0)
  const totalPerMonth = paidServices.reduce((sum, s) => sum + monthlyCost(s), 0)

  const displayName = customer?.company || customer?.name || profile.full_name || 'kund'

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="font-bakerie text-brand-green-dark text-base mb-2 tracking-wide">Hej {customer?.name?.split(' ')[0] ?? ''}</p>
          <h1 className="font-playfair font-black text-3xl md:text-4xl text-black">{displayName}</h1>
          <p className="text-black/50 text-sm mt-2">
            Här ser du alla tjänster ni har hos JT Media, när de förnyas och vem ni kontaktar.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Aktiva tjänster', value: activeServices.length },
            { label: 'Domäner', value: domains.length },
            { label: 'Projekt', value: (projects ?? []).length },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-black/6 shadow-sm px-4 py-3 text-center min-w-[96px]">
              <div className="font-black text-2xl text-black">{stat.value}</div>
              <div className="text-[11px] text-black/45">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming renewals */}
      {upcoming.length > 0 && (
        <section className="bg-black text-white rounded-3xl p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-green mb-4">Kommande förnyelser</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {upcoming.map((s) => (
              <div key={s.id} className="bg-white/8 border border-white/10 rounded-2xl p-4">
                <p className="text-sm font-semibold truncate">{s.name}</p>
                <p className="text-xs text-white/50 mt-0.5">{serviceTypeLabels[s.type]}{s.billing_interval ? ` · ${serviceIntervalLabels[s.billing_interval]}` : ''}</p>
                <p className="text-sm font-bold text-brand-green mt-3">{formatDate(s.renews_at)}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/40 mt-4">Förnyelser sker automatiskt. Vill ni ändra något, hör av er innan förnyelsedatumet.</p>
        </section>
      )}

      {/* Services */}
      <section>
        <div className="flex items-end justify-between mb-5">
          <h2 className="font-playfair font-black text-2xl text-black">Era tjänster</h2>
          <span className="text-xs text-black/40">{activeServices.length} aktiva</span>
        </div>
        {activeServices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/6 shadow-sm p-10 text-center">
            <p className="text-black/50 text-sm">Inga tjänster är registrerade ännu. Vi fyller på detta inom kort.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeServices.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        )}
        {endedServices.length > 0 && (
          <details className="mt-6">
            <summary className="text-xs font-semibold text-black/40 cursor-pointer hover:text-black transition-colors">
              Visa avslutade tjänster ({endedServices.length})
            </summary>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
              {endedServices.map((s) => <ServiceCard key={s.id} service={s} />)}
            </div>
          </details>
        )}
      </section>

      {/* Cost overview */}
      {paidServices.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-5">
            <h2 className="font-playfair font-black text-2xl text-black">Vad ni betalar</h2>
            <span className="text-xs text-black/40">Alla belopp exkl. moms</span>
          </div>
          <div className="bg-white rounded-2xl border border-black/6 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-black/6">
                    {['Tjänst', 'Intervall', 'Belopp', 'Nästa förnyelse'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-black/40">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/6">
                  {paidServices.map((s) => (
                    <tr key={s.id}>
                      <td className="px-5 py-3">
                        <p className="font-semibold text-black">{s.name}</p>
                        <p className="text-xs text-black/40">{serviceTypeLabels[s.type]}{s.domain ? ` · ${s.domain}` : ''}</p>
                      </td>
                      <td className="px-5 py-3 text-black/60">{serviceIntervalLabels[s.billing_interval!]}</td>
                      <td className="px-5 py-3 font-semibold text-black whitespace-nowrap">{formatAmount(s.amount)}</td>
                      <td className="px-5 py-3 text-black/60 whitespace-nowrap">{s.renews_at ? formatDate(s.renews_at) : 'Löpande'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-black/6 bg-[#F8F8F8] px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-8">
              <div className="flex items-center gap-2 text-sm">
                <Receipt className="w-4 h-4 text-brand-green-dark" />
                <span className="text-black/50">Motsvarar per månad</span>
                <span className="font-bold text-black">{formatAmount(totalPerMonth)}</span>
              </div>
              <div className="text-sm">
                <span className="text-black/50">Totalt per år</span>{' '}
                <span className="font-black text-black text-lg">{formatAmount(totalPerYear)}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {(projects ?? []).length > 0 && (
        <section>
          <h2 className="font-playfair font-black text-2xl text-black mb-5">Projekt</h2>
          <div className="bg-white rounded-2xl border border-black/6 shadow-sm divide-y divide-black/6">
            {projects!.map((p) => (
              <div key={p.id} className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-green/15 flex items-center justify-center shrink-0">
                  <FolderKanban className="w-5 h-5 text-brand-green-dark" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-semibold text-black">{p.name}</p>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusBadge[p.status] ?? statusBadge.active}`}>
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
