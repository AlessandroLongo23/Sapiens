import { getSession } from '@/lib/server/auth';
import { deleteNoteForever, restoreNote } from '@/lib/server/zaino';
import { fail, guarded, isUuid, json } from '@/lib/server/http';

/** Restores a note from the trash, with its quaderno when that is in the trash too. */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail('Nota non trovata nel cestino.', 404);
	return guarded('note restore', async () => json(await restoreNote(supabase, user, id)));
}

/** Deletes a note in the trash for good. */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail('Nota non trovata nel cestino.', 404);
	return guarded('note delete', async () => {
		await deleteNoteForever(supabase, user.id, id);
		return json({ status: 'deleted' });
	});
}
