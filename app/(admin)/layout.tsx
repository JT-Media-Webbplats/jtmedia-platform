import type { Metadata } from 'next'
import SidebarNav from './_components/SidebarNav'
import LogoutButton from './_components/LogoutButton'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s — JT Media Admin' },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Role guard — non-admins go to customer portal
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single()

  if (profile && profile.role !== 'admin') redirect('/customer')

  const displayName = profile?.full_name ?? profile?.email ?? user.email ?? 'Admin'

  return (
    <div className="min-h-screen flex">
      {/* Sidebar — stays dark */}
      <aside className="w-60 bg-[#0a0a0a] border-r border-white/5 flex flex-col shrink-0 sticky top-0 h-screen">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-brand-green flex items-center justify-center text-black font-black text-xs shrink-0">
              JT
            </span>
            <div>
              <p className="text-xs font-bold text-white leading-none">Media Sweden</p>
              <p className="text-[10px] text-white/30 mt-0.5">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Nav — client component for active state */}
        <SidebarNav />

        {/* User + logout */}
        <div className="px-5 py-4 border-t border-white/5 space-y-2">
          <p className="text-xs text-white/40 truncate">{displayName}</p>
          <LogoutButton />
        </div>
      </aside>

      {/* Main content — light */}
      <main className="flex-1 overflow-auto min-w-0 bg-gray-50">{children}</main>
    </div>
  )
}
