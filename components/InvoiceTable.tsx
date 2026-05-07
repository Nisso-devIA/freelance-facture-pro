'use client'

import { Download, Trash2, CheckCircle, Clock } from 'lucide-react'

interface Invoice {
  id: string
  number: string
  client_name: string
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
  onMarkAsPaid?: (id: string) => void
}

export function InvoiceTable({ 
  invoices, 
  loading, 
  onRefresh, 
  demoMode = false,
  onDemoDelete,
  onMarkAsPaid 
}: InvoiceTableProps) {

  const markAsPaid = (id: string, number: string) => {
    if (!confirm(`Marquer ${number} comme PAYÉE ?`)) return
    onMarkAsPaid?.(id)
    onRefresh()
  }

  const handleDelete = (id: string, number: string) => {
    if (!confirm(`Supprimer ${number} ?`)) return
    if (demoMode && onDemoDelete) onDemoDelete(id)
    else onRefresh()
  }

  const getStatusBadge = (status: string) => {
    if (status === 'paid') {
      return <span className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-5 py-1.5 rounded-full text-sm font-medium"><CheckCircle size={18} /> Payée</span>
    }
    return <span className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-5 py-1.5 rounded-full text-sm font-medium"><Clock size={18} /> Envoyée</span>
  }

  return (
    <div className="glass rounded-3xl p-6 md:p-8 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Historique des factures</h2>
        <button onClick={onRefresh} className="text-violet-400 hover:text-white">↻ Actualiser</button>
      </div>

      {invoices.length === 0 ? (
        <p className="text-zinc-500 text-center py-16">Aucune facture pour le moment</p>
      ) : (
        <>
          {/* Mobile + Tablette : Cartes */}
          <div className="md:hidden space-y-4">
            {invoices.map((inv) => (
              <div key={inv.id} className="bg-zinc-900 border border-white/10 rounded-3xl p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-mono text-lg">{inv.number}</p>
                    <p className="text-white">{inv.client_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{inv.amount.toFixed(2)} €</p>
                    {getStatusBadge(inv.status)}
                  </div>
                </div>
                <div className="mt-6 flex justify-between text-sm text-zinc-400">
                  <span>{new Date(inv.created_at).toLocaleDateString('fr-FR')}</span>
                  <div className="flex gap-6">
                    {inv.pdf_url && <a href={inv.pdf_url} target="_blank"><Download size={22} /></a>}
                    {inv.status !== 'paid' && <button onClick={() => markAsPaid(inv.id, inv.number)}><CheckCircle size={24} /></button>}
                    <button onClick={() => handleDelete(inv.id, inv.number)}><Trash2 size={22} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop : Tableau */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4">N° Facture</th>
                  <th className="text-left py-4">Client</th>
                  <th className="text-right py-4">Montant</th>
                  <th className="text-center py-4">Statut</th>
                  <th className="text-center py-4">Date</th>
                  <th className="text-center py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/5 transition">
                    <td className="py-5 font-mono text-white">{inv.number}</td>
                    <td className="py-5 text-white">{inv.client_name}</td>
                    <td className="py-5 text-right font-bold text-white">{inv.amount.toFixed(2)} €</td>
                    <td className="py-5 text-center">{getStatusBadge(inv.status)}</td>
                    <td className="py-5 text-zinc-400 text-sm">{new Date(inv.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="py-5 text-center flex gap-4">
                      {inv.pdf_url && <a href={inv.pdf_url} target="_blank"><Download size={20} /></a>}
                      {inv.status !== 'paid' && <button onClick={() => markAsPaid(inv.id, inv.number)}><CheckCircle size={22} /></button>}
                      <button onClick={() => handleDelete(inv.id, inv.number)}><Trash2 size={20} /></button>
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