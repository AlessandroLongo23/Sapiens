import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { passEnd, passOnSale } from '@/lib/stripe/config';
import { currentUser } from '@/lib/server/auth';
import { accountPlan } from '@/lib/server/plan';
import { SubscriptionPanel } from '@/components/subscription/SubscriptionPanel';

export const metadata: Metadata = pageMetadata({ title: 'Il tuo abbonamento | Sapiens', path: '/subscription' });

export default async function SubscriptionPage() {
	const user = await currentUser();
	const { plan, source, subscription, passUntil, trialUntil } = accountPlan(user);
	return (
		<div className="min-h-screen bg-page-alt">
			<SubscriptionPanel subscription={subscription} state={{ signedIn: !!user, planId: plan.id, source, passUntil, trialUntil, passOnSale: passOnSale(), passEnd: passEnd() }} />
		</div>
	);
}
