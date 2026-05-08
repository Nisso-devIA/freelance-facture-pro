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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #8b5cf6;">Bonjour ${clientName},</h2>
          <p>Votre facture <strong>${invoiceNumber}</strong> d'un montant de <strong>${amount.toFixed(2)} €</strong> a été générée avec succès.</p>
          
          <div style="margin: 30px 0;">
            <a href="${pdfUrl}" 
               target="_blank"
               style="background: linear-gradient(to right, #8b5cf6, #a855f7); 
                      color: white; 
                      padding: 16px 32px; 
                      text-decoration: none; 
                      border-radius: 12px; 
                      font-weight: bold; 
                      display: inline-block;">
              📄 Télécharger la facture PDF
            </a>
          </div>

          <p style="color: #666; font-size: 14px;">
            Merci pour votre confiance !<br>
            L'équipe Facture Pro
          </p>
        </div>
      `,
    })

    if (error) throw error
    console.log('✅ Email envoyé avec lien PDF cliquable')
    return data
  } catch (error) {
    console.error('Erreur envoi email:', error)
    throw error
  }
}