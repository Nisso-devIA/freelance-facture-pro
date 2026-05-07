// app/icon.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #8b5cf6, #22d3ee, #a855f7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 48,
          fontWeight: 900,
          color: '#0a0a0a',
          borderRadius: '20%',
        }}
      >
        FP
      </div>
    ),
    {
      width: 64,
      height: 64,
    }
  )
}