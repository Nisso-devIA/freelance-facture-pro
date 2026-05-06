'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <div className="flex-1 flex items-center">
      <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        
        {/* Texte */}
        <div className="space-y-8">
          <h1 className="text-6xl md:text-7xl font-semibold tracking-tighter leading-none">
            Factures pros,<br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              envoyées en 30 secondes.
            </span>
          </h1>

          <p className="text-xl text-zinc-300 max-w-lg">
            Crée ta facture, génère un PDF magnifique et envoie-la par email.<br />
            Simple, rapide et professionnel.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/demo"
              className="px-10 py-5 bg-white text-black font-semibold rounded-3xl text-lg hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-white/20"
            >
              Commencer gratuitement →
            </Link>

            <Link
              href="/login"
              className="px-10 py-5 border border-white/30 hover:border-white/60 font-medium rounded-3xl text-lg transition-all duration-300"
            >
              Voir le dashboard
            </Link>
          </div>
        </div>

        {/* Illustration */}
        <div className="hidden md:flex justify-center relative">
          <div className="w-96 h-96 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 rounded-[4rem] blur-3xl"></div>
            <div className="relative bg-zinc-900/90 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white rounded-2xl p-6 text-black">
                <div className="flex justify-between mb-6">
                  <div className="font-semibold">Facture #FAC-39281</div>
                  <div className="text-emerald-600 font-bold">429 €</div>
                </div>
                <div className="text-sm text-zinc-600 mb-8">Client : Sophie Martin</div>
                <div className="text-center py-6 border-t border-black/10 text-emerald-600 font-medium">
                  Payée avec succès ✓
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}