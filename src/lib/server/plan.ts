import 'server-only';
import type { User } from '@supabase/supabase-js';
import { SUBSCRIPTION_PLANS, getPlanById, type SubscriptionPlan } from '@/lib/stripe/config';
import { subscriptionOf, type SubscriptionClaim } from '@/lib/auth/entitlements';

/** The plan shown as "yours" on the pricing and account pages: the paid one only while Stripe says it is active or trialing. */
export function currentPlan(subscription: SubscriptionClaim | null): SubscriptionPlan {
	return subscription && ['active', 'trialing'].includes(subscription.status) ? getPlanById(subscription.plan) : SUBSCRIPTION_PLANS.FREE;
}

export const claimOf = (user: User | null): SubscriptionClaim | null => (user ? subscriptionOf(user) : null);
