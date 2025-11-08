import { json } from '@sveltejs/kit';
import { createCheckoutSession, getOrCreateCustomer } from '$lib/stripe/server.js';
import { SUBSCRIPTION_PLANS } from '$lib/stripe/config.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals: { user }, url }) {
	// Check if user is authenticated
	if (!user) {
		return json({ error: 'Non autenticato' }, { status: 401 });
	}

	try {
		const { planId } = await request.json();

		// Validate plan
		const plan = Object.values(SUBSCRIPTION_PLANS).find(p => p.id === planId);
		if (!plan || !plan.stripePriceId) {
			return json({ error: 'Piano non valido' }, { status: 400 });
		}

		// Get or create Stripe customer
		const customer = await getOrCreateCustomer(user.email, {
			userId: user.id,
			name: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`
		});

		// Create checkout session
		const session = await createCheckoutSession({
			priceId: plan.stripePriceId,
			customerId: customer.id,
			successUrl: `${url.origin}/student/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
			cancelUrl: `${url.origin}/student/subscription/cancel`,
			metadata: {
				userId: user.id,
				planId: plan.id
			}
		});

		return json({ sessionId: session.id, url: session.url });
	} catch (error) {
		console.error('Stripe checkout error:', error);
		return json(
			{ error: 'Errore durante la creazione della sessione di pagamento' },
			{ status: 500 }
		);
	}
}

