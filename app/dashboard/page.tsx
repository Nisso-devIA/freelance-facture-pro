'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { InvoiceForm } from '@/components/InvoiceForm'
import { InvoiceTable } from '@/components/InvoiceTable'
import Navbar from '@/components/Navbar'

export default function Dashboard() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClientComponentClient()

  const fetchInvoices = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setInvoices(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-indigo-950 to-violet-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-6xl font-bold tracking-tighter">Dashboard</h1>
          <p className="text-zinc-400 text-xl">Vue d'ensemble de ton activité</p>
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