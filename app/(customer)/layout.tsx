import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './_components/LogoutButton'

export const metadata: Metadata = {
  title: 'Kundportal | JT Media AB',
  description: 'JT Media kundportal',
  robots: { index: false, follow: false },
}

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirectTo=/customer')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      <header className="bg-white border-b border-black/6">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/customer" className="flex items-center gap-3">
            <Image
              src="/images/jt-media-logo-black.svg"
              alt="JT Media AB"
              width={130}
              height={130}
              className="h-8 w-auto"
              priority
            />
            <span className="hidden sm:inline text-xs font-semibold uppercase tracking-widest text-black/35 border-l border-black/10 pl-3">
              Kundportal
            </span>
          </Link>
          <div className="flex items-center gap-5">
            {profile?.role === 'admin' && (
              <Link href="/admin" className="text-xs font-semibold text-brand-green-dark hover:text-black transition-colors">
                Till admin
              </Link>
            )}
            <span className="hidden sm:inline text-xs text-black/40 truncate max-w-[200px]">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">{children}</main>
      <footer className="border-t border-black/6 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-black/40">
          <span>JT Media AB, Stationsgatan 2, 341 60 Ljungby</span>
          <a href="mailto:info@jtmediasweden.com" className="hover:text-black transition-colors">info@jtmediasweden.com</a>
        </div>
      </footer>
    </div>
  )
}
