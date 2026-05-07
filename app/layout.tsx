import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Facture Pro',
  description: 'Factures professionnelles envoyées en 30 secondes',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="bg-zinc-950 text-white antialiased">{children}</body>
    </html>
  )
}