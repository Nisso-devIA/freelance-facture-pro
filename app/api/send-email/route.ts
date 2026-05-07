import { NextRequest, NextResponse } from 'next/server'
import { sendInvoiceEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin') || ''

  // Autorise TOUT ce qui est Vercel + localhost (le plus fiable)
  const isVercelOrigin = origin.endsWith('.vercel.app') || origin.includes('localhost')

  const headers = {
    'Access-Control-Allow-Origin': isVercelOrigin ? origin : '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }

  // Réponse au preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return NextResponse.json({}, { headers })
  }

  try {
    const body = await req.json()

    await sendInvoiceEmail({
      to: body.to,
      clientName: body.clientName,
      invoiceNumber: body.invoiceNumber,
      amount: body.amount,
      pdfUrl: body.pdfUrl,
    })

    return NextResponse.json({ success: true }, { headers })

  } catch (error: any) {
    console.error('Send email error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers }
    )
  }
}