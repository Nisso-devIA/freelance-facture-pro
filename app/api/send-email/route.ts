import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { to, clientName, invoiceNumber, amount, pdfUrl } = await request.json()

    const { data, error } = await resend.emails.send({
      from: 'Facture Pro <onboarding@resend.dev>',
      to,
      subject: `Votre facture ${invoiceNumber}`,
      html: `
        <h1>Bonjour ${clientName},</h1>
        <p>Voici votre facture <strong>${invoiceNumber}</strong> pour un montant de <strong>${amount.toFixed(2)} €</strong>.</p>
        <p>
          <a href="${pdfUrl}" style="background:#fff;color:#000;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;">
            📥 Télécharger le PDF
          </a>
        </p>
        <p>Merci pour votre confiance !</p>
      `,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}