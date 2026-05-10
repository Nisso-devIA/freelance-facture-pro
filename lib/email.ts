import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null

export async function sendInvoiceEmail(data: {
  to: string
  clientName: string
  invoiceNumber: string
  amount: number
  pdfUrl: string
}) {
  if (!resend) {
    console.warn('⚠️ RESEND_API_KEY absente - mode démo sans envoi email')
    return { success: false, reason: 'no_api_key' }
  }

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: 'Facture Pro <onboarding@resend.dev>',
      to: data.to,
      subject: `Votre facture ${data.invoiceNumber} est prête`,
      html: `
        <h2>Bonjour ${data.clientName},</h2>
        <p>Voici votre facture <strong>${data.invoiceNumber}</strong> (${data.amount.toFixed(2)} €)</p>
        <a href="${data.pdfUrl}" style="background:#8b5cf6;color:white;padding:16px 32px;border-radius:12px;text-decoration:none;font-weight:bold;display:inline-block;margin:20px 0;">
          📄 Télécharger la facture PDF
        </a>
        <p>Merci pour votre confiance !</p>
      `
    })

    if (error) throw error
    return { success: true, data: emailData }
  } catch (err) {
    console.error('Resend error:', err)
    return { success: false }
  }
}