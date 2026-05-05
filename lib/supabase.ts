// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr'

// ==================== CLIENT SIDE ====================
export function createClientComponentClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ==================== SERVER SIDE ONLY ====================
export async function createServerComponentClient() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()

  const { createServerClient } = await import('@supabase/ssr')

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        // TYPAGE EXPLICITE POUR TUER LE ROUGE
        setAll(cookiesToSet: any) {
          try {
            cookiesToSet.forEach((cookie: any) => {
              cookieStore.set(cookie.name, cookie.value, cookie.options)
            })
          } catch (err) {
            console.warn('[Supabase] Cookie set ignored in RSC:', err)
          }
        },
      },
    }
  )
}