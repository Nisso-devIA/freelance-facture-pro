'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthCallback() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [status, setStatus] = useState('Redirection en cours...')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Callback error:', error)
          setStatus('Erreur lors de la connexion...')
          return
        }

        // Session validée → on balance vers le dashboard
        router.push('/dashboard')
        router.refresh() // force refresh du middleware/session
      } catch (err) {
        console.error(err)
        setStatus('Erreur inconnue...')
      }
    }

    handleAuthCallback()
  }, [supabase, router])

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl mb-6">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-zinc-300">{status}</span>
        </div>
        <p className="text-zinc-500 text-sm">Tu vas être redirigé automatiquement...</p>
      </div>
    </div>
  )
}