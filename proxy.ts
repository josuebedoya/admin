import {createServerClient} from '@supabase/ssr'
import {type NextRequest, NextResponse} from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request
  })

  const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const anon_key = process.env.NEXT_PUBLIC_SUPABASE_KEY || ''

  if (!supabase_url || !anon_key) {
    throw new Error('SUPABASE_URL and SUPABASE_KEY must be set in environment variables')
  }


  const supabase = createServerClient(
    supabase_url,
    anon_key,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          request.cookies.set({
            name,
            value,
            ...options
          })
          response.cookies.set({
            name,
            value,
            ...options
          })
        },
        remove(name: string, options) {
          request.cookies.set({
            name,
            value: '',
            ...options
          })
          response.cookies.set({
            name,
            value: '',
            ...options
          })
        }
      }
    }
  )

  await supabase.auth.getUser()

  return response;
}