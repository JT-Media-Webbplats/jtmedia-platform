'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Receipt,
  Clock,
  Settings,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard',       href: '/admin',           Icon: LayoutDashboard },
  { label: 'Kunder',          href: '/admin/customers', Icon: Users },
  { label: 'Projekt',         href: '/admin/projects',  Icon: FolderKanban },
  { label: 'Fakturering',     href: '/admin/billing',   Icon: Receipt },
  { label: 'Tidrapportering', href: '/admin/time',      Icon: Clock },
  { label: 'Inställningar',   href: '/admin/settings',  Icon: Settings },
]

export default function SidebarNav() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
      {navItems.map(({ label, href, Icon }) => {
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
