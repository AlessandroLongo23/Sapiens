import { json } from '@sveltejs/kit';
import { createPortalSession } from '$lib/stripe/server.js';
import { subscriptionOf } from '$lib/auth/entitlements';

/** Opens the Stripe customer portal (change card, cancel, invoices). */

/** @type {import('./$types').RequestHandler} */
export async function POST({ locals, url }) {
	const { user } = await locals.safeGetSession();
	if (!user) {
		return json({ error: 'Non autenticato' }, { status: 401 });
	}

	const { customerId } = subscriptionOf(user);
	if (!customerId) {
		return json({ error: 'Nessun abbonamento da gestire.' }, { status: 400 });
	}

	try {
		const session = await createPortalSession(customerId, new URL('/subscription', url.origin).toString());
		return json({ url: session.url });
	} catch (error) {
		console.error('Stripe portal error:', error);
		return json({ error: "Errore durante l'apertura del portale" }, { status: 500 });
	}
}
