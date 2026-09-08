import { getSession } from '@/lib/server/auth';
import { deleteNotebook, parseNotebookInput, renameNotebook } from '@/lib/server/zaino';
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

/** Deletes the quaderno and its note. `?confirm=1` is required once it holds any. */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail('Quaderno non trovato.', 404);
	const confirm = new URL(request.url).searchParams.get('confirm') === '1';
	return guarded('notebook delete', async () => json(await deleteNotebook(supabase, user.id, id, confirm)));
}
