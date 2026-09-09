import Image from 'next/image'
import Link from 'next/link'
import { team, contactEmail } from '@/lib/portal'

interface Props {
  /** Show the heading above the cards. */
  heading?: boolean
  /** Hide the "mejla oss" hint below. */
  compact?: boolean
  /** Force one card per row (for narrow columns). */
  stack?: boolean
}

export default function ContactCard({ heading = true, compact = false, stack = false }: Props) {
  return (
    <section>
      {heading && <h2 className="font-playfair font-black text-2xl text-black mb-4">Din kontakt hos oss</h2>}
      <div className={`grid gap-4 ${stack ? '' : 'sm:grid-cols-2'}`}>
        {team.map((person) => (
          <div key={person.name} className="bg-white rounded-2xl border border-black/6 shadow-sm p-5 flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
              <Image src={person.img} alt={person.name} fill sizes="56px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-black text-sm">{person.name}</p>
              <p className="text-black/45 text-xs mb-1.5">{person.role}</p>
              <a href={`tel:${person.tel}`} className="text-black/60 text-sm hover:text-black transition-colors">
                {person.phone}
              </a>
            </div>
          </div>
        ))}
      </div>
      {!compact && (
        <p className="text-xs text-black/40 mt-4">
          Vill ni beställa något nytt? Gå till{' '}
          <Link href="/customer/bestall" className="underline hover:text-black">Fler tjänster</Link>{' '}
          eller mejla{' '}
          <a href={`mailto:${contactEmail}`} className="underline hover:text-black">{contactEmail}</a>{' '}
          så återkommer vi samma dag.
        </p>
      )}
    </section>
  )
}
