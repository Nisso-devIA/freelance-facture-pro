'use client'

import React from 'react'
import Link from 'next/link'
import { InvoiceForm } from '@/components/InvoiceForm'
import { InvoiceTable } from '@/components/InvoiceTable'

export default function DemoPage() {
  const [remaining, setRemaining] = React.useState(5)
  const [limitReached, setLimitReached] = React.useState(false)
  const [invoices, setInvoices] = React.useState<any[]>([])

  const loadUsage = async () => {
    try {
      const res = await fetch('/api/demo-limit')
      const data = await res.json()
      setRemaining(data.remaining || 5)
      setLimitReached(data.limitReached || false)
    } catch (e) {
      console.error('Erreur chargement limite démo:', e)
    }
  }

  React.useEffect(() => {
    loadUsage()

    const saved = localStorage.getItem('demoInvoices')
    if (saved) {
      setInvoices(JSON.parse(saved))
    }
  }, [])

  const handleDemoAction = async (newInvoice: any) => {
    await fetch('/api/demo-limit', { method: 'POST' })
    await loadUsage()

    if (newInvoice) {
      const invoiceWithId = {
        ...newInvoice,
        id: newInvoice.id || `demo-${Date.now()}-${Math.random().toString(36).slice(2)}`
      }
      const updated = [invoiceWithId, ...invoices]
      setInvoices(updated)
      localStorage.setItem('demoInvoices', JSON.stringify(updated))
    }
  }

  const handleMarkAsPaidDemo = (id: string) => {
    const updated = invoices.map(inv =>
      inv.id === id ? { ...inv, status: 'paid' } : inv
    )
    setInvoices(updated)
    localStorage.setItem('demoInvoices', JSON.stringify(updated))
  }

  const handleDemoDelete = (id: string) => {
    const updated = invoices.filter(inv => inv.id !== id)
    setInvoices(updated)
    localStorage.setItem('demoInvoices', JSON.stringify(updated))
  }

  // Limite atteinte
  if (limitReached) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-950 to-violet-950 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-6">🚀</div>
          <h2 className="text-5xl font-bold tracking-tighter mb-4">Limite atteinte (5/5)</h2>
          <p className="text-xl text-zinc-300 mb-10">
            Tu as utilisé toutes tes démos gratuites.<br />
            Crée un compte pour continuer sans limite.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-black px-12 py-5 rounded-3xl font-bold text-xl hover:scale-105 transition-all"
          >
            Créer mon compte gratuit →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-indigo-950 to-violet-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-6xl font-bold tracking-tighter">Mode Démo</h1>
            <p className="text-zinc-400 mt-2">Essaye le produit complet — 5 factures maximum</p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 border border-white/30 hover:bg-white/10 rounded-3xl text-sm font-medium transition flex items-center gap-2"
            >
              ← Retour à l'accueil
            </Link>

            <div className="bg-white/10 backdrop-blur-2xl px-8 py-4 rounded-3xl border border-white/10 flex items-center gap-3 text-lg font-medium">
              <span className="text-emerald-400">●</span>
              {remaining} utilisation{remaining > 1 ? 's' : ''} restante{remaining > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        <InvoiceForm 
          onSuccess={handleDemoAction}
          demoMode={true}
          onDemoCreate={handleDemoAction}
        />

        <InvoiceTable 
          invoices={invoices} 
          loading={false} 
          onRefresh={loadUsage}
          demoMode={true}
          onDemoDelete={handleDemoDelete}
          onMarkAsPaid={handleMarkAsPaidDemo}
        />
      </div>
    </div>
  )
}