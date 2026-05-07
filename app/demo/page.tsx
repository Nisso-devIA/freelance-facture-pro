'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { InvoiceForm } from '@/components/InvoiceForm'
import { InvoiceTable } from '@/components/InvoiceTable'

export default function DemoPage() {
  const router = useRouter()
  const [remaining, setRemaining] = useState(5)
  const [limitReached, setLimitReached] = useState(false)
  const [invoices, setInvoices] = useState<any[]>([])

  // Charger compteur + factures sauvegardées
  const loadUsage = async () => {
    const res = await fetch('/api/demo-limit')
    const data = await res.json()
    setRemaining(data.remaining)
    setLimitReached(data.limitReached)
    if (data.limitReached) router.push('/register')
  }

  useEffect(() => {
    loadUsage()

    const saved = localStorage.getItem('demoInvoices')
    if (saved) setInvoices(JSON.parse(saved))
  }, [router])

  // Création de facture en démo
  const handleDemoAction = async (newInvoice: any) => {
    await fetch('/api/demo-limit', { method: 'POST' })
    
    const res = await fetch('/api/demo-limit')
    const data = await res.json()
    
    setRemaining(data.remaining)
    setLimitReached(data.limitReached)

    if (newInvoice) {
      const updatedInvoices = [newInvoice, ...invoices]
      setInvoices(updatedInvoices)
      localStorage.setItem('demoInvoices', JSON.stringify(updatedInvoices))
    }

    if (data.limitReached) {
      setTimeout(() => router.push('/register'), 1500)
    }
  }

  // Bouton Payée en mode démo (localStorage)
  const handleMarkAsPaidDemo = (id: string) => {
    const updatedInvoices = invoices.map(inv => 
      inv.id === id ? { ...inv, status: 'paid' } : inv
    )
    setInvoices(updatedInvoices)
    localStorage.setItem('demoInvoices', JSON.stringify(updatedInvoices))
  }

  if (limitReached) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-950 to-violet-950 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-6">🚀</div>
          <h2 className="text-5xl font-bold tracking-tighter mb-4">Limite atteinte (5/5)</h2>
          <p className="text-xl text-zinc-300 mb-10">Tu as utilisé toutes tes démos gratuites.<br />Crée un compte pour continuer sans limite.</p>
          <a href="/register" className="inline-block bg-white text-black px-12 py-6 rounded-3xl font-bold text-xl hover:scale-105 transition-all">
            Créer un compte gratuit →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-indigo-950 to-violet-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-6xl font-bold tracking-tighter">Mode Démo</h1>
            <p className="text-zinc-400 mt-2">Essaye le produit complet — 5 factures maximum</p>
          </div>

          <div className="bg-white/10 backdrop-blur-2xl px-8 py-4 rounded-3xl border border-white/10 flex items-center gap-3 text-lg font-medium">
            <span className="text-emerald-400">●</span>
            {remaining} utilisation{remaining > 1 ? 's' : ''} restante{remaining > 1 ? 's' : ''}
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
          onRefresh={() => {}}
          demoMode={true}
          onMarkAsPaid={handleMarkAsPaidDemo}
        />
      </div>
    </div>
  )
}