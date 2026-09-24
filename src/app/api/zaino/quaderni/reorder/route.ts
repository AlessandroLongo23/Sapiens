import { getSession } from '@/lib/server/auth';
import { parseIdList, reorderNotebooks } from '@/lib/server/zaino';
import { fail, guarded, json, readJson } from '@/lib/server/http';

/** The shelf order. `reorder` is a static segment, so it never collides with a quaderno id. */
export async function POST(request: Request) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const ids = parseIdList(await readJson(request));
	if (typeof ids === 'string') return fail(ids, 400);
	return guarded('notebook reorder', async () => {
		await reorderNotebooks(supabase, user.id, ids);
		return json({ status: 'ok' });
	});
}
