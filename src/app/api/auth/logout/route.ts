import { createRequestClient } from '@/lib/server/auth';
import { json } from '@/lib/server/http';

/** Signs out and clears the auth cookies (the per-request client removes them). */
export async function POST(request: Request) {
	const supabase = await createRequestClient();
	const { error } = await supabase.auth.signOut({ scope: 'local' });
	const wantsJson = (request.headers.get('Accept') || '').includes('application/json');
	if (error) {
		console.error('logout failed:', error.message);
		if (wantsJson) return json({ error: error.message, redirectTo: '/' }, 500);
	} else if (wantsJson) {
		return json({ success: true, redirectTo: '/' });
	}
	return Response.redirect(new URL('/', request.url), 303);
}
