import { PAGE_FILES, type Language } from './blocco';

/**
 * The programs a student saves from the code editor, as the server and the browser agree on them. Pure, so the
 * editor can import it: the reads and the writes are in lib/server/programmi.ts.
 */

/** What a saved program is written in: a language of the editor, or a web page with its three files. */
export type ProgramLanguage = Language | 'web';

/** The files of a program, by name: `main` for a program, `html`, `css` and `js` for a page. */
export type ProgramFiles = Record<string, string>;

export const PROGRAM_FILES: Record<ProgramLanguage, readonly string[]> = { python: ['main'], c: ['main'], cpp: ['main'], javascript: ['main'], web: PAGE_FILES };
export const PROGRAM_LANGUAGES: Record<ProgramLanguage, string> = { python: 'Python', c: 'C', cpp: 'C++', javascript: 'JavaScript', web: 'Pagina web' };

/** How many programs a free account keeps. Paid plans have no ceiling, as for the Zaino. */
export const FREE_PROGRAMS = 10;
/** The most a program's files weigh together, in characters; the column refuses more. */
export const MAX_PROGRAM_SIZE = 200_000;
export const MAX_PROGRAM_TITLE = 120;

/** A saved program as the list shows it. */
export interface SavedProgram {
	id: string;
	title: string;
	language: ProgramLanguage;
	updated_at: string;
}

/** A saved program with what is written in it. */
export interface SavedProgramFiles extends SavedProgram {
	files: ProgramFiles;
}

export interface ProgramQuota {
	used: number;
	/** Null on a paid plan. */
	max: number | null;
}

export const isProgramLanguage = (value: unknown): value is ProgramLanguage => typeof value === 'string' && Object.hasOwn(PROGRAM_FILES, value);

/** The files of a program of `language` read from what a request or a row carries: exactly its files, all text. */
export function readProgramFiles(language: ProgramLanguage, value: unknown): ProgramFiles | null {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
	const given = value as Record<string, unknown>;
	const names = PROGRAM_FILES[language];
	if (Object.keys(given).some((name) => !names.includes(name))) return null;
	const files: ProgramFiles = {};
	let size = 0;
	for (const name of names) {
		const text = given[name] ?? '';
		if (typeof text !== 'string') return null;
		size += text.length;
		files[name] = text;
	}
	return size <= MAX_PROGRAM_SIZE ? files : null;
}
