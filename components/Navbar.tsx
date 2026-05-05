'use client'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/lib/supabase'
import { LogOut } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white text-black rounded-2xl flex items-center justify-center font-black text-2xl">FP</div>
          <div>
            <div className="font-bold text-2xl tracking-tight">Facture Pro</div>
            <div className="text-xs text-zinc-500 -mt-1">Freelance Edition</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl hover:bg-white/10 transition text-sm font-medium"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </nav>
  )
}