// app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const dynamic = 'force-dynamic'

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data, error } = await resend.emails.send({
      from: 'Facture Pro <onboarding@resend.dev>', // domaine par défaut Resend
      to: body.to,
      subject: `Facture ${body.invoiceNumber || 'Nouvelle'} - ${body.amount}€`,
      html: `
        <h2>Bonjour ${body.clientName},</h2>
        <p>Votre facture est prête.</p>
        <a href="${body.pdfUrl}" target="_blank">📄 Télécharger PDF</a>
      `,
    })

    if (error) throw error

    return NextResponse.json({ success: true }, {
      headers: { 'Access-Control-Allow-Origin': '*' }
    })

  } catch (err: any) {
    console.error('Send-email error:', err)
    return NextResponse.json({ error: err.message }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    })
  }
}