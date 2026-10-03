import type { Metadata } from 'next';
import { Page } from '@/components/content/PageHeader';
import { Playground } from '@/components/codice/Playground';

/** A trial page for the code editor of the informatica lessons: Python, C and C++ run in the browser. Not linked, not indexed, to be removed. */
export const metadata: Metadata = { title: 'Prova dell’editor di codice', robots: { index: false, follow: false } };

export default function CodeTrial() {
	return (
		<Page width="full">
			<h1 className="mb-2 text-4xl font-semibold text-fg-strong">Editor di codice</h1>
			<p className="mb-6 max-w-2xl text-fg-muted">Scrivi un programma in Python, C o C++ ed eseguilo: gira nel tuo browser, senza installare nulla.</p>
			<Playground />
		</Page>
	);
}
