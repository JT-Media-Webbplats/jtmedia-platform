// Server-only: the monthly statistics report as a PDF, modelled on the Adobe Express template.
import path from 'node:path'
import React from 'react'
import { Document, Font, Image, Line, Page, Polyline, Rect, StyleSheet, Svg, Text, View, renderToBuffer } from '@react-pdf/renderer'
import type { ReportStats, TrafficPair } from '@/lib/supabase/types'
import { change, ctr, formatChange, formatInt, formatPct, shortDay } from '@/lib/reports'

const ASSETS = path.join(process.cwd(), 'assets/report')

Font.register({
  family: 'Playfair',
  fonts: [
    { src: path.join(ASSETS, 'PlayfairDisplay-Regular.ttf') },
    { src: path.join(ASSETS, 'PlayfairDisplay-Bold.ttf'), fontWeight: 700 },
  ],
})
Font.register({ family: 'Bakerie', src: path.join(ASSETS, 'Bakerie.ttf') })
Font.register({ family: 'DMSans', src: path.join(ASSETS, 'DMSans-Regular.ttf') })
Font.registerHyphenationCallback((word) => [word])

const GREEN = '#A8D570'
const GREEN_PREV = '#9DB86E'
const GREEN_CUR = '#B3D67A'
const INK = '#1a1a1a'
const DOWN = '#8a8a8a'

/** Green for growth, grey for a drop, like a calm traffic light. */
const changeColor = (ratio: number | null) => (ratio !== null && ratio < 0 ? DOWN : GREEN)

const s = StyleSheet.create({
  page: { paddingTop: 36, paddingBottom: 36, paddingLeft: 70, paddingRight: 48, fontFamily: 'Playfair', color: INK },
  bar: { position: 'absolute', left: 10, top: 0, bottom: 0, width: 7, backgroundColor: GREEN },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginLeft: -60 },
  jtLogo: { width: 70, height: 70 },
  title: { fontSize: 58, lineHeight: 0.98, marginTop: 6 },
  customer: { fontFamily: 'Bakerie', fontSize: 15, marginTop: 14, marginBottom: 22 },
  section: { flexDirection: 'row', paddingVertical: 14 },
  label: { width: 130, fontFamily: 'Bakerie', fontSize: 17, paddingTop: 2 },
  cols: { flex: 1, flexDirection: 'row' },
  col: { flex: 1 },
  colHead: { fontFamily: 'Bakerie', fontSize: 13, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 7 },
  key: { fontWeight: 700, fontSize: 12.5, marginRight: 8 },
  value: { fontSize: 12.5 },
  green: { fontSize: 12.5, color: GREEN },
  rule: { marginLeft: 130, borderBottomWidth: 1.2, borderBottomColor: INK },
  small: { fontFamily: 'Bakerie', fontSize: 10.5, marginBottom: 4 },
  smallGreen: { fontFamily: 'Bakerie', fontSize: 10.5, color: GREEN },
  chartLabel: { fontFamily: 'Bakerie', fontSize: 8, textAlign: 'center' },
  footer: { position: 'absolute', bottom: 22, left: 70, right: 48, fontFamily: 'DMSans', fontSize: 7.5, color: '#888' },
})

function Arrow() {
  return (
    <Svg width={120} height={50} viewBox="0 0 120 50">
      <Polyline points="0,25 92,25" stroke={GREEN} strokeWidth={4} />
      <Polyline points="70,3 92,25 70,47" stroke={GREEN} strokeWidth={4} fill="none" />
      <Polyline points="90,3 112,25 90,47" stroke={INK} strokeWidth={4} fill="none" />
    </Svg>
  )
}

function Figures({ head, data }: { head: string; data: TrafficPair }) {
  return (
    <View style={s.col}>
      <Text style={s.colHead}>{head}</Text>
      <View style={s.row}><Text style={s.key}>Exponeringar</Text><Text style={s.value}>{formatInt(data.impressions)}</Text></View>
      <View style={s.row}><Text style={s.key}>Klick</Text><Text style={s.value}>{formatInt(data.clicks)}</Text></View>
      <View style={s.row}><Text style={s.key}>CTR</Text><Text style={s.green}>{formatPct(ctr(data))}</Text></View>
    </View>
  )
}

function ChangeLine({ label, ratio }: { label: string; ratio: number | null }) {
  return (
    <Text style={[s.smallGreen, { color: changeColor(ratio) }]}>
      <Text style={{ color: INK }}>{label}:  </Text>{formatChange(ratio)}
    </Text>
  )
}

