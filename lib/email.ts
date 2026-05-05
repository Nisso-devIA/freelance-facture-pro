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
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://ton-domaine.vercel.app' 
    : 'http://localhost:3000'

  try {
    const res = await fetch(`${baseUrl}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, clientName, invoiceNumber, amount, pdfUrl }),
    })

    const result = await res.json()

    if (result.success) {
      console.log('✅ Email envoyé via API Route')
    } else {
      console.error('❌ Erreur API:', result.error)
    }
  } catch (err) {
    console.error('💥 Erreur fetch email:', err)
  }
}