'use client'

import { Download, Trash2, CheckCircle, AlertCircle, Clock } from 'lucide-react'

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

interface InvoiceTableProps {
  invoices: Invoice[]
  loading: boolean
  onRefresh: () => void
  demoMode?: boolean
  onDemoDelete?: (id: string) => void
}

export function InvoiceTable({ 
  invoices, 
  loading, 
  onRefresh,
  demoMode = false,
  onDemoDelete
}: InvoiceTableProps) {

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return <span className="inline-flex items-center gap-1 text-green-400"><CheckCircle size={18} /> Payée</span>
      case 'sent': return <span className="inline-flex items-center gap-1 text-blue-400"><Clock size={18} /> Envoyée</span>
      case 'draft': return <span className="inline-flex items-center gap-1 text-zinc-400"><AlertCircle size={18} /> Brouillon</span>
      case 'overdue': return <span className="inline-flex items-center gap-1 text-red-400"><AlertCircle size={18} /> En retard</span>
      default: return <span className="text-amber-400">Inconnu</span>
    }
  }

  const handleDelete = (id: string) => {
    if (demoMode && onDemoDelete) {
      onDemoDelete(id)
      return
    }
    // mode normal déjà géré dans l’ancienne version
    console.log('Delete normal', id)
  }

  return (
    <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Historique des factures</h2>
        <button onClick={onRefresh} disabled={loading} className="text-blue-400 hover:text-white flex items-center gap-2 px-4 py-2 rounded-2xl hover:bg-white/5 transition">↻ Actualiser</button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-zinc-500">Chargement...</div>
      ) : invoices.length === 0 ? (
        <p className="text-zinc-500 text-center py-16">Aucune facture pour le moment</p>
      ) : (
        <div className="overflow-x-auto">
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
                <tr key={inv.id} className="hover:bg-white/5 transition">
                  <td className="py-4 font-mono text-white">{inv.number}</td>
                  <td className="py-4 text-white">{inv.client_name}</td>
                  <td className="py-4 text-right font-bold text-white">{inv.amount.toFixed(2)} €</td>
                  <td className="py-4 text-center">{getStatusBadge(inv.status)}</td>
                  <td className="py-4 text-zinc-400 text-sm">{new Date(inv.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="py-4 text-center flex justify-center gap-4">
                    {inv.pdf_url && <a href={inv.pdf_url} target="_blank" className="text-blue-400 hover:text-white"><Download size={20} /></a>}
                    <button onClick={() => handleDelete(inv.id)} className="text-red-400 hover:text-red-500"><Trash2 size={20} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}