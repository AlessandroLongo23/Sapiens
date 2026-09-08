import Stripe from 'stripe';

// One client instance, pinned to the API version the code was written against.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', { apiVersion: '2026-08-26.dahlia' });

/** Label for Checkout Sessions in the Dashboard: a fixed name plus eight random letters. */
const integrationIdentifier = (label: string) =>
	`${label}-${Array.from({ length: 8 }, () => 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]).join('')}`;

export interface CheckoutParams {
	priceId: string;
	customerId: string;
	successUrl: string;
	cancelUrl: string;
	metadata: Record<string, string>;
	trialDays: number;
}

/**
 * A subscription Checkout. With `trialDays` > 0 the card is not collected
 * (`payment_method_collection: 'if_required'`): the trial simply ends if no
 * card is added, matching the "senza carta di credito" promise on the pricing
 * page. The metadata travels on the subscription object, so every later
 * webhook event carries the user id and plan without a lookup.
 */
export function createCheckoutSession({ priceId, customerId, successUrl, cancelUrl, metadata, trialDays }: CheckoutParams) {
	return stripe.checkout.sessions.create({
		mode: 'subscription',
		customer: customerId,
		line_items: [{ price: priceId, quantity: 1 }],
		success_url: successUrl,
		cancel_url: cancelUrl,
		metadata,
		subscription_data: {
			metadata,
			...(trialDays > 0 ? { trial_period_days: trialDays, trial_settings: { end_behavior: { missing_payment_method: 'cancel' } } } : {})
		},
		...(trialDays > 0 ? { payment_method_collection: 'if_required' } : {}),
		allow_promotion_codes: true,
		locale: 'it',
		// Not in the SDK's types yet: labels the session in the Dashboard.
		...({ integration_identifier: integrationIdentifier('sapiens-premium') } as object)
	});
}

export function createPortalSession(customerId: string, returnUrl: string) {
	return stripe.billingPortal.sessions.create({ customer: customerId, return_url: returnUrl });
}

/** Get or create a Stripe customer. The user id is kept in the customer's metadata so any Stripe object can be traced back. */
export async function getOrCreateCustomer(email: string, metadata: Record<string, string>) {
	const existing = (await stripe.customers.list({ email, limit: 1 })).data[0];
	if (existing) {
		if (metadata.userId && existing.metadata?.userId !== metadata.userId) {
			return stripe.customers.update(existing.id, { metadata: { ...existing.metadata, ...metadata } });
		}
		return existing;
	}
	return stripe.customers.create({ email, metadata });
}
