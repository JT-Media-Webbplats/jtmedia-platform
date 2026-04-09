import type { Metadata } from 'next'
import Image from 'next/image'
import ContactForm from './_components/ContactForm'

export const metadata: Metadata = {
  title: 'Kontakt | JT Media Sweden — Ljungby',
  description:
    'Kontakta JT Media Sweden för ett kostnadsfritt samtal. Vi hjälper er med webb, SEO, AI och digital marknadsföring. Svarar samma dag.',
}

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/jtmediasweden',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/jtmediasweden',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/jtmediasweden',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
]

export default function KontaktPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#F8F8F8] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block font-bakerie text-sm bg-brand-green/20 text-black px-4 py-1.5 rounded-full mb-6">
            Kontakt
          </span>
          <h1 className="font-playfair font-black text-5xl md:text-6xl text-black mb-4 leading-tight">
            Kontakta oss — vi svarar snabbt
          </h1>
          <p className="text-xl text-black/55 max-w-xl mx-auto">
            Fyll i formuläret nedan eller ring oss direkt. Vi återkommer samma dag.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <h2 className="font-playfair font-black text-3xl text-black mb-8">
                Skicka ett meddelande
              </h2>
              <ContactForm />
            </div>

            {/* Info */}
            <div>
              <h2 className="font-playfair font-black text-3xl text-black mb-8">
                Kontaktuppgifter
              </h2>

              {/* Address */}
              <div className="bg-[#F8F8F8] rounded-3xl p-7 mb-6">
                <div className="space-y-5">
                  <div>
                    <p className="text-xs text-black/40 font-semibold uppercase tracking-widest mb-1">Adress</p>
                    <p className="text-black font-medium">Stationsgatan 2</p>
                    <p className="text-black/70">341 60 Ljungby</p>
                  </div>
                  <div>
                    <p className="text-xs text-black/40 font-semibold uppercase tracking-widest mb-1">E-post</p>
                    <a
                      href="mailto:info@jtmediasweden.com"
                      className="text-black font-medium hover:text-brand-green-dark transition-colors"
                    >
                      info@jtmediasweden.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Team */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  {
                    name: 'Theo Brandt',
                    role: 'Grundare & Webb',
                    phone: '076-768 02 02',
                    tel: '+46767680202',
                    img: '/images/team/theo.webp',
                  },
                  {
                    name: 'Jakob Jolheden',
                    role: 'Grundare & Digital strategi',
                    phone: '073-698 01 31',
                    tel: '+46736980131',
                    img: '/images/team/jakob.webp',
                  },
                ].map((person) => (
                  <div key={person.name} className="bg-[#F8F8F8] rounded-2xl p-5 flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
                      <Image src={person.img} alt={person.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-black text-sm">{person.name}</p>
                      <p className="text-black/45 text-xs mb-1.5">{person.role}</p>
                      <a
                        href={`tel:${person.tel}`}
                        className="text-black/60 text-sm hover:text-black transition-colors"
                      >
                        {person.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div className="bg-[#F8F8F8] rounded-3xl p-7">
                <p className="text-xs text-black/40 font-semibold uppercase tracking-widest mb-4">Följ oss</p>
                <div className="flex gap-3">
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="w-10 h-10 rounded-xl bg-black/8 hover:bg-brand-green hover:text-black text-black/50 flex items-center justify-center transition-all"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
