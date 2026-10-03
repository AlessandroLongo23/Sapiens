import type { Metadata } from 'next';
import { Page } from '@/components/content/PageHeader';
import { Runner } from '@/components/codice/Runner';

/** A trial page for the code editor of the informatica lessons: Python run in the browser. Not linked, not indexed, to be removed. */
export const metadata: Metadata = { title: 'Prova dell’editor di Python', robots: { index: false, follow: false } };

export default function PythonTrial() {
	return (
		<Page width="full">
			<h1 className="mb-2 text-4xl font-semibold text-fg-strong">Editor di Python</h1>
			<p className="mb-6 max-w-2xl text-fg-muted">Scrivi un programma ed eseguilo: gira nel tuo browser, senza installare nulla.</p>
			<Runner />
		</Page>
	);
}
