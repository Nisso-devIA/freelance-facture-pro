import type { Metadata } from 'next'
import './globals.css'     // ← Changé ici (point + slash)

export const metadata: Metadata = {
  title: 'Facture Pro',
  description: 'Factures professionnelles simples et rapides',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}