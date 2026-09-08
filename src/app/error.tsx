'use client';

import { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { Shell } from '@/components/shell/Shell';
import { Button, LinkButton } from '@/components/ui/Button';

/**
 * Shown when a page throws (the database is unreachable, say). Production
 * builds strip the original message, so the copy is fixed and Italian, and
 * the page keeps the site frame around it.
 */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		console.error(error);
	}, [error]);
	return (
		<Shell>
			<section className="flex min-h-[60vh] items-center justify-center px-4 py-16">
				<div className="w-full max-w-md text-center">
					<h1 className="mb-3 text-3xl font-bold text-fg-strong">Contenuti temporaneamente non disponibili</h1>
					<p className="mb-8 text-fg-muted">Qualcosa è andato storto nel caricare questa pagina. Riprova tra qualche istante: di solito basta.</p>
					<div className="flex flex-col justify-center gap-3 sm:flex-row">
						<Button size="lg" onClick={reset}>
							<RotateCcw className="size-4" aria-hidden="true" />
							Riprova
						</Button>
						<LinkButton href="/" variant="secondary" size="lg">
							Torna alla home
						</LinkButton>
					</div>
				</div>
			</section>
		</Shell>
	);
}
