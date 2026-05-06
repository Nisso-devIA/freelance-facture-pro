'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-8">Freelance Facture</h1>
        <p className="text-xl text-zinc-400 mb-12">Factures pros en 30 secondes</p>
        
        <div className="space-y-4">
          <Link
            href="/demo"
            className="block w-full px-10 py-6 bg-white text-black font-bold text-2xl rounded-3xl hover:brightness-110 transition"
          >
            Commencer gratuitement →
          </Link>
          
          <Link
            href="/login"
            className="block w-full px-10 py-6 border border-white/40 text-white font-medium text-xl rounded-3xl hover:bg-white/10 transition"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  )
}