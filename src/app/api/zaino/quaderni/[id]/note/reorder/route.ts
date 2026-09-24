import { getSession } from '@/lib/server/auth';
import { parseIdList, reorderNotes } from '@/lib/server/zaino';
import { fail, guarded, isUuid, json, readJson } from '@/lib/server/http';

/** The order of one quaderno's note. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail('Quaderno non trovato.', 404);
	const ids = parseIdList(await readJson(request));
	if (typeof ids === 'string') return fail(ids, 400);
	return guarded('note reorder', async () => {
		await reorderNotes(supabase, user.id, id, ids);
		return json({ status: 'ok' });
	});
}
