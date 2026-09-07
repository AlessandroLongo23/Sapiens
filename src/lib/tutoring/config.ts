/**
 * Fixed vocabularies of the tutoring marketplace: subjects, levels, modes and
 * sort orders. Tutor profiles store the ids; the UI shows the names. The list
 * page filters on these, so a value that is not here cannot be searched for.
 */

export type TutorLevel = 'middle_school' | 'high_school' | 'university';
export type TutorMode = 'online' | 'in_person';

export interface TutorSubject {
	id: string;
	name: string;
	group: 'scuola' | 'università';
}

export const TUTOR_SUBJECTS: TutorSubject[] = [
	{ id: 'matematica', name: 'Matematica', group: 'scuola' },
	{ id: 'fisica', name: 'Fisica', group: 'scuola' },
	{ id: 'chimica', name: 'Chimica', group: 'scuola' },
	{ id: 'informatica', name: 'Informatica', group: 'scuola' },
	{ id: 'analisi-1', name: 'Analisi I', group: 'università' },
	{ id: 'analisi-2', name: 'Analisi II', group: 'università' },
	{ id: 'algebra-lineare', name: 'Algebra lineare', group: 'università' },
	{ id: 'fisica-1', name: 'Fisica I', group: 'università' },
	{ id: 'fisica-2', name: 'Fisica II', group: 'università' },
	{ id: 'statistica', name: 'Statistica', group: 'università' },
	{ id: 'programmazione', name: 'Programmazione', group: 'università' },
	{ id: 'fondamenti-informatica', name: 'Fondamenti di informatica', group: 'università' },
	{ id: 'database', name: 'Database', group: 'università' },
	{ id: 'sistemi-operativi', name: 'Sistemi operativi', group: 'università' },
	{ id: 'reti', name: 'Reti di calcolatori', group: 'università' },
	{ id: 'teoria-segnali', name: 'Teoria dei segnali', group: 'università' }
];

export const TUTOR_LEVELS: { id: TutorLevel; name: string; short: string }[] = [
	{ id: 'middle_school', name: 'Scuola media', short: 'Medie' },
	{ id: 'high_school', name: 'Scuola superiore', short: 'Superiori' },
	{ id: 'university', name: 'Università', short: 'Università' }
];

export const TUTOR_MODES: { id: TutorMode; name: string }[] = [
	{ id: 'online', name: 'Online' },
	{ id: 'in_person', name: 'In presenza' }
];

export type SortId = 'consigliati' | 'prezzo-crescente' | 'prezzo-decrescente' | 'recenti';

/**
 * Published ranking criteria (Regulation (EU) 2019/1150, art. 5): the
 * "Consigliati" order puts verified profiles first, then the newest.
 */
export const SORT_OPTIONS: { id: SortId; name: string }[] = [
	{ id: 'consigliati', name: 'Consigliati' },
	{ id: 'prezzo-crescente', name: 'Prezzo crescente' },
	{ id: 'prezzo-decrescente', name: 'Prezzo decrescente' },
	{ id: 'recenti', name: 'Più recenti' }
];

/** A row of the `tutors_public` view. */
export interface TutorProfile {
	id: string;
	slug: string;
	first_name: string;
	last_initial: string;
	headline: string;
	bio: string;
	subjects: string[];
	levels: TutorLevel[];
	modes: TutorMode[];
	city: string | null;
	hourly_rate: number | null;
	education: string | null;
	years_experience: number;
	avatar_url: string | null;
	verified: boolean;
	created_at: string;
	updated_at: string;
}

const subjectById = new Map(TUTOR_SUBJECTS.map((s) => [s.id, s]));
const levelById = new Map(TUTOR_LEVELS.map((l) => [l.id, l]));
const modeById = new Map(TUTOR_MODES.map((m) => [m.id, m]));

export function subjectName(id: string): string {
	return subjectById.get(id)?.name ?? id;
}

export function levelName(id: string): string {
	return levelById.get(id as TutorLevel)?.name ?? id;
}

export function levelShort(id: string): string {
	return levelById.get(id as TutorLevel)?.short ?? id;
}

export function modeName(id: string): string {
	return modeById.get(id as TutorMode)?.name ?? id;
}

/** "Giulia D." — the surname never reaches the page. */
export function tutorDisplayName(tutor: Pick<TutorProfile, 'first_name' | 'last_initial'>): string {
	return tutor.last_initial ? `${tutor.first_name} ${tutor.last_initial}.` : tutor.first_name;
}

const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

/** "15 €/h", or null when the tutor has not set a price. */
export function formatRate(rate: number | null | undefined): string | null {
	if (rate == null || Number.isNaN(rate)) return null;
	return `${euro.format(rate)}/h`;
}

/** Where a tutor teaches, as one line: "Online e in presenza a Bologna". */
export function whereLine(tutor: Pick<TutorProfile, 'modes' | 'city'>): string {
	const online = tutor.modes.includes('online');
	const inPerson = tutor.modes.includes('in_person');
	const place = tutor.city ? ` a ${tutor.city}` : '';
	if (online && inPerson) return `Online e in presenza${place}`;
	if (inPerson) return `In presenza${place}`;
	if (online) return 'Online';
	return '';
}
