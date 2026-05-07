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
  onSuccess?: (invoice?: any) => void
  demoMode?: boolean
  onDemoCreate?: (newInvoice: any) => void
}

export function InvoiceForm({ onSuccess, demoMode = false, onDemoCreate }: InvoiceFormProps) {
  const [items, setItems] = useState<InvoiceItem[]>([{ description: '', quantity: 1, price: 0 }])
  const [loading, setLoading] = useState(false)

  // Émetteur fixe
  const [emitter] = useState({
    name: "Alexandre Martin",
    address: "123 Rue du Code, 75002 Paris",
    siret: "12345678901234",
    tva: "FR12345678901"
  })

  // Client
  const [clientType, setClientType] = useState<'particulier' | 'pro'>('particulier')
  const [client, setClient] = useState({
    name: "",
    email: "",
    address: "",
    siret: "",
    tva: ""
  })

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

    if (!client.name || !client.email || !client.address) {
      alert('❌ Nom, email et adresse du client sont obligatoires')
      setLoading(false)
      return
    }
    if (clientType === 'pro' && (!client.siret || !client.tva)) {
      alert('❌ Pour un professionnel, SIRET et TVA sont obligatoires')
      setLoading(false)
      return
    }

    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
    const invoiceNumber = 'FAC-' + Date.now().toString().slice(-8)

    const invoiceData = {
      number: invoiceNumber,
      emitter,
      client: { ...client, type: clientType },
      amount: totalAmount,
      status: 'sent' as const,
      created_at: new Date().toISOString(),
      items,
    }

    // ==================== MODE DÉMO ====================
    if (demoMode && onDemoCreate) {
      onDemoCreate(invoiceData)
      onSuccess?.(invoiceData)

      try {
        const pdfBlob = await generatePDF(invoiceData)
        const pdfUrl = URL.createObjectURL(pdfBlob)

        await sendInvoiceEmail({
          to: client.email,
          clientName: client.name,
          invoiceNumber,
          amount: totalAmount,
          pdfUrl
        })

        alert(`✅ Facture démo ${invoiceNumber} créée et envoyée à ${client.email} !`)
      } catch (e) {
        console.error(e)
        alert(`✅ Facture démo ${invoiceNumber} créée ! (email non envoyé)`)
      }

      setItems([{ description: '', quantity: 1, price: 0 }])
      setClient({ name: "", email: "", address: "", siret: "", tva: "" })
      setLoading(false)
      return
    }

    // ==================== MODE NORMAL (vrai dashboard) ====================
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Utilisateur non connecté")

      // 1. Insert dans Supabase
      const { data: insertedInvoice, error: insertError } = await supabase
        .from('invoices')
        .insert({
          user_id: user.id,
          number: invoiceNumber,
          client_name: client.name,
          client_email: client.email,
          amount: totalAmount,
          status: 'sent',
          items: items,
          emitter: emitter,
          client: client
        })
        .select()
        .single()

      if (insertError) throw insertError

      // 2. Générer PDF
          // 2. Générer PDF
      const pdfBlob = await generatePDF(invoiceData)   // ← plus simple et TS OK

      // 3. Upload PDF dans Storage
      const fileName = `${invoiceNumber}.pdf`
      const { data: uploadData, error: uploadError } = await serviceSupabase
        .storage
        .from('invoices')
        .upload(fileName, pdfBlob, { contentType: 'application/pdf', upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = serviceSupabase
        .storage
        .from('invoices')
        .getPublicUrl(fileName)

      // 4. Envoyer l'email
      await sendInvoiceEmail({
        to: client.email,
        clientName: client.name,
        invoiceNumber,
        amount: totalAmount,
        pdfUrl: publicUrl
      })

      alert(`✅ Facture ${invoiceNumber} créée et envoyée à ${client.email} !`)

      // 5. Rafraîchir l'historique
      onSuccess?.(insertedInvoice)

    } catch (error: any) {
      console.error(error)
      alert('Erreur lors de la création de la facture : ' + error.message)
    }

    // Reset form
    setItems([{ description: '', quantity: 1, price: 0 }])
    setClient({ name: "", email: "", address: "", siret: "", tva: "" })
    setLoading(false)
  }

  return (
    <div className="glass rounded-3xl p-8">
      <h2 className="text-4xl font-bold mb-8 text-white tracking-tight">Nouvelle Facture</h2>

      {/* ÉMETTEUR */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-4 text-white">Émetteur (vous)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={emitter.name} className="input" readOnly />
          <input value={emitter.address} className="input" readOnly />
          <input value={emitter.siret} className="input" readOnly />
          <input value={emitter.tva} className="input" readOnly />
        </div>
      </div>

      {/* CLIENT */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-4 text-white">Client</h3>
        
        <div className="flex gap-4 mb-6">
          <button onClick={() => setClientType('particulier')} className={`flex-1 py-3 rounded-2xl font-medium transition ${clientType === 'particulier' ? 'bg-white text-black' : 'bg-zinc-800 text-white'}`}>Particulier</button>
          <button onClick={() => setClientType('pro')} className={`flex-1 py-3 rounded-2xl font-medium transition ${clientType === 'pro' ? 'bg-white text-black' : 'bg-zinc-800 text-white'}`}>Professionnel</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={client.name} onChange={(e) => setClient({...client, name: e.target.value})} placeholder="Nom et Prénom *" className="input" />
          <input value={client.email} onChange={(e) => setClient({...client, email: e.target.value})} placeholder="Email du client *" type="email" className="input" />
          <input value={client.address} onChange={(e) => setClient({...client, address: e.target.value})} placeholder="Adresse complète *" className="input" />

          {clientType === 'pro' && (
            <>
              <input value={client.siret} onChange={(e) => setClient({...client, siret: e.target.value})} placeholder="SIRET *" className="input" />
              <input value={client.tva} onChange={(e) => setClient({...client, tva: e.target.value})} placeholder="Numéro TVA *" className="input" />
            </>
          )}
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4 items-end">
            <input placeholder="Description" value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} className="input flex-1" />
            <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 1)} className="input w-24 text-center" />
            <input type="number" step="0.01" value={item.price} onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)} className="input w-32" />
            <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-600 text-2xl px-3">✕</button>
          </div>
        ))}
      </div>

      <button type="button" onClick={addItem} className="text-violet-400 hover:text-violet-500 mb-6 text-lg">+ Ajouter une ligne</button>

      <button onClick={handleSubmit} disabled={loading} className="w-full btn-primary">
        {loading ? 'Création & Envoi en cours...' : demoMode ? 'Créer & Envoyer en Démo' : 'Créer & Envoyer la Facture'}
      </button>
    </div>
  )
}