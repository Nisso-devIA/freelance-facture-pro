'use client'

import { useState, useMemo, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import { generatePDF } from '@/lib/pdf-template'
import { sendInvoiceEmail } from '@/lib/email'
import { Upload, X } from 'lucide-react'

interface InvoiceItem { description: string; quantity: number; price: number }

interface InvoiceFormProps {
  onSuccess?: (invoice?: any) => void
  demoMode?: boolean
  onDemoCreate?: (newInvoice: any) => void
}

export function InvoiceForm({ onSuccess, demoMode = false, onDemoCreate }: InvoiceFormProps) {
  const [items, setItems] = useState<InvoiceItem[]>([{ description: '', quantity: 1, price: 0 }])
  const [loading, setLoading] = useState(false)

  // Logo
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  // Émetteur
  const [emitter, setEmitter] = useState({
    name: "Alexandre Martin",
    address: "123 Rue du Code, 75002 Paris",
    siret: "12345678901234",
    tva: "FR12345678901",
    logoUrl: "" as string
  })

  const supabase = createClientComponentClient()
  const serviceSupabase = useMemo(() => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
  ), [])

  useEffect(() => {
    const saved = localStorage.getItem('invoiceEmitter')
    if (saved) {
      const parsed = JSON.parse(saved)
      setEmitter(parsed)
      if (parsed.logoUrl) setLogoPreview(parsed.logoUrl)
    }
  }, [])

  const updateEmitter = (field: string, value: string) => {
    const newEmitter = { ...emitter, [field]: value }
    setEmitter(newEmitter)
    localStorage.setItem('invoiceEmitter', JSON.stringify(newEmitter))
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))

    const fileExt = file.name.split('.').pop()
    const fileName = `logos/${Date.now()}.${fileExt}`

    const { error } = await serviceSupabase.storage
      .from('invoices')
      .upload(fileName, file, { upsert: true })

    if (error) return alert("Erreur upload logo")

    const { data: { publicUrl } } = serviceSupabase.storage
      .from('invoices')
      .getPublicUrl(fileName)

    const newEmitter = { ...emitter, logoUrl: publicUrl }
    setEmitter(newEmitter)
    localStorage.setItem('invoiceEmitter', JSON.stringify(newEmitter))
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
    const newEmitter = { ...emitter, logoUrl: '' }
    setEmitter(newEmitter)
    localStorage.setItem('invoiceEmitter', JSON.stringify(newEmitter))
  }

  const [clientType, setClientType] = useState<'particulier' | 'pro'>('particulier')
  const [client, setClient] = useState({ name: "", email: "", address: "", siret: "", tva: "" })

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
      number,
      emitter,
      client: { ...client, type: clientType },
      amount: total,
      items,
      status: 'sent',
      created_at: new Date().toISOString()
    }

    try {
      // ==================== MODE DÉMO ====================
      // ==================== MODE DÉMO ====================
if (demoMode && onDemoCreate) {
  onDemoCreate(invoiceData)

  const pdfBlob = await generatePDF(invoiceData, true)
  
  // Téléchargement direct
  const url = URL.createObjectURL(pdfBlob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${invoiceData.number}.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  // Option email (si email renseigné)
  if (client.email) {
    try {
      await sendInvoiceEmail({
        to: client.email,
        clientName: client.name,
        invoiceNumber: number,
        amount: total,
        pdfUrl: url   // Ne marchera pas dans l'email, mais on garde pour log
      })
      alert(`✅ Facture démo ${number} téléchargée + email envoyé !`)
    } catch (e) {
      alert(`✅ Facture démo ${number} téléchargée (email non envoyé)`)
    }
  } else {
    alert(`✅ Facture démo ${number} téléchargée avec succès !`)
  }

  setLoading(false)
  return
}

      // ==================== MODE NORMAL ====================
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non connecté")

      const { data: inserted } = await supabase
        .from('invoices')
        .insert({ user_id: user.id, ...invoiceData })
        .select()
        .single()

      const pdfBlob = await generatePDF(invoiceData, false)
      const fileName = `${number}.pdf`

      await serviceSupabase.storage.from('invoices').upload(fileName, pdfBlob, { upsert: true })
      const { data: { publicUrl } } = serviceSupabase.storage.from('invoices').getPublicUrl(fileName)

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

      if (!res.ok) throw new Error('Failed to send email')

      alert(`✅ Facture ${number} envoyée à ${client.email}`)
      onSuccess?.(inserted)

    } catch (err: any) {
      console.error(err)
      alert('Erreur : ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass rounded-3xl p-8">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white tracking-tight">Nouvelle Facture</h2>

      {/* Logo Upload */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-4 text-white">Logo de votre entreprise</h3>
        <label className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-white/30 rounded-3xl cursor-pointer hover:border-violet-500 transition-all group">
          {logoPreview ? (
            <div className="relative">
              <img src={logoPreview} alt="logo" className="max-h-40 object-contain rounded-xl" />
              <button onClick={removeLogo} className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full">
                <X size={18} />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto text-5xl text-zinc-400 mb-3 group-hover:text-violet-400" />
              <p className="text-zinc-400">Uploader votre logo</p>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
        </label>
      </div>

      {/* ÉMETTEUR */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-white">Émetteur (vous)</h3>
        <div className="grid grid-cols-1 gap-4">
          <input value={emitter.name} onChange={(e) => updateEmitter('name', e.target.value)} placeholder="Nom entreprise / Nom complet" className="input" />
          <input value={emitter.address} onChange={(e) => updateEmitter('address', e.target.value)} placeholder="Adresse complète" className="input" />
          <div className="grid grid-cols-2 gap-4">
            <input value={emitter.siret} onChange={(e) => updateEmitter('siret', e.target.value)} placeholder="SIRET" className="input" />
            <input value={emitter.tva} onChange={(e) => updateEmitter('tva', e.target.value)} placeholder="Numéro TVA" className="input" />
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
          <input value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} placeholder="Nom et Prénom *" className="input" />
          <input value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} placeholder="Email *" type="email" className="input" />
          <input value={client.address} onChange={(e) => setClient({ ...client, address: e.target.value })} placeholder="Adresse complète *" className="input" />

          {clientType === 'pro' && (
            <div className="grid grid-cols-2 gap-4">
              <input value={client.siret} onChange={(e) => setClient({ ...client, siret: e.target.value })} placeholder="SIRET *" className="input" />
              <input value={client.tva} onChange={(e) => setClient({ ...client, tva: e.target.value })} placeholder="Numéro TVA *" className="input" />
            </div>
          )}
        </div>
      </div>

      {/* Prestations */}
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

      <button onClick={handleSubmit} disabled={loading} className="w-full btn-primary text-lg py-6">
        {loading ? 'Création & Envoi en cours...' : demoMode ? 'Créer & Envoyer en Démo' : 'Créer & Envoyer la Facture'}
      </button>
    </div>
  )
}