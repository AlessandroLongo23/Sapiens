import 'server-only';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { hasFeature } from '@/lib/auth/entitlements';
import { Features } from '@/lib/stripe/config';
import {
	DEFAULT_NOTEBOOK_TITLE,
	DEFAULT_NOTE_TITLE,
	FREE_NOTEBOOKS,
	FREE_NOTES,
	MAX_CONTENT,
	NOTEBOOK_COLORS,
	type NotebookColor,
	type NotebookRow,
	type NoteRow,
	type NoteHit,
	type NoteSummary,
	type Quota
} from '@/lib/zaino/config';
import { parseStickers, type PlacedSticker } from '@/lib/zaino/stickers';
import { DEFAULT_PAPER, readPaper, type Paper } from '@/lib/zaino/paper';

// Re-exported so a server caller has one import for the whole feature.
export * from '@/lib/zaino/config';

/**
 * The student's backpack: quaderni and note, read and written with the
 * visitor's own Supabase client, so row level security is the access rule and
 * not a second opinion. Nothing here is ever read on behalf of another user,
 * which is why the service role stays out of it (unlike ./tutoring-admin).
 * The free-plan ceiling lives here too, next to hasFeature: see requireQuota.
 */

export class ZainoError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

const NOTEBOOK_COLUMNS = 'id,user_id,title,color,position,created_at,updated_at';
/** No `content`: a quaderno of 40 note must not carry 40 documents across the wire. */
const NOTE_LIST_COLUMNS = 'id,user_id,notebook_id,title,excerpt,position,version,lesson_path,lesson_title,created_at,updated_at';
const NOTE_COLUMNS = `${NOTE_LIST_COLUMNS},content`;

type Row = Record<string, unknown>;

function toNotebook(row: Row): NotebookRow {
	return { ...(row as unknown as NotebookRow), position: Number(row.position ?? 0) };
}

function toNoteSummary(row: Row): NoteSummary {
	return {
		...(row as unknown as NoteSummary),
		position: Number(row.position ?? 0),
		version: Number(row.version ?? 1),
		excerpt: typeof row.excerpt === 'string' ? row.excerpt : '',
		lesson_path: typeof row.lesson_path === 'string' ? row.lesson_path : null,
		lesson_title: typeof row.lesson_title === 'string' ? row.lesson_title : null
	};
}

function toNote(row: Row): NoteRow {
	return { ...toNoteSummary(row), content: typeof row.content === 'string' ? row.content : '' };
}

/** Logs the driver's message and answers with the site's outage line, as ./tutoring-admin does. */
function fail(context: string, error: { message: string }): never {
	console.error(`${context}:`, error.message);
	throw new ZainoError(503, 'Servizio non disponibile. Riprova più tardi.');
}

/** Postgres codes the write paths translate into an answer of their own. */
const DUPLICATE = '23505';
const MISSING_PARENT = '23503';

/* ------------------------------------------------------------------ quota */

/**
 * How full the backpack is, and how full it may get. The ceiling comes from
 * `hasFeature`, never from the row counts, so a downgrade stops new note
 * without hiding or deleting the ones already written.
 */
export async function getQuota(supabase: SupabaseClient, user: User): Promise<Quota> {
	const unlimited = hasFeature(user, Features.NOTEBOOKS);
	const [books, notes] = await Promise.all([
		supabase.from('notebooks').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
		supabase.from('notes').select('id', { count: 'exact', head: true }).eq('user_id', user.id)
	]);
	if (books.error) fail('notebook count failed', books.error);
	if (notes.error) fail('note count failed', notes.error);
	return {
		unlimited,
		notebooks: { used: books.count ?? 0, max: unlimited ? null : FREE_NOTEBOOKS },
		notes: { used: notes.count ?? 0, max: unlimited ? null : FREE_NOTES }
	};
}

/**
 * Refuses the create that would pass the free ceiling, with the 402 the client
 * turns into the paywall. Called from `createNotebook` and `createNote` only:
 * there is one path to an insert and this is on it. Two simultaneous creates
 * can both pass; one extra row on a free account is not worth a lock.
 */
async function requireQuota(supabase: SupabaseClient, user: User, kind: 'notebook' | 'note'): Promise<void> {
	const quota = await getQuota(supabase, user);
	if (quota.unlimited) return;
	const { used, max } = kind === 'notebook' ? quota.notebooks : quota.notes;
	if (max === null || used < max) return;
	throw new ZainoError(
		402,
		kind === 'notebook'
			? 'Con il piano gratuito hai un quaderno. Passa a un piano a pagamento per averne quanti vuoi.'
			: `Con il piano gratuito puoi tenere ${FREE_NOTES} note. Passa a un piano a pagamento per non avere limiti.`
	);
}

