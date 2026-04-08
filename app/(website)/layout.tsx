import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JT Media',
  description: 'Kreativ mediebyrå för moderna varumärken.',
}

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-gray-900">
            JT Media
          </span>
          <nav className="flex gap-6 text-sm text-gray-600">
            <a href="#tjanster" className="hover:text-gray-900 transition-colors">
              Tjänster
            </a>
            <a href="#om-oss" className="hover:text-gray-900 transition-colors">
              Om oss
            </a>
            <a
              href="/customer"
              className="bg-brand-600 text-white px-4 py-1.5 rounded-full hover:bg-brand-700 transition-colors"
            >
              Logga in
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} JT Media. Alla rättigheter förbehållna.
      </footer>
    </div>
  )
}
