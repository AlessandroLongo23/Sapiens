import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { RequestEvent } from '@sveltejs/kit';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

/**
 * Per-request Supabase client bound to the visitor's cookies, so the session
 * created in the browser is visible to server loads, API routes and hooks.
 * The browser side is in `$lib/auth/client`.
 */
export function createRequestClient(event: RequestEvent): SupabaseClient {
	return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				for (const { name, value, options } of cookiesToSet) {
					event.cookies.set(name, value, { ...options, path: '/' });
				}
			}
		}
	});
}

export interface SafeSession {
	session: Session | null;
	user: User | null;
}

/**
 * The session from the cookie, validated against Supabase Auth: `getUser()`
 * checks the token with the server, so a forged cookie yields no user, and
 * `app_metadata` (where the subscription lives) is always the current one.
 */
export async function safeGetSession(supabase: SupabaseClient): Promise<SafeSession> {
	const {
		data: { session }
	} = await supabase.auth.getSession();
	if (!session) return { session: null, user: null };

	const {
		data: { user },
		error
	} = await supabase.auth.getUser();
	if (error || !user) return { session: null, user: null };

	return { session, user };
}

/** True when the request carries a Supabase auth cookie at all. */
export function hasAuthCookie(event: RequestEvent): boolean {
	return event.cookies.getAll().some((c) => c.name.startsWith('sb-') && c.name.includes('auth-token'));
}
