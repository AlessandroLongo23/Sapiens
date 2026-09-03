import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { stripe } from '$lib/stripe/server.js';
import { STRIPE_WEBHOOK_SECRET, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { getPlanByPriceId, SUBSCRIPTION_PLANS } from '$lib/stripe/config.js';

/**
 * Keeps the subscription claim in `auth.users.app_metadata.subscription` in
 * step with Stripe. `app_metadata` can only be written with the service role,
 * so a user cannot grant themselves a plan; every page and API route reads
 * the claim through `$lib/auth/entitlements`.
 */

const admin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
	auth: { persistSession: false, autoRefreshToken: false }
});

function isoDate(unixSeconds) {
	return typeof unixSeconds === 'number' ? new Date(unixSeconds * 1000).toISOString() : undefined;
}

/** The user id a subscription belongs to: from its metadata, else from the customer's. */
async function userIdFor(subscription) {
	if (subscription.metadata?.userId) return subscription.metadata.userId;
	const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id;
	if (!customerId) return null;
	const customer = await stripe.customers.retrieve(customerId);
	return customer && !customer.deleted ? (customer.metadata?.userId ?? null) : null;
}

function planIdFor(subscription) {
	const priceId = subscription.items?.data?.[0]?.price?.id;
	return getPlanByPriceId(priceId)?.id ?? subscription.metadata?.planId ?? SUBSCRIPTION_PLANS.FREE.id;
}

/** Merge the claim into app_metadata (the admin API replaces the object, so read first). */
async function writeClaim(userId, patch) {
	const { data, error } = await admin.auth.admin.getUserById(userId);
	if (error || !data.user) {
		console.error(`webhook: user ${userId} not found`, error?.message);
		return;
	}
	const previous = data.user.app_metadata?.subscription ?? {};
	const subscription = { ...previous, ...patch, updatedAt: new Date().toISOString() };
	const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
		app_metadata: { ...data.user.app_metadata, subscription }
	});
	if (updateError) {
		console.error(`webhook: could not update user ${userId}`, updateError.message);
	}
}

async function applySubscription(subscription) {
	const userId = await userIdFor(subscription);
	if (!userId) {
		console.error(`webhook: no user for subscription ${subscription.id}`);
		return;
	}

	const gone = subscription.status === 'canceled' || subscription.status === 'incomplete_expired';
	const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id;

	await writeClaim(userId, {
		plan: gone ? SUBSCRIPTION_PLANS.FREE.id : planIdFor(subscription),
		status: subscription.status,
		customerId,
		subscriptionId: subscription.id,
		currentPeriodEnd: isoDate(subscription.current_period_end),
		...(subscription.trial_start ? { trialUsedAt: isoDate(subscription.trial_start) } : {})
	});
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	let event;

	try {
		const body = await request.text();
		const signature = request.headers.get('stripe-signature');
		if (!signature) {
			return json({ error: 'Missing signature' }, { status: 400 });
		}
		event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
	} catch (err) {
		console.error('Webhook signature verification failed:', err.message);
		return json({ error: 'Webhook signature verification failed' }, { status: 400 });
	}

	try {
		switch (event.type) {
			case 'checkout.session.completed': {
				const session = event.data.object;
				if (session.mode === 'subscription' && session.subscription) {
					const subscription = await stripe.subscriptions.retrieve(session.subscription);
					await applySubscription(subscription);
				}
				break;
			}

			case 'customer.subscription.created':
			case 'customer.subscription.updated':
			case 'customer.subscription.deleted':
			case 'customer.subscription.paused':
			case 'customer.subscription.resumed':
			case 'customer.subscription.trial_will_end':
				await applySubscription(event.data.object);
				break;

			default:
				break;
		}

		return json({ received: true });
	} catch (error) {
		console.error('Error processing webhook:', error);
		return json({ error: 'Webhook processing failed' }, { status: 500 });
	}
}
