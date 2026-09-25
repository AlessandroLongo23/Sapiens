'use client';

import { useState } from 'react';
import { CheckCircle, Loader2, Sparkles, XCircle } from 'lucide-react';
import { Features, FeaturesDetails, PLAN_DESCRIPTIONS, SCHOOL_YEAR_PASS, SUBSCRIPTION_PLANS, TRIAL_DAYS, formatDay, formatPrice, type SubscriptionPlan } from '@/lib/stripe/config';
import type { PlanSource } from '@/lib/auth/entitlements';
import { FREE_NOTEBOOKS, FREE_NOTES } from '@/lib/zaino/config';
import { useAuth } from '@/lib/state/auth';
import { requestCheckout, type BillingOption } from '@/lib/subscription/checkout';
import { cn } from '@/lib/utils/cn';
import { Alert } from '@/components/ui/Alert';

const PLANS = [SUBSCRIPTION_PLANS.FREE, SUBSCRIPTION_PLANS.STUDIO];
const FEATURES = Object.values(Features) as Features[];

/** The visitor's plan as the pricing and account pages see it: computed on the server, passed down. */
export interface PlanState {
	signedIn: boolean;
	planId: string;
	source: PlanSource;
	/** Last day of a paid pass, YYYY-MM-DD. */
	passUntil: string | null;
	/** Last day of the reverse trial, YYYY-MM-DD, while it runs. */
	trialUntil: string | null;
	/** Whether the "until June" pass can be bought today (decided on the server, in Rome time). */
	passOnSale: boolean;
	/** Its last day if bought today. */
	passEnd: string;
}

/** What Free gets where it gets less than Studio; `true` is a tick, `false` a cross. */
function allowance(plan: SubscriptionPlan, feature: Features): string | boolean {
	if (plan.access[feature]) return feature === Features.EXERCISES || feature === Features.NOTEBOOKS ? 'Senza limiti' : true;
	if (feature === Features.EXERCISES) return 'Una sessione al giorno';
	if (feature === Features.NOTEBOOKS) return `${FREE_NOTEBOOKS} quaderno, ${FREE_NOTES} note`;
	return false;
}

/** Starts a checkout; the page shows the redirect overlay and any error. */
export function usePlanCheckout(returnTo: string) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const select = async (billing: BillingOption) => {
		setLoading(true);
		setError(null);
		try {
			await requestCheckout({ planId: SUBSCRIPTION_PLANS.STUDIO.id, billing, returnTo });
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Errore durante la creazione della sessione');
		} finally {
			setLoading(false);
		}
	};
	return { loading, error, select };
}

/** Full-screen "redirecting" veil while the checkout session is created. */
export function CheckoutOverlay({ error, loading }: { error: string | null; loading: boolean }) {
	return (
		<>
			{error && <Alert tone="error" className="mb-6">{error}</Alert>}
			{loading && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="status">
					<div className="flex flex-col items-center gap-4 rounded-lg bg-surface p-8">
						<Loader2 className="size-12 animate-spin text-accent-fg" aria-hidden="true" />
						<p className="text-lg font-medium text-fg">Reindirizzamento in corso...</p>
					</div>
				</div>
			)}
		</>
	);
}

const BUTTON = 'w-full rounded-xl font-semibold transition-[background-color,transform,box-shadow] duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:translate-y-0';

/**
 * The action under a plan. A visitor without an account signs up, which starts the free week of Studio;
 * a signed-in visitor on Free or in the trial buys Studio; a plan already in force says so.
 */
function PlanButton({ plan, state, onSelect, small = false }: { plan: SubscriptionPlan; state: PlanState; onSelect: (billing: BillingOption) => void; small?: boolean }) {
	const { openModal } = useAuth();
	const studio = plan.id === SUBSCRIPTION_PLANS.STUDIO.id;
	const paid = state.source === 'subscription' || state.source === 'pass';
	const size = small ? 'mx-auto max-w-[180px] px-4 py-2.5 text-sm' : 'px-4 py-3';
	const tone = studio ? 'bg-accent text-white shadow-key hover:bg-accent-hover' : 'border border-edge-strong bg-surface text-fg shadow-paper hover:bg-surface-2';
	const signUp = () => openModal({ register: true, next: () => window.location.reload() });

	let label: string;
	let action: (() => void) | null = null;
	if (!studio) {
		label = !state.signedIn ? 'Crea un account' : state.source === 'free' ? 'Il tuo piano' : 'Incluso in Studio';
		if (!state.signedIn) action = signUp;
	} else if (!state.signedIn) {
		label = `Prova gratis per ${TRIAL_DAYS} giorni`;
		action = signUp;
	} else if (state.source === 'pass' && state.passUntil) {
		label = `Attivo fino al ${formatDay(state.passUntil)}`;
	} else if (paid) {
		label = 'Il tuo piano';
	} else {
		label = 'Attiva Studio';
		action = () => onSelect('monthly');
	}
	return (
		<button type="button" onClick={() => action?.()} disabled={!action} className={cn(BUTTON, size, tone)}>
			{label}
		</button>
	);
}

/** Studio until June, under the monthly button: only while it is on sale and the visitor has not paid for Studio yet. */
function PassOffer({ state, onSelect }: { state: PlanState; onSelect: (billing: BillingOption) => void }) {
	if (!state.passOnSale || !SUBSCRIPTION_PLANS.STUDIO.stripePassPriceId || state.source === 'subscription' || state.source === 'pass') return null;
	return (
		<button type="button" onClick={() => onSelect('pass')} className="mt-3 w-full rounded-lg px-2 py-1.5 text-sm text-fg-muted underline underline-offset-2 hover:text-accent-fg focus-ring">
			oppure {formatPrice(SCHOOL_YEAR_PASS.price)} fino al {formatDay(state.passEnd)}, un solo pagamento
		</button>
	);
}

