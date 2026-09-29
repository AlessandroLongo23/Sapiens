import { getSession } from '@/lib/server/auth';
import { parseNotebookInput, renameNotebook, trashNotebook } from '@/lib/server/zaino';
import { fail, guarded, isUuid, json, readJson } from '@/lib/server/http';

/** Rename or recolour one quaderno. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail('Quaderno non trovato.', 404);
	const input = parseNotebookInput(await readJson(request));
	if (typeof input === 'string') return fail(input, 400);
	return guarded('notebook rename', async () => json({ notebook: await renameNotebook(supabase, user.id, id, input) }));
}

/** Moves the quaderno to the trash, with its notes. Nothing to confirm: it can be restored for 30 days. */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail('Quaderno non trovato.', 404);
	return guarded('notebook trash', async () => {
		await trashNotebook(supabase, user.id, id);
		return json({ status: 'trashed' });
	});
}
