import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://jtmedia.se'),
  title: {
    default: 'JT Media AB',
    template: '%s | JT Media AB',
  },
  description: 'Din externa marknadsavdelning. JT Media AB levererar webb, AI, SEO och design under ett tak.',
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: 'https://jtmedia.se',
    siteName: 'JT Media AB',
    title: 'JT Media AB',
    description: 'Din externa marknadsavdelning. Webb, AI, SEO och design under ett tak.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JT Media AB',
    description: 'Din externa marknadsavdelning. Webb, AI, SEO och design under ett tak.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  )
}
