import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/config/site';
import { SUBSCRIPTION_PLANS, TRIAL_DAYS } from '@/lib/stripe/config';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { productOffersJsonLd } from '@/lib/seo/jsonld';
import { currentUser } from '@/lib/server/auth';
import { claimOf, currentPlan } from '@/lib/server/plan';
import { JsonLd } from '@/components/seo/JsonLd';
import { PricingPage } from '@/components/subscription/PricingPage';

const description = `Piano Free con teoria e formulari gratis. Piani Lite, Base e Pro con esercizi interattivi, flashcard, chat con Sapiens AI e lezioni individuali. Prova gratuita di ${TRIAL_DAYS} giorni, disdici quando vuoi.`;

export const metadata: Metadata = pageMetadata({ title: `Prezzi e abbonamenti | ${SITE_NAME}`, description, path: '/pricing' });

// Structured data reflects the published monthly prices of the paid plans only.
const offers = productOffersJsonLd(
	[SUBSCRIPTION_PLANS.LITE, SUBSCRIPTION_PLANS.BASE, SUBSCRIPTION_PLANS.PRO].map((plan) => ({
		name: plan.name,
		description: `${plan.name}: ${Object.values(plan.access).filter(Boolean).length} funzionalità incluse.`,
		price: plan.price,
		currency: plan.currency,
		billingDuration: 'P1M'
	})),
	'/pricing'
);

export default async function Pricing() {
	const plan = currentPlan(claimOf(await currentUser()));
	return (
		<>
			<JsonLd data={offers} />
			<PricingPage current={plan} />
		</>
	);
}
