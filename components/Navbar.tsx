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
        
        {/* LOGO FP ANIMÉ PREMIUM */}
<Link href="/" className="flex items-center gap-3 group">
  <div className="relative w-12 h-12">
    <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 rounded-3xl animate-pulse group-hover:scale-110 transition-all duration-700" />
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-4xl font-black tracking-tighter text-black drop-shadow-xl animate-bounce">
        FP
      </span>
    </div>
  </div>
  <div className="font-bold text-3xl tracking-tighter bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
    Facture Pro
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