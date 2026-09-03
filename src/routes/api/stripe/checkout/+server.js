import { json } from '@sveltejs/kit';
import { createCheckoutSession, getOrCreateCustomer } from '$lib/stripe/server.js';
import { getPlanById, SUBSCRIPTION_PLANS, TRIAL_DAYS } from '$lib/stripe/config.js';
import { trialAvailable, subscriptionOf } from '$lib/auth/entitlements';

/**
 * Starts a Stripe Checkout for a paid plan.
 *
 * Body: `{ planId, billing?: 'monthly' | 'semester', returnTo?: string }`.
 * `returnTo` is the page the student was on (the locked exercises, say): the
 * success page sends them back there once the plan is active.
 */

/** Only same-origin paths are accepted as a return target. */
function safeReturnPath(value) {
	if (typeof value !== 'string') return null;
	if (!value.startsWith('/') || value.startsWith('//')) return null;
	return value;
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals, url }) {
	const { user } = await locals.safeGetSession();
	if (!user) {
		return json({ error: 'Accedi per attivare un piano.', code: 'login_required' }, { status: 401 });
	}

	let body;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Richiesta non valida' }, { status: 400 });
	}

	const plan = getPlanById(body?.planId);
	if (plan.id === SUBSCRIPTION_PLANS.FREE.id) {
		return json({ error: 'Piano non valido' }, { status: 400 });
	}

	const billing = body?.billing === 'semester' ? 'semester' : 'monthly';
	const priceId = billing === 'semester' ? plan.stripePriceIdSemester : plan.stripePriceId;
	if (!priceId) {
		return json(
			{
				error:
					billing === 'semester'
						? 'Il pagamento semestrale non è ancora disponibile per questo piano.'
						: 'Questo piano non è ancora acquistabile.'
			},
			{ status: 400 }
		);
	}

	const current = subscriptionOf(user);
	if (current.plan === plan.id && (current.status === 'active' || current.status === 'trialing')) {
		return json({ error: 'Hai già questo piano.' }, { status: 400 });
	}

	const returnTo = safeReturnPath(body?.returnTo) ?? '/subscription';

	try {
		const customer = await getOrCreateCustomer(user.email, {
			userId: user.id,
			name: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim()
		});

		const successUrl = new URL('/pricing/success', url.origin);
		successUrl.searchParams.set('next', returnTo);
		successUrl.searchParams.set('plan', plan.id);
		const cancelUrl = new URL('/pricing/cancel', url.origin);
		cancelUrl.searchParams.set('next', returnTo);

		const session = await createCheckoutSession({
			priceId,
			customerId: customer.id,
			// Stripe fills the placeholder; keep it verbatim.
			successUrl: successUrl.toString() + '&session_id={CHECKOUT_SESSION_ID}',
			cancelUrl: cancelUrl.toString(),
			metadata: { userId: user.id, planId: plan.id, billing },
			subscriptionMetadata: { userId: user.id, planId: plan.id, billing },
			trialDays: trialAvailable(user) ? TRIAL_DAYS : 0
		});

		return json({ sessionId: session.id, url: session.url });
	} catch (error) {
		console.error('Stripe checkout error:', error);
		return json({ error: 'Errore durante la creazione della sessione di pagamento' }, { status: 500 });
	}
}
