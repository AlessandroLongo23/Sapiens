import type { ReactNode } from 'react';
import type { ContentNode } from '@/lib/utils/tree';
import { YearTabs } from './YearTabs';

/** A chapter is ready once one of its lessons is written. */
const ready = (chapter: ContentNode) => chapter.children.some((lesson) => lesson.has_theory !== false);

/** The chapters split by school year, or null when some chapter has no year: then the page keeps one list. */
export function chaptersByYear(chapters: ContentNode[]): Map<number, number[]> | null {
	if (chapters.length === 0 || chapters.some((c) => c.type !== 'chapter' || !c.school_year)) return null;
	const years = new Map<number, number[]>();
	chapters.forEach((c, i) => years.set(c.school_year!, [...(years.get(c.school_year!) ?? []), i]));
	return years;
}

/**
 * A subject's chapters grouped by the year they are usually taught in, shown
 * one year at a time (`YearTabs`). `rows` are the rendered chapters, in the
 * same order as `chapters`: the numbering stays continuous across years, since
 * it is the order of the route.
 */
export function ChapterYears({ id, chapters, years, rows }: { id: string; chapters: ContentNode[]; years: Map<number, number[]>; rows: ReactNode[] }) {
	const panels = [...years.entries()]
		.sort(([a], [b]) => a - b)
		.map(([year, indexes]) => ({ year, ready: indexes.filter((i) => ready(chapters[i])).length, total: indexes.length, rows: indexes.map((i) => rows[i]) }));
	return (
		<section className="animate-fade-in" aria-labelledby={id}>
			<YearTabs id={id} years={panels} />
			<p className="mt-8 max-w-2xl text-sm text-fg-subtle">
				Gli anni seguono l’ordine dei libri più diffusi. Il programma nazionale divide solo in bienni e quinto anno: la tua classe può anticipare o rimandare qualche capitolo.
			</p>
		</section>
	);
}
