'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email.value,
      password: form.password.value,
    })

    if (error) setError(error.message)
    else router.push('/dashboard')

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
        <h1 className="text-5xl font-bold tracking-tighter mb-2">Bienvenue</h1>
        <p className="text-zinc-400 mb-10">Connecte-toi pour accéder à ton espace</p>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-5 rounded-2xl font-semibold hover:scale-105 transition mb-8"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
          Continuer avec Google
        </button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <div className="relative text-center text-xs text-zinc-500">ou avec email</div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-6">
          <input name="email" type="email" placeholder="ton@email.com" className="input w-full" required />
          <input name="password" type="password" placeholder="Mot de passe" className="input w-full" required />
          
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-8">
          Pas encore de compte ? <Link href="/register" className="text-white hover:underline">Créer un compte</Link>
        </p>
      </div>
    </div>
  )
}