import { json } from '@sveltejs/kit';
import { subscriptionOf, effectivePlan } from '$lib/auth/entitlements';

/** The signed-in user's plan, read fresh from Supabase Auth. Never cached. */

/** @type {import('./$types').RequestHandler} */
export async function GET({ locals }) {
	const { user } = await locals.safeGetSession();
	const headers = { 'Cache-Control': 'private, no-store' };

	if (!user) {
		return json({ user: null }, { headers });
	}

	const claim = subscriptionOf(user);
	return json(
		{
			user: { id: user.id, email: user.email },
			subscription: claim,
			plan: effectivePlan(user).id
		},
		{ headers }
	);
}
