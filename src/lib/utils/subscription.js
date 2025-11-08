import { canAccessFeature, getPlanById } from '$lib/stripe/config.js';

/**
 * Check if user can access a specific feature based on their subscription
 */
export function checkFeatureAccess(user, feature) {
	const userPlan = user?.user_metadata?.subscription_plan || 'free';
	const subscriptionStatus = user?.user_metadata?.subscription_status || 'active';

	// If subscription is not active, revert to free plan
	if (subscriptionStatus !== 'active' && subscriptionStatus !== 'trialing') {
		return canAccessFeature('free', feature);
	}

	return canAccessFeature(userPlan, feature);
}

/**
 * Get user's current subscription plan
 */
export function getUserPlan(user) {
	const planId = user?.user_metadata?.subscription_plan || 'free';
	return getPlanById(planId);
}

/**
 * Check if user needs to upgrade for a feature
 */
export function needsUpgrade(user, feature) {
	return !checkFeatureAccess(user, feature);
}

/**
 * Get subscription status badge info
 */
export function getSubscriptionBadge(user) {
	const plan = getUserPlan(user);
	const status = user?.user_metadata?.subscription_status || 'active';

	const badges = {
		free: { text: 'Gratuito', color: 'zinc' },
		lite: { text: 'Lite', color: 'blue' },
		base: { text: 'Base', color: 'purple' },
		pro: { text: 'Pro', color: 'amber' }
	};

	return {
		...badges[plan.id],
		status,
		planName: plan.name
	};
}

