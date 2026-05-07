'use client'

import { useState, useMemo, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import { generatePDF } from '@/lib/pdf-template'
import { sendInvoiceEmail } from '@/lib/email'

interface InvoiceItem { description: string; quantity: number; price: number }

interface InvoiceFormProps {
  onSuccess?: (invoice?: any) => void
  demoMode?: boolean
  onDemoCreate?: (newInvoice: any) => void
}

export function InvoiceForm({ onSuccess, demoMode = false, onDemoCreate }: InvoiceFormProps) {
  const [items, setItems] = useState<InvoiceItem[]>([{ description: '', quantity: 1, price: 0 }])
  const [loading, setLoading] = useState(false)

  // Émetteur modifiable
  const [emitter, setEmitter] = useState({
    name: "Alexandre Martin", address: "123 Rue du Code, 75002 Paris",
    siret: "12345678901234", tva: "FR12345678901"
  })

  useEffect(() => {
    const saved = localStorage.getItem('invoiceEmitter')
    if (saved) setEmitter(JSON.parse(saved))
  }, [])

  const updateEmitter = (field: string, value: string) => {
    const newEmitter = { ...emitter, [field]: value }
    setEmitter(newEmitter)
    localStorage.setItem('invoiceEmitter', JSON.stringify(newEmitter))
  }

  const [clientType, setClientType] = useState<'particulier' | 'pro'>('particulier')
  const [client, setClient] = useState({ name: "", email: "", address: "", siret: "", tva: "" })

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

    const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0)
    const number = 'FAC-' + Date.now().toString().slice(-8)

    const invoiceData = {
      number, emitter, client: { ...client, type: clientType },
      amount: total, items, status: 'sent', created_at: new Date().toISOString()
    }

    if (demoMode && onDemoCreate) {
      onDemoCreate(invoiceData)
      setLoading(false)
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non connecté")

      // === INSERT INVOICE ===
      const { data: inserted } = await supabase
        .from('invoices')
        .insert({ user_id: user.id, ...invoiceData })
        .select()
        .single()

      // === GENERATE PDF ===
      const pdfBlob = await generatePDF(invoiceData)
      const fileName = `${number}.pdf`
      await serviceSupabase.storage.from('invoices').upload(fileName, pdfBlob, { upsert: true })
      const { data: { publicUrl } } = serviceSupabase.storage.from('invoices').getPublicUrl(fileName)

      // === SEND EMAIL (relative URL = même projet) ===
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: client.email,
          clientName: client.name,
          invoiceNumber: number,
          amount: total,
          pdfUrl: publicUrl
        })
      })

      const result = await res.json()
      console.log('📧 Email API response:', result)

      if (!res.ok) throw new Error(result.error || 'Failed to send email')

      alert(`✅ Facture ${number} envoyée à ${client.email}`)
      onSuccess?.(inserted)

    } catch (err: any) {
      console.error('Erreur finale:', err)
      alert('Erreur : ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass rounded-3xl p-8">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white tracking-tight">Nouvelle Facture</h2>

      {/* ÉMETTEUR MODIFIABLE */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-white">Émetteur (vous)</h3>
        <div className="grid grid-cols-1 gap-4">
          <input 
            value={emitter.name} 
            onChange={(e) => updateEmitter('name', e.target.value)}
            placeholder="Nom de votre entreprise / Nom complet" 
            className="input" 
          />
          <input 
            value={emitter.address} 
            onChange={(e) => updateEmitter('address', e.target.value)}
            placeholder="Adresse complète" 
            className="input" 
          />
          <div className="grid grid-cols-2 gap-4">
            <input 
              value={emitter.siret} 
              onChange={(e) => updateEmitter('siret', e.target.value)}
              placeholder="SIRET" 
              className="input" 
            />
            <input 
              value={emitter.tva} 
              onChange={(e) => updateEmitter('tva', e.target.value)}
              placeholder="Numéro TVA" 
              className="input" 
            />
          </div>
        </div>
      </div>

      {/* CLIENT */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-white">Client</h3>
        
        <div className="flex gap-3 mb-6">
          <button onClick={() => setClientType('particulier')} className={`flex-1 py-4 rounded-3xl font-medium transition ${clientType === 'particulier' ? 'bg-white text-black' : 'bg-zinc-800 text-white'}`}>Particulier</button>
          <button onClick={() => setClientType('pro')} className={`flex-1 py-4 rounded-3xl font-medium transition ${clientType === 'pro' ? 'bg-white text-black' : 'bg-zinc-800 text-white'}`}>Professionnel</button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <input value={client.name} onChange={(e) => setClient({...client, name: e.target.value})} placeholder="Nom et Prénom *" className="input" />
          <input value={client.email} onChange={(e) => setClient({...client, email: e.target.value})} placeholder="Email *" type="email" className="input" />
          <input value={client.address} onChange={(e) => setClient({...client, address: e.target.value})} placeholder="Adresse complète *" className="input" />

          {clientType === 'pro' && (
            <div className="grid grid-cols-2 gap-4">
              <input value={client.siret} onChange={(e) => setClient({...client, siret: e.target.value})} placeholder="SIRET *" className="input" />
              <input value={client.tva} onChange={(e) => setClient({...client, tva: e.target.value})} placeholder="Numéro TVA *" className="input" />
            </div>
          )}
        </div>
      </div>

      {/* Lignes prestations */}
      <div className="space-y-4 mb-8">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-4">
            <input placeholder="Description" value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} className="input flex-1" />
            <div className="flex gap-4">
              <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 1)} className="input w-24 text-center" />
              <input type="number" step="0.01" value={item.price} onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)} className="input w-32" />
              <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-600 text-3xl px-3">✕</button>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={addItem} className="text-violet-400 hover:text-violet-500 mb-6 text-lg">+ Ajouter une ligne</button>

      <button onClick={handleSubmit} disabled={loading} className="w-full btn-primary text-lg py-6">
        {loading ? 'Création & Envoi en cours...' : demoMode ? 'Créer en Démo' : 'Créer & Envoyer la Facture'}
      </button>
    </div>
  )
}