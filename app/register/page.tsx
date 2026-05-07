'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Register() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}/dashboard` }
    })

    if (error) setError(error.message)
    else {
      alert('✅ Compte créé ! Vérifie ta boîte mail.')
      router.push('/login')
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/dashboard` }
    })
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-indigo-950 to-violet-950 flex items-center justify-center p-6">
      <div className="glass w-full max-w-md p-10 rounded-3xl">
        <h1 className="text-5xl font-bold tracking-tighter mb-2">Créer un compte</h1>
        <p className="text-zinc-400 mb-10">Commence à facturer en 30 secondes</p>

        <button onClick={handleGoogle} disabled={loading} className="w-full flex items-center justify-center gap-3 bg-white text-black py-5 rounded-2xl font-semibold hover:scale-105 transition mb-8">
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
          S'inscrire avec Google
        </button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <div className="relative text-center text-xs text-zinc-500">ou avec email</div>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <input type="email" placeholder="ton@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input w-full" required />
          <input type="password" placeholder="Mot de passe (min 6 caractères)" value={password} onChange={(e) => setPassword(e.target.value)} className="input w-full" required />
          
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-8">
          Déjà un compte ? <Link href="/login" className="text-white hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}