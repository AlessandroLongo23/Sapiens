'use client';

import { useState } from 'react';
import { Calendar, CreditCard, Crown } from 'lucide-react';
import { SUBSCRIPTION_PLANS, formatDay, formatPrice } from '@/lib/stripe/config';
import type { SubscriptionClaim } from '@/lib/auth/entitlements';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CheckoutOverlay, PlanCards, usePlanCheckout, type PlanState } from './Plans';

const STATUS: Record<string, { text: string; tone: BadgeTone }> = {
	active: { text: 'Attivo', tone: 'ok' },
	past_due: { text: 'Pagamento in sospeso', tone: 'warn' },
	canceled: { text: 'Cancellato', tone: 'danger' },
	trialing: { text: 'Periodo di prova', tone: 'info' }
};

/** What the account has now, in one line under the plan name. */
function summary(state: PlanState): { badge: { text: string; tone: BadgeTone }; lines: string[]; price: string | null } {
	const studio = SUBSCRIPTION_PLANS.STUDIO;
	if (state.source === 'pass' && state.passUntil)
		return { badge: STATUS.active, lines: [`Attivo fino al ${formatDay(state.passUntil)}`, 'Pagamento unico: non si rinnova'], price: null };
	if (state.source === 'trial' && state.trialUntil)
		return { badge: { text: 'Prova gratuita', tone: 'info' }, lines: [`Prova di Studio fino al ${formatDay(state.trialUntil)}`, 'Senza carta: alla fine passi al piano Free, senza addebiti'], price: null };
	if (state.source === 'subscription') return { badge: STATUS.active, lines: ['Pagamento automatico mensile'], price: formatPrice(studio.price, studio.currency) };
	return { badge: STATUS.active, lines: ['Teoria, formulari e una sessione di esercizi al giorno'], price: null };
}

/** The account page: the plan in force, the Stripe portal when there is a subscription, then the plans. */
export function SubscriptionPanel({ subscription, state }: { subscription: SubscriptionClaim | null; state: PlanState }) {
	const { loading, error, select } = usePlanCheckout('/subscription');
	const [portal, setPortal] = useState<{ busy?: boolean; error?: string }>({});
	const name = state.source === 'free' ? SUBSCRIPTION_PLANS.FREE.name : SUBSCRIPTION_PLANS.STUDIO.name;
	const { badge, lines, price } = summary(state);
	const status = state.source === 'subscription' && subscription ? (STATUS[subscription.status] ?? badge) : badge;

	const manage = async () => {
		setPortal({ busy: true });
		try {
			const response = await fetch('/api/stripe/portal', { method: 'POST' });
			const body = await response.json().catch(() => ({}));
			if (!response.ok || !body.url) throw new Error(body.error || "Errore durante l'apertura del portale");
			window.location.href = body.url;
		} catch (err) {
			setPortal({ error: err instanceof Error ? err.message : "Errore durante l'apertura del portale" });
		}
	};

	return (
		<div className="mx-auto max-w-7xl px-4 py-8">
			<CheckoutOverlay error={error ?? portal.error ?? null} loading={loading || !!portal.busy} />
			<header className="mb-8">
				<h1 className="mb-2 text-3xl font-bold text-fg">Il tuo abbonamento</h1>
				<p className="text-fg-muted">Il tuo piano, il metodo di pagamento e le ricevute.</p>
			</header>
			<div className="mb-12 rounded-xl border border-edge bg-surface p-6">
				<div className="mb-4 flex items-start justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="flex size-12 items-center justify-center rounded-full bg-accent-soft text-accent-fg">
							<Crown className="size-6" aria-hidden="true" />
						</div>
						<div>
							<h2 className="text-lg font-bold text-fg">{name}</h2>
							<Badge tone={status.tone}>{status.text}</Badge>
						</div>
					</div>
					{price && (
						<div className="text-right">
							<p className="text-2xl font-bold text-fg">{price}</p>
							<p className="text-sm text-fg-muted">al mese</p>
						</div>
					)}
				</div>
				<div className="mb-6 space-y-3 text-sm">
					{lines.map((line, i) => (
						<p key={line} className="flex items-center gap-2 text-fg-muted">
							{i === 0 ? <Calendar className="size-4 text-fg-subtle" aria-hidden="true" /> : <CreditCard className="size-4 text-fg-subtle" aria-hidden="true" />}
							{line}
						</p>
					))}
				</div>
				{(subscription?.customerId || state.source === 'pass') && (
					<Button variant="secondary" onClick={manage} loading={portal.busy} className="w-full sm:w-auto">
						{state.source === 'subscription' ? 'Gestisci abbonamento' : 'Pagamenti e ricevute'}
					</Button>
				)}
			</div>
			<PlanCards state={state} onSelect={select} />
		</div>
	);
}
