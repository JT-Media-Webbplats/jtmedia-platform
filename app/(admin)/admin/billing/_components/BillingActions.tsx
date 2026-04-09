'use client'

import { useTransition } from 'react'
import { markAsBilled } from '@/app/actions/billing'
import { Loader2, CheckCircle } from 'lucide-react'

export default function BillingActions({ scheduleId }: { scheduleId: string }) {
  const [pending, startTransition] = useTransition()

  function handleMark() {
    startTransition(async () => {
      await markAsBilled(scheduleId)
    })
  }

  return (
    <button
      onClick={handleMark}
      disabled={pending}
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-green/10 text-brand-green hover:bg-brand-green/20 transition-colors disabled:opacity-50"
    >
      {pending ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
      Markera betald
    </button>
  )
}