function Price({ plan, size }: { plan: SubscriptionPlan; size: 'lg' | 'sm' }) {
	if (plan.price === 0) return <span className={cn('font-display font-semibold tracking-tight text-fg-strong', size === 'lg' ? 'text-5xl' : 'text-2xl')}>Gratis</span>;
	return (
		<div className={cn('flex items-baseline', size === 'lg' ? 'gap-2' : 'justify-center gap-1')}>
			<span className={cn('font-display font-semibold tracking-tight text-fg-strong tabular-nums', size === 'lg' ? 'text-5xl' : 'text-2xl')}>{formatPrice(plan.price, plan.currency)}</span>
			<span className={cn('text-fg-muted', size === 'sm' && 'text-sm')}>/mese</span>
		</div>
	);
}

/** Free and Studio as cards. */
export function PlanCards({ state, onSelect }: { state: PlanState; onSelect: (billing: BillingOption) => void }) {
	return (
		<div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
			{PLANS.map((plan) => (
				<div key={plan.id} className={cn('relative rounded-2xl border-2 bg-surface transition-all duration-200', plan.popular ? 'border-accent shadow-lift md:-translate-y-2' : 'border-edge shadow-paper')}>
					{plan.popular && (
						<div className="label-mono absolute -top-3.5 left-1/2 flex -translate-x-1/2 rotate-[-2deg] items-center gap-1.5 whitespace-nowrap rounded-md bg-accent px-3 py-1.5 text-white shadow-paper">
							<Sparkles className="size-4" aria-hidden="true" />
							{TRIAL_DAYS} giorni gratis
						</div>
					)}
					<div className="flex h-full flex-col justify-between p-6">
						<div className="flex flex-col gap-2">
							<h2 className="label-mono mb-2 text-fg-subtle">{plan.name}</h2>
							<div className="mb-6">
								<Price plan={plan} size="lg" />
							</div>
							<p className="mb-6 text-sm leading-relaxed text-fg-muted">{PLAN_DESCRIPTIONS[plan.id]}</p>
							{plan.id === SUBSCRIPTION_PLANS.STUDIO.id && state.source === 'trial' && state.trialUntil && (
								<p className="mb-6 text-sm font-medium text-accent-fg">Stai provando Studio fino al {formatDay(state.trialUntil)}.</p>
							)}
						</div>
						<div>
							<PlanButton plan={plan} state={state} onSelect={onSelect} />
							{plan.id === SUBSCRIPTION_PLANS.STUDIO.id && <PassOffer state={state} onSelect={onSelect} />}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

/** Feature by feature comparison of Free and Studio. */
export function PlanTable({ state, onSelect }: { state: PlanState; onSelect: (billing: BillingOption) => void }) {
	const cell = (plan: SubscriptionPlan, extra = '') => cn('px-4 py-4 text-center sm:px-6', plan.popular && 'bg-accent-soft', extra);
	return (
		<div className="w-full overflow-x-auto">
			<table className="w-full min-w-[520px] border-collapse">
				<thead>
					<tr className="border-b-2 border-edge">
						<th scope="col" className="px-4 py-4 text-left font-semibold text-fg sm:px-6">Funzionalità</th>
						{PLANS.map((plan) => (
							<th key={plan.id} scope="col" className={cell(plan, 'w-44 rounded-t-lg')}>
								<span className="text-lg font-bold text-fg">{plan.name}</span>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					<tr className="border-b border-edge bg-surface-2">
						<td className="px-4 py-4 font-semibold text-fg sm:px-6">Prezzo</td>
						{PLANS.map((plan) => (
							<td key={plan.id} className={cell(plan)}>
								<Price plan={plan} size="sm" />
							</td>
						))}
					</tr>
					{FEATURES.map((feature, index) => {
						const { icon: Icon, name } = FeaturesDetails[feature];
						return (
							<tr key={feature} className={cn('border-b border-edge transition-colors hover:bg-surface-2', index % 2 ? 'bg-surface-2' : 'bg-surface')}>
								<td className="px-4 py-4 sm:px-6">
									<span className="flex items-center gap-3 text-sm font-medium text-fg-muted">
										<Icon className="size-4 shrink-0" aria-hidden="true" />
										{name.replace(/ senza limiti$/, '')}
									</span>
								</td>
								{PLANS.map((plan) => {
									const value = allowance(plan, feature);
									return (
										<td key={plan.id} className={cell(plan, 'text-sm')}>
											{value === true ? (
												<CheckCircle className="mx-auto size-5 text-ok" role="img" aria-label="Incluso" />
											) : value === false ? (
												<XCircle className="mx-auto size-5 text-fg-faint" role="img" aria-label="Non incluso" />
											) : (
												<span className="font-medium text-fg">{value}</span>
											)}
										</td>
									);
								})}
							</tr>
						);
					})}
					<tr>
						<td className="px-4 py-6 sm:px-6" />
						{PLANS.map((plan) => (
							<td key={plan.id} className={cell(plan, 'rounded-b-lg py-6')}>
								<PlanButton plan={plan} state={state} onSelect={onSelect} small />
							</td>
						))}
					</tr>
				</tbody>
			</table>
		</div>
	);
}
