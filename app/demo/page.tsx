'use client'

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <nav className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-2xl flex items-center justify-center text-black font-bold text-xl">F</div>
            <span className="text-2xl font-bold tracking-tighter">Freelance Facture</span>
          </div>
          
          <a
            href="/login"
            className="px-8 py-3 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition"
          >
            Se connecter
          </a>
        </div>
      </nav>

      <div className="flex-1 flex items-center max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-2xl">
          <h1 className="text-7xl font-bold tracking-tighter leading-none mb-6">
            Factures pros.<br />
            Envoyées en 30 secondes.
          </h1>

          <p className="text-2xl text-zinc-400 mb-10">
            Crée, génère le PDF, envoie par email.<br />
            Tout automatisé.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="/demo"
              className="px-10 py-5 bg-white text-black font-bold text-xl rounded-3xl hover:brightness-110 transition"
            >
              Commencer gratuitement →
            </a>

            <a
              href="/login"
              className="px-8 py-5 border border-white/30 text-white font-medium rounded-3xl hover:bg-white/5 transition"
            >
              Voir le dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}