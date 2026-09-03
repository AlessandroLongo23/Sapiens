import { Features } from '$lib/stripe/config.js';
import { hasFeature } from '$lib/auth/entitlements';

/**
 * Exercises are part of the paid plans, so this page is rendered per
 * request (no ISR: the answer depends on who is asking) and the exercises
 * are generated only for visitors whose plan includes them.
 */
export const config = { isr: false };

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	const { user } = await locals.safeGetSession();
	return {
		access: {
			exercises: hasFeature(user, Features.EXERCISES),
			signedIn: user !== null
		}
	};
}
