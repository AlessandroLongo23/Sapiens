import { subscriptionOf } from '$lib/auth/entitlements';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	return {
		subscription: user ? subscriptionOf(user) : null
	};
};
