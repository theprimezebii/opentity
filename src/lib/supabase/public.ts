import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Anonymous Supabase client — no cookies, no session.
 * Use ONLY in server components that should be statically cacheable.
 * Anon permissions apply — RLS + function grants still enforce safety.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
