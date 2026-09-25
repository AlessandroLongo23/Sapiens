'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Loader2, Lock } from 'lucide-react';
import { Features, FeaturesDetails, SCHOOL_YEAR_PASS, TRIAL_DAYS, formatDay, formatPrice, passEnd, passOnSale } from '@/lib/stripe/config';
import { featuresUnlockedBy, requiredPlanFor } from '@/lib/auth/entitlements';
import type { BillingOption } from '@/lib/subscription/checkout';
import { useAuth } from '@/lib/state/auth';
import { requestCheckout } from '@/lib/subscription/checkout';
import { cn } from '@/lib/utils/cn';

const COPY: Record<Features, (plan: string) => string> = {
	[Features.EXERCISES]: (p) => `Gli esercizi interattivi sono inclusi nel piano ${p}`,
	[Features.FLASHCARDS]: (p) => `Le flashcard sono incluse nel piano ${p}`,
	[Features.NOTEBOOKS]: (p) => `Quaderni e note senza limiti sono inclusi nel piano ${p}`,
	[Features.AI_CHAT]: (p) => `Sapiens AI è incluso nel piano ${p}`,
	[Features.THEORY]: (p) => `Inclusa nel piano ${p}`
};

interface Props {
	feature: Features;
	/** Page to come back to once the plan is active. */
	returnTo: string;
	/** Where the "back" link goes (the lesson's theory, usually). */
	backUrl?: string;
	/** A one-line, true description of what the feature does. */
	benefit: string;
	/** Replaces the "included in Studio" heading (the free exercise session already used today, say). */
	title?: string;
	/** Rendered, blurred and inert, behind the card. */
	preview?: ReactNode;
	/** Narrow version for sidebars. */
	compact?: boolean;
}

/**
 * Shown in place of a Studio feature the visitor cannot use. States the plan
 * that includes it, what else it unlocks and the price. A visitor without an
 * account is offered the free week of Studio that comes with signing up; a
 * signed-in one on Free starts the checkout in one click, monthly or, in
 * January and February, until June. No timers, no fake scarcity: the content
 * behind is what sells it.
 */
export function Paywall({ feature, returnTo, backUrl, benefit, title, preview, compact = false }: Props) {
	const { user, ready, openModal } = useAuth();
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const plan = requiredPlanFor(feature);
	const name = plan.name.replace(/^Piano\s+/i, '');
	const unlocked = featuresUnlockedBy(plan);
	const pass = passOnSale() && !!plan.stripePassPriceId;

	const upgrade = async (billing: BillingOption) => {
		if (!user) return openModal({ register: true, next: () => window.location.reload() });
		setBusy(true);
		setError(null);
		try {
			await requestCheckout({ planId: plan.id, billing, returnTo });
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Qualcosa è andato storto. Riprova.');
		} finally {
			setBusy(false);
		}
	};

	return (
		<div className={cn('relative', !compact && 'h-full min-h-[60vh]')} id="paywall">
			{preview && (
				<div className="pointer-events-none select-none opacity-50 blur-sm" aria-hidden="true" inert>
					{preview}
				</div>
			)}
			<div className={cn('flex items-center justify-center', !!preview && 'absolute inset-0', compact ? 'p-3' : 'p-6')}>
				<section className={cn('w-full rounded-3xl border border-edge bg-surface text-center shadow-xl', compact ? 'max-w-sm p-5' : 'max-w-md p-8')} aria-labelledby="paywall-title">
					<div className={cn('mx-auto flex items-center justify-center rounded-full bg-accent-soft text-accent-fg', compact ? 'mb-3 size-11' : 'mb-5 size-16')}>
						<Lock className={compact ? 'size-5' : 'size-7'} aria-hidden="true" />
					</div>
					<h2 id="paywall-title" className={cn('font-bold leading-snug tracking-tight text-fg-strong', compact ? 'text-base' : 'text-2xl')}>
						{title ?? COPY[feature](name)}
					</h2>
					<p className={cn('mt-2 leading-relaxed text-fg-muted', compact && 'text-sm')}>{benefit}</p>
					{unlocked.length > 1 && !compact && (
						<ul className="mt-5 flex flex-col gap-2 text-left text-sm text-fg-muted" aria-label={`Incluso nel piano ${name}`}>
							{unlocked.map((f) => (
								<li key={f} className="flex items-center gap-2.5">
									<Check className="size-4 shrink-0 text-accent-fg" aria-hidden="true" />
									<span>{FeaturesDetails[f].name}</span>
								</li>
							))}
						</ul>
					)}
					<p className="mt-5 text-sm text-fg-muted">
						{user ? (
							<>
								<span className="font-semibold text-fg">{formatPrice(plan.price, plan.currency)} al mese</span> · disdici quando vuoi
							</>
						) : (
							<>Crea un account: hai {name} gratis per {TRIAL_DAYS} giorni, senza carta. Poi il piano Free resta gratis.</>
						)}
					</p>
					<button type="button" onClick={() => upgrade('monthly')} disabled={busy} className={cn('mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-wait disabled:opacity-60 focus-ring-offset', compact ? 'py-2.5 text-sm' : 'py-3.5')}>
						{busy ? (
							<>
								<Loader2 className="size-4 animate-spin" aria-hidden="true" />
								<span>Un attimo…</span>
							</>
						) : user ? (
							`Attiva ${name}`
						) : (
							`Prova ${name} gratis per ${TRIAL_DAYS} giorni`
						)}
					</button>
					{user && pass && (
						<button type="button" onClick={() => upgrade('pass')} disabled={busy} className="mt-2 rounded text-sm text-fg-muted underline underline-offset-2 hover:text-accent-fg focus-ring">
							oppure {formatPrice(SCHOOL_YEAR_PASS.price)} fino al {formatDay(passEnd())}, un solo pagamento
						</button>
					)}
					{error && (
						<p className="mt-3 text-sm text-danger-fg" role="alert">
							{error}
						</p>
					)}
					<div className="mt-4 flex flex-col items-center gap-2 text-sm">
						<Link href="/pricing" className="rounded text-fg-muted underline underline-offset-2 hover:text-accent-fg focus-ring">
							Confronta tutti i piani
						</Link>
						{ready && !user && (
							<button type="button" onClick={() => openModal()} className="rounded text-fg-subtle hover:text-fg focus-ring">
								Hai già un abbonamento? Accedi
							</button>
						)}
					</div>
					{backUrl && (
						<Link href={backUrl} className="mt-5 inline-flex items-center gap-2 rounded text-sm text-fg-subtle hover:text-fg focus-ring">
							<ArrowLeft className="size-4" aria-hidden="true" />
							Torna alla teoria
						</Link>
					)}
				</section>
			</div>
		</div>
	);
}
