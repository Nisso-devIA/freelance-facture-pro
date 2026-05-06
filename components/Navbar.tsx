'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase'
import { LogOut } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        
        {/* Logo cliquable */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <div className="w-9 h-9 bg-white text-black rounded-2xl flex items-center justify-center font-black text-2xl">FP</div>
          <div>
            <div className="font-bold text-2xl tracking-tighter">Facture Pro</div>
            <div className="text-xs text-zinc-500 -mt-1">Freelance Edition</div>
          </div>
        </Link>

        {/* Boutons conditionnels */}
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link
                href="/register"
                className="px-6 py-2.5 rounded-2xl border border-white/30 text-white font-medium hover:bg-white/5 transition"
              >
                Créer un compte
              </Link>
              <Link
                href="/login"
                className="px-6 py-2.5 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition"
              >
                Se connecter
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-medium transition"
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