'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { InvoiceForm } from '@/components/InvoiceForm'
import { InvoiceTable } from '@/components/InvoiceTable'
import Navbar from '@/components/Navbar'

export default function Dashboard() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isPro, setIsPro] = useState(false)
  const [invoiceCountThisMonth, setInvoiceCountThisMonth] = useState(0)

  const supabase = useMemo(() => createClientComponentClient(), [])

  const fetchUserAndInvoices = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const isProUser = user.user_metadata?.is_pro === true
    setIsPro(isProUser)

    // Récupération des factures
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setInvoices(data || [])

    // Compteur du mois en cours pour les utilisateurs non-Pro
    if (!isProUser) {
      const now = new Date()
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      const { count } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', firstDay)

      setInvoiceCountThisMonth(count || 0)
    }

    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchUserAndInvoices()
  }, [fetchUserAndInvoices])

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
              <span className="font-bold">Compte Pro actif • Illimité</span>
            </div>
          ) : (
            <div className="text-right">
              <div className="text-sm text-zinc-400">Connecté Gratuit</div>
              <div className="text-emerald-400 font-medium">
                {invoiceCountThisMonth}/20 factures ce mois-ci
              </div>
              <button
                onClick={() => window.location.href = '/pricing'}
                className="mt-2 bg-white text-black px-6 py-2.5 rounded-3xl font-bold hover:scale-105 transition-all text-sm"
              >
                Passer en Pro
              </button>
            </div>
          )}
        </div>

        <InvoiceForm 
          onSuccess={fetchUserAndInvoices} 
          demoMode={false} 
        />
        <InvoiceTable 
          invoices={invoices} 
          loading={loading} 
          onRefresh={fetchUserAndInvoices} 
        />
      </div>
    </div>
  )
}