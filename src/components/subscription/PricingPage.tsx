'use client';

import { useState } from 'react';
import { SUBSCRIPTION_PLANS, TRIAL_DAYS, type SubscriptionPlan } from '@/lib/stripe/config';
import type { BillingOption } from '@/lib/subscription/billing';
import { BillingToggle, CheckoutOverlay, PlanCards, PlanTable, usePlanCheckout } from './Plans';

/** The pricing page's interactive part: billing period, plan cards, the comparison table and the checkout. */
export function PricingPage({ current }: { current: SubscriptionPlan }) {
	const [billing, setBilling] = useState<BillingOption>('monthly');
	const { loading, error, select } = usePlanCheckout('/subscription', billing);
	// The six-month option exists only once its Stripe prices are configured.
	const semester = Object.values(SUBSCRIPTION_PLANS).some((p) => p.stripePriceIdSemester);

	return (
		<div className="z-10 mx-auto flex max-w-7xl flex-col gap-12 px-4 py-12">
			<CheckoutOverlay error={error} loading={loading} />
			<div className="flex flex-col gap-12">
				<div className="flex flex-col gap-4 text-center">
					<h1 className="text-3xl font-bold text-fg sm:text-4xl">Prezzi e abbonamenti</h1>
					<p className="mx-auto max-w-3xl text-lg text-fg-muted">
						Inizia gratis e passa a Premium quando vuoi. Puoi annullare in qualsiasi momento.
						{semester && (
							<>
								<br />
								<span className="text-base text-accent-fg">Con l&apos;abbonamento semestrale, il primo mese te lo regaliamo!</span>
							</>
						)}
					</p>
					{semester && <BillingToggle value={billing} onChange={setBilling} />}
				</div>
				<PlanCards current={current} billing={billing} onSelect={select} />
				<p className="text-center text-sm text-fg-muted">Prova gratuita di {TRIAL_DAYS} giorni per tutti i piani Premium. Non serve la carta di credito.</p>
			</div>
			<hr className="border-edge" />
			<div className="flex flex-col gap-12">
				<div className="flex flex-col gap-4 text-center">
					<h2 className="text-3xl font-bold text-fg sm:text-4xl">Confronta i piani</h2>
					<p className="mx-auto max-w-3xl text-lg text-fg-muted">Tutti i dettagli a colpo d&apos;occhio per aiutarti a scegliere il piano perfetto per le tue esigenze.</p>
				</div>
				<div className="overflow-hidden rounded-2xl border border-edge bg-surface p-6 shadow-lg">
					<PlanTable current={current} billing={billing} onSelect={select} />
				</div>
			</div>
		</div>
	);
}
