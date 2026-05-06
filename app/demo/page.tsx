'use client'

import { useState, useCallback } from 'react'
import { InvoiceForm } from '@/components/InvoiceForm'
import { InvoiceTable } from '@/components/InvoiceTable'
import Navbar from '@/components/Navbar'

interface Invoice {
  id: string
  number: string
  client_name: string
  client_email?: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  created_at: string
  pdf_url?: string
  [key: string]: any
}

export default function DemoDashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([])

  const addDemoInvoice = useCallback((newInvoice: any) => {
    const invoice: Invoice = {
      id: 'demo-' + Date.now(),
      number: newInvoice.number || 'FAC-' + Date.now().toString().slice(-8),
      client_name: newInvoice.client_name || 'Client Démo',
      client_email: newInvoice.client_email,
      amount: newInvoice.amount || 0,
      status: 'sent',
      created_at: new Date().toISOString(),
      ...newInvoice,
    }
    setInvoices(prev => [invoice, ...prev])
  }, [])

  const deleteDemoInvoice = useCallback((id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-6 py-2 rounded-full mb-4">
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">MODE DÉMO — Tout est effacé au rechargement</span>
          </div>
          <h1 className="text-6xl font-bold tracking-tighter text-white">Dashboard Démo</h1>
          <p className="text-zinc-400 text-xl mt-3">Testez la création de factures sans compte</p>
        </div>

        <InvoiceForm 
          demoMode={true}
          onDemoCreate={addDemoInvoice}
        />

        <InvoiceTable 
          invoices={invoices} 
          loading={false}
          onRefresh={() => {}}
          demoMode={true}
          onDemoDelete={deleteDemoInvoice}
        />
      </div>
    </div>
  )
}