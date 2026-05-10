// lib/supabase.ts - Version Blackhat Singleton Ultime (SSR-safe)
import { createBrowserClient } from '@supabase/ssr'

let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function createClientComponentClient() {
  if (typeof window === 'undefined') {
    console.warn('[Supabase] createClientComponentClient appelé côté serveur → retour null (safe)')
    return null as any
  }

  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return browserClient
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
        getAll() { return cookieStore.getAll() },
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