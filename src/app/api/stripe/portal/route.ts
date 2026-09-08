import { createPortalSession } from '@/lib/stripe/server';
import { subscriptionOf } from '@/lib/auth/entitlements';
import { currentUser } from '@/lib/server/auth';
import { fail, json } from '@/lib/server/http';

/** Opens the Stripe customer portal (change card, cancel, invoices). */
export async function POST(request: Request) {
	const user = await currentUser();
	if (!user) return fail('Non autenticato', 401);
	const { customerId } = subscriptionOf(user);
	if (!customerId) return fail('Nessun abbonamento da gestire.', 400);
	try {
		const session = await createPortalSession(customerId, new URL('/subscription', request.url).toString());
		return json({ url: session.url });
	} catch (error) {
		console.error('Stripe portal error:', error);
		return fail("Errore durante l'apertura del portale", 500);
	}
}
