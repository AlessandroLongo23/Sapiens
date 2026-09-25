import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/config/site';
import { SCHOOL_YEAR_PASS, SUBSCRIPTION_PLANS, TRIAL_DAYS, formatDay, passEnd, passOnSale } from '@/lib/stripe/config';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { productOffersJsonLd } from '@/lib/seo/jsonld';
import { currentUser } from '@/lib/server/auth';
import { accountPlan } from '@/lib/server/plan';
import { JsonLd } from '@/components/seo/JsonLd';
import { PricingPage } from '@/components/subscription/PricingPage';

const description = `Piano Free con teoria, formulari e una sessione di esercizi al giorno. Studio a ${SUBSCRIPTION_PLANS.STUDIO.price.toFixed(2).replace('.', ',')} € al mese con esercizi senza limiti, flashcard, Zaino e Sapiens AI. ${TRIAL_DAYS} giorni di Studio gratis, senza carta.`;

export const metadata: Metadata = pageMetadata({ title: `Prezzi | ${SITE_NAME}`, description, path: '/pricing' });

export default async function Pricing() {
	const user = await currentUser();
	const { plan, source, passUntil, trialUntil } = accountPlan(user);
	const onSale = passOnSale();
	const end = passEnd();
	// Structured data lists what can be bought today: the monthly plan, and the pass while it is on sale.
	const offers = productOffersJsonLd(
		[
			{ name: 'Studio', description: 'Studio, abbonamento mensile.', price: SUBSCRIPTION_PLANS.STUDIO.price, currency: SUBSCRIPTION_PLANS.STUDIO.currency, billingDuration: 'P1M' },
			...(onSale ? [{ name: `Studio fino al ${formatDay(end)}`, description: 'Studio fino a fine giugno, pagamento unico.', price: SCHOOL_YEAR_PASS.price, currency: SUBSCRIPTION_PLANS.STUDIO.currency }] : [])
		],
		'/pricing'
	);
	return (
		<>
			<JsonLd data={offers} />
			<PricingPage state={{ signedIn: !!user, planId: plan.id, source, passUntil, trialUntil, passOnSale: onSale, passEnd: end }} />
		</>
	);
}