/* --------------------------------------------------------------- quaderni */

/** The owner's quaderni, in shelf order. Ties break on age, so the order is stable. */
export async function listNotebooks(supabase: SupabaseClient, userId: string): Promise<NotebookRow[]> {
	const { data, error } = await supabase
		.from('notebooks')
		.select(NOTEBOOK_COLUMNS)
		.eq('user_id', userId)
		.order('position', { ascending: true })
		.order('created_at', { ascending: true });
	if (error) fail('notebook list failed', error);
	return (data ?? []).map((row) => toNotebook(row as Row));
}

export async function getNotebook(supabase: SupabaseClient, userId: string, id: string): Promise<NotebookRow | null> {
	const { data, error } = await supabase.from('notebooks').select(NOTEBOOK_COLUMNS).eq('id', id).eq('user_id', userId).maybeSingle();
	if (error) fail('notebook lookup failed', error);
	return data ? toNotebook(data as Row) : null;
}

/** The quaderno, or the 404 every caller would otherwise repeat. */
async function requireNotebook(supabase: SupabaseClient, userId: string, id: string): Promise<NotebookRow> {
	const notebook = await getNotebook(supabase, userId, id);
	if (!notebook) throw new ZainoError(404, 'Quaderno non trovato.');
	return notebook;
}

/** One past the last position in a list, so a new row lands at the end. */
async function nextPosition(supabase: SupabaseClient, table: 'notebooks' | 'notes', column: 'user_id' | 'notebook_id', value: string): Promise<number> {
	const { data, error } = await supabase.from(table).select('position').eq(column, value).order('position', { ascending: false }).limit(1).maybeSingle();
	if (error) fail(`${table} position lookup failed`, error);
	return data ? Number((data as Row).position ?? 0) + 1 : 0;
}

/**
 * A new quaderno at the end of the shelf. Takes the whole user, not just the
 * id, because the ceiling is read from the plan claim in `app_metadata`.
 * The default title collides with itself by design, so it is suffixed rather
 * than refused; a title the student typed is their business and comes back 409.
 */
export async function createNotebook(supabase: SupabaseClient, user: User, input: NotebookInput): Promise<NotebookRow> {
	await requireQuota(supabase, user, 'notebook');
	const position = await nextPosition(supabase, 'notebooks', 'user_id', user.id);
	const named = input.title !== DEFAULT_NOTEBOOK_TITLE;
	for (let attempt = 1; attempt <= 20; attempt++) {
		const title = attempt === 1 ? input.title : `${input.title} ${attempt}`;
		const { data, error } = await supabase
			.from('notebooks')
			.insert({ user_id: user.id, title, color: input.color, position })
			.select(NOTEBOOK_COLUMNS)
			.single();
		if (!error) return toNotebook(data as Row);
		if (error.code !== DUPLICATE) fail('notebook create failed', error);
		if (named) throw new ZainoError(409, 'Hai già un quaderno con questo nome.');
	}
	throw new ZainoError(409, 'Hai già un quaderno con questo nome.');
}

/** Title and colour. A title already in use is a 409, not a silent rename. */
export async function renameNotebook(supabase: SupabaseClient, userId: string, id: string, input: NotebookInput): Promise<NotebookRow> {
	await requireNotebook(supabase, userId, id);
	const { data, error } = await supabase
		.from('notebooks')
		.update({ title: input.title, color: input.color, updated_at: new Date().toISOString() })
		.eq('id', id)
		.eq('user_id', userId)
		.select(NOTEBOOK_COLUMNS)
		.single();
	if (error?.code === DUPLICATE) throw new ZainoError(409, 'Hai già un quaderno con questo nome.');
	if (error) fail('notebook rename failed', error);
	return toNotebook(data as Row);
}

/** How many note a quaderno holds, for the delete confirmation. */
export async function countNotes(supabase: SupabaseClient, userId: string, notebookId: string): Promise<number> {
	const { count, error } = await supabase
		.from('notes')
		.select('id', { count: 'exact', head: true })
		.eq('user_id', userId)
		.eq('notebook_id', notebookId);
	if (error) fail('note count failed', error);
	return count ?? 0;
}

