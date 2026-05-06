'use client'

import { useState, useMemo } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import { generatePDF } from '@/lib/pdf-template'
import { sendInvoiceEmail } from '@/lib/email'

interface InvoiceItem {
  description: string
  quantity: number
  price: number
}

interface InvoiceFormProps {
  onSuccess?: () => void
  demoMode?: boolean
  onDemoCreate?: (newInvoice: any) => void
}

export function InvoiceForm({ onSuccess, demoMode = false, onDemoCreate }: InvoiceFormProps) {
  const [items, setItems] = useState<InvoiceItem[]>([{ description: '', quantity: 1, price: 0 }])
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()

  const serviceSupabase = useMemo(() => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
  ), [])

  const addItem = () => setItems([...items, { description: '', quantity: 1, price: 0 }])
  const removeItem = (index: number) => {
    if (items.length === 1) return
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const handleSubmit = async () => {
    setLoading(true)

    const clientName = (document.getElementById('clientName') as HTMLInputElement)?.value?.trim() || ''
    const clientEmail = (document.getElementById('clientEmail') as HTMLInputElement)?.value?.trim() || ''

    if (!clientName || !clientEmail) {
      alert('❌ Nom et email obligatoires')
      setLoading(false)
      return
    }

    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
    const invoiceNumber = 'FAC-' + Date.now().toString().slice(-8)

    // ==================== MODE DÉMO ====================
    if (demoMode && onDemoCreate) {
      onDemoCreate({
        number: invoiceNumber,
        client_name: clientName,
        client_email: clientEmail,
        amount: totalAmount,
        status: 'sent' as const,
        items,
      })
      alert(`✅ Facture démo ${invoiceNumber} créée (effacée au rechargement)`)
      setItems([{ description: '', quantity: 1, price: 0 }])
      setLoading(false)
      return
    }
    // ===================================================

    // Mode normal (Supabase)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Tu dois être connecté')

      const pdfBlob = await generatePDF({ number: invoiceNumber, client: clientName, items })
      const filePath = `${user.id}/${invoiceNumber}.pdf`

      const { error: uploadError } = await serviceSupabase.storage
        .from('invoices')
        .upload(filePath, pdfBlob as any, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('invoices').getPublicUrl(filePath)

      await supabase.from('invoices').insert({
        user_id: user.id,
        number: invoiceNumber,
        client_name: clientName,
        client_email: clientEmail,
        amount: totalAmount,
        status: 'sent',
        items,
        pdf_url: publicUrl,
      })

      await sendInvoiceEmail({ to: clientEmail, clientName, invoiceNumber, amount: totalAmount, pdfUrl: publicUrl })

      alert(`✅ Facture ${invoiceNumber} créée et envoyée !`)
      setItems([{ description: '', quantity: 1, price: 0 }])
      onSuccess?.()
    } catch (err: any) {
      console.error(err)
      alert('❌ ' + (err.message || 'Erreur inconnue'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
      <h2 className="text-4xl font-bold mb-8 text-white tracking-tight">Nouvelle Facture</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <input id="clientName" placeholder="Nom du client" className="bg-zinc-950/80 border border-white/10 rounded-2xl px-6 py-4 text-lg focus:border-white focus:outline-none transition" />
        <input id="clientEmail" type="email" placeholder="Email du client" className="bg-zinc-950/80 border border-white/10 rounded-2xl px-6 py-4 text-lg focus:border-white focus:outline-none transition" />
      </div>

      <div className="space-y-4 mb-8">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4 items-end">
            <input placeholder="Description" value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} className="flex-1 bg-zinc-950/80 border border-white/10 rounded-2xl px-6 py-4" />
            <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 1)} className="w-24 bg-zinc-950/80 border border-white/10 rounded-2xl px-6 py-4 text-center" />
            <input type="number" step="0.01" value={item.price} onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)} className="w-32 bg-zinc-950/80 border border-white/10 rounded-2xl px-6 py-4" />
            <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-600 text-2xl px-3">✕</button>
          </div>
        ))}
      </div>

      <button type="button" onClick={addItem} className="text-blue-400 hover:text-blue-500 mb-6 text-lg">+ Ajouter une ligne</button>

      <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-white to-zinc-200 text-black font-bold py-5 rounded-2xl text-xl hover:brightness-110 disabled:opacity-70 transition">
        {loading ? 'Création en cours...' : demoMode ? 'Créer en mode démo' : 'Créer & Envoyer la Facture'}
      </button>
    </div>
  )
}