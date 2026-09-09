import Link from 'next/link'
import { ArrowRight, ExternalLink, Sparkles } from 'lucide-react'
import type { Recommendation } from '@/lib/portal'
import RequestServiceButton from '../customer/bestall/_components/RequestServiceButton'

interface Props {
  recommendations: Recommendation[]
  /** Catalogue keys with an open request, so the button shows "Förfrågan skickad". */
  openKeys: Set<string>
  /** Smaller variant for the overview page. */
  compact?: boolean
}

export default function Recommendations({ recommendations, openKeys, compact = false }: Props) {
  if (recommendations.length === 0) return null

  return (
    <section>
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="font-playfair font-black text-2xl text-black">Vi rekommenderar</h2>
          <p className="text-xs text-black/45 mt-1">Utifrån det ni redan har hos oss. Inga bindningar, vi hör av oss med ett förslag.</p>
        </div>
        <Link href="/customer/bestall" className="text-xs font-semibold text-brand-green-dark hover:text-black transition-colors inline-flex items-center gap-1 whitespace-nowrap">
          Alla tjänster <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className={`grid gap-4 ${compact ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
        {recommendations.map(({ service, reason }, i) => {
          const featured = i === 0 && !compact
          return (
            <div
              key={service.key}
              className={`rounded-2xl p-6 flex flex-col ${
                featured ? 'bg-black text-white' : 'bg-white border border-black/6 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className={`w-4 h-4 ${featured ? 'text-brand-green' : 'text-brand-green-dark'}`} />
                <p className={`text-[11px] font-semibold uppercase tracking-widest ${featured ? 'text-brand-green' : 'text-black/35'}`}>
                  {featured ? 'Vårt främsta tips' : 'Passar er'}
                </p>
              </div>
              <h3 className={`font-bold text-xl leading-tight mb-2 ${featured ? 'text-white' : 'text-black'}`}>{service.name}</h3>
              <p className={`text-sm leading-relaxed flex-1 ${featured ? 'text-white/65' : 'text-black/55'}`}>{reason}</p>
              <div className={`mt-5 pt-4 border-t flex items-center justify-between gap-3 ${featured ? 'border-white/10' : 'border-black/6'}`}>
                <RequestServiceButton
                  serviceKey={service.key}
                  serviceName={service.name}
                  owned={false}
                  hasOpenRequest={openKeys.has(service.key)}
                />
                <a
                  href={service.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 text-xs transition-colors ${featured ? 'text-white/40 hover:text-white' : 'text-black/40 hover:text-black'}`}
                >
                  Läs mer <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
