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
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur-2xl">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl transition group-hover:rotate-12">FP</div>
          <div>
            <div className="font-bold text-2xl tracking-tighter">Facture Pro</div>
            <div className="text-xs text-zinc-500 -mt-1">Freelance Edition</div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link href="/register" className="px-6 py-3 rounded-2xl border border-white/20 hover:border-white/40 transition text-sm font-medium">Créer un compte</Link>
              <Link href="/login" className="px-6 py-3 bg-white text-black rounded-2xl font-semibold hover:bg-white/90 transition">Se connecter</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition">
              <LogOut size={18} /> Déconnexion
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}