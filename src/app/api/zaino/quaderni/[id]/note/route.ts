import { getSession } from '@/lib/server/auth';
import { DEFAULT_NOTE_TITLE, createNote, listNotes } from '@/lib/server/zaino';
import { fail, guarded, isUuid, json, readJson } from '@/lib/server/http';

/** One quaderno's note, without their documents. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail('Quaderno non trovato.', 404);
	return guarded('note list', async () => json({ notes: await listNotes(supabase, user.id, id) }));
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail('Quaderno non trovato.', 404);
	const body = await readJson(request);
	const title = typeof body.title === 'string' && body.title.trim() ? body.title.trim().slice(0, 120) : DEFAULT_NOTE_TITLE;
	return guarded('note create', async () => json({ note: await createNote(supabase, user, id, title) }, 201));
}
