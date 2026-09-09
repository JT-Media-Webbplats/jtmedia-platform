import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './_components/LogoutButton'
import PortalNav from './_components/PortalNav'

export const metadata: Metadata = {
  title: { default: 'Kundportal', template: '%s | JT Media Kundportal' },
  description: 'JT Media kundportal',
  robots: { index: false, follow: false },
}

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirectTo=/customer')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, customer_id')
    .eq('id', user.id)
    .single()

  let customerName: string | null = null
  if (profile?.customer_id) {
    const { data: customer } = await supabase
      .from('customers')
      .select('name, company')
      .eq('id', profile.customer_id)
      .single()
    customerName = customer?.company || customer?.name || null
  }

  const isAdmin = profile?.role === 'admin'

  return (
    <div className="min-h-screen md:flex bg-[#F8F8F8]">
      {/* Sidebar, desktop */}
      <aside className="hidden md:flex w-60 bg-[#0a0a0a] border-r border-white/5 flex-col shrink-0 sticky top-0 h-screen">
        <div className="px-5 py-4 border-b border-white/5">
          <Link href="/customer">
            <Image
              src="/images/jt-media-logo-white.svg"
              alt="JT Media AB"
              width={130}
              height={130}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <p className="text-[10px] text-white/30 mt-1.5">Kundportal</p>
        </div>

        <PortalNav />

        <div className="px-5 py-4 border-t border-white/5 space-y-2">
          {customerName && <p className="text-xs font-semibold text-white/70 truncate">{customerName}</p>}
          <p className="text-xs text-white/40 truncate">{user.email}</p>
          <div className="flex items-center gap-4 pt-1">
            <LogoutButton />
            {isAdmin && (
              <Link href="/admin" className="text-xs text-brand-green/70 hover:text-brand-green transition-colors">
                Till admin
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Top bar, mobile */}
      <div className="md:hidden bg-[#0a0a0a] sticky top-0 z-20">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link href="/customer" className="flex items-center gap-3">
            <Image src="/images/jt-media-logo-white.svg" alt="JT Media AB" width={130} height={130} className="h-8 w-auto" priority />
            <span className="text-[10px] uppercase tracking-widest text-white/40">Kundportal</span>
          </Link>
          <LogoutButton />
        </div>
        <PortalNav variant="bar" />
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="max-w-6xl mx-auto px-5 py-8 md:px-10 md:py-10">{children}</div>
        <footer className="max-w-6xl mx-auto px-5 md:px-10 pb-8 pt-4 text-xs text-black/35 flex flex-col sm:flex-row gap-1 sm:gap-4">
          <span>JT Media AB, Stationsgatan 2, 341 60 Ljungby</span>
          <a href="mailto:info@jtmediasweden.com" className="hover:text-black transition-colors">info@jtmediasweden.com</a>
        </footer>
      </main>
    </div>
  )
}
