import { createCheckoutSession, getOrCreateCustomer } from '@/lib/stripe/server';
import { SUBSCRIPTION_PLANS, TRIAL_DAYS, getPlanById } from '@/lib/stripe/config';
import { subscriptionOf, trialAvailable } from '@/lib/auth/entitlements';
import { currentUser } from '@/lib/server/auth';
import { fail, json, readJson } from '@/lib/server/http';
import { safePath } from '@/lib/utils/safe-path';

/**
 * Starts a Stripe Checkout for a paid plan.
 * Body: `{ planId, billing?: 'monthly' | 'semester', returnTo?: string }`.
 * `returnTo` is the page the student was on (the locked exercises, say): the
 * success page sends them back there once the plan is active.
 */
export async function POST(request: Request) {
	const user = await currentUser();
	if (!user) return json({ error: 'Accedi per attivare un piano.', code: 'login_required' }, 401);

	const body = await readJson(request);
	const plan = getPlanById(String(body.planId ?? ''));
	if (plan.id === SUBSCRIPTION_PLANS.FREE.id) return fail('Piano non valido', 400);

	const billing = body.billing === 'semester' ? 'semester' : 'monthly';
	const priceId = billing === 'semester' ? plan.stripePriceIdSemester : plan.stripePriceId;
	if (!priceId) return fail(billing === 'semester' ? 'Il pagamento semestrale non è ancora disponibile per questo piano.' : 'Questo piano non è ancora acquistabile.', 400);

	const current = subscriptionOf(user);
	if (current.plan === plan.id && (current.status === 'active' || current.status === 'trialing')) return fail('Hai già questo piano.', 400);

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
		const session = await createCheckoutSession({
			priceId,
			customerId: customer.id,
			// Stripe fills the placeholder; keep it verbatim.
			successUrl: `${successUrl}&session_id={CHECKOUT_SESSION_ID}`,
			cancelUrl: cancelUrl.toString(),
			metadata: { userId: user.id, planId: plan.id, billing },
			trialDays: trialAvailable(user) ? TRIAL_DAYS : 0
		});
		return json({ sessionId: session.id, url: session.url });
	} catch (error) {
		console.error('Stripe checkout error:', error);
		return fail('Errore durante la creazione della sessione di pagamento', 500);
	}
}
