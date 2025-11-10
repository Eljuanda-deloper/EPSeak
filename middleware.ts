import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  console.log('🛡️ MIDDLEWARE START - Path:', req.nextUrl.pathname, 'Method:', req.method)

  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  console.log('🔐 MIDDLEWARE SESSION:', {
    hasSession: !!session,
    userId: session?.user?.id,
    userEmail: session?.user?.email,
    expiresAt: session?.expires_at,
    pathname: req.nextUrl.pathname
  })

  // Protect routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile']
  const isProtectedRoute = protectedRoutes.some(route =>
    req.nextUrl.pathname.startsWith(route)
  )

  console.log('🔍 Route analysis:', {
    pathname: req.nextUrl.pathname,
    isProtectedRoute,
    hasSession: !!session
  })

  if (isProtectedRoute && !session) {
    console.log('🚫 BLOCKING: Protected route without session')
    const redirectUrl = new URL('/auth/login', req.url)
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    console.log('🔀 REDIRECTING TO:', redirectUrl.toString())
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect authenticated users away from auth pages
  const authRoutes = ['/auth/login', '/auth/register']
  const isAuthRoute = authRoutes.some(route =>
    req.nextUrl.pathname.startsWith(route)
  )

  console.log('🔍 Auth route check:', {
    pathname: req.nextUrl.pathname,
    isAuthRoute,
    hasSession: !!session,
    shouldRedirect: isAuthRoute && !!session
  })

  if (isAuthRoute && session) {
    console.log('✅ REDIRECTING: Auth route with session → dashboard')
    const dashboardUrl = new URL('/dashboard', req.url)
    console.log('🎯 DASHBOARD URL:', dashboardUrl.toString())
    return NextResponse.redirect(dashboardUrl)
  }

  console.log('✅ MIDDLEWARE END - Allowing request to:', req.nextUrl.pathname)
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}