import type { Metadata } from 'next'
import Image from 'next/image'
import Navbar from './_components/Navbar'

export const metadata: Metadata = {
  title: 'JT Media Sweden — Din externa marknadsavdelning',
  description:
    'JT Media Sweden hjälper svenska företag att växa med webb, AI-lösningar, SEO, sociala medier och grafisk design — till en bråkdel av kostnaden av en intern avdelning.',
}

const footerServices = [
  { label: 'Webb & Hemsidor', href: '/tjanster/webb' },
  { label: 'AI-lösningar', href: '/tjanster/ai' },
  { label: 'SEO', href: '/tjanster/seo' },
  { label: 'Google Ads', href: '/tjanster/google-ads' },
  { label: 'Sociala medier', href: '/tjanster/sociala-medier' },
  { label: 'Digital Boost', href: '/tjanster/digital-boost' },
  { label: 'Grafisk design', href: '/tjanster/grafisk-design' },
]

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="playfair-headings min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Col 1 — Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Image
                src="/images/jt-media-logo-white.svg"
                alt="JT Media Sweden"
                width={130}
                height={130}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Din externa marknadsavdelning — till en bråkdel av kostnaden.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
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
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-white/8 hover:bg-brand-green hover:text-black text-white/50 flex items-center justify-center transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Services */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-5">
              Tjänster
            </p>
            <ul className="space-y-3">
              {footerServices.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    className="text-sm text-white/55 hover:text-white transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Company */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-5">
              Företaget
            </p>
            <ul className="space-y-3 text-sm text-white/55">
              {[
                { label: 'Om oss', href: '/om-oss' },
                { label: 'Kundcase', href: '/kundcase' },
                { label: 'SEO-test', href: '/seo-test' },
                { label: 'Kundportal', href: '/customer' },
                { label: 'Villkor', href: '/villkor' },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-5">
              Kontakt
            </p>
            <ul className="space-y-4 text-sm">
              <li>
                <p className="text-white/30 text-xs mb-0.5">Adress</p>
                <p className="text-white/70">Stationsgatan 2</p>
                <p className="text-white/70">341 60 Ljungby</p>
              </li>
              <li>
                <p className="text-white/30 text-xs mb-0.5">E-post</p>
                <a
                  href="mailto:info@jtmediasweden.com"
                  className="text-brand-green hover:text-brand-green-light transition-colors"
                >
                  info@jtmediasweden.com
                </a>
              </li>
              <li>
                <p className="text-white/30 text-xs mb-1">Team</p>
                <div className="space-y-1">
                  <a href="tel:+46767680202" className="block text-white/60 hover:text-white transition-colors">
                    Theo — 076-768 02 02
                  </a>
                  <a href="tel:+46736980131" className="block text-white/60 hover:text-white transition-colors">
                    Jakob — 073-698 01 31
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 py-5">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/25">
            <p>© {new Date().getFullYear()} JT Media Sweden AB. Alla rättigheter förbehållna.</p>
            <p>Ljungby, Sverige</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
