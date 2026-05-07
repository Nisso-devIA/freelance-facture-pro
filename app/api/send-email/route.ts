import { NextRequest, NextResponse } from 'next/server'
import { sendInvoiceEmail } from '@/lib/email'

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    await sendInvoiceEmail({
      to: body.to,
      clientName: body.clientName,
      invoiceNumber: body.invoiceNumber,
      amount: body.amount,
      pdfUrl: body.pdfUrl,
    })

    return NextResponse.json({ success: true }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    })

  } catch (error: any) {
    console.error('Send email error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    )
  }
}