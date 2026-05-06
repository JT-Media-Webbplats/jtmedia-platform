import { ImageResponse } from 'next/og'

export const alt = 'JT Media AB — Din externa marknadsavdelning'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px',
          background:
            'linear-gradient(135deg, #ffffff 0%, #f0fbe5 55%, #c4e49a 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: '#A8D570',
            }}
          />
          <div
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#5fa832',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            JT Media AB
          </div>
        </div>

        <div
          style={{
            fontSize: '110px',
            fontWeight: 900,
            color: '#000',
            lineHeight: 1.02,
            letterSpacing: '-0.02em',
            marginBottom: '24px',
          }}
        >
          Din externa
        </div>
        <div
          style={{
            fontSize: '90px',
            fontWeight: 900,
            color: '#5fa832',
            lineHeight: 1.02,
            letterSpacing: '-0.02em',
            marginBottom: '50px',
          }}
        >
          marknadsavdelning.
        </div>

        <div
          style={{
            fontSize: '30px',
            color: '#000',
            opacity: 0.55,
            fontWeight: 500,
          }}
        >
          Webb · AI · SEO · Google Ads · Design
        </div>
      </div>
    ),
    { ...size }
  )
}
