import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
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
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
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

  // refrescamos la sesión si está caducada
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protección de rutas
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/registro') || request.nextUrl.pathname.startsWith('/recuperar-contrasena')
  const isUserRoute = request.nextUrl.pathname.startsWith('/cuenta') || request.nextUrl.pathname.startsWith('/reservar')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  // Si el usuario no está logueado y trata de entrar a una ruta protegida
  if (!user && (isUserRoute || isAdminRoute)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Si el usuario está logueado y trata de entrar al login o registro
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/cuenta/prestamos'
    return NextResponse.redirect(url)
  }

  // Protección específica para /admin (comprobar rol en DB)
  if (user && isAdminRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || (profile.role !== 'admin' && profile.role !== 'committee')) {
      // Si no es admin ni comité, lo mandamos a su cuenta
      const url = request.nextUrl.clone()
      url.pathname = '/cuenta/prestamos'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
