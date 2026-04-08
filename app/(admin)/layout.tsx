import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin',
  description: 'JT Media internal admin portal',
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <aside className="w-56 border-r border-gray-800 flex flex-col p-6 gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            JT Media
          </span>
          <p className="text-sm font-bold text-white mt-0.5">Admin</p>
        </div>
        <nav className="flex flex-col gap-1 text-sm">
          {[
            { label: 'Dashboard', href: '/admin' },
            { label: 'Kunder', href: '/admin/customers' },
            { label: 'Projekt', href: '/admin/projects' },
            { label: 'Användare', href: '/admin/users' },
            { label: 'Inställningar', href: '/admin/settings' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-gray-800">
          <a
            href="/api/auth/signout"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Logga ut
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