function Bars({ head, previous, current }: { head: string; previous: number; current: number }) {
  const W = 150
  const H = 105
  const max = Math.max(previous, current, 1)
  const bar = (v: number) => Math.max(2, (v / max) * (H - 16))
  return (
    <View style={s.col}>
      <Text style={s.colHead}>{head}</Text>
      <Svg width={W} height={H}>
        <Rect x={4} y={H - bar(previous)} width={62} height={bar(previous)} fill={GREEN_PREV} />
        <Rect x={76} y={H - bar(current)} width={62} height={bar(current)} fill={GREEN_CUR} />
        <Line x1={0} y1={H} x2={142} y2={H} stroke="#ddd" strokeWidth={0.5} />
      </Svg>
      {/* Values above the bars, laid out as text so the fonts match */}
      <View style={{ flexDirection: 'row', width: 142, position: 'absolute', top: 24 }}>
        <Text style={{ width: 71, fontSize: 8, textAlign: 'center', marginTop: H - bar(previous) - 12 }}>{formatInt(previous)}</Text>
        <Text style={{ width: 71, fontSize: 8, textAlign: 'center', marginTop: H - bar(current) - 12 }}>{formatInt(current)}</Text>
      </View>
      <View style={{ flexDirection: 'row', width: 142, marginTop: 4 }}>
        <Text style={[s.chartLabel, { width: 71 }]}>Föregående period</Text>
        <Text style={[s.chartLabel, { width: 71 }]}>Denna period</Text>
      </View>
    </View>
  )
}

function ReportDocument({ customerName, stats }: { customerName: string; stats: ReportStats }) {
  const { organic, paid, visitors } = stats
  const hasTraffic = organic || paid

  return (
    <Document title={`Statistik ${customerName}`} author="JT Media AB">
      <Page size="A4" style={s.page}>
        <View style={s.bar} fixed />

        <View style={s.header}>
          <Arrow />
          <Image src={path.join(ASSETS, 'jt-logo.png')} style={s.jtLogo} />
        </View>

        <Text style={s.title}>Statistik{'\n'}Hemsida</Text>
        <Text style={s.customer}>{customerName}</Text>

        {hasTraffic && (
          <>
            <View style={s.section}>
              <Text style={s.label}>Föregående period</Text>
              <View style={s.cols}>
                {organic && <Figures head="Organisk trafik" data={organic.previous} />}
                {paid && <Figures head="Betald trafik" data={paid.previous} />}
              </View>
            </View>
            <View style={s.rule} />

            <View style={s.section}>
              <Text style={s.label}>Denna period</Text>
              <View style={s.cols}>
                {organic && <Figures head="Organisk trafik" data={organic.current} />}
                {paid && <Figures head="Betald trafik" data={paid.current} />}
              </View>
            </View>
            <View style={s.rule} />

            <View style={s.section}>
              <View style={{ width: 130 }}>
                <Text style={[s.label, { width: 'auto', marginBottom: 14 }]}>Förändring i trafik</Text>
                <Text style={s.small}>Procentuell ökning/minskning</Text>
                {organic && <ChangeLine label="Organiskt" ratio={change(organic.previous.clicks, organic.current.clicks)} />}
                {paid && <ChangeLine label="Google Ads" ratio={change(paid.previous.clicks, paid.current.clicks)} />}
              </View>
              <View style={s.cols}>
                {organic && <Bars head="Organiskt" previous={organic.previous.clicks} current={organic.current.clicks} />}
                {paid && <Bars head="Google Ads" previous={paid.previous.clicks} current={paid.current.clicks} />}
              </View>
            </View>
          </>
        )}

        {visitors && (
          <>
            {hasTraffic && <View style={s.rule} />}
            <View style={s.section}>
              <Text style={s.label}>Besökare på{'\n'}hemsidan</Text>
              <View style={s.cols}>
                <View style={s.col}>
                  <Text style={s.colHead}>Föregående period</Text>
                  <Text style={{ fontSize: 22 }}>{formatInt(visitors.previous)}</Text>
                </View>
                <View style={s.col}>
                  <Text style={s.colHead}>Denna period</Text>
                  <Text style={{ fontSize: 22 }}>
                    {formatInt(visitors.current)}
                    <Text style={{ fontSize: 11, color: changeColor(change(visitors.previous, visitors.current)) }}>  {formatChange(change(visitors.previous, visitors.current))}</Text>
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

        <Text style={s.footer} fixed>
          Denna period: {shortDay(stats.start)} till {shortDay(stats.end)} {stats.end.slice(0, 4)}. Föregående period: {shortDay(stats.prevStart)} till {shortDay(stats.prevEnd)}.
          Organisk trafik från Google Search Console{paid ? ', betald trafik från Google Ads' : ''}{visitors ? ', besökare från Google Analytics' : ''}.
        </Text>
      </Page>
    </Document>
  )
}

export function renderReportPdf(customerName: string, stats: ReportStats): Promise<Buffer> {
  return renderToBuffer(<ReportDocument customerName={customerName} stats={stats} />)
}
