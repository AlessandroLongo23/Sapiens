'use client';

import { Backpack, Calculator, PenLine, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/lib/state/auth';

const POINTS = [
	{ icon: PenLine, title: 'Due modi di scrivere', body: 'Modalità Semplice con la barra degli strumenti, come un editor di testo. Modalità Avanzata in markdown, se preferisci scrivere ### e - a mano.' },
	{ icon: Calculator, title: 'Le formule vengono bene', body: 'Scrivi $x^2$ e diventa una formula composta. Le stesse che vedi nelle lezioni, nelle tue note.' },
	{ icon: Smartphone, title: 'Anche dal telefono', body: 'La barra di formattazione resta sopra la tastiera e la nota si salva da sola mentre scrivi.' }
];

/** What a visitor who is not signed in sees at /zaino. */
export function ZainoLanding() {
	const { openModal } = useAuth();
	return (
		<div className="space-y-10">
			<Card tone="accent" className="flex flex-col items-start gap-4 px-6 py-10 sm:px-10">
				<Backpack className="size-10 text-accent-fg" aria-hidden="true" />
				<h2 className="text-2xl font-bold text-fg-strong sm:text-3xl">I tuoi appunti, accanto alle lezioni</h2>
				<p className="max-w-xl leading-relaxed text-fg-muted">
					Lo Zaino è il posto dove tieni i tuoi quaderni e le tue note. Accedi per iniziare: con il piano gratuito hai un quaderno,
					con un piano a pagamento quanti ne vuoi.
				</p>
				<div className="flex flex-wrap gap-3">
					<Button onClick={() => openModal({ register: true })}>Crea un account</Button>
					<Button variant="secondary" onClick={() => openModal()}>Accedi</Button>
				</div>
			</Card>

			<ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{POINTS.map(({ icon: Icon, title, body }) => (
					<Card as="li" key={title} className="flex flex-col gap-2 p-6">
						<Icon className="size-6 text-accent-fg" aria-hidden="true" />
						<h3 className="font-semibold text-fg-strong">{title}</h3>
						<p className="text-sm leading-relaxed text-fg-muted">{body}</p>
					</Card>
				))}
			</ul>
		</div>
	);
}
