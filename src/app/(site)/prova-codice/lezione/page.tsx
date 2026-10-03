import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';
import { Page } from '@/components/content/PageHeader';
import { LessonBody } from '@/components/content/lesson/LessonBody';
import { renderMarkdown } from '@/lib/content/markdown';

/**
 * A trial of the ```codice blocks in a lesson's text: docs/lezioni/prove/codice.md, read when the site is built.
 * Not linked, not indexed, to be removed with /prova-codice.
 */
export const metadata: Metadata = { title: 'Prova dei programmi nelle lezioni', robots: { index: false, follow: false } };

export default async function CodeBlockTrial() {
	const markdown = await readFile(join(process.cwd(), 'docs/lezioni/prove/codice.md'), 'utf8');
	return (
		<Page width="narrow">
			<h1 className="mb-6 text-4xl font-semibold text-fg-strong">Prova dei programmi nelle lezioni</h1>
			<LessonBody html={renderMarkdown(markdown)} />
		</Page>
	);
}
