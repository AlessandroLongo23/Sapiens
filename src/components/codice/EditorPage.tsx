import 'katex/dist/katex.min.css';
import Link from 'next/link';
import { BookOpen, NotebookPen } from 'lucide-react';
import { CATEGORY_NAMES, type ToolMeta } from '@/lib/tools/types';
import { TOOLS_ROOT, toolBySlug } from '@/lib/tools/registry';
import { Breadcrumb, HOME_CRUMB } from '@/components/content/Breadcrumb';
import { Page, PenStroke } from '@/components/content/PageHeader';
import { JsonLd } from '@/components/seo/JsonLd';
import { Html } from '@/components/ui/Html';
import { LearnLink, TOOLS_CRUMB, toolJsonLd, type ToolLesson } from '@/components/tools/ToolPage';
import { Playground } from './Playground';

export const EDITOR_SLUG = 'editor-di-codice';
export const EDITOR_PATH = `${TOOLS_ROOT}/${EDITOR_SLUG}`;

/** One column for everything under the editor, with the prose at the width of a line that reads well. */
const COLUMN = 'mx-auto max-w-5xl';
const PROSE = 'markdown-content [&>*]:max-w-[70ch] [&>h1]:max-w-none [&>h2]:max-w-none';

/**
 * The page of the code editor, laid out like the plotter's: the editor with its console above the fold, the way to
 * the lessons, and the article that says what each language can do here.
 */
export function EditorPage({ tool, lessons, articleHtml }: { tool: ToolMeta; lessons: ToolLesson[]; articleHtml: string | null }) {
	const related = (tool.related ?? []).map(toolBySlug).filter((t): t is ToolMeta => !!t);
	return (
		<Page width="full">
			<JsonLd data={toolJsonLd(tool)} />
			{/* A lower header than the other pages': the editor has to start above the fold. */}
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

			<Playground />

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

			{articleHtml && (
				<div className={`${COLUMN} mt-14`}>
					<Html html={articleHtml} className={PROSE} />
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
