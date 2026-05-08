import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInvoiceEmail({
  to,
  clientName,
  invoiceNumber,
  amount,
  pdfUrl
}: {
  to: string
  clientName: string
  invoiceNumber: string
  amount: number
  pdfUrl: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Facture Pro <factures@resend.dev>',
      to,
      subject: `Votre facture ${invoiceNumber} est prête`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; }
            .button {
              display: inline-block;
              background: linear-gradient(to right, #8b5cf6, #a855f7);
              color: white;
              padding: 16px 32px;
              text-decoration: none;
              border-radius: 12px;
              font-weight: bold;
              margin: 20px 0;
            }
          </style>
        </head>
        <body style="margin:0;padding:40px;background:#f8fafc;">
          <div style="max-width:600px;margin:0 auto;background:white;padding:40px;border-radius:16px;">
            <h2 style="color:#8b5cf6;">Bonjour ${clientName},</h2>
            <p style="font-size:16px;">Votre facture <strong>${invoiceNumber}</strong> d'un montant de <strong>${amount.toFixed(2)} €</strong> a été générée avec succès.</p>
            
            <a href="${pdfUrl}" 
               target="_blank" 
               class="button">
              📄 Télécharger la facture PDF
            </a>
            
            <p style="color:#666;margin-top:30px;">Merci pour votre confiance !<br>L'équipe Facture Pro</p>
          </div>
        </body>
        </html>
      `,
    })

    if (error) throw error

    console.log('✅ Email envoyé avec bouton cliquable')
    return data
  } catch (error) {
    console.error('Erreur email:', error)
    throw error
  }
}