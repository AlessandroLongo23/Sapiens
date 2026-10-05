import { PAGE_FILES, type Language } from './blocco';
import { MAX_PROJECT_SIZE, readProject } from './progetto';

/**
 * The programs a student saves from the code editor, as the server and the browser agree on them. Pure, so the
 * editor can import it: the reads and the writes are in lib/server/programmi.ts.
 */

/**
 * What a saved program is: one file in a language of the editor, or a project of more files. `web` is the page of
 * three files of before the projects: it is still read, and opens as a project.
 */
export type ProgramLanguage = Language | 'web' | 'project';

/** The files of a program, by name: `main` for a program of one file, the paths of its files for a project. */
export type ProgramFiles = Record<string, string>;

export const PROGRAM_FILES: Record<Exclude<ProgramLanguage, 'project'>, readonly string[]> = { python: ['main'], c: ['main'], cpp: ['main'], javascript: ['main'], web: PAGE_FILES };
export const PROGRAM_LANGUAGES: Record<ProgramLanguage, string> = { python: 'Python', c: 'C', cpp: 'C++', javascript: 'JavaScript', web: 'Pagina web', project: 'Progetto' };

/** How many programs a free account keeps. Paid plans have no ceiling, as for the Zaino. */
export const FREE_PROGRAMS = 10;
/** The most a program of one file weighs, in characters. A project has its own ceiling (MAX_PROJECT_SIZE), for its pictures. */
export const MAX_PROGRAM_SIZE = 200_000;
export { MAX_PROJECT_SIZE };
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

export const isProgramLanguage = (value: unknown): value is ProgramLanguage => typeof value === 'string' && Object.hasOwn(PROGRAM_LANGUAGES, value);

/** The page of three files of before the projects, as the project it is now. */
export const webAsProject = (files: ProgramFiles): ProgramFiles => ({ 'index.html': files.html ?? '', 'style.css': files.css ?? '', 'script.js': files.js ?? '' });

/** The files of a program of `language` read from what a request or a row carries: exactly its files, all text. */
export function readProgramFiles(language: ProgramLanguage, value: unknown): ProgramFiles | null {
	if (language === 'project') return readProject(value);
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
