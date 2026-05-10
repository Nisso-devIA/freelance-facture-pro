'use client'

import Link from 'next/link'

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-indigo-950 to-violet-950 text-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold tracking-tighter">Choisis ton plan</h1>
          <p className="text-xl text-zinc-400 mt-4">Commence à facturer comme un pro dès aujourd’hui</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Démo */}
          <div className="glass rounded-3xl p-10 border border-white/10">
            <h2 className="text-3xl font-bold">Démo Gratuit</h2>
            <div className="text-7xl font-bold mt-6">0 €</div>
            <p className="text-zinc-400 mt-2">5 factures • Essai complet</p>
            <Link href="/demo" className="block w-full text-center py-6 mt-12 bg-white text-black rounded-3xl font-bold text-xl hover:scale-105 transition-all">
              Essayer gratuitement
            </Link>
          </div>

          {/* Pro */}
          <div className="glass rounded-3xl p-10 border-2 border-violet-500 relative overflow-hidden">
            <div className="absolute top-6 right-6 bg-violet-600 text-white text-sm px-5 py-1 rounded-3xl">Le plus populaire</div>
            
            <h2 className="text-3xl font-bold">Pro Illimité</h2>
            <div className="flex items-baseline gap-3 mt-8">
              <span className="text-7xl font-bold">9 €</span>
              <span className="text-2xl text-zinc-400">/mois</span>
            </div>
            <p className="text-emerald-400 text-xl">ou 79 € / an (2 mois offerts)</p>

            <button
              onClick={() => window.location.href = '/api/stripe/checkout?plan=monthly'}
              className="w-full py-7 mt-12 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-3xl font-bold text-2xl hover:brightness-110 transition-all"
            >
              Devenir Pro maintenant
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}