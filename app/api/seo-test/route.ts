import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const target = searchParams.get('url')

  if (!target) {
    return NextResponse.json({ error: 'URL saknas.' }, { status: 400 })
  }

  const requestedStrategy = searchParams.get('strategy')
  const strategy = requestedStrategy === 'desktop' ? 'desktop' : 'mobile'

  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY

  const params = new URLSearchParams({
    url: target,
    strategy,
  })
  for (const category of ['performance', 'accessibility', 'best-practices', 'seo']) {
    params.append('category', category)
  }
  if (apiKey) params.set('key', apiKey)

  try {
    const res = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`,
      { cache: 'no-store' },
    )

    const data = await res.json()

    if (!res.ok) {
      const reason = data?.error?.errors?.[0]?.reason
      const message = data?.error?.message ?? 'Okänt fel vid analysen. Försök igen om en stund.'

      if (reason === 'rateLimitExceeded' || res.status === 429) {
        return NextResponse.json(
          {
            error:
              'Vår analyskvot är tillfälligt full. Vänta en stund och försök igen, eller kontakta oss så kör vi analysen åt er manuellt.',
          },
          { status: 429 },
        )
      }

      if (res.status === 400) {
        return NextResponse.json(
          { error: 'Den angivna adressen kunde inte analyseras. Kontrollera att hemsidan är öppen och nåbar.' },
          { status: 400 },
        )
      }

      return NextResponse.json({ error: message }, { status: res.status })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('PageSpeed proxy error:', err)
    return NextResponse.json(
      { error: 'Kunde inte slutföra analysen just nu. Försök igen om en stund.' },
      { status: 502 },
    )
  }
}
