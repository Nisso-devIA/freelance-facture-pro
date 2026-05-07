import { NextRequest, NextResponse } from 'next/server'
import { sendInvoiceEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin') || ''

  // Autorise tous les domaines Vercel + localhost (très pratique en prod/preview)
  const allowedOrigins = [
    'https://freelance-facture-pro.vercel.app',
    'http://localhost:3000',
    'https://freelance-facture-pro.vercel.app/*',           // ton preview actuel
    // Ajoute ici d'autres previews si besoin
  ]

  const isAllowed = allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')

  const headers = {
    'Access-Control-Allow-Origin': isAllowed ? origin : '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }

  // Préflight CORS
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