/**
 * Deletes the quaderno and, by the foreign key, every note in it. `confirm`
 * must be true when it still holds note, so a stray request cannot empty a
 * shelf and the page can name the count first.
 */
export async function deleteNotebook(supabase: SupabaseClient, userId: string, id: string, confirm: boolean): Promise<{ deleted: number }> {
	await requireNotebook(supabase, userId, id);
	const notes = await countNotes(supabase, userId, id);
	if (notes > 0 && !confirm) {
		throw new ZainoError(409, notes === 1 ? 'Il quaderno contiene una nota.' : `Il quaderno contiene ${notes} note.`);
	}
	const { error } = await supabase.from('notebooks').delete().eq('id', id).eq('user_id', userId);
	if (error) fail('notebook delete failed', error);
	return { deleted: notes };
}

/* ------------------------------------------------------------------- note */

/** One quaderno's note without their documents, in order. */
export async function listNotes(supabase: SupabaseClient, userId: string, notebookId: string): Promise<NoteSummary[]> {
	const { data, error } = await supabase
		.from('notes')
		.select(NOTE_LIST_COLUMNS)
		.eq('user_id', userId)
		.eq('notebook_id', notebookId)
		.order('position', { ascending: true })
		.order('created_at', { ascending: true });
	if (error) fail('note list failed', error);
	return (data ?? []).map((row) => toNoteSummary(row as Row));
}

export async function getNote(supabase: SupabaseClient, userId: string, id: string): Promise<NoteRow | null> {
	const { data, error } = await supabase.from('notes').select(NOTE_COLUMNS).eq('id', id).eq('user_id', userId).maybeSingle();
	if (error) fail('note lookup failed', error);
	return data ? toNote(data as Row) : null;
}

/** A new note at the end of its quaderno. Ceiling checked first; see requireQuota. */
export async function createNote(
	supabase: SupabaseClient,
	user: User,
	notebookId: string,
	title: string,
	lesson?: LessonLink | null
): Promise<NoteRow> {
	await requireNotebook(supabase, user.id, notebookId);
	await requireQuota(supabase, user, 'note');
	const position = await nextPosition(supabase, 'notes', 'notebook_id', notebookId);
	const { data, error } = await supabase
		.from('notes')
		.insert({
			user_id: user.id,
			notebook_id: notebookId,
			title,
			position,
			lesson_path: lesson?.path ?? null,
			lesson_title: lesson?.title ?? null
		})
		.select(NOTE_COLUMNS)
		.single();
	if (error) fail('note create failed', error);
	return toNote(data as Row);
}

/** The lesson a note was taken on: its public path and the title to show. */
export interface LessonLink {
	path: string;
	title: string;
}

export interface NotePatch {
	title?: string;
	content?: string;
	notebookId?: string;
}

/**
 * Saves a note: title, document, quaderno, or any combination — the editor
 * autosaves the document alone and the move menu sends the quaderno alone.
 * `excerpt` and `updated_at` are rewritten only when the title or the document
 * is in the patch, so a move is not recorded as an edit. A destination that is
 * not the user's own comes back from the composite foreign key, so there is no
 * ownership lookup here.
 *
 * `version` is the copy the editor loaded. Zero rows updated means either the
 * note is gone or a second tab saved first; the follow-up read tells them apart.
 */
export async function saveNote(supabase: SupabaseClient, userId: string, id: string, patch: NotePatch, version: number): Promise<NoteRow> {
	const edited = patch.title !== undefined || patch.content !== undefined;
	const fields: Row = { version: version + 1 };
	if (patch.title !== undefined) fields.title = patch.title;
	if (patch.content !== undefined) {
		fields.content = patch.content;
		fields.excerpt = plainExcerpt(patch.content);
	}
	if (patch.notebookId !== undefined) {
		fields.notebook_id = patch.notebookId;
		fields.position = await nextPosition(supabase, 'notes', 'notebook_id', patch.notebookId);
	}
	if (edited) fields.updated_at = new Date().toISOString();

	const { data, error } = await supabase
		.from('notes')
		.update(fields)
		.eq('id', id)
		.eq('user_id', userId)
		.eq('version', version)
		.select(NOTE_COLUMNS)
		.maybeSingle();
	if (error?.code === MISSING_PARENT) throw new ZainoError(404, 'Quaderno non trovato.');
	if (error) fail('note save failed', error);
	if (data) return toNote(data as Row);

	const current = await getNote(supabase, userId, id);
	if (!current) throw new ZainoError(404, 'Nota non trovata.');
	throw new NoteConflict(current);
}

