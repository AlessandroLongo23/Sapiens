import { execFile } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import 'katex/dist/katex.min.css';
import { Page } from '@/components/content/PageHeader';
import { LessonBody } from '@/components/content/lesson/LessonBody';
import { renderMarkdown } from '@/lib/content/markdown';

/**
 * Only in development: a lesson's text from a file of docs/lezioni, to try the ```grafico blocks before a lesson
 * has them (`?file=prove/grafico.md`, the default). In production it answers 404.
 *
 * A lesson not published yet has no pictures of its TikZ figures, and TikZJax in the browser cannot draw every one of
 * them: here they are compiled as the publication would (scripts/figure/svg.mjs), so the page is the lesson as it
 * will be.
 */
export const metadata: Metadata = { title: 'Prova del piano nelle lezioni', robots: { index: false, follow: false } };

/** The site shows TikZ at 1.5 times its size (FIGURE_SCALE in lib/content/figures.ts). */
const SCALE = 1.5;
const compiled = new Map<string, Promise<({ svg: string; width: number; height: number } | null)[]>>();

/** The figures of a file still to publish, compiled once for each version of the file. */
async function figures(path: string) {
	const key = `${path}:${(await stat(path)).mtimeMs}`;
	let work = compiled.get(key);
	if (!work) {
		work = promisify(execFile)('node', ['scripts/figure/svg.mjs', path], { maxBuffer: 64 * 1024 * 1024 })
			.then(({ stdout }) => JSON.parse(stdout) as ({ svg: string; width: number; height: number } | null)[])
			.catch(() => []);
		compiled.set(key, work);
	}
	return work;
}

export default async function PlotBlockTrial({ searchParams }: { searchParams: Promise<{ file?: string }> }) {
	if (process.env.NODE_ENV === 'production') notFound();
	const { file = 'prove/grafico.md' } = await searchParams;
	if (!/^[\w/-]+\.md$/.test(file)) notFound();
	const path = join(process.cwd(), 'docs/lezioni', file);
	const markdown = await readFile(path, 'utf8').catch(() => null);
	if (markdown === null) notFound();
	let html = renderMarkdown(markdown);
	// each figure left to TikZJax takes its compiled picture, in the order of the file
	if (html.includes('<script type="text/tikz">')) {
		const drawn = await figures(path);
		let next = 0;
		html = html.replace(/<div class="tikz-container my-6 flex justify-center"><script type="text\/tikz">[\s\S]*?<\/script><\/div>/g, (left) => {
			const figure = drawn[next++];
			if (!figure) return left;
			const width = Math.round(figure.width * SCALE);
			return `<figure class="tikz-container my-6 flex justify-center"><img src="data:image/svg+xml;base64,${Buffer.from(figure.svg).toString('base64')}" alt="" width="${width}" height="${Math.round(figure.height * SCALE)}" style="width:${width}px"></figure>`;
		});
	}
	return (
		<Page width="full">
			<LessonBody html={html} />
		</Page>
	);
}
