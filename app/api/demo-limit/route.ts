import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const ip = (req.headers.get('x-forwarded-for')?.split(',')[0] || 
                req.headers.get('x-real-ip') || 'unknown').trim()

    const { data, error } = await supabase
      .from('demo_usage')
      .select('count')
      .eq('ip', ip)
      .single()

    const usage = data?.count || 0

    return NextResponse.json({ 
      remaining: Math.max(0, 5 - usage),
      limitReached: usage >= 5 
    })
  } catch (e) {
    console.error("GET demo-limit error:", e)
    return NextResponse.json({ remaining: 5, limitReached: false })
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = (req.headers.get('x-forwarded-for')?.split(',')[0] || 
                req.headers.get('x-real-ip') || 'unknown').trim()

    const { data: existing } = await supabase
      .from('demo_usage')
      .select('count')
      .eq('ip', ip)
      .single()

    const newCount = (existing?.count || 0) + 1

    await supabase
      .from('demo_usage')
      .upsert({ 
        ip, 
        count: newCount,
        last_used: new Date().toISOString()
      })

    return NextResponse.json({ remaining: Math.max(0, 5 - newCount) })
  } catch (e) {
    console.error("POST demo-limit error:", e)
    return NextResponse.json({ remaining: 5 })
  }
}