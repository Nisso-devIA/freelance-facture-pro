'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

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

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-10">
        <h1 className="text-5xl font-bold text-white tracking-tighter mb-8">Connexion</h1>

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

          {error && <p className="text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-5 rounded-2xl text-xl hover:brightness-110 transition disabled:opacity-70"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}