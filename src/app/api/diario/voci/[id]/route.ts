import { getSession } from '@/lib/server/auth';
import { deleteEntry, diaryTopics, updateEntry } from '@/lib/server/diary';
import { parseEntryInput } from '@/lib/diary/entries';
import { fail, guarded, isUuid, json, readJson } from '@/lib/server/http';

/** Changes an entry: ticks it, hides it, or rewrites it. Only the fields sent change. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail('Voce non trovata.', 404);
	const patch = parseEntryInput(await readJson(request), true);
	if (typeof patch === 'string') return fail(patch, 400);
	if (Object.keys(patch).length === 0) return fail('Niente da cambiare.', 400);
	return guarded('diary entry update', async () => {
		if (patch.topic && !(await diaryTopics()).some((t) => t.path === patch.topic)) patch.topic = null;
		return json({ entry: await updateEntry(supabase, user.id, id, patch) });
	});
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail('Voce non trovata.', 404);
	return guarded('diary entry delete', async () => {
		await deleteEntry(supabase, user.id, id);
		return json({ ok: true });
	});
}
