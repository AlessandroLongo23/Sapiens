import type { SubscriptionPlan } from "$lib/stripe/config";

export enum BillingOption {
    MONTHLY = 'monthly',
    SEMESTER = 'semester',
}

/**
* Calculate discounted price for the semester plan
* @param monthlyPrice - The monthly price
* @returns The discounted price for the semester plan
*/
export function calculateDiscountedPrice(monthlyPrice: number): number {
    return monthlyPrice * 5;
}

/**
* Get the display price for a plan
* @param plan - The plan
* @param billingPeriod - The billing period
* @returns The display price and period
*/
export function getDisplayPrice(plan: SubscriptionPlan, billingPeriod: BillingOption): { price: number; period: string } {
    if (plan.price === 0) {
        return { price: 0, period: '' };
    }

    if (billingPeriod === BillingOption.SEMESTER) {
        const discountedPrice = calculateDiscountedPrice(plan.price);
        return { price: discountedPrice, period: '/6 mesi' };
    }

    return { price: plan.price, period: '/mese' };
}