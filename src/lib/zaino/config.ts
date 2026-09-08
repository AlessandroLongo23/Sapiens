/**
 * Vocabulary and row shapes of the backpack, shared by the server and the
 * browser. Pure and isomorphic on purpose: the editor and the shelf need the
 * ceilings and the types, and importing them from ../server/zaino would drag
 * `server-only` into a client bundle. The reads and writes live there; this
 * file holds what both sides have to agree on. Mirrors lib/tutoring/config.
 */

/** Free-plan ceilings. Paid plans have none: see Features.NOTEBOOKS. */
export const FREE_NOTEBOOKS = 1;
export const FREE_NOTES = 5;

/** Longest document the editor will save; the column check refuses more. */
export const MAX_CONTENT = 200_000;

export const NOTEBOOK_COLORS = ['zinc', 'crimson', 'amber', 'teal', 'sky', 'indigo'] as const;
export type NotebookColor = (typeof NOTEBOOK_COLORS)[number];

export const COLOR_LABEL: Record<NotebookColor, string> = {
	zinc: 'Grigio',
	crimson: 'Rosso',
	amber: 'Ambra',
	teal: 'Verde acqua',
	sky: 'Azzurro',
	indigo: 'Indaco'
};

export const DEFAULT_NOTEBOOK_TITLE = 'Nuovo quaderno';
export const DEFAULT_NOTE_TITLE = 'Nuova nota';

export interface NotebookRow {
	id: string;
	user_id: string;
	title: string;
	color: NotebookColor;
	position: number;
	created_at: string;
	updated_at: string;
}

/** What a list shows: everything but the document itself. */
export interface NoteSummary {
	id: string;
	user_id: string;
	notebook_id: string;
	title: string;
	excerpt: string;
	position: number;
	version: number;
	created_at: string;
	updated_at: string;
}

/** A row of `notes` with its document. Only the editor asks for this. */
export interface NoteRow extends NoteSummary {
	content: string;
}

export interface Quota {
	/** A paid plan, or staff: no ceiling at all. */
	unlimited: boolean;
	notebooks: { used: number; max: number | null };
	notes: { used: number; max: number | null };
}
