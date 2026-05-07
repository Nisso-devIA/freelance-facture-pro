// app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://freelance-facture-pro.vercel.app',
  'https://*.vercel.app',           // Tous les previews Vercel
]

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin') || ''
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.some(o => origin.includes(o.replace('*', ''))) ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin') || ''

  try {
    const { to, clientName, invoiceNumber, amount, pdfUrl } = await request.json()

    const { data, error } = await resend.emails.send({
      from: 'Facture Pro <factures@ton-domaine.com>',   // ← Change avec ton domaine vérifié Resend
      to,
      subject: `Votre facture ${invoiceNumber} est prête`,
      html: `
        <h2>Bonjour ${clientName},</h2>
        <p>Votre facture <strong>${invoiceNumber}</strong> d'un montant de <strong>${amount} €</strong> a été générée.</p>
        <p><a href="${pdfUrl}" target="_blank">📄 Télécharger la facture PDF</a></p>
        <p>Merci pour votre confiance !</p>
      `,
    })

    if (error) throw error

    return NextResponse.json({ success: true, data }, {
      headers: {
        'Access-Control-Allow-Origin': ALLOWED_ORIGINS.some(o => origin.includes(o.replace('*', ''))) ? origin : ALLOWED_ORIGINS[0],
      }
    })

  } catch (error: any) {
    console.error('Send email error:', error)
    return NextResponse.json({ error: error.message }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': ALLOWED_ORIGINS.some(o => origin.includes(o.replace('*', ''))) ? origin : ALLOWED_ORIGINS[0],
      }
    })
  }
}