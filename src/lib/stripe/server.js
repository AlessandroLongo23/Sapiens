import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

// Initialize Stripe
export const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2024-11-20.acacia'
});

/**
 * Create a checkout session for a subscription
 */
export async function createCheckoutSession({
	priceId,
	customerId,
	customerEmail,
	successUrl,
	cancelUrl,
	metadata = {}
}) {
	const sessionConfig = {
		mode: 'subscription',
		payment_method_types: ['card'],
		line_items: [
			{
				price: priceId,
				quantity: 1
			}
		],
		success_url: successUrl,
		cancel_url: cancelUrl,
		metadata
	};

	// Use existing customer or create new one
	if (customerId) {
		sessionConfig.customer = customerId;
	} else if (customerEmail) {
		sessionConfig.customer_email = customerEmail;
	}

	// Allow promotional codes
	sessionConfig.allow_promotion_codes = true;

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
 * Get or create a Stripe customer
 */
export async function getOrCreateCustomer(email, metadata = {}) {
	// Check if customer already exists
	const existingCustomers = await stripe.customers.list({
		email: email,
		limit: 1
	});

	if (existingCustomers.data.length > 0) {
		return existingCustomers.data[0];
	}

	// Create new customer
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

