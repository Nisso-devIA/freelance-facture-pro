// app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data, error } = await resend.emails.send({
      from: 'Facture Pro <onboarding@resend.dev>',
      to: body.to,
      subject: `Facture ${body.invoiceNumber || ''} - ${body.amount}€`,
      html: `
        <h2>Bonjour ${body.clientName || 'Client'},</h2>
        <p>Votre facture est prête.</p>
        <a href="${body.pdfUrl}" target="_blank" style="background:#8b5cf6;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;display:inline-block;margin:20px 0;">
          📄 Télécharger la facture PDF
        </a>
      `,
    })

    if (error) throw error

    return NextResponse.json({ success: true }, {
      headers: { 'Access-Control-Allow-Origin': '*' }
    })

  } catch (err: any) {
    console.error('Send email error:', err)
    return NextResponse.json({ error: err.message }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    })
  }
}