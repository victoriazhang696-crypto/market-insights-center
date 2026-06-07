import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Public paths
  const publicPaths = ['/login', '/auth/callback']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // If no user and trying to access protected route
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user exists, check permissions
  if (user) {
    // Get user profile to check role and expire_date
    const { data: profile } = await supabase
      .from('users')
      .select('role, expire_date, status')
      .eq('id', user.id)
      .single()

    // Admin routes
    if (pathname.startsWith('/admin')) {
      if (!profile || profile.role !== 'admin') {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
    }

    // Check if member account is expired or disabled
    if (profile && profile.role === 'member') {
      const now = new Date()
      const expireDate = new Date(profile.expire_date)
      
      if (profile.status === 'disabled' || now > expireDate) {
        // Allow access to login page to show error message
        if (!pathname.startsWith('/login')) {
          const url = request.nextUrl.clone()
          url.pathname = '/login'
          url.searchParams.set('error', 'expired')
          return NextResponse.redirect(url)
        }
      }
    }

    // Redirect logged in users away from login page
    if (pathname === '/login') {
      const url = request.nextUrl.clone()
      url.pathname = profile?.role === 'admin' ? '/admin' : '/'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
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
