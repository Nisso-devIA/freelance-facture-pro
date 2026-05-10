'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Pricing() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }
    checkSession()
  }, [supabase])

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-indigo-950 to-violet-950 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold tracking-tighter">Choisis ton plan</h1>
          <p className="text-xl text-zinc-400 mt-4">Commence à facturer comme un pro dès aujourd’hui</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Démo Gratuit */}
          <div className="glass rounded-3xl p-10 border border-white/10">
            <h2 className="text-3xl font-bold">Démo Gratuit</h2>
            <div className="text-7xl font-bold mt-6">0 €</div>
            <p className="text-zinc-400 mt-2">5 factures • Essai complet</p>
            <Link 
              href="/demo"
              className="block w-full text-center py-6 mt-12 bg-white text-black rounded-3xl font-bold text-xl hover:scale-105 transition-all"
            >
              Essayer gratuitement
            </Link>
          </div>

          {/* Pro Illimité */}
          <div className="glass rounded-3xl p-10 border-2 border-violet-500 relative">
            <div className="absolute -top-3 right-6 bg-violet-500 text-white text-xs px-5 py-1 rounded-3xl">Le plus populaire</div>
            
            <h2 className="text-3xl font-bold">Pro Illimité</h2>

            {/* Mensuel */}
            <div className="mt-8 flex items-baseline gap-3">
              <span className="text-7xl font-bold">9 €</span>
              <span className="text-2xl text-zinc-400">/mois</span>
            </div>
            {isLoggedIn ? (
              <button
                onClick={() => window.location.href = '/api/stripe/checkout?plan=monthly'}
                className="w-full py-6 mt-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-3xl font-bold text-xl hover:brightness-110 transition-all"
              >
                Choisir Mensuel
              </button>
            ) : (
              <button
                onClick={() => router.push('/login?return_to=/pricing')}
                className="w-full py-6 mt-6 border border-white/30 hover:bg-white/10 rounded-3xl font-bold text-xl transition-all"
              >
                Se connecter pour s'abonner
              </button>
            )}

            {/* Annuel */}
            <div className="mt-12 flex items-baseline gap-3">
              <span className="text-7xl font-bold">79 €</span>
              <span className="text-2xl text-zinc-400">/an</span>
              <span className="text-emerald-400 text-sm font-medium">(2 mois offerts)</span>
            </div>
            {isLoggedIn ? (
              <button
                onClick={() => window.location.href = '/api/stripe/checkout?plan=yearly'}
                className="w-full py-6 mt-6 border border-white/30 hover:bg-white/10 rounded-3xl font-bold text-xl transition-all"
              >
                Choisir Annuel
              </button>
            ) : (
              <button
                onClick={() => router.push('/login?return_to=/pricing')}
                className="w-full py-6 mt-6 border border-white/30 hover:bg-white/10 rounded-3xl font-bold text-xl transition-all"
              >
                Se connecter pour s'abonner
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}