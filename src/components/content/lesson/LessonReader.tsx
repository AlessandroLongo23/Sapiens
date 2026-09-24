'use client';

import type { ReactNode } from 'react';
import { ChevronDown, Clock, FileText, ListTree } from 'lucide-react';
import type { TocSection } from '@/lib/content/markdown';
import { useLessonLayout } from '@/lib/state/lesson-layout';
import { useLg } from '@/lib/hooks/use-media';
import { cn } from '@/lib/utils/cn';
import { Sheet } from '@/components/ui/Sheet';
import { Html } from '@/components/ui/Html';
import { LessonBody } from './LessonBody';
import { TableOfContents } from './TableOfContents';

interface Props {
	html: string;
	sections: TocSection[];
	/** The tutor call to action and the previous/next row, rendered by the page. */
	footer?: ReactNode;
}

const countSections = (sections: TocSection[]): number => sections.reduce((n, s) => n + 1 + s.subsections.length, 0);

/** Reading figures for the meta row: about 50 words a minute, 120 words a page. */
function figures(html: string) {
	const words = html.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
	return { pages: Math.max(1, Math.ceil(words / 120)), minutes: Math.max(1, Math.ceil(words / 50)) };
}

/**
 * A theory or formulary page: reading figures, the outline collapsed at the
 * top on phones (and as a sheet from the header's button), the text, then
 * whatever the page puts after it.
 */
export function LessonReader({ html, sections, footer }: Props) {
	const lg = useLg();
	const compact = useLessonLayout((s) => s.scrollY > 20);
	const tocOpen = useLessonLayout((s) => s.tocOpen);
	const setTocOpen = useLessonLayout((s) => s.setTocOpen);
	const jumpTo = useLessonLayout((s) => s.jumpTo);
	const { pages, minutes } = figures(html);
	const total = countSections(sections);

	return (
		<>
			{!lg && (
				<Sheet open={tocOpen} onClose={() => setTocOpen(false)} title="Indice della lezione" flush>
					<TableOfContents sections={sections} touch />
				</Sheet>
			)}
			<div className="px-4 pb-8 pt-0 sm:px-6 md:px-10">
				<div className={cn('mt-2 h-auto overflow-hidden opacity-100 transition-all duration-300', compact && 'lg:mt-0 lg:h-0 lg:opacity-0')}>
					<div className="label-mono flex items-center justify-end gap-3 text-fg-subtle">
						<span className="flex items-center gap-1.5">
							<FileText className="size-3.5" aria-hidden="true" />
							{pages} {pages === 1 ? 'pagina' : 'pagine'}
						</span>
						<span className="size-1 rounded-full bg-surface-4" aria-hidden="true" />
						<span className="flex items-center gap-1.5">
							<Clock className="size-3.5" aria-hidden="true" />
							{minutes} min lettura
						</span>
					</div>
				</div>

				{sections.length > 0 && (
					<details className="group mt-4 rounded-2xl border border-edge-soft bg-surface-2 lg:hidden">
						<summary className="flex min-h-[48px] cursor-pointer list-none items-center gap-3 rounded-2xl px-4 text-sm font-semibold text-fg focus-ring [&::-webkit-details-marker]:hidden">
							<ListTree className="size-5 text-accent-fg" aria-hidden="true" />
							<span className="flex-1">In questa lezione: {total} {total === 1 ? 'sezione' : 'sezioni'}</span>
							<ChevronDown className="size-5 text-fg-faint transition-transform group-open:rotate-180" aria-hidden="true" />
						</summary>
						<ol className="border-t border-edge-soft px-2 py-2">
							{sections.map((section) => (
								<li key={section.id}>
									<button type="button" onClick={() => jumpTo(section.id)} className="flex min-h-[44px] w-full items-center rounded-xl px-3 text-left text-base text-fg hover:bg-surface active:bg-surface">
										<Html as="span" html={section.titleHtml} className="math-inline" />
									</button>
									{section.subsections.length > 0 && (
										<ol className="ml-4 border-l border-edge pl-1">
											{section.subsections.map((sub) => (
												<li key={sub.id}>
													<button type="button" onClick={() => jumpTo(sub.id)} className="flex min-h-[40px] w-full items-center rounded-xl px-3 text-left text-sm text-fg-muted hover:bg-surface active:bg-surface">
														<Html as="span" html={sub.titleHtml} className="math-inline" />
													</button>
												</li>
											))}
										</ol>
									)}
								</li>
							))}
						</ol>
					</details>
				)}

				<div className="prose prose-zinc max-w-none prose-strong:text-fg-strong">
					<LessonBody html={html} />
				</div>
			</div>
			{footer}
		</>
	);
}
