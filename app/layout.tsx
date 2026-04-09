import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'JT Media',
    template: '%s | JT Media',
  },
  description: 'Kreativ mediebyrå för moderna varumärken.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv" className={playfair.variable}>
      <body className="antialiased font-playfair">{children}</body>
    </html>
  )
}
