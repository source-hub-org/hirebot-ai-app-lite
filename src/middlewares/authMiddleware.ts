import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function authMiddleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  const isLoginPage = request.nextUrl.pathname === '/login'

  // If trying to access a protected route without a token, redirect to login
  if (!token && !isLoginPage && !isPublicRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If trying to access the login page with a token, redirect to the dashboard
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Define which routes should be public (accessible without authentication)
function isPublicRoute(pathname: string): boolean {
  // Exact matches for root and simple routes
  const exactPublicRoutes = ['/login', '/about', '/contact', '/']
  if (exactPublicRoutes.includes(pathname)) {
    return true
  }

  // Prefix matches for API routes, Next.js routes, and static files
  const prefixPublicRoutes = ['/api/', '/_next/', '/favicon.ico']
  if (prefixPublicRoutes.some(route => pathname.startsWith(route))) {
    return true
  }

  // All other routes (including /submissions/new) require authentication
  return false
}

// See "Matching Paths" below to learn more
export const authConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
