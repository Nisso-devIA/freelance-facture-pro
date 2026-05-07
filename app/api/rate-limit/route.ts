import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
)

const YOUR_IP = '91.160.58.131'   // ← CHANGE ÇA

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] 
          || req.headers.get('x-real-ip') 
          || 'unknown'

  if (ip === YOUR_IP) {
    return NextResponse.json({ allowed: true })
  }

  // Rate limit normal
  const { data } = await supabase
    .from('rate_limits')
    .select('count, last_request')
    .eq('ip', ip)
    .single()

  const now = Date.now()
  const window = 60 * 1000

  if (!data || now - new Date(data.last_request).getTime() > window) {
    await supabase.from('rate_limits').upsert({ ip, count: 1, last_request: new Date().toISOString() })
    return NextResponse.json({ allowed: true })
  }

  if (data.count >= 15) {
    return NextResponse.json({ allowed: false }, { status: 429 })
  }

  await supabase.from('rate_limits').update({ count: data.count + 1, last_request: new Date().toISOString() }).eq('ip', ip)

  return NextResponse.json({ allowed: true })
}