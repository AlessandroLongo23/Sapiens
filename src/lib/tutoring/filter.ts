import { SORT_OPTIONS, type SortId, type TutorProfile } from './config';

/**
 * Filtering, sorting and searching of the tutor list, done in the browser on
 * the full list of published tutors (small for a long time) so every change
 * is instant and the page can be cached as static HTML. The state lives in
 * the URL (`?materia=...&livello=...`) so a filtered list can be shared.
 */

export interface TutorFilters {
	q: string;
	subject: string;
	level: string;
	mode: string;
	city: string;
	sort: SortId;
}

export const EMPTY_FILTERS: TutorFilters = {
	q: '',
	subject: '',
	level: '',
	mode: '',
	city: '',
	sort: 'consigliati'
};

const PARAM_KEYS: Record<keyof TutorFilters, string> = {
	q: 'q',
	subject: 'materia',
	level: 'livello',
	mode: 'modalita',
	city: 'citta',
	sort: 'ordina'
};

const SORT_IDS = new Set<string>(SORT_OPTIONS.map((o) => o.id));

export function filtersFromParams(params: URLSearchParams): TutorFilters {
	const sort = params.get(PARAM_KEYS.sort) ?? '';
	return {
		q: params.get(PARAM_KEYS.q)?.trim() ?? '',
		subject: params.get(PARAM_KEYS.subject) ?? '',
		level: params.get(PARAM_KEYS.level) ?? '',
		mode: params.get(PARAM_KEYS.mode) ?? '',
		city: params.get(PARAM_KEYS.city) ?? '',
		sort: SORT_IDS.has(sort) ? (sort as SortId) : 'consigliati'
	};
}

/** Only the values that differ from the defaults, so the plain URL stays clean. */
export function paramsFromFilters(filters: TutorFilters): URLSearchParams {
	const params = new URLSearchParams();
	for (const key of Object.keys(PARAM_KEYS) as (keyof TutorFilters)[]) {
		const value = filters[key];
		if (value && value !== EMPTY_FILTERS[key]) params.set(PARAM_KEYS[key], value);
	}
	return params;
}

export function activeFilterCount(filters: TutorFilters): number {
	return (['q', 'subject', 'level', 'mode', 'city'] as const).filter((k) => filters[k]).length;
}

/** Lowercase, accents stripped, so "Universita" finds "Università". */
export function normalize(text: string): string {
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.trim();
}

/** Cities offered for in-person lessons, one entry each, in alphabetical order. */
export function citiesOf(tutors: TutorProfile[]): string[] {
	const set = new Set<string>();
	for (const t of tutors) {
		if (t.city && t.modes.includes('in_person')) set.add(t.city.trim());
	}
	return [...set].sort((a, b) => a.localeCompare(b, 'it'));
}

function matchesQuery(tutor: TutorProfile, haystack: (t: TutorProfile) => string, q: string): boolean {
	const words = normalize(q).split(/\s+/).filter(Boolean);
	if (words.length === 0) return true;
	const text = normalize(haystack(tutor));
	return words.every((w) => text.includes(w));
}

export interface FilterContext {
	/** Names for the subject ids, so a search for "analisi" matches the subject. */
	subjectName: (id: string) => string;
}

export function applyFilters(tutors: TutorProfile[], filters: TutorFilters, ctx: FilterContext): TutorProfile[] {
	const haystack = (t: TutorProfile) =>
		[t.first_name, t.headline, t.bio, t.city ?? '', t.education ?? '', ...t.subjects.map(ctx.subjectName)].join(' ');

	const filtered = tutors.filter((t) => {
		if (filters.subject && !t.subjects.includes(filters.subject)) return false;
		if (filters.level && !t.levels.includes(filters.level as TutorProfile['levels'][number])) return false;
		if (filters.mode && !t.modes.includes(filters.mode as TutorProfile['modes'][number])) return false;
		if (filters.city && normalize(t.city ?? '') !== normalize(filters.city)) return false;
		return matchesQuery(t, haystack, filters.q);
	});

	return sortTutors(filtered, filters.sort);
}

export function sortTutors(tutors: TutorProfile[], sort: SortId): TutorProfile[] {
	const byNewest = (a: TutorProfile, b: TutorProfile) => b.created_at.localeCompare(a.created_at);
	const rate = (t: TutorProfile) => (t.hourly_rate == null ? Number.POSITIVE_INFINITY : t.hourly_rate);
	const list = [...tutors];
	switch (sort) {
		case 'prezzo-crescente':
			return list.sort((a, b) => rate(a) - rate(b) || byNewest(a, b));
		case 'prezzo-decrescente':
			// Tutors without a price go last in both price orders.
			return list.sort((a, b) => {
				if (a.hourly_rate == null && b.hourly_rate == null) return byNewest(a, b);
				if (a.hourly_rate == null) return 1;
				if (b.hourly_rate == null) return -1;
				return b.hourly_rate - a.hourly_rate || byNewest(a, b);
			});
		case 'recenti':
			return list.sort(byNewest);
		case 'consigliati':
		default:
			return list.sort((a, b) => Number(b.verified) - Number(a.verified) || byNewest(a, b));
	}
}
