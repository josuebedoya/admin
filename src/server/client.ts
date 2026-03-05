import {createBrowserClient} from '@supabase/ssr'

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const anon_key = process.env.NEXT_PUBLIC_SUPABASE_KEY || ''

if (!supabase_url || !anon_key) {
  throw new Error('SUPABASE_URL and SUPABASE_KEY must be set in environment variables')
}

function createClient() {
  return createBrowserClient(
    supabase_url,
    anon_key,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    }
  )
}

const supabase = createClient()

export default supabase;