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
        // Define the type for the cookiesToSet parameter
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This is required for a secure setup
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  
  if (!user && pathname.startsWith('/Dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/signin' 
    
    // Create the redirect response
    const response = NextResponse.redirect(url)

    // Essential: Copy cookies from the modified response to the redirect response
    // This is often why "Invalid flow state" occurs—the verifier cookie is lost on redirect.
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value);
    });

    return response
  }

  return supabaseResponse
}