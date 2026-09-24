'use client';

import { useState } from 'react';
import { CheckCircle, Loader2, Sparkles, XCircle } from 'lucide-react';
import { Features, FeaturesDetails, PLAN_DESCRIPTIONS, SUBSCRIPTION_PLANS, canAccessFeature, formatPrice, type SubscriptionPlan } from '@/lib/stripe/config';
import { displayPrice, type BillingOption } from '@/lib/subscription/billing';
import { requestCheckout } from '@/lib/subscription/checkout';
import { cn } from '@/lib/utils/cn';
import { Alert } from '@/components/ui/Alert';

const PLANS = Object.values(SUBSCRIPTION_PLANS);
const FEATURES = Object.values(Features) as Features[];

/** Starts a checkout for a plan; the page shows the redirect overlay and any error. */
export function usePlanCheckout(returnTo: string, billing: BillingOption) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const select = async (plan: SubscriptionPlan) => {
		setLoading(true);
		setError(null);
		try {
			await requestCheckout({ planId: plan.id, billing, returnTo });
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

function PlanButton({ plan, current, onSelect, small = false }: { plan: SubscriptionPlan; current: SubscriptionPlan; onSelect: (plan: SubscriptionPlan) => void; small?: boolean }) {
	const isFree = plan.id === SUBSCRIPTION_PLANS.FREE.id;
	const isCurrent = current.id === plan.id;
	return (
		<button
			type="button"
			onClick={() => !isFree && !isCurrent && onSelect(plan)}
			disabled={isFree || isCurrent}
			className={cn(
				'w-full rounded-xl font-semibold transition-[background-color,transform,box-shadow] duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:translate-y-0',
				small ? 'mx-auto max-w-[140px] px-4 py-2.5 text-sm' : 'px-4 py-3',
				plan.popular ? 'bg-accent text-white shadow-key hover:bg-accent-hover' : 'border border-edge-strong bg-surface text-fg shadow-paper hover:bg-surface-2'
			)}
		>
			{isCurrent ? 'Il tuo piano' : isFree ? 'Piano Free' : 'Seleziona'}
		</button>
	);
}

function Price({ plan, billing, size }: { plan: SubscriptionPlan; billing: BillingOption; size: 'lg' | 'sm' }) {
	if (plan.price === 0) return <span className={cn('font-display font-semibold tracking-tight text-fg-strong', size === 'lg' ? 'text-5xl' : 'text-2xl')}>Gratis</span>;
	const { price, period } = displayPrice(plan, billing);
	return (
		<div className={cn('flex flex-col', size === 'sm' && 'items-center gap-1')}>
			<div className={cn('flex items-baseline', size === 'lg' ? 'gap-2' : 'gap-1')}>
				<span className={cn('font-display font-semibold tracking-tight text-fg-strong tabular-nums', size === 'lg' ? 'text-5xl' : 'text-2xl')}>{formatPrice(price, plan.currency)}</span>
				<span className={cn('text-fg-muted', size === 'sm' && 'text-sm')}>{period}</span>
			</div>
			{billing === 'semester' && (
				<div className="mt-1 text-sm">
					<span className="text-fg-subtle line-through">{formatPrice(plan.price * 6, plan.currency)}</span>
					{size === 'lg' && <span className="ml-2 font-medium text-accent-fg">Risparmi {formatPrice(plan.price * 6 - price, plan.currency)}</span>}
				</div>
			)}
		</div>
	);
}

/** The four plans as cards. */
export function PlanCards({ current, billing, onSelect }: { current: SubscriptionPlan; billing: BillingOption; onSelect: (plan: SubscriptionPlan) => void }) {
	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			{PLANS.map((plan) => (
				<div key={plan.id} className={cn('relative rounded-2xl border-2 bg-surface transition-all duration-200', plan.popular ? 'border-accent shadow-lift md:-translate-y-2' : 'border-edge shadow-paper')}>
					{plan.popular && (
						<div className="label-mono absolute -top-3.5 left-1/2 flex -translate-x-1/2 rotate-[-2deg] items-center gap-1.5 whitespace-nowrap rounded-md bg-accent px-3 py-1.5 text-white shadow-paper">
							<Sparkles className="size-4" aria-hidden="true" />
							Più popolare
						</div>
					)}
					<div className="flex h-full flex-col justify-between p-6">
						<div className="flex flex-col gap-2">
							<h2 className="label-mono mb-2 text-fg-subtle">{plan.name}</h2>
							<div className="mb-6">
								<Price plan={plan} billing={billing} size="lg" />
							</div>
							<p className="mb-8 text-sm leading-relaxed text-fg-muted">{PLAN_DESCRIPTIONS[plan.id]}</p>
						</div>
						<PlanButton plan={plan} current={current} onSelect={onSelect} />
					</div>
				</div>
			))}
		</div>
	);
}

/** Feature by feature comparison of the plans. */
export function PlanTable({ current, billing, onSelect }: { current: SubscriptionPlan; billing: BillingOption; onSelect: (plan: SubscriptionPlan) => void }) {
	const cell = (plan: SubscriptionPlan, extra = '') => cn('px-6 py-4 text-center', plan.popular && 'bg-accent-soft', extra);
	const TutoringIcon = FeaturesDetails[Features.TUTORING].icon;
	return (
		<div className="w-full overflow-x-auto">
			<p className="mb-2 text-xs text-fg-subtle lg:hidden">Scorri lateralmente per confrontare tutti i piani.</p>
			<table className="w-full min-w-[800px] border-collapse">
				<thead>
					<tr className="border-b-2 border-edge">
						<th scope="col" className="px-6 py-4 text-left font-semibold text-fg">Funzionalità</th>
						{PLANS.map((plan) => (
							<th key={plan.id} scope="col" className={cell(plan, 'w-56 rounded-t-lg')}>
								<span className="relative text-lg font-bold text-fg">
									{plan.name}
									{plan.popular && (
										<span className="absolute -right-8 -top-2 rounded-full bg-accent px-2 py-0.5 text-white">
											<Sparkles className="size-3" aria-hidden="true" />
										</span>
									)}
								</span>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					<tr className="border-b border-edge bg-surface-2">
						<td className="px-6 py-4 font-semibold text-fg">Prezzo</td>
						{PLANS.map((plan) => (
							<td key={plan.id} className={cell(plan)}>
								<Price plan={plan} billing={billing} size="sm" />
							</td>
						))}
					</tr>
					{FEATURES.map((feature, index) => {
						const { icon: Icon, name } = FeaturesDetails[feature];
						return (
							<tr key={feature} className={cn('border-b border-edge transition-colors hover:bg-surface-2', index % 2 ? 'bg-surface-2' : 'bg-surface')}>
								<td className="px-6 py-4">
									<span className="flex items-center gap-3 text-sm font-medium text-fg-muted">
										<Icon className="size-4 shrink-0" aria-hidden="true" />
										{name}
									</span>
								</td>
								{PLANS.map((plan) => (
									<td key={plan.id} className={cell(plan)}>
										{canAccessFeature(plan.id, feature) ? <CheckCircle className="mx-auto size-5 text-ok" role="img" aria-label="Inclusa" /> : <XCircle className="mx-auto size-5 text-fg-faint" role="img" aria-label="Non inclusa" />}
									</td>
								))}
							</tr>
						);
					})}
					<tr className="border-b border-edge bg-surface-2">
						<td className="px-6 py-4">
							<span className="flex items-center gap-3 text-sm font-medium text-fg-muted">
								<TutoringIcon className="size-4 shrink-0" aria-hidden="true" />
								Ore di ripetizioni a settimana
							</span>
						</td>
						{PLANS.map((plan) => (
							<td key={plan.id} className={cell(plan, 'text-sm')}>
								{plan.tutoring_hours > 0 ? <span className="font-medium text-fg">{plan.tutoring_hours}h</span> : <span className="text-fg-faint">—</span>}
							</td>
						))}
					</tr>
					<tr>
						<td className="px-6 py-6" />
						{PLANS.map((plan) => (
							<td key={plan.id} className={cell(plan, 'rounded-b-lg py-6')}>
								<PlanButton plan={plan} current={current} onSelect={onSelect} small />
							</td>
						))}
					</tr>
				</tbody>
			</table>
		</div>
	);
}

/** Monthly or six-month billing. */
export function BillingToggle({ value, onChange }: { value: BillingOption; onChange: (value: BillingOption) => void }) {
	const semester = value === 'semester';
	const label = (on: boolean) => cn('text-sm font-medium transition-colors', on ? 'text-fg' : 'text-fg-subtle');
	return (
		<div className="flex items-center justify-center gap-4">
			<span className={label(!semester)}>Mensile</span>
			<button type="button" role="switch" aria-checked={semester} aria-label="Seleziona periodo di fatturazione" onClick={() => onChange(semester ? 'monthly' : 'semester')} className={cn('relative inline-flex h-8 w-14 items-center rounded-full transition-colors', semester ? 'bg-accent' : 'bg-surface-4')}>
				<span className={cn('inline-block size-6 rounded-full bg-white transition-transform', semester ? 'translate-x-7' : 'translate-x-1')} />
			</button>
			<span className={label(semester)}>Semestrale</span>
		</div>
	);
}
