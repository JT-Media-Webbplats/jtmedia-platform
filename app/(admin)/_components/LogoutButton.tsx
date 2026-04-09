'use client'

import { useTransition } from 'react'
import { signOut } from '@/app/actions/auth'
import { LogOut, Loader2 } from 'lucide-react'

export default function LogoutButton() {
  const [pending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => signOut())}
      disabled={pending}
      className="flex items-center gap-2 text-xs text-white/30 hover:text-white/70 transition-colors disabled:opacity-50"
    >
      {pending
        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
        : <LogOut className="w-3.5 h-3.5" />
      }
      Logga ut
    </button>
  )
}
