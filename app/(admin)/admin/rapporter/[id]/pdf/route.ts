import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderReportPdf } from '@/lib/report-pdf'
import { periodFromParam, periodLabel } from '@/lib/reports'
import type { ReportStats } from '@/lib/supabase/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** GET /admin/rapporter/<report client id>/pdf?m=YYYY-MM → the generated report as a PDF download. */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const period = periodFromParam(request.nextUrl.searchParams.get('m') ?? undefined)
  const supabase = await createClient()

  // RLS limits both tables to admins, so a non-admin simply gets nothing back.
  const [{ data: client }, { data: report }] = await Promise.all([
    supabase.from('report_clients').select('id, customer:customers(name)').eq('id', params.id).maybeSingle(),
    supabase.from('monthly_reports').select('stats').eq('report_client_id', params.id).eq('period', period).maybeSingle(),
  ])
  if (!client) return NextResponse.json({ error: 'Kunden hittades inte.' }, { status: 404 })
  if (!report?.stats) return NextResponse.json({ error: 'Rapporten är inte skapad ännu.' }, { status: 404 })

  const name = (client.customer as unknown as { name: string } | null)?.name ?? 'Kund'
  const pdf = await renderReportPdf(name, report.stats as ReportStats)
  const filename = `Statistik ${name.replace(/[\\/:*?"<>|]/g, '-')} ${periodLabel(period)}.pdf`

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="report.pdf"; filename*=UTF-8''${encodeURIComponent(filename)}`,
      'Cache-Control': 'no-store',
    },
  })
}
