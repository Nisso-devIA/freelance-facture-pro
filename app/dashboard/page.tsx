'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { InvoiceForm } from '@/components/InvoiceForm'
import { InvoiceTable } from '@/components/InvoiceTable'
import Navbar from '@/components/Navbar'

export default function Dashboard() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  const fetchInvoices = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erreur Supabase:', error)
      } else {
        setInvoices(data || [])
      }
    } catch (error) {
      console.error('Erreur fetch invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 bg-white/5 px-6 py-2 rounded-full mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-zinc-400">En ligne • Connecté</span>
          </div>
          <h1 className="text-6xl font-bold tracking-tighter text-white">Dashboard</h1>
          <p className="text-zinc-400 text-xl mt-3">Gère tes factures électroniques pro</p>
        </div>

        <InvoiceForm onSuccess={fetchInvoices} />
        <InvoiceTable 
          invoices={invoices} 
          loading={loading} 
          onRefresh={fetchInvoices} 
        />
      </div>
    </div>
  )
}