import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
)

// ← TON IP PUBLIQUE ICI (remplace par la tienne)
const ALLOWED_IP = '91.160.58.131'   // ← CHANGE ÇA

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] 
           || request.headers.get('x-real-ip') 
           || 'unknown'

  // Si c’est toi → on donne toujours 999 utilisations (pratiquement illimité)
  if (ip === ALLOWED_IP) {
    return NextResponse.json({ remaining: 999, limitReached: false })
  }

  // Sinon on applique la limite normale
  const { data } = await supabase
    .from('demo_usage')
    .select('count')
    .eq('ip', ip)
    .single()

  const count = data?.count || 0
  const remaining = Math.max(0, 5 - count)

  return NextResponse.json({
    remaining,
    limitReached: remaining <= 0
  })
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] 
           || request.headers.get('x-real-ip') 
           || 'unknown'

  // Si c’est ton IP → on ne compte pas les utilisations
  if (ip === ALLOWED_IP) {
    return NextResponse.json({ success: true })
  }

  // Sinon on incrémente le compteur
  await supabase
    .from('demo_usage')
    .upsert({ ip, count: 1 }, { onConflict: 'ip' })

  // On incrémente proprement
  await supabase.rpc('increment_demo_usage', { user_ip: ip })

  return NextResponse.json({ success: true })
}