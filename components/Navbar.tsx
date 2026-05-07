'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase'
import { LogOut, User } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-2xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        
        {/* LOGO FP ANIMÉ */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 rounded-2xl rotate-12 group-hover:rotate-0 transition-transform duration-500" />
            <div className="relative w-10 h-10 bg-zinc-950 rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-all duration-300 shadow-xl shadow-violet-500/50">
              <span className="text-3xl font-black tracking-tighter bg-gradient-to-br from-white via-cyan-200 to-white bg-clip-text text-transparent animate-pulse">
                FP
              </span>
            </div>
          </div>
          <div>
            <div className="font-bold text-2xl tracking-tighter text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-cyan-400 transition-all">
              Facture Pro
            </div>
            <div className="text-xs text-zinc-500 -mt-1">Freelance Edition 2026</div>
          </div>
        </Link>

        {/* Boutons à droite */}
        <div className="flex items-center gap-3">
          <Link
            href="/register"
            className="px-6 py-2.5 rounded-3xl border border-white/30 text-white font-medium hover:bg-white/10 hover:border-violet-400 transition-all"
          >
            Créer un compte
          </Link>
          
          <Link
            href="/login"
            className="px-6 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-3xl hover:brightness-110 transition-all shadow-lg shadow-violet-500/30"
          >
            Se connecter
          </Link>

          {/* Bouton Déconnexion (visible seulement quand connecté) */}
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-3xl hover:bg-white/10 text-sm font-medium text-zinc-400 hover:text-white transition"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  )
}