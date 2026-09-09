'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { updateRequestStatus } from '@/app/actions/requests'
import type { ServiceRequestStatus } from '@/lib/supabase/types'
import { requestStatusLabels } from '@/lib/portal'

const statusCls: Record<ServiceRequestStatus, string> = {
  new:         'bg-brand-green/15 text-brand-green border-brand-green/30',
  in_progress: 'bg-blue-50 text-blue-600 border-blue-200',
  done:        'bg-gray-100 text-gray-500 border-gray-200',
  declined:    'bg-red-50 text-red-500 border-red-200',
}

export default function RequestStatusSelect({ id, status }: { id: string; status: ServiceRequestStatus }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <div className="inline-flex items-center gap-2">
      <select
        value={status}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as ServiceRequestStatus
          startTransition(async () => {
            await updateRequestStatus(id, next)
            router.refresh()
          })
        }}
        className={`text-xs font-bold rounded-lg border px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-green/20 disabled:opacity-50 ${statusCls[status]}`}
      >
        {(Object.keys(requestStatusLabels) as ServiceRequestStatus[]).map((s) => (
          <option key={s} value={s}>{requestStatusLabels[s]}</option>
        ))}
      </select>
      {pending && <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />}
    </div>
  )
}
