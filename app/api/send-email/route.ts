// app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, clientName, invoiceNumber, amount, pdfUrl } = body

    const { data, error } = await resend.emails.send({
      from: 'Facture Pro <factures@resend.dev>', // ← Change si tu as un domaine vérifié
      to,
      subject: `Facture ${invoiceNumber} - ${amount}€`,
      html: `
        <h2>Bonjour ${clientName},</h2>
        <p>Votre facture <strong>${invoiceNumber}</strong> d'un montant de <strong>${amount}€</strong> est prête.</p>
        <a href="${pdfUrl}" target="_blank" style="display:inline-block;margin:20px 0;padding:14px 28px;background:#8b5cf6;color:white;border-radius:12px;text-decoration:none;">
          📄 Télécharger la facture PDF
        </a>
        <p>Merci pour votre confiance !</p>
      `,
    })

    if (error) throw error

    return NextResponse.json({ success: true }, {
      headers: { 'Access-Control-Allow-Origin': '*' }
    })

  } catch (err: any) {
    console.error('Email error:', err)
    return NextResponse.json({ error: err.message }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    })
  }
}