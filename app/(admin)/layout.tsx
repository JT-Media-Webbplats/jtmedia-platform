import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin',
  description: 'JT Media internal admin portal',
  robots: { index: false, follow: false },
}

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '▪' },
  { label: 'Kunder', href: '/admin/customers', icon: '▪' },
  { label: 'Projekt', href: '/admin/projects', icon: '▪' },
  { label: 'Användare', href: '/admin/users', icon: '▪' },
  { label: 'Inställningar', href: '/admin/settings', icon: '▪' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-gray-100">
      {/* Sidebar */}
      <aside className="w-60 border-r border-white/5 flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green mb-0.5">
            JT Media
          </p>
          <p className="text-xs text-white/30">Admin Portal</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all"
            >
              <span className="text-brand-green text-[8px]">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-white/5">
          <a
            href="/api/auth/signout"
            className="text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            Logga ut
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
