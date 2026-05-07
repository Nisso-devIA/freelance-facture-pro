'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase'
import { LogOut } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isClicked, setIsClicked] = useState(false)

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsClicked(true)
    
    // Animation de 600ms
    setTimeout(() => setIsClicked(false), 600)
    
    // Redirection après animation
    setTimeout(() => {
      router.push('/')
    }, 300)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="border-b border-white/10 bg-zinc-950/90 backdrop-blur-2xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        
        {/* === LOGO FP ANIMÉ AU CLIC === */}
        <Link 
          href="/" 
          onClick={handleLogoClick}
          className="flex items-center gap-3 group cursor-pointer select-none active:scale-95 transition-transform"
        >
          <div className={`relative w-14 h-14 transition-all duration-300 ${isClicked ? 'animate-bounce' : ''}`}>
            {/* Glow intense */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-all" />
            
            {/* Cercle principal */}
            <div className="relative w-full h-full bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl flex items-center justify-center shadow-2xl border border-white/30 overflow-hidden">
              <span 
                className={`text-4xl font-black tracking-tighter text-white drop-shadow-xl transition-all duration-300 ${isClicked ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`}
              >
                FP
              </span>
            </div>
          </div>

          <div className="leading-none">
            <div className="font-bold text-3xl tracking-tighter bg-gradient-to-r from-white via-cyan-200 to-fuchsia-200 bg-clip-text text-transparent group-hover:from-violet-300 group-hover:to-cyan-300 transition-all">
              Facture Pro
            </div>
            <div className="text-xs text-zinc-500">Freelance Edition 2026</div>
          </div>
        </Link>

        {/* Boutons droite */}
        <div className="flex items-center gap-4">
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

          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 px-5 py-3 rounded-3xl hover:bg-white/10 text-sm font-medium text-zinc-400 hover:text-white transition"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  )
}