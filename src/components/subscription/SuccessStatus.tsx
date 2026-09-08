'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Loader2 } from 'lucide-react';
import { authStore } from '@/lib/state/auth';
import { LinkButton } from '@/components/ui/Button';

type Phase = 'waiting' | 'active' | 'slow';

/**
 * Stripe confirms the payment through a webhook a few seconds after the
 * redirect: poll the account until the plan is on, then refresh the token
 * so the browser session carries it too.
 */
export function SuccessStatus({ next, planName }: { next: string; planName: string }) {
	const [phase, setPhase] = useState<Phase>('waiting');

	useEffect(() => {
		let attempts = 0;
		let timer: ReturnType<typeof setTimeout> | undefined;
		const check = async () => {
			attempts++;
			try {
				const body = await (await fetch('/api/me', { cache: 'no-store' })).json();
				const status = body?.subscription?.status;
				if (body?.plan && body.plan !== 'free' && (status === 'active' || status === 'trialing')) {
					await authStore.getState().refresh();
					setPhase('active');
					return;
				}
			} catch {
				// Network hiccup: try again.
			}
			if (attempts >= 15) return setPhase('slow');
			timer = setTimeout(check, 2000);
		};
		check();
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="w-full max-w-md rounded-2xl border border-edge bg-surface p-8 text-center">
			{phase === 'active' ? (
				<>
					<div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
						<CheckCircle className="size-12 text-ok-fg" aria-hidden="true" />
					</div>
					<h1 className="mb-4 text-3xl font-bold text-fg">{planName} attivo</h1>
					<p className="mb-8 text-fg-muted">Tutto pronto. Puoi riprendere da dove eri rimasto.</p>
					<LinkButton href={next} size="lg" className="w-full">Continua</LinkButton>
				</>
			) : phase === 'slow' ? (
				<>
					<h1 className="mb-4 text-2xl font-bold text-fg">Ci vuole un attimo di più</h1>
					<p className="mb-8 text-fg-muted">
						Il pagamento è andato a buon fine e il piano si attiverà entro pochi minuti. Se non succede, scrivici dalla pagina{' '}
						<Link href="/contacts" className="text-accent-fg underline">Contatti</Link>.
					</p>
					<LinkButton href={next} variant="secondary" size="lg" className="w-full">Torna alla pagina</LinkButton>
				</>
			) : (
				<>
					<div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-surface-3" role="status">
						<Loader2 className="size-10 animate-spin text-accent-fg" aria-hidden="true" />
						<span className="sr-only">Attivazione in corso</span>
					</div>
					<h1 className="mb-4 text-2xl font-bold text-fg">Stiamo attivando il tuo piano</h1>
					<p className="text-fg-muted">Pochi secondi e sei dentro.</p>
				</>
			)}
		</div>
	);
}
