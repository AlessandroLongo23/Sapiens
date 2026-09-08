import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './supabase';

/**
 * Per-request Supabase client bound to the visitor's cookies, so the session
 * created in the browser is visible to server components and route handlers.
 * Cookies can only be written from route handlers and server actions; server
 * components read them and the proxy refreshes them.
 */
export async function createRequestClient(): Promise<SupabaseClient> {
	const store = await cookies();
	return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => store.getAll(),
			setAll: (toSet) => {
				try {
					for (const { name, value, options } of toSet) store.set(name, value, { ...options, path: '/' });
				} catch {
					// Server components cannot write cookies; the proxy refreshes them.
				}
			}
		}
	});
}

export interface SafeSession {
	supabase: SupabaseClient;
	session: Session | null;
	user: User | null;
}

/**
 * The session from the cookie, validated against Supabase Auth: `getUser()`
 * checks the token with the server, so a forged cookie yields no user, and
 * `app_metadata` (where the subscription lives) is always the current one.
 * Only looked up when an auth cookie is present: anonymous visitors cost nothing.
 */
export async function getSession(): Promise<SafeSession> {
	const supabase = await createRequestClient();
	const store = await cookies();
	if (!store.getAll().some((c) => c.name.startsWith('sb-') && c.name.includes('auth-token'))) {
		return { supabase, session: null, user: null };
	}
	const {
		data: { session }
	} = await supabase.auth.getSession();
	if (!session) return { supabase, session: null, user: null };
	const {
		data: { user },
		error
	} = await supabase.auth.getUser();
	if (error || !user) return { supabase, session: null, user: null };
	return { supabase, session, user };
}

/** The signed-in user, or null. */
export async function currentUser(): Promise<User | null> {
	return (await getSession()).user;
}
