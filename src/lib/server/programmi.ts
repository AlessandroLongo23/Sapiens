import 'server-only';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { hasFeature } from '@/lib/auth/entitlements';
import { FREE_PROGRAMS, MAX_PROGRAM_TITLE, isProgramLanguage, readProgramFiles, type ProgramFiles, type ProgramLanguage, type ProgramQuota, type SavedProgram, type SavedProgramFiles } from '@/lib/codice/salvati';
import { Features } from '@/lib/stripe/config';

/**
 * The programs saved from the code editor, read and written with the visitor's own Supabase client: row level
 * security is the access rule. Built like ./grafici, and sharing its plan: an account with unlimited quaderni has
 * unlimited programs.
 */

export class ProgramError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

const LIST_COLUMNS = 'id,title,language,updated_at';
const COLUMNS = `${LIST_COLUMNS},files`;
const DUPLICATE = '23505';
const TAKEN = 'Hai già un programma con questo nome.';
const MISSING = 'Programma non trovato.';

function fail(context: string, error: { message: string }): never {
	console.error(`${context}:`, error.message);
	throw new ProgramError(503, 'Servizio non disponibile. Riprova più tardi.');
}

export async function programQuota(supabase: SupabaseClient, user: User): Promise<ProgramQuota> {
	const { count, error } = await supabase.from('programs').select('id', { count: 'exact', head: true }).eq('user_id', user.id);
	if (error) fail('program count failed', error);
	return { used: count ?? 0, max: hasFeature(user, Features.NOTEBOOKS) ? null : FREE_PROGRAMS };
}

export async function listPrograms(supabase: SupabaseClient, userId: string): Promise<SavedProgram[]> {
	const { data, error } = await supabase.from('programs').select(LIST_COLUMNS).eq('user_id', userId).order('updated_at', { ascending: false });
	if (error) fail('program list failed', error);
	return (data ?? []) as SavedProgram[];
}

export async function getProgram(supabase: SupabaseClient, userId: string, id: string): Promise<SavedProgramFiles> {
	const { data, error } = await supabase.from('programs').select(COLUMNS).eq('user_id', userId).eq('id', id).maybeSingle();
	if (error) fail('program read failed', error);
	if (!data) throw new ProgramError(404, MISSING);
	return data as SavedProgramFiles;
}

/** "Salva con nome": a new program. The free ceiling is checked here, the one way to an insert. */
export async function createProgram(supabase: SupabaseClient, user: User, input: { title: string; language: ProgramLanguage; files: ProgramFiles }): Promise<SavedProgramFiles> {
	const quota = await programQuota(supabase, user);
	if (quota.max !== null && quota.used >= quota.max) throw new ProgramError(402, `Con il piano gratuito puoi tenere ${FREE_PROGRAMS} programmi. Passa a un piano a pagamento per non avere limiti, oppure eliminane uno.`);
	const { data, error } = await supabase.from('programs').insert({ user_id: user.id, title: input.title, language: input.language, files: input.files }).select(COLUMNS).single();
	if (error?.code === DUPLICATE) throw new ProgramError(409, TAKEN);
	if (error) fail('program create failed', error);
	return data as SavedProgramFiles;
}

/** "Salva" over a program already saved, or a new name for it. */
export async function updateProgram(supabase: SupabaseClient, userId: string, id: string, patch: { title?: string; language?: ProgramLanguage; files?: ProgramFiles }): Promise<SavedProgramFiles> {
	const { data, error } = await supabase
		.from('programs')
		.update({ ...patch, updated_at: new Date().toISOString() })
		.eq('user_id', userId)
		.eq('id', id)
		.select(COLUMNS)
		.maybeSingle();
	if (error?.code === DUPLICATE) throw new ProgramError(409, TAKEN);
	if (error) fail('program save failed', error);
	if (!data) throw new ProgramError(404, MISSING);
	return data as SavedProgramFiles;
}

export async function deleteProgram(supabase: SupabaseClient, userId: string, id: string): Promise<void> {
	const { error } = await supabase.from('programs').delete().eq('user_id', userId).eq('id', id);
	if (error) fail('program delete failed', error);
}

/** The title and the program of a request, each where it is given: a sentence when one cannot be used. */
export function parseProgramInput(body: Record<string, unknown>, need: { title: boolean; program: boolean }): { title?: string; language?: ProgramLanguage; files?: ProgramFiles } | string {
	const out: { title?: string; language?: ProgramLanguage; files?: ProgramFiles } = {};
	if (body.title !== undefined || need.title) {
		const title = typeof body.title === 'string' ? body.title.trim().replace(/\s+/g, ' ') : '';
		if (!title) return 'Dai un nome al programma.';
		if (title.length > MAX_PROGRAM_TITLE) return `Il nome è troppo lungo: al più ${MAX_PROGRAM_TITLE} caratteri.`;
		out.title = title;
	}
	if (body.files !== undefined || body.language !== undefined || need.program) {
		// the language and the files go together: the files of a page are not those of a program
		const files = isProgramLanguage(body.language) ? readProgramFiles(body.language, body.files) : null;
		if (!files || Object.values(files).every((text) => !text.trim())) return 'Questo programma non si può salvare.';
		out.language = body.language as ProgramLanguage;
		out.files = files;
	}
	if (out.title === undefined && out.files === undefined) return 'Niente da salvare.';
	return out;
}
