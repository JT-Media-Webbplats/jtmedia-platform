import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kundportal',
  description: 'JT Media kundportal',
  robots: { index: false, follow: false },
}

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">
            JT Media — Kundportal
          </span>
          <a
            href="/api/auth/signout"
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            Logga ut
          </a>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
    </div>
  )
}
