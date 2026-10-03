import 'katex/dist/katex.min.css';
import Link from 'next/link';
import { BookOpen, NotebookPen } from 'lucide-react';
import type { PlotState } from '@/lib/grafico/documento';
import { CATEGORY_NAMES, type ToolMeta } from '@/lib/tools/types';
import { TOOLS_ROOT, toolBySlug } from '@/lib/tools/registry';
import { Breadcrumb, HOME_CRUMB } from '@/components/content/Breadcrumb';
import { Page, PenStroke } from '@/components/content/PageHeader';
import { JsonLd } from '@/components/seo/JsonLd';
import { Html } from '@/components/ui/Html';
import { LearnLink, TOOLS_CRUMB, toolJsonLd, type ToolLesson } from '@/components/tools/ToolPage';
import { Plotter, type PlotterFormula } from './Plotter';
import { ToolGuide } from './ToolGuide';

export const PLOTTER_SLUG = 'grafico-di-funzione';
export const PLOTTER_PATH = `${TOOLS_ROOT}/${PLOTTER_SLUG}`;

/** Where the article leaves room for the tools of geometry: a line of its own in the markdown. */
const TOOLS_MARK = '<p>@@strumenti@@</p>';
/**
 * One column for everything under the plane, wider than a lesson's text: this page has no index beside it. The
 * prose keeps the width of a line that reads well, from the same left edge; headings and films take the whole column.
 */
const COLUMN = 'mx-auto max-w-5xl';
const PROSE = 'markdown-content [&>*]:max-w-[70ch] [&>h1]:max-w-none [&>h2]:max-w-none';

/**
 * The page of the plotter: the plane with its panel, the way to the lessons, and the article that says how to write
 * a formula, with the tools of geometry in their section, each with its film.
 */
export function PlotterPage({ tool, lessons, articleHtml, initial, read }: { tool: ToolMeta; lessons: ToolLesson[]; articleHtml: string | null; initial: PlotState; read: PlotterFormula[] }) {
	const related = (tool.related ?? []).map(toolBySlug).filter((t): t is ToolMeta => !!t);
	const [before, after] = articleHtml?.split(TOOLS_MARK) ?? [];
	return (
		<Page width="full">
			<JsonLd data={toolJsonLd(tool)} />
			{/* A lower header than the other pages': the plane has to start above the fold. */}
			<header className="mb-4 animate-fade-in">
				<Breadcrumb items={[HOME_CRUMB, TOOLS_CRUMB, { label: tool.title }]} tail={CATEGORY_NAMES[tool.category]} hideCurrent />
				<div className="flex flex-wrap items-end gap-x-8 gap-y-2">
					<h1 className="w-fit text-4xl font-semibold leading-[1.05] text-fg-strong sm:text-5xl">
						{tool.title}
						<PenStroke className="mt-1" />
					</h1>
					<p className="max-w-2xl flex-1 basis-80 pb-1 text-base leading-snug text-fg-muted">{tool.lead}</p>
				</div>
			</header>

			<Plotter initial={initial} read={read} />

			{lessons.length > 0 && (
				<nav aria-label="Studia l'argomento" className="mx-auto mt-8 grid max-w-5xl gap-3 sm:grid-cols-2">
					{lessons.map((l) => (
						<LearnLink key={l.theory} href={l.theory} icon={<BookOpen className="size-5" aria-hidden="true" />} label="Impara" title={l.title} />
					))}
					{lessons
						.filter((l) => l.exercises)
						.map((l) => (
							<LearnLink key={l.exercises} href={l.exercises!} icon={<NotebookPen className="size-5" aria-hidden="true" />} label="Esercitati" title={`Esercizi: ${l.title}`} />
						))}
				</nav>
			)}

			{before && (
				<div className={`${COLUMN} mt-14`}>
					<Html html={before} className={PROSE} />
					{after !== undefined && <ToolGuide />}
					{after && <Html html={after} className={`${PROSE} mt-8`} />}
				</div>
			)}

			{related.length > 0 && (
				<section aria-labelledby="related-tools" className={`${COLUMN} mt-14 border-t border-edge pt-6`}>
					<h2 id="related-tools" className="label-mono mb-3 text-fg-subtle">
						Altri strumenti
					</h2>
					<ul className="flex flex-wrap gap-x-6 gap-y-2">
						{related.map((t) => (
							<li key={t.slug}>
								<Link href={`${TOOLS_ROOT}/${t.slug}`} className="font-medium text-fg underline decoration-edge-strong underline-offset-4 hover:text-accent-fg hover:decoration-current">
									{t.title}
								</Link>
							</li>
						))}
					</ul>
				</section>
			)}
		</Page>
	);
}
