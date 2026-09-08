import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { currentUser } from '@/lib/server/auth';
import { claimOf, currentPlan } from '@/lib/server/plan';
import { SubscriptionPanel } from '@/components/subscription/SubscriptionPanel';

export const metadata: Metadata = pageMetadata({ title: 'Il tuo abbonamento | Sapiens', path: '/subscription' });

export default async function SubscriptionPage() {
	const subscription = claimOf(await currentUser());
	return (
		<div className="min-h-screen bg-page-alt">
			<SubscriptionPanel subscription={subscription} current={currentPlan(subscription)} />
		</div>
	);
}
