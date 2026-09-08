import { getSession } from '@/lib/server/auth';
import { NoteConflict, deleteNote, getNote, parseNotePatch, parseVersion, saveNote } from '@/lib/server/zaino';
import { fail, guarded, isUuid, json, readJson } from '@/lib/server/http';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail('Nota non trovata.', 404);
	return guarded('note read', async () => {
		const note = await getNote(supabase, user.id, id);
		return note ? json({ note }) : fail('Nota non trovata.', 404);
	});
}

/**
 * Rename, autosave or move one note — any combination of the three, since all
 * three are updates of a column. `version` is the copy the editor loaded; a
 * stale one comes back 409 with the row that won, for the client to choose.
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail('Nota non trovata.', 404);
	const body = await readJson(request);
	const patch = parseNotePatch(body);
	if (typeof patch === 'string') return fail(patch, 400);
	const version = parseVersion(body);
	if (typeof version === 'string') return fail(version, 400);
	return guarded('note save', async () => {
		try {
			return json({ note: await saveNote(supabase, user.id, id, patch, version) });
		} catch (err) {
			if (err instanceof NoteConflict) return json({ error: err.message, note: err.note }, 409);
			throw err;
		}
	});
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail('Nota non trovata.', 404);
	return guarded('note delete', async () => {
		await deleteNote(supabase, user.id, id);
		return json({ status: 'deleted' });
	});
}
