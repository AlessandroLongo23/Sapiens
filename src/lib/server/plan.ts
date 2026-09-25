import 'server-only';
import type { User } from '@supabase/supabase-js';
import { SUBSCRIPTION_PLANS, romeDate, type SubscriptionPlan } from '@/lib/stripe/config';
import { passOf, planOf, subscriptionOf, trialEnd, type PlanSource, type SubscriptionClaim } from '@/lib/auth/entitlements';

/** What the pricing and account pages show about a visitor's plan. Serializable, for client components. */
export interface AccountPlan {
	plan: SubscriptionPlan;
	source: PlanSource;
	/** The Stripe subscription claim, when the account ever had one. */
	subscription: SubscriptionClaim | null;
	/** Last day of a paid "until June" pass, YYYY-MM-DD. */
	passUntil: string | null;
	/** Last day of the reverse trial, YYYY-MM-DD, while it runs. */
	trialUntil: string | null;
}

export function accountPlan(user: User | null): AccountPlan {
	if (!user) return { plan: SUBSCRIPTION_PLANS.FREE, source: 'free', subscription: null, passUntil: null, trialUntil: null };
	const { plan, source } = planOf(user);
	const claim = subscriptionOf(user);
	const end = trialEnd(user);
	return {
		plan,
		source,
		subscription: claim.subscriptionId || claim.customerId ? claim : null,
		passUntil: passOf(user)?.until ?? null,
		trialUntil: source === 'trial' && end ? romeDate(end) : null
	};
}
