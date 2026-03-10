import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const anon_key = process.env.NEXT_PUBLIC_SUPABASE_KEY || ''

if (!supabase_url || !anon_key) {
  throw new Error('SUPABASE_URL and SUPABASE_KEY must be set in environment variables')
}

export async function createAuthClient() {
  const cookieStore = await cookies()

  return createServerClient(
    supabase_url,
    anon_key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignorar errores si no estamos en Server Action/Route Handler
          }
        },
      },
    }
  )
}
