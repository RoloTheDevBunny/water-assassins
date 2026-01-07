import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

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
        // Explicitly type the cookiesToSet parameter
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          // 1. Update request cookies (for the current middleware execution)
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          // 2. Refresh the response object
          supabaseResponse = NextResponse.next({
            request,
          })
          
          // 3. Update response cookies (for the browser to save)
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This call is essential to refresh the session and prevent loops
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  
  // Protect the Dashboard: Redirect to signin if no user is found
  if (!user && pathname.startsWith('/Dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/signin' 
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}