/** A save that lost to another tab. The route answers 409 with the row that won. */
export class NoteConflict extends ZainoError {
	note: NoteRow;
	constructor(note: NoteRow) {
		super(409, 'Questa nota è stata modificata altrove.');
		this.note = note;
	}
}

export async function deleteNote(supabase: SupabaseClient, userId: string, id: string): Promise<void> {
	const { error } = await supabase.from('notes').delete().eq('id', id).eq('user_id', userId);
	if (error) fail('note delete failed', error);
}

/* -------------------------------------------------------------- ordering */

/**
 * Rewrites the order of a list. `ids` must be exactly the rows the owner has
 * in that scope: a partial list would leave holes that outlive the drag, so a
 * mismatch is refused rather than half-applied. Positions are written in one
 * upsert carrying only the id and the new position, so a reorder never touches
 * a document or an `updated_at`.
 */
async function reorder(supabase: SupabaseClient, userId: string, table: 'notebooks' | 'notes', scope: { column: 'user_id' | 'notebook_id'; value: string }, ids: string[]): Promise<void> {
	const { data, error } = await supabase.from(table).select('id').eq('user_id', userId).eq(scope.column, scope.value);
	if (error) fail(`${table} reorder read failed`, error);
	const owned = new Set((data ?? []).map((row) => String((row as Row).id)));
	if (owned.size !== ids.length || ids.some((id) => !owned.has(id))) {
		throw new ZainoError(400, 'Ordine non valido.');
	}
	// One update per row, not an upsert: an upsert with just {id, position}
	// enters through the INSERT policy, which checks `user_id = auth.uid()` on a
	// payload that has no user_id, so row level security refuses the whole batch.
	// Lists here are tens of rows at most, and they run together.
	const writes = await Promise.all(
		ids.map((id, position) => supabase.from(table).update({ position }).eq('id', id).eq('user_id', userId))
	);
	const writeError = writes.find((w) => w.error)?.error;
	if (writeError) fail(`${table} reorder failed`, writeError);
}

export const reorderNotebooks = (supabase: SupabaseClient, userId: string, ids: string[]) =>
	reorder(supabase, userId, 'notebooks', { column: 'user_id', value: userId }, ids);

export const reorderNotes = (supabase: SupabaseClient, userId: string, notebookId: string, ids: string[]) =>
	reorder(supabase, userId, 'notes', { column: 'notebook_id', value: notebookId }, ids);

/* ---------------------------------------------------------------- search */

/**
 * Turns what the student typed into a prefix tsquery: "deriv parz" becomes
 * `deriv:* & parz:*`, so the results narrow while the word is still being
 * written. Anything that is not a letter or a digit is dropped, which is what
 * keeps a stray `&` or `!` from being read as tsquery syntax and erroring.
 */
export function toPrefixQuery(input: string): string {
	return input
		.split(/\s+/)
		.map((term) => term.replace(/[^\p{L}\p{N}]/gu, ''))
		.filter(Boolean)
		.slice(0, 8)
		.map((term) => `${term}:*`)
		.join(' & ');
}

/** The owner's notes matching a query, most recently touched first. */
export async function searchNotes(supabase: SupabaseClient, userId: string, query: string, limit = 20): Promise<NoteHit[]> {
	const tsquery = toPrefixQuery(query);
	if (!tsquery) return [];
	const { data, error } = await supabase
		.from('notes')
		.select(`${NOTE_LIST_COLUMNS},notebooks!inner(title,color)`)
		.eq('user_id', userId)
		.textSearch('search', tsquery, { config: 'simple' })
		.order('updated_at', { ascending: false })
		.limit(limit);
	if (error) fail('note search failed', error);
	return (data ?? []).map((row) => {
		const book = (row as Row).notebooks as { title?: string; color?: NotebookColor } | null;
		return {
			...toNoteSummary(row as Row),
			notebook_title: book?.title ?? '',
			notebook_color: book?.color ?? 'zinc'
		};
	});
}

/** The last notes touched, for the strip at the top of the shelf. */
export async function recentNotes(supabase: SupabaseClient, userId: string, limit = 4): Promise<NoteHit[]> {
	const { data, error } = await supabase
		.from('notes')
		.select(`${NOTE_LIST_COLUMNS},notebooks!inner(title,color)`)
		.eq('user_id', userId)
		.order('updated_at', { ascending: false })
		.limit(limit);
	if (error) fail('recent notes failed', error);
	return (data ?? []).map((row) => {
		const book = (row as Row).notebooks as { title?: string; color?: NotebookColor } | null;
		return { ...toNoteSummary(row as Row), notebook_title: book?.title ?? '', notebook_color: book?.color ?? 'zinc' };
	});
}

