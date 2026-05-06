'use client'

import Hero from '@/components/hero'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-indigo-950 to-violet-950 text-white flex flex-col">
      <Navbar />
      <Hero />
      
      <footer className="py-10 text-center text-xs text-zinc-500 border-t border-white/10 mt-auto">
        © ShadowForge Inc • Freelance Facture Pro
      </footer>
    </div>
  )
}