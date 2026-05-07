// app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',           // ← Tout autorisé temporairement
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const { to, clientName, invoiceNumber, amount, pdfUrl } = await request.json()

    if (!to || !pdfUrl) {
      return NextResponse.json({ error: 'Missing to or pdfUrl' }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: 'Facture Pro <factures@resend.dev>',   // Change avec ton domaine vérifié Resend
      to,
      subject: `Votre facture ${invoiceNumber} - ${amount}€`,
      html: `
        <h2>Bonjour ${clientName},</h2>
        <p>Votre facture <strong>${invoiceNumber}</strong> d'un montant de <strong>${amount} €</strong> a été générée avec succès.</p>
        <p style="margin: 30px 0;">
          <a href="${pdfUrl}" target="_blank" style="background:#8b5cf6;color:white;padding:12px 24px;border-radius:12px;text-decoration:none;">
            📄 Télécharger la facture PDF
          </a>
        </p>
        <p>Merci pour votre confiance !</p>
      `,
    })

    if (error) throw error

    return NextResponse.json({ success: true, data }, {
      headers: { 'Access-Control-Allow-Origin': '*' }
    })

  } catch (error: any) {
    console.error('Send email error:', error)
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { 
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    })
  }
}