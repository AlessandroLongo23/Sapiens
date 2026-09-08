import 'server-only';
import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY ?? '';

/** Anonymous client for public reads (content tree, published tutors). Row level security applies. */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
	auth: { persistSession: false, autoRefreshToken: false }
});

let admin: ReturnType<typeof createClient> | null = null;

/** Service-role client: writes to app_metadata and the private tutoring columns. Server only. */
export function adminClient() {
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
	admin ??= createClient(SUPABASE_URL, key, { auth: { persistSession: false, autoRefreshToken: false } });
	return admin;
}
