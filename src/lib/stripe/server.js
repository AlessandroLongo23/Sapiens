import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

// One client instance, pinned to the API version the code was written against.
export const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2026-08-26.dahlia'
});

/** Label for Checkout Sessions in the Dashboard: a fixed name plus eight random letters. */
function integrationIdentifier(label) {
	const letters = 'abcdefghijklmnopqrstuvwxyz';
	let suffix = '';
	for (let i = 0; i < 8; i++) suffix += letters[Math.floor(Math.random() * letters.length)];
	return `${label}-${suffix}`;
}

/**
 * Create a checkout session for a subscription.
 *
 * With `trialDays` > 0 the card is not collected (`payment_method_collection:
 * 'if_required'`): the trial simply ends if no card is added, matching the
 * "senza carta di credito" promise on the pricing page. `subscriptionMetadata`
 * travels on the subscription object, so every later webhook event carries
 * the user id and plan without a lookup. Payment method types are left to
 * the Dashboard settings on purpose (no `payment_method_types`).
 */
export async function createCheckoutSession({
	priceId,
	customerId,
	customerEmail,
	successUrl,
	cancelUrl,
	metadata = {},
	subscriptionMetadata = {},
	trialDays = 0
}) {
	const sessionConfig = {
		mode: 'subscription',
		line_items: [
			{
				price: priceId,
				quantity: 1
			}
		],
		success_url: successUrl,
		cancel_url: cancelUrl,
		metadata,
		subscription_data: {
			metadata: subscriptionMetadata
		},
		allow_promotion_codes: true,
		locale: 'it',
		integration_identifier: integrationIdentifier('sapiens-premium')
	};

	if (trialDays > 0) {
		sessionConfig.subscription_data.trial_period_days = trialDays;
		sessionConfig.subscription_data.trial_settings = {
			end_behavior: { missing_payment_method: 'cancel' }
		};
		sessionConfig.payment_method_collection = 'if_required';
	}

	// Use existing customer or create new one
	if (customerId) {
		sessionConfig.customer = customerId;
	} else if (customerEmail) {
		sessionConfig.customer_email = customerEmail;
	}

	return await stripe.checkout.sessions.create(sessionConfig);
}

/**
 * Create a customer portal session
 */
export async function createPortalSession(customerId, returnUrl) {
	return await stripe.billingPortal.sessions.create({
		customer: customerId,
		return_url: returnUrl
	});
}

/**
 * Get or create a Stripe customer. The user id is kept in the customer's
 * metadata so any Stripe object can be traced back to the account.
 */
export async function getOrCreateCustomer(email, metadata = {}) {
	const existingCustomers = await stripe.customers.list({
		email: email,
		limit: 1
	});

	if (existingCustomers.data.length > 0) {
		const customer = existingCustomers.data[0];
		if (metadata.userId && customer.metadata?.userId !== metadata.userId) {
			return await stripe.customers.update(customer.id, { metadata: { ...customer.metadata, ...metadata } });
		}
		return customer;
	}

	return await stripe.customers.create({
		email,
		metadata
	});
}

/**
 * Get subscription by customer ID
 */
export async function getCustomerSubscription(customerId) {
	const subscriptions = await stripe.subscriptions.list({
		customer: customerId,
		status: 'active',
		limit: 1
	});

	return subscriptions.data.length > 0 ? subscriptions.data[0] : null;
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId) {
	return await stripe.subscriptions.cancel(subscriptionId);
}

/**
 * Update subscription
 */
export async function updateSubscription(subscriptionId, params) {
	return await stripe.subscriptions.update(subscriptionId, params);
}
