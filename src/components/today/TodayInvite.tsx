'use client';

import { useAuth } from '@/lib/state/auth';
import { TRIAL_DAYS } from '@/lib/stripe/config';
import { Button } from '@/components/ui/Button';

/** Oggi for a visitor without an account: what it will hold, and the way in. */
export function TodayInvite() {
	const { openModal } = useAuth();
	return (
		<section className="flex flex-col gap-4 rounded-2xl border border-edge bg-surface p-6 text-center shadow-paper sm:p-8">
			<h2 className="font-display text-2xl font-semibold text-fg-strong">Qui trovi la tua giornata di studio</h2>
			<p className="text-fg-muted">La pratica di ogni giorno, la serie di giorni, gli errori da rifare e la prova lasciata a metà. Crea un account: hai Studio gratis per {TRIAL_DAYS} giorni, senza carta.</p>
			<div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
				<Button size="lg" onClick={() => openModal({ register: true, next: () => window.location.reload() })}>
					Crea un account
				</Button>
				<Button size="lg" variant="secondary" onClick={() => openModal({ next: () => window.location.reload() })}>
					Accedi
				</Button>
			</div>
		</section>
	);
}
