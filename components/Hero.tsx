'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <div className="flex-1 flex items-center pt-12 md:pt-0">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Texte */}
        <div className="space-y-8">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter leading-none">
            Factures pros,<br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              envoyées en 30 secondes.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-300 max-w-lg">
            Crée ta facture, génère un PDF magnifique et envoie-la par email.<br />
            Simple, rapide et professionnel.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/demo"
              className="px-10 py-5 bg-white text-black font-semibold rounded-3xl text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/20 flex-1 md:flex-none text-center"
            >
              Commencer gratuitement →
            </Link>

            <Link
              href="/login"
              className="px-10 py-5 border border-white/30 hover:border-white/60 font-medium rounded-3xl text-lg transition-all flex-1 md:flex-none text-center"
            >
              Voir le dashboard
            </Link>
          </div>
        </div>

        {/* Mockup Facture */}
        <div className="hidden md:flex justify-center relative">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
            {/* Ton mockup actuel reste identique */}
            <div className="flex justify-between mb-8">
              <div>
                <div className="font-bold text-xl text-black">Alexandre Martin</div>
                <div className="text-xs text-zinc-500">Développeur Freelance</div>
                <div className="text-xs text-zinc-500 mt-1">123 Rue du Code • 75002 Paris</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-zinc-500">Facture N°</div>
                <div className="font-mono font-semibold text-black">FAC-39281</div>
                <div className="text-xs text-zinc-500 mt-2">07 Mai 2026</div>
              </div>
            </div>

            <div className="border-t border-zinc-200 my-6"></div>

            <div className="mb-8 text-black">
              <div className="text-xs text-zinc-500 mb-2">FACTURER À</div>
              <div className="font-semibold">Sophie Martin</div>
              <div className="text-sm text-zinc-600">sophie.martin@gmail.com</div>
              <div className="text-sm text-zinc-600">123 Avenue des Lilas</div>
            </div>

            <div className="flex justify-end mb-8">
              <div className="text-right">
                <div className="text-xs text-zinc-500">Montant total</div>
                <div className="text-4xl font-bold text-emerald-600">429 €</div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-2xl py-8 text-center">
              <div className="text-emerald-600 font-semibold text-2xl flex items-center justify-center gap-3">
                Payée avec succès <span className="text-3xl">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}