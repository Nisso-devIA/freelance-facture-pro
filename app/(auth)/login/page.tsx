'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      alert('❌ ' + error.message)
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white text-black rounded-3xl text-5xl font-black mb-6 shadow-xl">
            FP
          </div>
          <h1 className="text-5xl font-bold tracking-tight">Connexion</h1>
          <p className="text-zinc-400 mt-3 text-lg">Accède à ton espace facturation pro</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-6 py-5 text-lg focus:border-white focus:outline-none transition"
              required
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-6 py-5 text-lg focus:border-white focus:outline-none transition"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-zinc-100 text-black font-bold py-5 rounded-2xl text-xl transition disabled:opacity-70"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-zinc-500">
          Pas encore de compte ?{' '}
          <a href="/register" className="text-blue-400 hover:text-blue-500 font-medium">
            Créer un compte
          </a>
        </p>
      </div>
    </div>
  )
}
