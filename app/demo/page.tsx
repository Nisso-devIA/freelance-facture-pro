'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { InvoiceForm } from '@/components/InvoiceForm'   // ← CORRIGÉ (avec {})
import { InvoiceTable } from '@/components/InvoiceTable' // ← CORRIGÉ (avec {})

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
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-4xl font-bold mb-4">Limite atteinte (5/5)</h2>
          <p className="text-zinc-400 mb-8">Tu as utilisé toutes tes démos gratuites.</p>
          <a href="/register" className="inline-block bg-white text-black px-10 py-4 rounded-2xl font-bold hover:scale-105 transition">
            Créer un compte gratuit → Illimité
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-5xl font-bold tracking-tighter">Mode Démo</h1>
          <div className="bg-white/10 px-5 py-2 rounded-full text-sm">
            {remaining} utilisation{remaining > 1 ? 's' : ''} restante{remaining > 1 ? 's' : ''}
          </div>
        </div>

        <InvoiceForm 
          onSuccess={handleDemoAction}
          demoMode={true}
          onDemoCreate={(newInvoice: any) => {
            setInvoices(prev => [newInvoice, ...prev])
          }}
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