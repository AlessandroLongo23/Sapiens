import type { User } from '@supabase/supabase-js';
import { SUBSCRIPTION_PLANS, TRIAL_DAYS, Features, getPlanById, romeDate, type SubscriptionPlan } from '@/lib/stripe/config';

/**
 * What a user is allowed to use. Three things give Studio, in this order: a
 * subscription the Stripe webhook writes into `app_metadata.subscription`, a
 * paid "until June" pass in `app_metadata.pass`, and the first TRIAL_DAYS days
 * after the account was created (the reverse trial). `app_metadata` can only be
 * edited with the service role, unlike `user_metadata`. Used on the server to
 * gate data and on the client to decide what to show; the server decision is
 * the one that counts.
 */

export interface SubscriptionClaim {
	/** Plan id from $lib/stripe/config (`free`, `studio`; `lite`, `base`, `pro` on old accounts). */
	plan: string;
	/** Stripe subscription status (`active`, `trialing`, `past_due`, `canceled`, ...). */
	status: string;
	customerId?: string;
	subscriptionId?: string;
	/** ISO date: set on accounts that had a Stripe trial before the reverse trial existed. */
	trialUsedAt?: string;
	currentPeriodEnd?: string;
	updatedAt?: string;
}

/** A one-off "until June" purchase, written by the webhook once Stripe says it is paid. */
export interface PassClaim {
	plan: string;
	/** Last day of access, YYYY-MM-DD, Rome time. */
	until: string;
	customerId?: string;
	paymentIntentId?: string;
	purchasedAt?: string;
}

/** Where the plan in force comes from. */
export type PlanSource = 'subscription' | 'pass' | 'trial' | 'free';

const FREE: SubscriptionClaim = { plan: SUBSCRIPTION_PLANS.FREE.id, status: 'active' };

const ENTITLING_STATUSES = new Set(['active', 'trialing']);

type MaybeUser = (Pick<User, 'app_metadata'> & Partial<Pick<User, 'created_at'>>) | null | undefined;

export function subscriptionOf(user: MaybeUser): SubscriptionClaim {
	const claim = user?.app_metadata?.subscription as Partial<SubscriptionClaim> | undefined;
	if (!claim || typeof claim.plan !== 'string') return FREE;
	return { ...FREE, ...claim };
}

/** The pass, while it lasts: null once its last day is over. */
export function passOf(user: MaybeUser, now: Date = new Date()): PassClaim | null {
	const pass = user?.app_metadata?.pass as Partial<PassClaim> | undefined;
	if (!pass || typeof pass.plan !== 'string' || typeof pass.until !== 'string') return null;
	return pass.until >= romeDate(now) ? (pass as PassClaim) : null;
}

/** When the reverse trial ends: TRIAL_DAYS after the account was created. */
export function trialEnd(user: MaybeUser): Date | null {
	const created = user?.created_at ? Date.parse(user.created_at) : NaN;
	return Number.isFinite(created) ? new Date(created + TRIAL_DAYS * 86_400_000) : null;
}

/** The plan in force and what gives it. */
export function planOf(user: MaybeUser, now: Date = new Date()): { plan: SubscriptionPlan; source: PlanSource } {
	const claim = subscriptionOf(user);
	if (claim.plan !== SUBSCRIPTION_PLANS.FREE.id && ENTITLING_STATUSES.has(claim.status)) return { plan: getPlanById(claim.plan), source: 'subscription' };
	const pass = passOf(user, now);
	if (pass) return { plan: getPlanById(pass.plan), source: 'pass' };
	const end = trialEnd(user);
	if (end && now < end) return { plan: SUBSCRIPTION_PLANS.STUDIO, source: 'trial' };
	return { plan: SUBSCRIPTION_PLANS.FREE, source: 'free' };
}

/** The plan whose features apply right now. */
export function effectivePlan(user: MaybeUser): SubscriptionPlan {
	return planOf(user).plan;
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
	return plans[0] ?? SUBSCRIPTION_PLANS.STUDIO;
}

/** Features a plan adds on top of the free one, in config order. */
export function featuresUnlockedBy(plan: SubscriptionPlan): Features[] {
	return (Object.values(Features) as Features[]).filter(
		(f) => plan.access[f] && !SUBSCRIPTION_PLANS.FREE.access[f]
	);
}
