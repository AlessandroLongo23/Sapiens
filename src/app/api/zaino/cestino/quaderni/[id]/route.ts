import { getSession } from '@/lib/server/auth';
import { deleteNotebookForever, restoreNotebook } from '@/lib/server/zaino';
import { fail, guarded, isUuid, json } from '@/lib/server/http';

/** Restores a quaderno from the trash, with the notes that went with it. */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail('Quaderno non trovato nel cestino.', 404);
	return guarded('notebook restore', async () => json({ notebook: await restoreNotebook(supabase, user, id) }));
}

/** Deletes a quaderno in the trash for good, with every note in it. */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail('Quaderno non trovato nel cestino.', 404);
	return guarded('notebook delete', async () => {
		await deleteNotebookForever(supabase, user.id, id);
		return json({ status: 'deleted' });
	});
}
