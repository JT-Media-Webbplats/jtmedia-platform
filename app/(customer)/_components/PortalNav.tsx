'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Package, Sparkles, MessageCircle } from 'lucide-react'

export const portalNavItems = [
  { label: 'Översikt',      href: '/customer',          Icon: LayoutDashboard },
  { label: 'Era tjänster',  href: '/customer/tjanster', Icon: Package },
  { label: 'Fler tjänster', href: '/customer/bestall',  Icon: Sparkles },
  { label: 'Kontakt',       href: '/customer/kontakt',  Icon: MessageCircle },
]

interface Props {
  variant?: 'sidebar' | 'bar'
}

export default function PortalNav({ variant = 'sidebar' }: Props) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/customer') return pathname === '/customer'
    return pathname.startsWith(href)
  }

  if (variant === 'bar') {
    return (
      <nav className="flex gap-1 overflow-x-auto px-3 py-2 -mx-1 scrollbar-none">
        {portalNavItems.map(({ label, href, Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                active ? 'bg-brand-green/15 text-brand-green' : 'text-gray-300 hover:text-white hover:bg-white/8'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>
    )
  }

  return (
    <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
      {portalNavItems.map(({ label, href, Icon }) => {
        const active = isActive(href)
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              active
                ? 'bg-brand-green/12 text-brand-green font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-white/8'
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-brand-green' : ''}`} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