/* ---------------------------------------------------------------- lesson */

/** The owner's notes taken on one lesson, newest first. */
export async function notesForLesson(supabase: SupabaseClient, userId: string, lessonPath: string): Promise<NoteSummary[]> {
	const { data, error } = await supabase
		.from('notes')
		.select(NOTE_LIST_COLUMNS)
		.eq('user_id', userId)
		.eq('lesson_path', lessonPath)
		.order('updated_at', { ascending: false });
	if (error) fail('lesson notes failed', error);
	return (data ?? []).map((row) => toNoteSummary(row as Row));
}

/**
 * The note to open when a student presses "Prendi appunti" on a lesson: the
 * one they already started on it, or a new one seeded with the lesson's title.
 * A new note lands in the first quaderno, and the shelf gets one made for it
 * when it is still empty, so the action never dead-ends on an empty backpack.
 */
export async function noteForLesson(supabase: SupabaseClient, user: User, lesson: LessonLink): Promise<NoteRow> {
	const existing = await notesForLesson(supabase, user.id, lesson.path);
	if (existing.length > 0) {
		const note = await getNote(supabase, user.id, existing[0].id);
		if (note) return note;
	}
	const books = await listNotebooks(supabase, user.id);
	const notebook = books[0] ?? (await createNotebook(supabase, user, { title: DEFAULT_NOTEBOOK_TITLE, color: 'crimson' }));
	return createNote(supabase, user, notebook.id, lesson.title.slice(0, 120) || DEFAULT_NOTE_TITLE, lesson);
}

/** The clean lesson link, or the message to show. */
export function parseLessonLink(body: Row): LessonLink | string {
	const path = text(body.path);
	const title = text(body.title);
	// Only an in-site content path: this ends up in an href.
	if (!path.startsWith('/materiale/') || path.length > 500 || /\s/.test(path)) return 'Lezione non valida.';
	if (!title || title.length > 200) return 'Lezione non valida.';
	return { path, title };
}

/** A list of ids from a request body, or the message to show. Order is the payload. */
export function parseIdList(body: Row): string[] | string {
	const ids = Array.isArray(body.ids) ? body.ids : null;
	if (!ids || ids.length === 0 || ids.length > 200) return 'Ordine non valido.';
	if (!ids.every((id) => typeof id === 'string' && id.length > 0)) return 'Ordine non valido.';
	return ids as string[];
}

/* ------------------------------------------------------------- validation */

export interface NotebookInput {
	title: string;
	color: NotebookColor;
}

const text = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

const COLORS = new Set<string>(NOTEBOOK_COLORS);

/** The clean quaderno, or the message to show. */
export function parseNotebookInput(body: Row): NotebookInput | string {
	const title = text(body.title) || DEFAULT_NOTEBOOK_TITLE;
	if (title.length > 120) return 'Il nome del quaderno può avere al massimo 120 caratteri.';
	const color = text(body.color) || 'zinc';
	if (!COLORS.has(color)) return 'Colore non valido.';
	return { title, color: color as NotebookColor };
}

/** The clean patch, or the message to show. An empty patch is a mistake, not a no-op. */
export function parseNotePatch(body: Row): NotePatch | string {
	const patch: NotePatch = {};
	if (body.title !== undefined) {
		const title = text(body.title);
		if (title.length < 1 || title.length > 120) return 'Il titolo deve avere da 1 a 120 caratteri.';
		patch.title = title;
	}
	if (body.content !== undefined) {
		if (typeof body.content !== 'string') return 'Contenuto non valido.';
		if (body.content.length > MAX_CONTENT) return 'La nota è troppo lunga.';
		patch.content = body.content;
	}
	if (body.notebookId !== undefined) {
		const notebookId = text(body.notebookId);
		if (!notebookId) return 'Quaderno non valido.';
		patch.notebookId = notebookId;
	}
	if (Object.keys(patch).length === 0) return 'Niente da salvare.';
	return patch;
}

/** The version the editor loaded, or the message to show. */
export function parseVersion(body: Row): number | string {
	const version = Number(body.version);
	if (!Number.isInteger(version) || version < 1) return 'Versione non valida.';
	return version;
}

