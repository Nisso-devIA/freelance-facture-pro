'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { InvoiceForm } from '@/components/InvoiceForm'
import { InvoiceTable } from '@/components/InvoiceTable'
import Navbar from '@/components/Navbar'
import { useSearchParams } from 'next/navigation'

export default function Dashboard() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isPro, setIsPro] = useState(false)

  const supabase = useMemo(() => createClientComponentClient(), [])
  const searchParams = useSearchParams()

  const fetchUserAndInvoices = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Vérification du statut Pro depuis les metadata Stripe
    const isProUser = user.user_metadata?.is_pro === true
    setIsPro(isProUser)

    console.log('🔍 Statut Pro détecté :', isProUser) // ← Debug pour voir dans la console

    // Récupération des factures
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setInvoices(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchUserAndInvoices()

    // Rafraîchissement automatique après retour du paiement Stripe
    if (searchParams.get('success') === 'true') {
      fetchUserAndInvoices()
    }
  }, [fetchUserAndInvoices, searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-indigo-950 to-violet-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-6xl font-bold tracking-tighter">Dashboard</h1>
            <p className="text-zinc-400">Gère tes factures électroniques pro</p>
          </div>

          {isPro ? (
            <div className="bg-emerald-500/10 text-emerald-400 px-6 py-3 rounded-3xl flex items-center gap-3">
              <span className="text-xl">⭐</span>
              <span className="font-bold">Compte Pro actif</span>
            </div>
          ) : (
            <button
              onClick={() => window.location.href = '/pricing'}
              className="bg-white text-black px-8 py-4 rounded-3xl font-bold hover:scale-105 transition-all"
            >
              Passer en Pro
            </button>
          )}
        </div>

        <InvoiceForm onSuccess={fetchUserAndInvoices} />
        <InvoiceTable 
          invoices={invoices} 
          loading={loading} 
          onRefresh={fetchUserAndInvoices} 
        />
      </div>
    </div>
  )
}