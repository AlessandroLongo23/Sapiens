'use client';

import { useState } from 'react';
import { Calendar, CreditCard, Crown } from 'lucide-react';
import { getPlanById, formatPrice, type SubscriptionPlan } from '@/lib/stripe/config';
import type { SubscriptionClaim } from '@/lib/auth/entitlements';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CheckoutOverlay, PlanCards, usePlanCheckout } from './Plans';

const STATUS: Record<string, { text: string; tone: BadgeTone }> = {
	active: { text: 'Attivo', tone: 'ok' },
	past_due: { text: 'Pagamento in sospeso', tone: 'warn' },
	canceled: { text: 'Cancellato', tone: 'danger' },
	trialing: { text: 'Periodo di prova', tone: 'info' }
};

/** The account page: the current plan with the portal button, then the plans to switch to. */
export function SubscriptionPanel({ subscription, current }: { subscription: SubscriptionClaim | null; current: SubscriptionPlan }) {
	const { loading, error, select } = usePlanCheckout('/subscription', 'monthly');
	const [portal, setPortal] = useState<{ busy?: boolean; error?: string }>({});
	const plan = subscription ? getPlanById(subscription.plan) : null;
	const status = STATUS[subscription?.status ?? ''] ?? STATUS.active;

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
				<p className="text-fg-muted">Gestisci il tuo piano, il metodo di pagamento e le fatture.</p>
			</header>
			{subscription && plan && (
				<div className="mb-12 rounded-xl border border-edge bg-surface p-6">
					<div className="mb-4 flex items-start justify-between">
						<div className="flex items-center gap-3">
							<div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
								<Crown className="size-6 text-white" aria-hidden="true" />
							</div>
							<div>
								<h2 className="text-lg font-bold text-fg">{plan.name}</h2>
								<Badge tone={status.tone}>{status.text}</Badge>
							</div>
						</div>
						{plan.id !== 'free' && (
							<div className="text-right">
								<p className="text-2xl font-bold text-fg">{formatPrice(plan.price, plan.currency)}</p>
								<p className="text-sm text-fg-muted">al mese</p>
							</div>
						)}
					</div>
					<div className="mb-6 space-y-3 text-sm">
						<p className="flex items-center gap-2 text-fg-muted">
							<CreditCard className="size-4 text-fg-subtle" aria-hidden="true" />
							{plan.id === 'free' ? 'Nessun metodo di pagamento richiesto' : 'Pagamento automatico mensile'}
						</p>
						{subscription.status === 'trialing' && (
							<p className="flex items-center gap-2 text-info-fg">
								<Calendar className="size-4" aria-hidden="true" />
								Prova gratuita attiva
							</p>
						)}
					</div>
					{plan.id !== 'free' && subscription.customerId && (
						<Button variant="secondary" onClick={manage} loading={portal.busy} className="w-full sm:w-auto">
							Gestisci abbonamento
						</Button>
					)}
				</div>
			)}
			<PlanCards current={current} billing="monthly" onSelect={select} />
		</div>
	);
}
