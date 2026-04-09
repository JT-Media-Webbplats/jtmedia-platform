'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const services = [
  { label: 'Webb & Hemsidor', href: '/tjanster/webb' },
  { label: 'AI-lösningar', href: '/tjanster/ai' },
  { label: 'SEO', href: '/tjanster/seo' },
  { label: 'Google Ads', href: '/tjanster/google-ads' },
  { label: 'Sociala medier', href: '/tjanster/sociala-medier' },
  { label: 'Digital Boost', href: '/tjanster/digital-boost' },
  { label: 'Grafisk design', href: '/tjanster/grafisk-design' },
]

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleMouseEnter() {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current)
    setDropdownOpen(true)
  }

  function handleMouseLeave() {
    dropdownTimer.current = setTimeout(() => setDropdownOpen(false), 120)
  }

  useEffect(() => {
    return () => {
      if (dropdownTimer.current) clearTimeout(dropdownTimer.current)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-black/8 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/images/jt-media-logo-black.svg"
            alt="JT Media Sweden"
            width={130}
            height={130}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {/* Tjänster dropdown */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center gap-1 text-black/55 hover:text-black transition-colors py-2">
              Tjänster
              <svg className="w-3.5 h-3.5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-52 bg-white rounded-2xl shadow-xl border border-black/8 py-2 z-50"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {services.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="block px-4 py-2.5 text-sm text-black/65 hover:text-black hover:bg-[#F8F8F8] transition-colors"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/kundcase" className="text-black/55 hover:text-black transition-colors">
            Kundcase
          </Link>
          <Link href="/om-oss" className="text-black/55 hover:text-black transition-colors">
            Om oss
          </Link>
          <Link href="/kontakt" className="text-black/55 hover:text-black transition-colors">
            Kontakt
          </Link>
          <Link
            href="/seo-test"
            className="bg-brand-green/15 text-black/80 hover:bg-brand-green/30 px-3 py-1 rounded-full text-sm font-semibold transition-colors"
          >
            SEO-test
          </Link>
        </nav>

        {/* Desktop CTA */}
        <Link
          href="/kontakt"
          className="hidden md:inline-flex items-center bg-brand-green text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-brand-green-dark transition-colors"
        >
          Kom igång →
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Öppna meny"
        >
          <span className={`block w-6 h-0.5 bg-black transition-transform ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-black transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-black transition-transform ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-black/8 px-6 py-4 flex flex-col gap-1">
          <button
            className="flex items-center justify-between w-full text-sm font-medium text-black/70 py-3 border-b border-black/6"
            onClick={() => setMobileServicesOpen((v) => !v)}
          >
            Tjänster
            <svg className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {mobileServicesOpen && (
            <div className="pl-3 mb-1 flex flex-col gap-0.5">
              {services.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="block text-sm text-black/55 hover:text-black py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          )}
          {[
            { label: 'Kundcase', href: '/kundcase' },
            { label: 'Om oss', href: '/om-oss' },
            { label: 'Kontakt', href: '/kontakt' },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-black/70 py-3 border-b border-black/6"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/seo-test"
            className="inline-flex mt-2 items-center justify-center bg-brand-green/15 text-black/80 px-4 py-2 rounded-full text-sm font-semibold"
            onClick={() => setMobileOpen(false)}
          >
            SEO-test
          </Link>
          <Link
            href="/kontakt"
            className="mt-2 inline-flex items-center justify-center bg-brand-green text-black px-5 py-2.5 rounded-full text-sm font-bold"
            onClick={() => setMobileOpen(false)}
          >
            Kom igång →
          </Link>
        </div>
      )}
    </header>
  )
}
