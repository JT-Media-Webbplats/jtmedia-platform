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
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-black/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-black tracking-tight text-black uppercase">
            JT Media
          </span>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <a href="#tjanster" className="text-black/60 hover:text-black transition-colors">
              Tjänster
            </a>
            <a href="#om-oss" className="text-black/60 hover:text-black transition-colors">
              Om oss
            </a>
            <a
              href="/customer"
              className="bg-black text-white px-4 py-1.5 rounded-full hover:bg-black/80 transition-colors"
            >
              Logga in
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-black text-white py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xl font-black uppercase tracking-tight">JT Media</span>
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} JT Media. Alla rättigheter förbehållna.
          </p>
          <a
            href="mailto:hej@jtmedia.se"
            className="text-brand-green hover:text-brand-green-light transition-colors text-sm font-medium"
          >
            hej@jtmedia.se
          </a>
        </div>
      </footer>
    </div>
  )
}
