'use client'
import { Download, Trash2, CheckCircle } from 'lucide-react'

interface Invoice {
  id: string
  number: string
  client: string
  amount: number
  status: 'sent' | 'paid'
  created_at: string
  pdf_url: string
}

export function InvoiceTable({ invoices, loading, onRefresh }: { 
  invoices: Invoice[], 
  loading: boolean,
  onRefresh: () => void 
}) {
  return (
    <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Historique des factures</h2>
        <button onClick={onRefresh} className="text-blue-400 hover:text-white flex items-center gap-2">
          ↻ Actualiser
        </button>
      </div>

      {invoices.length === 0 ? (
        <p className="text-zinc-500 text-center py-16">Aucune facture pour le moment</p>
      ) : (
        <div className="overflow-x-auto">
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
                  <td className="py-4 font-mono text-white">{inv.number}</td>
                  <td className="py-4">{inv.client}</td>
                  <td className="py-4 text-right font-bold">{inv.amount.toFixed(2)} €</td>
                  <td className="py-4 text-center">
                    {inv.status === 'paid' ? (
                      <span className="inline-flex items-center gap-1 text-green-400">
                        <CheckCircle size={18} /> Payée
                      </span>
                    ) : (
                      <span className="text-amber-400">En attente</span>
                    )}
                  </td>
                  <td className="py-4 text-zinc-400 text-sm">
                    {new Date(inv.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-4 text-center">
                    <a href={inv.pdf_url} target="_blank" className="text-blue-400 hover:text-white mx-2">
                      <Download size={20} />
                    </a>
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