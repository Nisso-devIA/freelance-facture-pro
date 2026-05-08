'use client'

import { Download, Trash2, CheckCircle, Clock, CreditCard } from 'lucide-react'
import { createClientComponentClient } from '@/lib/supabase'

interface Invoice {
  id: string
  number: string
  client_name: string
  client_email?: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  created_at: string
  pdf_url?: string
}

interface InvoiceTableProps {
  invoices: Invoice[]
  loading: boolean
  onRefresh: () => void
  demoMode?: boolean
  onDemoDelete?: (id: string) => void
  onMarkAsPaid?: (id: string) => void          // ← AJOUTÉ
}

export function InvoiceTable({ 
  invoices, 
  loading, 
  onRefresh, 
  demoMode = false,
  onDemoDelete,
  onMarkAsPaid 
}: InvoiceTableProps) {

  const supabase = createClientComponentClient()

  const markAsPaid = async (id: string, number: string) => {
    if (!confirm(`Marquer la facture ${number} comme PAYÉE ?`)) return

    if (demoMode) {
      alert(`✅ ${number} marquée comme payée (démo)`)
      onRefresh()
      return
    }

    const { error } = await supabase
      .from('invoices')
      .update({ status: 'paid' })
      .eq('id', id)

    if (error) alert('Erreur lors de la mise à jour')
    else {
      alert(`✅ Facture ${number} marquée comme payée !`)
      onRefresh()
    }
  }

  const handleStripePayment = async (inv: Invoice) => {
    if (!inv.client_email) {
      alert("Aucun email client pour le paiement Stripe")
      return
    }

    if (demoMode) {
      alert(`💳 Paiement Stripe simulé pour ${inv.number} (démo)`)
      markAsPaid(inv.id, inv.number)
      return
    }

    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invoiceId: inv.id,
        amount: inv.amount,
        clientEmail: inv.client_email,
        invoiceNumber: inv.number
      })
    })

    const { url } = await res.json()
    if (url) window.location.href = url
  }

  const handleDelete = (id: string, number: string) => {
    if (!confirm(`Supprimer définitivement ${number} ?`)) return

    if (demoMode && onDemoDelete) {
      onDemoDelete(id)
    } else {
      onRefresh()
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === 'paid') {
      return (
        <span className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-5 py-1.5 rounded-full text-sm font-medium border border-emerald-500/30">
          <CheckCircle size={18} /> Payée
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-5 py-1.5 rounded-full text-sm font-medium border border-blue-500/30">
        <Clock size={18} /> Envoyée
      </span>
    )
  }

  return (
    <div className="glass rounded-3xl p-6 md:p-8 mt-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Historique des factures</h2>
        <button onClick={onRefresh} className="text-violet-400 hover:text-white flex items-center gap-2">
          ↻ Actualiser
        </button>
      </div>

      {invoices.length === 0 ? (
        <p className="text-zinc-500 text-center py-20 text-lg">Aucune facture pour le moment</p>
      ) : (
        <>
          {/* MOBILE / TABLETTE - Cartes */}
          <div className="md:hidden space-y-4">
            {invoices.map((inv) => (
              <div key={inv.id} className="bg-zinc-900/80 border border-white/10 rounded-3xl p-6 hover:border-violet-500/30 transition-all">
                <div className="flex justify-between">
                  <div>
                    <p className="font-mono text-lg text-white">{inv.number}</p>
                    <p className="text-white font-medium">{inv.client_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{inv.amount.toFixed(2)} €</p>
                    {getStatusBadge(inv.status)}
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <span className="text-sm text-zinc-400">
                    {new Date(inv.created_at).toLocaleDateString('fr-FR')}
                  </span>
                  <div className="flex gap-4">
                    {inv.pdf_url && <a href={inv.pdf_url} target="_blank" className="text-blue-400 hover:text-blue-300"><Download size={24} /></a>}
                    
                    {inv.status !== 'paid' && (
                      <>
                        <button onClick={() => markAsPaid(inv.id, inv.number)} className="text-emerald-400 hover:text-emerald-300">
                          <CheckCircle size={24} />
                        </button>
                        <button onClick={() => handleStripePayment(inv)} className="text-purple-400 hover:text-purple-300">
                          <CreditCard size={24} />
                        </button>
                      </>
                    )}
                    <button onClick={() => handleDelete(inv.id, inv.number)} className="text-red-400 hover:text-red-300">
                      <Trash2 size={24} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP - Tableau */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 text-zinc-400 font-medium">N° Facture</th>
                  <th className="text-left py-4 text-zinc-400 font-medium">Client</th>
                  <th className="text-right py-4 text-zinc-400 font-medium">Montant</th>
                  <th className="text-center py-4 text-zinc-400 font-medium">Statut</th>
                  <th className="text-center py-4 text-zinc-400 font-medium">Date</th>
                  <th className="text-center py-4 text-zinc-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/5 transition-all group">
                    <td className="py-5 font-mono text-white">{inv.number}</td>
                    <td className="py-5 text-white">{inv.client_name}</td>
                    <td className="py-5 text-right font-bold text-white">{inv.amount.toFixed(2)} €</td>
                    <td className="py-5 text-center">{getStatusBadge(inv.status)}</td>
                    <td className="py-5 text-zinc-400 text-sm">{new Date(inv.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="py-5 text-center flex justify-center gap-5">
                      {inv.pdf_url && (
                        <a href={inv.pdf_url} target="_blank" className="text-blue-400 hover:text-blue-300 transition">
                          <Download size={22} />
                        </a>
                      )}
                      {inv.status !== 'paid' && (
                        <>
                          <button onClick={() => markAsPaid(inv.id, inv.number)} className="text-emerald-400 hover:text-emerald-300 transition" title="Marquer comme payée">
                            <CheckCircle size={24} />
                          </button>
                          <button onClick={() => handleStripePayment(inv)} className="text-purple-400 hover:text-purple-300 transition" title="Payer avec Stripe">
                            <CreditCard size={24} />
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDelete(inv.id, inv.number)} className="text-red-400 hover:text-red-300 transition">
                        <Trash2 size={22} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}