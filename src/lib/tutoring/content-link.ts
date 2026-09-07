import { TUTORING_ROOT } from '$lib/config/site';
import type { ContentNode } from '$lib/utils/tree';

/**
 * From a lesson to the tutors who teach it: the library's subject slugs
 * mapped to the marketplace subject ids, and the level slug as it is.
 */
const SUBJECT_BY_CONTENT_SLUG: Record<string, string> = {
	math: 'matematica',
	physics: 'fisica',
	chemistry: 'chimica',
	'computer-science': 'informatica',
	'analisi-1': 'analisi-1',
	'analisi-2': 'analisi-2',
	'fisica-1': 'fisica-1',
	'fisica-2': 'fisica-2',
	'fondamenti-informatica': 'fondamenti-informatica'
};

const LEVELS = new Set(['middle_school', 'high_school', 'university']);

/** `/ripetizioni?materia=...&livello=...` for a lesson, or null when the subject has no tutors category. */
export function tutoringSearchHref(ancestors: Pick<ContentNode, 'type' | 'slug'>[]): string | null {
	const subject = ancestors.find((n) => n.type === 'subject');
	const level = ancestors.find((n) => n.type === 'level');
	const materia = subject ? SUBJECT_BY_CONTENT_SLUG[subject.slug] : undefined;
	if (!materia) return null;
	const params = new URLSearchParams({ materia });
	if (level && LEVELS.has(level.slug)) params.set('livello', level.slug);
	return `${TUTORING_ROOT}?${params.toString()}`;
}
