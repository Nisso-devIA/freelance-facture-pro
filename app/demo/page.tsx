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

  useEffect(() => {
    fetch('/api/demo-limit')
      .then(r => r.json())
      .then(data => {
        setRemaining(data.remaining)
        setLimitReached(data.limitReached)
        if (data.limitReached) router.push('/register')
      })
  }, [router])

  const handleDemoAction = async () => {
    await fetch('/api/demo-limit', { method: 'POST' })
    const res = await fetch('/api/demo-limit')
    const data = await res.json()
    setRemaining(data.remaining)
    if (data.remaining <= 0) router.push('/register')
  }

  if (limitReached) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-950 to-fuchsia-950 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="text-6xl mb-6">⛔</div>
          <h2 className="text-5xl font-bold tracking-tighter mb-4">Limite atteinte</h2>
          <p className="text-xl text-zinc-300 mb-10">Tu as utilisé tes 5 démos gratuites.</p>
          <a href="/register" className="inline-block bg-white text-black px-12 py-5 rounded-3xl font-bold text-xl hover:scale-105 transition-all">
            Créer un compte → Illimité
          </a>
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
            <p className="text-zinc-400 mt-2">Essaye gratuitement — 5 factures max</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl px-8 py-3 rounded-3xl border border-white/10 flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="font-medium">{remaining} utilisation{remaining > 1 ? 's' : ''} restante{remaining > 1 ? 's' : ''}</span>
          </div>
        </div>

        <InvoiceForm 
          onSuccess={handleDemoAction}
          demoMode={true}
          onDemoCreate={(newInvoice: any) => setInvoices(prev => [newInvoice, ...prev])}
        />

        <InvoiceTable 
          invoices={invoices} 
          loading={false} 
          onRefresh={() => {}} 
          demoMode={true}
        />
      </div>
    </div>
  )
}