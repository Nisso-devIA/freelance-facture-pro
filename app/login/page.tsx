'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
    setLoading(false)
  }

  const handleMagicLink = async () => {
    if (!email) return alert('Entre ton email enculé')
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/dashboard`
      }
    })

    if (error) {
      setError(error.message)
    } else {
      alert('✅ Magic link envoyé ! Clique sur le lien dans ton mail.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-10">
        <h1 className="text-5xl font-bold text-white tracking-tighter mb-2">Connexion</h1>
        <p className="text-zinc-400 mb-8">Accède à ton dashboard factures</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="ton@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-white outline-none"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-white outline-none"
            required
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-5 rounded-2xl text-xl hover:brightness-110 transition disabled:opacity-70"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <button
          onClick={handleMagicLink}
          disabled={loading}
          className="w-full mt-4 text-blue-400 hover:text-blue-300 py-3 text-sm underline"
        >
          {loading ? 'Envoi...' : 'Envoyer un magic link'}
        </button>

        <p className="text-center text-zinc-500 text-sm mt-8">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-white hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}