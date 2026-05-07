import { NextRequest, NextResponse } from 'next/server'
import { sendInvoiceEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  // CORS headers pour permettre les appels depuis tous les sous-domaines Vercel + prod
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Ou remplace par ton domaine exact en prod
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }

  // Préflight OPTIONS
  if (req.method === 'OPTIONS') {
    return NextResponse.json({}, { headers: corsHeaders })
  }

  try {
    const body = await req.json()

    const result = await sendInvoiceEmail({
      to: body.to,
      clientName: body.clientName,
      invoiceNumber: body.invoiceNumber,
      amount: body.amount,
      pdfUrl: body.pdfUrl,
    })

    return NextResponse.json({ success: true, result }, { headers: corsHeaders })

  } catch (error: any) {
    console.error('Send email error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders }
    )
  }
}