'use client'

export default function Login() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="max-w-md w-full bg-zinc-900 p-10 rounded-3xl border border-white/10">
        <h1 className="text-4xl font-bold text-white mb-8">Connexion</h1>
        <p className="text-zinc-400 mb-8">Page de login (test)</p>
        
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="w-full bg-white text-black py-4 rounded-2xl font-bold text-xl"
        >
          Aller au Dashboard (test)
        </button>
      </div>
    </div>
  )
}