import { json, redirect } from '@sveltejs/kit';

/** Signs out and clears the auth cookies (the per-request client removes them). */

/** @type {import('./$types').RequestHandler} */
export const POST = async ({ locals: { supabase }, request }) => {
	const { error } = await supabase.auth.signOut({ scope: 'local' });

	const wantsJson = (request.headers.get('Accept') || '').includes('application/json');

	if (error) {
		console.error('logout failed:', error.message);
		if (wantsJson) return json({ error: error.message, redirectTo: '/' }, { status: 500 });
		throw redirect(303, '/');
	}

	if (wantsJson) return json({ success: true, redirectTo: '/' });
	throw redirect(303, '/');
};
