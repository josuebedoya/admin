import {createServerClient} from '@supabase/ssr'
import {cookies} from 'next/headers'

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const anon_key = process.env.NEXT_PUBLIC_SUPABASE_KEY || ''

if (!supabase_url || !anon_key) {
  throw new Error('SUPABASE_URL and SUPABASE_KEY must be set in environment variables')
}

async function createClientServer() {
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
          cookieStore.set({name, value, ...options})
        },
        remove(name: string, options) {
          cookieStore.set({name, value: '', ...options})
        },
      },
    }
  )
}

const supabaseServer = await createClientServer();

export default supabaseServer;