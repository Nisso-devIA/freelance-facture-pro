'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Home() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Redirection automatique si déjà connecté
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      }
    }
    checkSession()
  }, [router, supabase])

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-indigo-950 to-violet-950 text-white flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center">
        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
          
          {/* TEXTE GAUCHE */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-3xl text-sm border border-white/10">
              <span className="text-emerald-400">●</span>
              <span className="font-medium">Disponible maintenant</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-semibold tracking-tighter leading-none">
              Factures pros.<br />
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
                href="/pricing"
                className="px-10 py-5 border border-white/40 hover:border-white/70 font-medium rounded-3xl transition text-lg"
              >
                Voir les tarifs
              </Link>
            </div>
          </div>

          {/* FACTURE RÉALISTE À DROITE */}
          <div className="hidden md:block">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md mx-auto">
              <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-8 py-6 flex justify-between items-start">
                <div>
                  <div className="text-2xl font-bold">Facture Pro</div>
                  <div className="text-sm opacity-90">Freelance Edition</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xl">FAC-20260510</div>
                  <div className="text-sm opacity-75">10 mai 2026</div>
                </div>
              </div>

              <div className="p-8 text-zinc-900 grid grid-cols-2 gap-8">
                <div>
                  <div className="text-xs uppercase text-zinc-500 mb-2">Émetteur</div>
                  <div className="font-semibold">Alexandre Martin</div>
                  <div className="text-sm">123 Rue du Code, 75002 Paris</div>
                  <div className="text-sm">SIRET : 123 456 789 01234</div>
                  <div className="text-sm">TVA : FR12 345678901</div>
                </div>

                <div>
                  <div className="text-xs uppercase text-zinc-500 mb-2">Client</div>
                  <div className="font-semibold">Marie Dubois</div>
                  <div className="text-sm">45 Avenue des Fleurs, 69003 Lyon</div>
                </div>
              </div>

              <div className="px-8 border-t border-b py-6 space-y-4">
                <div className="flex justify-between text-zinc-900">
                  <span>Développement site web</span>
                  <span className="font-medium">1 200 €</span>
                </div>
                <div className="flex justify-between text-zinc-900">
                  <span>Formation React (2h)</span>
                  <span className="font-medium">280 €</span>
                </div>
              </div>

              <div className="px-8 pt-6 pb-8">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-semibold text-zinc-900">Total TTC</span>
                  <span className="text-4xl font-bold text-zinc-900">1 480 €</span>
                </div>

                <div className="mt-8 flex justify-end">
                  <div className="inline-flex items-center gap-3 bg-emerald-500 text-white font-bold text-lg px-8 py-3 rounded-2xl shadow-lg shadow-emerald-500/30">
                    <span className="text-2xl">✅</span>
                    PAYÉ
                  </div>
                </div>
              </div>

              <div className="bg-zinc-50 px-8 py-5 text-center text-xs text-zinc-500">
                Merci pour votre confiance • Paiement reçu
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-zinc-500">
        © ShadowForge Inc • Facture Pro
      </footer>
    </div>
  )
}