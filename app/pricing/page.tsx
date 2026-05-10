'use client'

import Link from 'next/link'

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-indigo-950 to-violet-950 text-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold tracking-tighter">Tarifs</h1>
          <p className="text-2xl text-zinc-400 mt-4">Choisis ton plan et commence à facturer en 30 secondes</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plan Démo */}
          <div className="glass rounded-3xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold">Démo Gratuit</h2>
            <div className="text-6xl font-bold mt-4 mb-2">0 €</div>
            <p className="text-zinc-400">5 factures</p>
            <Link href="/demo" className="block w-full text-center py-5 mt-8 bg-white text-black rounded-3xl font-bold">Essayer gratuitement</Link>
          </div>

          {/* Plan Pro */}
          <div className="glass rounded-3xl p-8 border-2 border-violet-500 relative">
            <div className="absolute -top-3 right-6 bg-violet-500 text-white text-xs px-4 py-1 rounded-full">POPULAIRE</div>
            <h2 className="text-3xl font-bold">Pro Illimité</h2>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-6xl font-bold">9 €</span>
              <span className="text-zinc-400">/mois</span>
            </div>
            <p className="text-emerald-400">ou 79 € / an (-27%)</p>

            <button 
              onClick={() => window.location.href = '/api/stripe/checkout?plan=monthly'}
              className="w-full py-5 mt-8 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-3xl font-bold text-xl hover:brightness-110"
            >
              Passer en Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}