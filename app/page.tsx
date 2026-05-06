'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Home() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) router.push('/dashboard')
    }
    checkSession()
  }, [supabase, router])

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <nav className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-2xl flex items-center justify-center text-black font-bold text-xl">F</div>
            <span className="text-2xl font-bold tracking-tighter">Freelance Facture</span>
          </div>
          <Link href="/login" className="px-8 py-3 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition">
            Se connecter
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-3xl mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-zinc-400">Lancé en 2026 • Prêt à facturer</span>
          </div>

          <h1 className="text-7xl font-bold tracking-tighter leading-none mb-6">
            Factures pros.<br />
            Envoyées en 30 secondes.
          </h1>

          <p className="text-2xl text-zinc-400 mb-10">
            Crée, PDF, email.<br />
            Tout automatisé. Zéro prise de tête.
          </p>

          <div className="flex items-center gap-4">
            {/* BOUTON COMMENCER GRATUITEMENT → DEMO MODE */}
            <Link
              href="/demo"
              className="px-10 py-5 bg-white text-black font-bold text-xl rounded-3xl hover:brightness-110 transition flex items-center gap-3"
            >
              Commencer gratuitement →
            </Link>

            <Link
              href="/login"
              className="px-8 py-5 border border-white/30 text-white font-medium rounded-3xl hover:bg-white/5 transition"
            >
              Voir le dashboard
            </Link>
          </div>

          <p className="text-zinc-500 text-sm mt-8 flex items-center gap-2">
            <span className="text-green-400">✓</span>
            Mode démo : tout est effacé au rechargement
          </p>
        </div>
      </div>

      <footer className="border-t border-white/10 py-8 text-center text-zinc-500 text-sm">
        © ShadowForge Inc • Freelance Facture Pro
      </footer>
    </div>
  )
}