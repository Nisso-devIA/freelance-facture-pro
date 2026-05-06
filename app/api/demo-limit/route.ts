import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseServiceKey) {
  console.error("SUPABASE_SERVICE_ROLE_KEY manquante sur Vercel")
}

const supabase = createClient(supabaseUrl, supabaseServiceKey!)

export async function GET(req: NextRequest) {
  const ip = (req.headers.get('x-forwarded-for')?.split(',')[0] || 
              req.headers.get('x-real-ip') || 'unknown').trim()

  const { data } = await supabase
    .from('demo_usage')
    .select('count')
    .eq('ip', ip)
    .single()

  const usage = data?.count || 0

  return NextResponse.json({ 
    remaining: Math.max(0, 5 - usage),
    limitReached: usage >= 5 
  })
}

export async function POST(req: NextRequest) {
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
}