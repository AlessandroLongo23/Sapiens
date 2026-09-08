import type { User } from '@supabase/supabase-js';
import { SUBSCRIPTION_PLANS, Features, getPlanById, type SubscriptionPlan } from '@/lib/stripe/config';

/**
 * What a user is allowed to use, from the subscription claim the Stripe
 * webhook writes into `app_metadata` (which only the service role can edit,
 * unlike `user_metadata`). Used on the server to gate data and on the client
 * to decide what to show; the server decision is the one that counts.
 */

export interface SubscriptionClaim {
	/** Plan id from $lib/stripe/config (`free`, `lite`, `base`, `pro`). */
	plan: string;
	/** Stripe subscription status (`active`, `trialing`, `past_due`, `canceled`, ...). */
	status: string;
	customerId?: string;
	subscriptionId?: string;
	/** ISO date: set once a trial has been used, so a second checkout gets none. */
	trialUsedAt?: string;
	currentPeriodEnd?: string;
	updatedAt?: string;
}

const FREE: SubscriptionClaim = { plan: SUBSCRIPTION_PLANS.FREE.id, status: 'active' };

const ENTITLING_STATUSES = new Set(['active', 'trialing']);

type MaybeUser = Pick<User, 'app_metadata'> | null | undefined;

export function subscriptionOf(user: MaybeUser): SubscriptionClaim {
	const claim = user?.app_metadata?.subscription as Partial<SubscriptionClaim> | undefined;
	if (!claim || typeof claim.plan !== 'string') return FREE;
	return { ...FREE, ...claim };
}

/** The plan whose features apply right now: the paid one only while Stripe says it is active or trialing. */
export function effectivePlan(user: MaybeUser): SubscriptionPlan {
	const claim = subscriptionOf(user);
	if (!ENTITLING_STATUSES.has(claim.status)) return SUBSCRIPTION_PLANS.FREE;
	return getPlanById(claim.plan);
}

/** Staff bypass: only `app_metadata.role`, which users cannot set themselves. */
export function isStaff(user: MaybeUser): boolean {
	return user?.app_metadata?.role === 'admin';
}

export function hasFeature(user: MaybeUser, feature: Features): boolean {
	if (isStaff(user)) return true;
	return effectivePlan(user).access[feature] === true;
}

/** The cheapest plan that includes a feature, for upgrade prompts. */
export function requiredPlanFor(feature: Features): SubscriptionPlan {
	const plans = Object.values(SUBSCRIPTION_PLANS)
		.filter((p) => p.access[feature])
		.sort((a, b) => a.price - b.price);
	return plans[0] ?? SUBSCRIPTION_PLANS.PRO;
}

/** Features a plan adds on top of the free one, in config order. */
export function featuresUnlockedBy(plan: SubscriptionPlan): Features[] {
	return (Object.values(Features) as Features[]).filter(
		(f) => plan.access[f] && !SUBSCRIPTION_PLANS.FREE.access[f]
	);
}

export function trialAvailable(user: MaybeUser): boolean {
	return !subscriptionOf(user).trialUsedAt;
}
