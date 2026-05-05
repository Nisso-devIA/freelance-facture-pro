'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    })
    if (error) alert('❌ ' + error.message)
    else {
      alert('✅ Compte créé ! Vérifie ton email.')
      router.push('/login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="mx-auto w-24 h-24 bg-white text-black rounded-3xl flex items-center justify-center text-6xl font-black mb-6">FP</div>
          <h1 className="text-5xl font-bold tracking-tight">Créer un compte</h1>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
          <form onSubmit={handleRegister} className="space-y-6">
            <input type="text" placeholder="Nom complet" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-6 py-5" required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-6 py-5" required />
            <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-6 py-5" required />
            <button type="submit" disabled={loading} className="w-full bg-white text-black font-bold py-5 rounded-2xl text-xl hover:bg-zinc-200">
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>
        </div>
        <p className="text-center mt-8 text-zinc-500">
          Déjà un compte ? <a href="/login" className="text-blue-400">Se connecter</a>
        </p>
      </div>
    </div>
  )
}
