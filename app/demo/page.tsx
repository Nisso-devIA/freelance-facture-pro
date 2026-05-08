'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { InvoiceForm } from '@/components/InvoiceForm'
import { InvoiceTable } from '@/components/InvoiceTable'

export default function DemoPage() {
  const [remaining, setRemaining] = useState(5)
  const [invoices, setInvoices] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/demo-limit')
      .then(r => r.json())
      .then(data => {
        setRemaining(data.remaining)
        if (data.limitReached) {
          alert("Limite démo atteinte ! Crée un compte pour continuer.")
        }
      })

    const saved = localStorage.getItem('demoInvoices')
    if (saved) setInvoices(JSON.parse(saved))
  }, [])

  const handleDemoAction = (newInvoice: any) => {
    fetch('/api/demo-limit', { method: 'POST' })
      .then(() => fetch('/api/demo-limit'))
      .then(r => r.json())
      .then(data => setRemaining(data.remaining))

    if (newInvoice) {
      const updated = [newInvoice, ...invoices]
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-indigo-950 to-violet-950">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-6xl font-bold tracking-tighter">Mode Démo</h1>
            <p className="text-zinc-400">5 factures gratuites • Tout est effacé à la fermeture</p>
          </div>
          <div className="bg-white/10 px-8 py-4 rounded-3xl border border-white/10 flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <span className="text-xl font-semibold">{remaining} restantes</span>
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
          onDemoDelete={handleDemoDelete}
          onMarkAsPaid={handleMarkAsPaidDemo}
        />

        <div className="text-center mt-12">
          <Link href="/" className="text-violet-400 hover:text-violet-300 underline">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}