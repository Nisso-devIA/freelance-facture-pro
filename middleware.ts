import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const isLogin = req.nextUrl.pathname === '/login'
  const isRegister = req.nextUrl.pathname === '/register'
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')

  // Token Supabase (simple check)
  const token = req.cookies.get('sb-bxwykkugvdthtzcyebes-auth-token')?.value

  if ((isDashboard) && !token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if ((isLogin || isRegister) && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/login', '/register', '/dashboard/:path*'],
}
