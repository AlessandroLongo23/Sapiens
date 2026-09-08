import { getSession } from '@/lib/server/auth';
import { createNotebook, getQuota, listNotebooks, parseNotebookInput } from '@/lib/server/zaino';
import { fail, guarded, json, readJson } from '@/lib/server/http';

/** The shelf and the ceiling in one call, so the page never renders a stale counter. */
export async function GET() {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	return guarded('notebook list', async () => {
		const [notebooks, quota] = await Promise.all([listNotebooks(supabase, user.id), getQuota(supabase, user)]);
		return json({ notebooks, quota });
	});
}

export async function POST(request: Request) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const input = parseNotebookInput(await readJson(request));
	if (typeof input === 'string') return fail(input, 400);
	return guarded('notebook create', async () => json({ notebook: await createNotebook(supabase, user, input) }, 201));
}
