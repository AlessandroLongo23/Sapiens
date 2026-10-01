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
import { OrbitalViewer } from './OrbitalViewer';

export const ORBITAL_SLUG = 'orbitali-atomici';
export const ORBITAL_PATH = `${TOOLS_ROOT}/${ORBITAL_SLUG}`;

/**
 * The page of the orbital viewer: the figure with its controls and the table of sublevels, the way to the lesson, and
 * the article that says what the figure shows.
 */
export function OrbitalPage({ tool, lessons, articleHtml }: { tool: ToolMeta; lessons: ToolLesson[]; articleHtml: string | null }) {
	const related = (tool.related ?? []).map(toolBySlug).filter((t): t is ToolMeta => !!t);
	return (
		<Page width="wide">
			<JsonLd data={toolJsonLd(tool)} />
			{/* A lower header than the other pages': the figure has to start above the fold. */}
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

			<OrbitalViewer />

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

			{articleHtml && <Html html={articleHtml} className="markdown-content mx-auto mt-14 max-w-[70ch]" />}

			{related.length > 0 && (
				<section aria-labelledby="related-tools" className="mx-auto mt-14 max-w-[70ch] border-t border-edge pt-6">
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