/**
 * A line of the body, for the list preview. The list already shows the note's
 * title, so headings are passed over: an excerpt that repeats the title tells
 * the student nothing. A note that is nothing but headings falls back to one.
 *
 * Formulas are dropped rather than unwrapped: `$\lim_{x\to 0}\frac{\sin x}{x}$`
 * has no useful plain-text form, and the raw TeX made every maths note look
 * like line noise. A line that is only a formula is skipped for the same reason.
 */
export function plainExcerpt(markdown: string, max = 160): string {
	let fenced = false;
	let heading = '';
	for (const raw of markdown.split(/\r?\n/)) {
		const line = raw.trim();
		if (line.startsWith('```')) {
			fenced = !fenced;
			continue;
		}
		if (fenced || !line) continue;
		// A page break (see lib/zaino/pages) is markup, not text.
		if (/^<!--\s*pagina\s*-->$/.test(line)) continue;
		const isHeading = /^#{1,6}\s/.test(line);
		const plain = line
			.replace(/^#{1,6}\s+/, '')
			.replace(/^>\s?/, '')
			.replace(/^[-*+]\s+(\[[ xX]\]\s+)?/, '')
			.replace(/^\d+\.\s+/, '')
			.replace(/^\|.*$/, '')
			.replace(/\$\$[\s\S]*?\$\$/g, ' ')
			.replace(/\$[^$]*\$/g, ' ')
			.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
			.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
			.replace(/[*_~`]/g, '')
			.replace(/\s+([,.;:!?])/g, '$1')
			.replace(/\s{2,}/g, ' ')
			.trim();
		// What survives a formula-only line is punctuation: keep looking.
		if (plain.replace(/[^\p{L}\p{N}]/gu, '').length < 3) continue;
		if (isHeading) {
			heading ||= plain;
			continue;
		}
		return clamp(plain, max);
	}
	return heading ? clamp(heading, max) : '';
}

const clamp = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

/* --------------------------------------------------------------- stickers */

/**
 * The stickers on one note. A read that fails gives an empty sheet and a log
 * line: a sticker is decoration, and the note must still open without it.
 */
export async function getNoteStickers(supabase: SupabaseClient, userId: string, noteId: string): Promise<PlacedSticker[]> {
	const { data, error } = await supabase.from('note_stickers').select('stickers').eq('note_id', noteId).eq('user_id', userId).maybeSingle();
	if (error) {
		console.error('note stickers lookup failed:', error.message);
		return [];
	}
	const parsed = parseStickers((data as Row | null)?.stickers ?? []);
	return typeof parsed === 'string' ? [] : parsed;
}

/** Replaces the whole set. The note is checked first so a missing one is a 404, not a policy error. */
export async function saveNoteStickers(supabase: SupabaseClient, userId: string, noteId: string, stickers: PlacedSticker[]): Promise<void> {
	const { data: note, error: lookup } = await supabase.from('notes').select('id').eq('id', noteId).eq('user_id', userId).maybeSingle();
	if (lookup) fail('note lookup failed', lookup);
	if (!note) throw new ZainoError(404, 'Nota non trovata.');
	const { error } = await supabase
		.from('note_stickers')
		.upsert({ note_id: noteId, user_id: userId, stickers, updated_at: new Date().toISOString() }, { onConflict: 'note_id' });
	if (error) fail('note stickers save failed', error);
}

/* ------------------------------------------------------------------ paper */

/**
 * The paper a note is written on. Like the stickers it is decoration read on
 * its own: a failed read opens the note on the default paper, with a log line.
 */
export async function getNotePaper(supabase: SupabaseClient, userId: string, noteId: string): Promise<Paper> {
	const { data, error } = await supabase.from('notes').select('paper').eq('id', noteId).eq('user_id', userId).maybeSingle();
	if (error) {
		console.error('note paper lookup failed:', error.message);
		return DEFAULT_PAPER;
	}
	return readPaper((data as Row | null)?.paper);
}

/** Sets the paper without touching `version` or `updated_at`: a change of paper is not an edit of the text. */
export async function saveNotePaper(supabase: SupabaseClient, userId: string, noteId: string, paper: Paper): Promise<void> {
	const { data, error } = await supabase.from('notes').update({ paper }).eq('id', noteId).eq('user_id', userId).select('id').maybeSingle();
	if (error) fail('note paper save failed', error);
	if (!data) throw new ZainoError(404, 'Nota non trovata.');
}
