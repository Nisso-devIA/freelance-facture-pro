// lib/supabase.ts - SINGLETON ULTIME PROD VERCEL (window global)
import { createBrowserClient } from '@supabase/ssr'

declare global {
  var __supabaseBrowserClient: ReturnType<typeof createBrowserClient> | undefined
}

export function createClientComponentClient() {
  if (typeof window === 'undefined') {
    console.warn('[Supabase] createClientComponentClient appelé côté serveur → safe return')
    return null as any
  }

  if (!globalThis.__supabaseBrowserClient) {
    globalThis.__supabaseBrowserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  return globalThis.__supabaseBrowserClient
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
            cookiesToSet.forEach((cookie: any) => cookieStore.set(cookie.name, cookie.value, cookie.options))
          } catch (err) {
            console.warn('[Supabase] Cookie set ignored in RSC:', err)
          }
        },
      },
    }
  )
}