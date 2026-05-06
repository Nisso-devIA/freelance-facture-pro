import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
             req.headers.get('x-real-ip') || 
             'unknown'

  // Nettoyage IP
  const cleanIp = ip.replace(/[^0-9a-fA-F:.]/g, '')

  const { data, error } = await supabase
    .from('demo_usage')
    .select('count')
    .eq('ip', cleanIp)
    .single()

  const usage = data?.count || 0

  return NextResponse.json({ 
    remaining: Math.max(0, 5 - usage),
    limitReached: usage >= 5 
  })
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
             req.headers.get('x-real-ip') || 
             'unknown'
  const cleanIp = ip.replace(/[^0-9a-fA-F:.]/g, '')

  const { data: existing } = await supabase
    .from('demo_usage')
    .select('count')
    .eq('ip', cleanIp)
    .single()

  const newCount = (existing?.count || 0) + 1

  await supabase
    .from('demo_usage')
    .upsert({ 
      ip: cleanIp, 
      count: newCount,
      last_used: new Date().toISOString()
    }, { onConflict: 'ip' })

  return NextResponse.json({ remaining: Math.max(0, 5 - newCount) })
}