'use client'

import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-indigo-950 to-violet-950 text-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center text-center px-6">
        <div className="max-w-2xl">
          <h1 className="text-6xl md:text-7xl font-semibold tracking-tighter leading-none mb-6">
            Factures pros,<br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              envoyées en 30 secondes.
            </span>
          </h1>
          <p className="text-xl text-zinc-300 mb-10">Crée, PDF, email. Simple et professionnel.</p>
          
          <div className="flex justify-center gap-4">
            <a href="/demo" className="px-10 py-5 bg-white text-black font-semibold rounded-3xl text-lg">Commencer gratuitement →</a>
            <a href="/login" className="px-10 py-5 border border-white/30 text-white font-medium rounded-3xl text-lg">Voir le dashboard</a>
          </div>
        </div>
      </div>
    </div>
  )
}