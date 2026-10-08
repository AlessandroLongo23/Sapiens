/**
 * The onboarding's vocabulary, shared by the signup dialog, the welcome page and the server
 * (vault/Prodotti/Studenti/Onboarding.md).
 */

/** Roles an account can have, several at once (table `profiles`). A school does not sign up: it writes to us. */
export const ROLES = ['student', 'parent', 'tutor', 'teacher'] as const;
export type Role = (typeof ROLES)[number];

/** The answers to "Chi sei?": the roles, and the school, which has no account. */
export type Door = Role | 'school';

export interface DoorCopy {
	id: Door;
	label: string;
	/** What Sapiens has for them today, in one line under the signup form. */
	today: string;
}

export const DOORS: DoorCopy[] = [
	{ id: 'student', label: 'Studente', today: '' },
	{ id: 'parent', label: 'Genitore', today: 'Oggi puoi creare l’account per tuo figlio o cercare un tutor. L’area per i genitori arriverà più avanti.' },
	{ id: 'tutor', label: 'Tutor', today: 'Dopo l’iscrizione crei il tuo profilo e gestisci studenti, lezioni e compiti dall’agenda.' },
	{ id: 'teacher', label: 'Docente', today: 'Oggi ogni lezione ha una scheda di esercizi da dare alla classe, senza account. Gli strumenti per i docenti arriveranno più avanti.' },
	{ id: 'school', label: 'Scuola', today: 'Sapiens non ha ancora un prodotto per le scuole. Scrivici: ti rispondiamo di persona.' }
];

export const isRole = (value: unknown): value is Role => typeof value === 'string' && (ROLES as readonly string[]).includes(value);

/** The age question has two answers for a student; every other role declares to be an adult. */
export const AGE_BANDS = ['under14', '14plus', 'adult'] as const;
export type AgeBand = (typeof AGE_BANDS)[number];

/**
 * "Che scuola fai?", by the slug of the level in the database. Only high school has lessons with exercises today,
 * so only its students are asked the year, the subjects and a lesson; a university student is not asked their age.
 */
export const SCHOOL_LEVELS = [
	{ id: 'middle_school', label: 'Medie', who: '11-14 anni', school: 'Scuola media', of: 'delle medie' },
	{ id: 'high_school', label: 'Superiori', who: '14-19 anni', school: 'Scuola superiore', of: 'delle superiori' },
	{ id: 'university', label: 'Università', who: 'Primi esami', school: 'Università', of: 'dell’università' }
] as const;
export type SchoolLevel = (typeof SCHOOL_LEVELS)[number]['id'];
export const isSchoolLevel = (value: unknown): value is SchoolLevel => SCHOOL_LEVELS.some((l) => l.id === value);

export const SCHOOL_YEARS = [1, 2, 3, 4, 5] as const;

/**
 * The subjects of high school a student can say they study with Sapiens, by their database slug, in the order
 * they are asked. Each is a notebook of its own colour in the onboarding (onboarding.css).
 */
export const SUBJECTS = [
	{ id: 'math', name: 'Matematica', in: 'matematica' },
	{ id: 'physics', name: 'Fisica', in: 'fisica' },
	{ id: 'chemistry', name: 'Chimica', in: 'chimica' },
	{ id: 'computer-science', name: 'Informatica', in: 'informatica' }
] as const;
export type SubjectId = (typeof SUBJECTS)[number]['id'];
export const isSubject = (value: unknown): value is SubjectId => SUBJECTS.some((s) => s.id === value);
export const YEAR_NAMES: Record<number, string> = { 1: 'Prima', 2: 'Seconda', 3: 'Terza', 4: 'Quarta', 5: 'Quinta' };

/** "Come ci hai conosciuto?", one tap after the first finished run. */
export const HEARD_FROM: { id: string; label: string }[] = [
	{ id: 'friend', label: 'Un amico o un compagno' },
	{ id: 'teacher', label: 'Un docente' },
	{ id: 'tiktok', label: 'TikTok' },
	{ id: 'instagram', label: 'Instagram' },
	{ id: 'youtube', label: 'YouTube' },
	{ id: 'search', label: 'Cercando su Google' },
	{ id: 'family', label: 'Un genitore' },
	{ id: 'other', label: 'Altro' }
];

/** The way in for a new visitor: who they are, the questions, the account (src/components/onboarding/Onboarding.tsx). */
export const SIGNUP_PATH = '/iscriviti';

/** The same questions for whoever already has an account and has not answered them. */
export const WELCOME_PATH = '/benvenuto';

/** The page a parent opens from the email to confirm the account of a student under 14. */
export const PARENT_CONFIRM_PATH = '/genitore/conferma';

/** A confirmation code: six digits, good for 15 minutes, five tries, one email a minute. */
export const EMAIL_CODE = { digits: 6, minutes: 15, attempts: 5, resendSeconds: 60 } as const;

/** Days a parent has to open the link. */
export const PARENT_LINK_DAYS = 30;
