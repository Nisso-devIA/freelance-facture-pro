'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { InvoiceForm } from '@/components/InvoiceForm'
import { InvoiceTable } from '@/components/InvoiceTable'
import Navbar from '@/components/Navbar'

interface Invoice {
  id: string
  user_id: string
  number: string
  client_name: string
  client_email?: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  created_at: string
  pdf_url?: string
  [key: string]: any
}

export default function Dashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = useMemo(() => createClientComponentClient(), [])

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError("Tu dois être connecté pour voir tes factures.")
        return
      }
      const { data, error: supabaseError } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (supabaseError) throw supabaseError
      setInvoices((data as Invoice[]) || [])
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  // Realtime
  useEffect(() => {
    fetchInvoices()

    const channel = supabase
      .channel('invoices')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, fetchInvoices)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchInvoices, supabase])

  const handleRefresh = useCallback(() => fetchInvoices(), [fetchInvoices])

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

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3">
            <span className="font-medium">🚨 Erreur :</span>
            <span>{error}</span>
            <button onClick={handleRefresh} className="ml-auto px-4 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-xl transition">Réessayer</button>
          </div>
        )}

        <InvoiceForm onSuccess={handleRefresh} />
        <InvoiceTable invoices={invoices} loading={loading} onRefresh={handleRefresh} />
      </div>
    </div>
  )
}