'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase'
import { LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    setMenuOpen(false)
  }

  return (
    <nav className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white text-black rounded-2xl flex items-center justify-center font-black text-2xl">FP</div>
          <div>
            <div className="font-bold text-2xl tracking-tight">Facture Pro</div>
            <div className="text-xs text-zinc-500 -mt-1">Freelance Edition</div>
          </div>
        </Link>

        {/* Desktop buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/register" className="px-6 py-2.5 rounded-2xl border border-white/30 text-white font-medium hover:bg-white/5 transition">Créer un compte</Link>
          <Link href="/login" className="px-6 py-2.5 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition">Se connecter</Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-white/10 px-6 py-6 space-y-4">
          <Link href="/register" onClick={() => setMenuOpen(false)} className="block w-full text-center py-4 bg-white text-black font-bold rounded-3xl">Créer un compte</Link>
          <Link href="/login" onClick={() => setMenuOpen(false)} className="block w-full text-center py-4 border border-white/30 text-white font-medium rounded-3xl">Se connecter</Link>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-4 text-red-400">
            <LogOut size={20} /> Déconnexion
          </button>
        </div>
      )}
    </nav>
  )
}