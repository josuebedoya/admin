import {createServerClient} from '@supabase/ssr'
import {cookies} from 'next/headers'

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const anon_key = process.env.NEXT_PUBLIC_SUPABASE_KEY || ''

if (!supabase_url || !anon_key) {
  throw new Error('SUPABASE_URL and SUPABASE_KEY must be set in environment variables')
}

export async function createClientServer() {
  const cookieStore = await cookies()

  return createServerClient(
    supabase_url,
    anon_key,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options) {
          try {
            cookieStore.set({name, value, ...options})
          } catch {
            // Ignorar errores cuando no estamos en Server Action/Route Handler
          }
        },
        remove(name: string, options) {
          try {
            cookieStore.set({name, value: '', ...options})
          } catch {
            // Ignorar errores cuando no estamos en Server Action/Route Handler
          }
        },
      },
    }
  )
}