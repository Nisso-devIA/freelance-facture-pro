'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-indigo-950 to-violet-950 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-3xl mb-6">
            <span className="text-emerald-400">●</span>
            <span className="font-medium">Disponible maintenant</span>
          </div>

          <h1 className="text-7xl md:text-8xl font-bold tracking-tighter leading-none mb-6">
            Factures pros.<br />
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Envoyées en 30 secondes.
            </span>
          </h1>

          <p className="text-2xl text-zinc-300 mb-10">
            Crée, PDF magnifique, envoi email automatique.<br />
            Zéro prise de tête pour les freelances.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/demo"
              className="px-10 py-6 bg-white text-black font-bold text-2xl rounded-3xl hover:scale-105 transition-all shadow-2xl"
            >
              Commencer gratuitement →
            </Link>

            <Link
              href="/pricing"
              className="px-10 py-6 border border-white/40 hover:bg-white/10 font-bold text-2xl rounded-3xl transition-all"
            >
              Voir les tarifs
            </Link>
          </div>
        </div>
      </div>

      <footer className="text-center text-zinc-500 py-8 border-t border-white/10">
        © ShadowForge Inc • Facture Pro 2026
      </footer>
    </div>
  )
}