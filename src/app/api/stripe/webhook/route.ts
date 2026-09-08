import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe/server';
import { SUBSCRIPTION_PLANS, getPlanByPriceId } from '@/lib/stripe/config';
import { adminClient } from '@/lib/server/supabase';
import { fail, json } from '@/lib/server/http';

/**
 * Keeps the subscription claim in `auth.users.app_metadata.subscription` in
 * step with Stripe. `app_metadata` can only be written with the service role,
 * so a user cannot grant themselves a plan; every page and API route reads
 * the claim through the entitlements module.
 */

const isoDate = (unixSeconds: number | null | undefined) => (typeof unixSeconds === 'number' ? new Date(unixSeconds * 1000).toISOString() : undefined);

/** Since API 2025-03-31 the period lives on the subscription items. */
function periodEnd(subscription: Stripe.Subscription): string | undefined {
	const ends = subscription.items?.data?.map((i) => i.current_period_end).filter((n): n is number => typeof n === 'number');
	return ends?.length ? isoDate(Math.max(...ends)) : undefined;
}

/** The subscription an invoice belongs to, across API versions. */
function invoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
	const nested = invoice.parent?.subscription_details?.subscription;
	return typeof nested === 'string' ? nested : (nested?.id ?? null);
}

const customerIdOf = (subscription: Stripe.Subscription) => (typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id);

/** The user id a subscription belongs to: from its metadata, else from the customer's. */
async function userIdFor(subscription: Stripe.Subscription): Promise<string | null> {
	if (subscription.metadata?.userId) return subscription.metadata.userId;
	const customerId = customerIdOf(subscription);
	if (!customerId) return null;
	const customer = await stripe.customers.retrieve(customerId);
	return customer.deleted ? null : (customer.metadata?.userId ?? null);
}

function planIdFor(subscription: Stripe.Subscription): string {
	return getPlanByPriceId(subscription.items?.data?.[0]?.price?.id)?.id ?? subscription.metadata?.planId ?? SUBSCRIPTION_PLANS.FREE.id;
}

/** Merge the claim into app_metadata (the admin API replaces the object, so read first). */
async function writeClaim(userId: string, patch: Record<string, unknown>) {
	const admin = adminClient();
	const { data, error } = await admin.auth.admin.getUserById(userId);
	if (error || !data.user) return console.error(`webhook: user ${userId} not found`, error?.message);
	const subscription = { ...(data.user.app_metadata?.subscription ?? {}), ...patch, updatedAt: new Date().toISOString() };
	const { error: updateError } = await admin.auth.admin.updateUserById(userId, { app_metadata: { ...data.user.app_metadata, subscription } });
	if (updateError) console.error(`webhook: could not update user ${userId}`, updateError.message);
}

async function applySubscription(subscription: Stripe.Subscription) {
	const userId = await userIdFor(subscription);
	if (!userId) return console.error(`webhook: no user for subscription ${subscription.id}`);
	const gone = subscription.status === 'canceled' || subscription.status === 'incomplete_expired';
	await writeClaim(userId, {
		plan: gone ? SUBSCRIPTION_PLANS.FREE.id : planIdFor(subscription),
		status: subscription.status,
		customerId: customerIdOf(subscription),
		subscriptionId: subscription.id,
		currentPeriodEnd: periodEnd(subscription),
		...(subscription.trial_start ? { trialUsedAt: isoDate(subscription.trial_start) } : {})
	});
}

export async function POST(request: Request) {
	let event: Stripe.Event;
	try {
		const signature = request.headers.get('stripe-signature');
		if (!signature) return fail('Missing signature', 400);
		event = stripe.webhooks.constructEvent(await request.text(), signature, process.env.STRIPE_WEBHOOK_SECRET ?? '');
	} catch (err) {
		console.error('Webhook signature verification failed:', err instanceof Error ? err.message : err);
		return fail('Webhook signature verification failed', 400);
	}

	try {
		switch (event.type) {
			case 'checkout.session.completed': {
				const session = event.data.object;
				if (session.mode === 'subscription' && session.subscription) {
					await applySubscription(await stripe.subscriptions.retrieve(typeof session.subscription === 'string' ? session.subscription : session.subscription.id));
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
			// Renewals and failed renewals: re-read the subscription so the claim follows Stripe even if a subscription event was missed.
			case 'invoice.paid':
			case 'invoice.payment_failed': {
				const id = invoiceSubscriptionId(event.data.object);
				if (id) await applySubscription(await stripe.subscriptions.retrieve(id));
				break;
			}
		}
		return json({ received: true });
	} catch (error) {
		console.error('Error processing webhook:', error);
		return fail('Webhook processing failed', 500);
	}
}
