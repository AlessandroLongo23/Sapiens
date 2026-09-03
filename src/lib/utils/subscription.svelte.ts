import { Features, getPlanById } from '$lib/stripe/config.js';
import { effectivePlan, hasFeature, subscriptionOf } from '$lib/auth/entitlements';
import type { User } from '@supabase/supabase-js';

/**
 * Thin wrappers kept for the existing call sites. The rules live in
 * `$lib/auth/entitlements` and read `app_metadata`, never `user_metadata`.
 */

export function checkFeatureAccess(user: User | null | undefined, feature: Features | string): boolean {
	return hasFeature(user, feature as Features);
}

export function getUserPlan(user: User | null | undefined) {
	return effectivePlan(user);
}

export function needsUpgrade(user: User | null | undefined, feature: Features | string): boolean {
	return !checkFeatureAccess(user, feature);
}

export function getSubscriptionBadge(user: User | null | undefined) {
	const claim = subscriptionOf(user);
	const plan = getPlanById(claim.plan);

	const badges: Record<string, { text: string; color: string }> = {
		free: { text: 'Gratuito', color: 'zinc' },
		lite: { text: 'Lite', color: 'blue' },
		base: { text: 'Base', color: 'purple' },
		pro: { text: 'Pro', color: 'amber' }
	};

	return {
		...(badges[plan.id] ?? badges.free),
		status: claim.status,
		planName: plan.name
	};
}
