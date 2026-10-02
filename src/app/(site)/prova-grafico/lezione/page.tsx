import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import 'katex/dist/katex.min.css';
import { Page } from '@/components/content/PageHeader';
import { LessonBody } from '@/components/content/lesson/LessonBody';
import { renderMarkdown } from '@/lib/content/markdown';

/**
 * Only in development: a lesson's text from a file of docs/lezioni, to try the ```grafico blocks before a lesson
 * has them (`?file=prove/grafico.md`, the default). In production it answers 404.
 */
export const metadata: Metadata = { title: 'Prova del piano nelle lezioni', robots: { index: false, follow: false } };

export default async function PlotBlockTrial({ searchParams }: { searchParams: Promise<{ file?: string }> }) {
	if (process.env.NODE_ENV === 'production') notFound();
	const { file = 'prove/grafico.md' } = await searchParams;
	if (!/^[\w/-]+\.md$/.test(file)) notFound();
	const markdown = await readFile(join(process.cwd(), 'docs/lezioni', file), 'utf8').catch(() => null);
	if (markdown === null) notFound();
	return (
		<Page width="full">
			<LessonBody html={renderMarkdown(markdown)} />
		</Page>
	);
}
