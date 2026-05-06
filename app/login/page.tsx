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

  // Connexion classique email/mdp
  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const email = form.email.value
    const password = form.password.value

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) setError(authError.message)
    else router.push('/dashboard')

    setLoading(false)
  }

  // Connexion avec Google
  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/dashboard`
      }
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-10">
        <h1 className="text-5xl font-bold text-white tracking-tighter mb-2">Connexion</h1>
        <p className="text-zinc-400 mb-8">Accède à ton dashboard factures</p>

        {/* Bouton Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-5 rounded-2xl font-semibold text-lg hover:brightness-110 transition mb-6"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Se connecter avec Google
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs text-zinc-500">
            ou
          </div>
        </div>

        {/* Formulaire email / mot de passe */}
        <form onSubmit={handleEmailLogin} className="space-y-6">
          <input
            name="email"
            type="email"
            placeholder="ton@email.com"
            className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-white outline-none"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-white outline-none"
            required
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-5 rounded-2xl transition"
          >
            {loading ? 'Connexion...' : 'Se connecter avec email'}
          </button>
        </form>

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