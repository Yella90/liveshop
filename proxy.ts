import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  const isDashboard = pathname.startsWith('/dashboard')
  const isAdmin = pathname.startsWith('/admin')
  const isAuth =
    pathname === '/connexion' || pathname === '/inscription'

  if (!user && (isDashboard || isAdmin)) {
    return NextResponse.redirect(new URL('/connexion', request.url))
  }

  if (user) {
    const role = user.user_metadata?.role ?? 'seller'

    if (isAdmin && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (isDashboard && role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    if (isAuth) {
      const target = role === 'admin' ? '/admin' : '/dashboard'
      return NextResponse.redirect(new URL(target, request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}