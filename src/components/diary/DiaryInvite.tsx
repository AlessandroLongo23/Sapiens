'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/state/auth';
import { APP_LIBRARY } from '@/lib/config/site';
import { TRIAL_DAYS } from '@/lib/stripe/config';
import { Button } from '@/components/ui/Button';
import './diary.css';

/** The diary for a visitor without an account: closed, with its elastic, and the way in. */
export function DiaryInvite({ year }: { year: number }) {
	const { openModal } = useAuth();
	return (
		<div className="grid items-center gap-12 py-4 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-16">
			<div className="diary-closed flex flex-col items-start justify-between p-8 pl-10 text-paper-50" aria-hidden="true">
				<span className="label-mono text-[0.65rem] opacity-70">
					Anno scolastico {year}/{String(year + 1).slice(2)}
				</span>
				<span className="flex flex-col gap-1">
					<span className="font-display text-5xl font-semibold tracking-tight">Diario</span>
					<span className="font-hand text-2xl opacity-80">di chi studia con Sapiens</span>
				</span>
				<span className="label-mono rounded-sm border border-paper-50/40 px-2 py-1 text-[0.6rem] opacity-70">Nome · Classe</span>
			</div>
			<div className="flex flex-col gap-5">
				<h2 className="font-display text-3xl font-semibold text-fg-strong sm:text-4xl">Il diario che ti dice cosa ripassare</h2>
				<p className="text-lg leading-relaxed text-fg-muted">
					Segni compiti, verifiche e interrogazioni in una riga, come sul diario di carta. Sapiens ti prepara il ripasso prima di ogni verifica, tiene la serie dei giorni in cui ti alleni e scrive da
					solo cosa hai fatto. Ogni giorno ha anche una pagina tutta tua, con gli adesivi.
				</p>
				<p className="text-sm text-fg-subtle">Crea un account: hai Studio gratis per {TRIAL_DAYS} giorni, senza carta.</p>
				<div className="flex flex-col gap-2 sm:flex-row">
					<Button
						size="lg"
						onClick={() =>
							openModal({
								register: true,
								next: () => window.location.reload()
							})
						}
					>
						Crea un account
					</Button>
					<Button size="lg" variant="secondary" onClick={() => openModal({ next: () => window.location.reload() })}>
						Accedi
					</Button>
				</div>
				<Link href={APP_LIBRARY} className="text-sm font-medium text-fg-muted underline underline-offset-2 hover:text-fg focus-ring">
					Intanto esplora il materiale
				</Link>
			</div>
		</div>
	);
}
