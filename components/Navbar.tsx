'use client'   // ← AJOUTE ÇA EN PREMIÈRE LIGNE

import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { AuthChangeEvent, Session, Subscription } from '@supabase/supabase-js'

export default function Navbar() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    checkUser()

    // Écouter les changements de session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event: AuthChangeEvent, session: Session | null) => {
    setUser(session?.user || null)
  }
)

return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="border-b border-white/10 bg-zinc-950/90 backdrop-blur-2xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        
        {/* LOGO FP HOVER */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer select-none">
          <div className="relative w-14 h-14 transition-all duration-500 group-hover:rotate-12">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 rounded-3xl blur-2xl opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500" />
            <div className="relative w-full h-full bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl flex items-center justify-center shadow-2xl border border-white/30 overflow-hidden group-hover:scale-110 transition-all duration-500">
              <span className="text-4xl font-black tracking-tighter text-white drop-shadow-2xl transition-all duration-300 group-hover:scale-125 group-hover:-rotate-6">
                FP
              </span>
            </div>
          </div>

          <div className="leading-none">
            <div className="font-bold text-3xl tracking-tighter bg-gradient-to-r from-white via-cyan-200 to-fuchsia-200 bg-clip-text text-transparent group-hover:from-violet-300 group-hover:to-cyan-300 transition-all duration-300">
              Facture Pro
            </div>
            <div className="text-xs text-zinc-500">Freelance Edition 2026</div>
          </div>
        </Link>

        {/* Boutons à droite */}
        <div className="flex items-center gap-4">
          {!user && (
            <>
              <Link 
                href="/register" 
                className="px-6 py-3 rounded-3xl border border-white/30 hover:bg-white/10 hover:border-violet-400 transition-all text-sm font-medium"
              >
                Créer un compte
              </Link>
              
              <Link 
                href="/login" 
                className="px-7 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 font-bold rounded-3xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-violet-500/40"
              >
                Se connecter
              </Link>
            </>
          )}

          {/* Bouton Déconnexion → UNIQUEMENT si connecté */}
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 rounded-3xl hover:bg-white/10 text-sm font-medium text-zinc-400 hover:text-white transition border border-white/20"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}