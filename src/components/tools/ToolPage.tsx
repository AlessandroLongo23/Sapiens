import 'katex/dist/katex.min.css';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, BookOpen, Calculator, NotebookPen } from 'lucide-react';
import { CATEGORY_NAMES, type ToolMeta } from '@/lib/tools/types';
import { TOOLS_ROOT, toolBySlug } from '@/lib/tools/registry';
import { ORGANIZATION_ID, breadcrumbJsonLd, type JsonLd as JsonLdData } from '@/lib/seo/jsonld';
import { absoluteUrl } from '@/lib/config/site';
import { HOME_CRUMB, type BreadcrumbItem } from '@/components/content/Breadcrumb';
import { Page, PageHeader } from '@/components/content/PageHeader';
import { JsonLd } from '@/components/seo/JsonLd';
import { Html } from '@/components/ui/Html';

export const TOOLS_CRUMB: BreadcrumbItem = { label: 'Strumenti', path: TOOLS_ROOT, icon: Calculator };

/** A lesson on the tool's topic, resolved on the server: where to read it and where to practise. */
export interface ToolLesson {
	title: string;
	theory: string;
	/** The worksheet, when the lesson has exercises. */
	exercises: string | null;
}

export function toolJsonLd(tool: ToolMeta): JsonLdData[] {
	const path = `${TOOLS_ROOT}/${tool.slug}`;
	return [
		{
			'@context': 'https://schema.org',
			'@type': 'WebApplication',
			name: tool.title,
			description: tool.description,
			url: absoluteUrl(path),
			inLanguage: 'it',
			applicationCategory: 'EducationalApplication',
			operatingSystem: 'Any',
			isAccessibleForFree: true,
			offers: { '@type': 'Offer', price: 0, priceCurrency: 'EUR' },
			publisher: { '@id': ORGANIZATION_ID }
		},
		breadcrumbJsonLd([
			{ name: 'Home', path: '/' },
			{ name: 'Strumenti', path: TOOLS_ROOT },
			{ name: tool.title, path }
		])
	];
}

/**
 * The page every tool shares: the header, the tool, the way to the lesson and its exercises, the article on how to
 * do it by hand, and the related tools.
 */
export function ToolPage({ tool, lessons, articleHtml, children }: { tool: ToolMeta; lessons: ToolLesson[]; articleHtml: string | null; children: ReactNode }) {
	const related = (tool.related ?? []).map(toolBySlug).filter((t): t is ToolMeta => !!t);
	return (
		<Page width="medium">
			<JsonLd data={toolJsonLd(tool)} />
			<PageHeader crumbs={[HOME_CRUMB, TOOLS_CRUMB]} eyebrow={CATEGORY_NAMES[tool.category]} title={tool.title} lead={tool.lead} />
			{children}

			{lessons.length > 0 && (
				<nav aria-label="Studia l'argomento" className="mt-6 grid gap-3 sm:grid-cols-2">
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

export function LearnLink({ href, icon, label, title }: { href: string; icon: ReactNode; label: string; title: string }) {
	return (
		<Link href={href} className="group flex items-center gap-3 rounded-xl border border-edge bg-surface p-4 shadow-paper transition-colors hover:border-edge-strong focus-ring">
			<span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-soft-fg">{icon}</span>
			<span className="flex min-w-0 flex-1 flex-col">
				<span className="label-mono text-fg-subtle">{label}</span>
				<span className="truncate font-medium text-fg-strong">{title}</span>
			</span>
			<ArrowRight className="size-4 shrink-0 text-fg-subtle transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
		</Link>
	);
}
