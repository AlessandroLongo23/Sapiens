import { SEMESTER_MONTHS_CHARGED, type SubscriptionPlan } from '@/lib/stripe/config';

export type BillingOption = 'monthly' | 'semester';

/** Price and period label for a plan under one billing option; the semester charges five months for six. */
export function displayPrice(plan: SubscriptionPlan, billing: BillingOption): { price: number; period: string } {
	if (plan.price === 0) return { price: 0, period: '' };
	return billing === 'semester' ? { price: plan.price * SEMESTER_MONTHS_CHARGED, period: '/6 mesi' } : { price: plan.price, period: '/mese' };
}
