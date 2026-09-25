'use client';

import { TRIAL_DAYS } from '@/lib/stripe/config';
import { CheckoutOverlay, PlanCards, PlanTable, usePlanCheckout, type PlanState } from './Plans';

/** The pricing page's interactive part: the two plans, the comparison table and the checkout. */
export function PricingPage({ state }: { state: PlanState }) {
	const { loading, error, select } = usePlanCheckout('/subscription');

	return (
		<div className="z-10 mx-auto flex max-w-7xl flex-col gap-12 px-4 py-12">
			<CheckoutOverlay error={error} loading={loading} />
			<div className="flex flex-col gap-12">
				<div className="flex flex-col gap-4 text-center">
					<h1 className="text-3xl font-bold text-fg sm:text-4xl">Prezzi</h1>
					<p className="mx-auto max-w-3xl text-lg text-fg-muted">
						Chi crea un account ha Studio gratis per {TRIAL_DAYS} giorni, senza carta. Poi resta il piano Free, con una sessione di esercizi al giorno, oppure continui con Studio.
					</p>
				</div>
				<PlanCards state={state} onSelect={select} />
				<p className="text-center text-sm text-fg-muted">Prezzi IVA inclusa. L&apos;abbonamento mensile si disdice quando vuoi; il piano fino a giugno è un pagamento unico e non si rinnova.</p>
			</div>
			<hr className="border-edge" />
			<div className="flex flex-col gap-12">
				<div className="flex flex-col gap-4 text-center">
					<h2 className="text-3xl font-bold text-fg sm:text-4xl">Confronta i piani</h2>
				</div>
				<div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-edge bg-surface p-4 shadow-lg sm:p-6">
					<PlanTable state={state} onSelect={select} />
				</div>
			</div>
		</div>
	);
}
