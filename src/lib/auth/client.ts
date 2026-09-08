import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Browser Supabase client. Sessions are stored in cookies (not localStorage),
 * so the server sees the same login. Created once, on first use, so public
 * pages do not pay for it until someone signs in or a signed-in visitor arrives.
 */
let client: SupabaseClient | null = null;

export function getBrowserClient(): SupabaseClient {
	client ??= createBrowserClient(process.env.PUBLIC_SUPABASE_URL ?? '', process.env.PUBLIC_SUPABASE_ANON_KEY ?? '');
	return client;
}
