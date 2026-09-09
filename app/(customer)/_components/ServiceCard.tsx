import {
  Globe, Server, Link as LinkIcon, Mail, Wrench, Search, Sparkles, Target, Share2, Bot, Palette, Package,
  CalendarClock, type LucideIcon,
} from 'lucide-react'
import type { CustomerService, ServiceType } from '@/lib/supabase/types'
import { serviceTypeLabels, serviceIntervalLabels, serviceStatusLabels, formatDate } from '@/lib/services'

export const serviceTypeIcons: Record<ServiceType, LucideIcon> = {
  website: Globe, hosting: Server, domain: LinkIcon, email: Mail, maintenance: Wrench,
  seo: Search, geo: Sparkles, google_ads: Target, social: Share2, ai: Bot, design: Palette, other: Package,
}

export const serviceStatusBadge: Record<string, string> = {
  active:    'bg-brand-green/20 text-brand-green-dark',
  paused:    'bg-yellow-400/15 text-yellow-700',
  ended:     'bg-black/5 text-black/40',
}

export default function ServiceCard({ service }: { service: CustomerService }) {
  const Icon = serviceTypeIcons[service.type] ?? Package
  const ended = service.status === 'ended'
  return (
    <div className={`bg-white rounded-2xl border border-black/6 shadow-sm p-6 flex flex-col ${ended ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-brand-green/15 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-brand-green-dark" />
        </div>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${serviceStatusBadge[service.status]}`}>
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
