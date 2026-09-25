import { createCheckoutSession, createPassCheckoutSession, getOrCreateCustomer } from '@/lib/stripe/server';
import { SUBSCRIPTION_PLANS, formatDay, getPlanById, passEnd, passOnSale } from '@/lib/stripe/config';
import { planOf } from '@/lib/auth/entitlements';
import { currentUser } from '@/lib/server/auth';
import { fail, json, readJson } from '@/lib/server/http';
import { safePath } from '@/lib/utils/safe-path';

/**
 * Starts a Stripe Checkout for Studio.
 * Body: `{ planId, billing?: 'monthly' | 'pass', returnTo?: string }`.
 * `monthly` is the subscription; `pass` is the one-off payment for Studio
 * until 30 June, sold only in January and February. `returnTo` is the page the
 * student was on (the locked exercises, say): the success page sends them back
 * there once the plan is active.
 */
export async function POST(request: Request) {
	const user = await currentUser();
	if (!user) return json({ error: 'Accedi per attivare un piano.', code: 'login_required' }, 401);

	const body = await readJson(request);
	const plan = getPlanById(String(body.planId ?? ''));
	if (plan.id === SUBSCRIPTION_PLANS.FREE.id) return fail('Piano non valido', 400);

	const billing = body.billing === 'pass' ? 'pass' : 'monthly';
	if (billing === 'pass' && !passOnSale()) return fail('Studio fino a giugno si può acquistare solo a gennaio e febbraio.', 400);
	const priceId = billing === 'pass' ? plan.stripePassPriceId : plan.stripePriceId;
	if (!priceId) return fail('Questo piano non è ancora acquistabile.', 400);

	// The reverse trial does not count: whoever is trying Studio can buy it.
	const { source } = planOf(user);
	if (source === 'subscription') return fail('Hai già un abbonamento a Studio.', 400);
	if (source === 'pass') return fail('Hai già Studio fino a giugno.', 400);

	const returnTo = safePath(body.returnTo, '/subscription');
	const origin = new URL(request.url).origin;
	try {
		const customer = await getOrCreateCustomer(user.email ?? '', {
			userId: user.id,
			name: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim()
		});
		const successUrl = new URL('/pricing/success', origin);
		successUrl.searchParams.set('next', returnTo);
		successUrl.searchParams.set('plan', plan.id);
		const cancelUrl = new URL('/pricing/cancel', origin);
		cancelUrl.searchParams.set('next', returnTo);
		const params = {
			priceId,
			customerId: customer.id,
			// Stripe fills the placeholder; keep it verbatim.
			successUrl: `${successUrl}&session_id={CHECKOUT_SESSION_ID}`,
			cancelUrl: cancelUrl.toString()
		};
		const until = passEnd();
		const session =
			billing === 'pass'
				? await createPassCheckoutSession({ ...params, metadata: { userId: user.id, planId: plan.id, billing, until, label: `Studio fino al ${formatDay(until)}` } })
				: await createCheckoutSession({ ...params, metadata: { userId: user.id, planId: plan.id, billing } });
		return json({ sessionId: session.id, url: session.url });
	} catch (error) {
		console.error('Stripe checkout error:', error);
		return fail('Errore durante la creazione della sessione di pagamento', 500);
	}
}
