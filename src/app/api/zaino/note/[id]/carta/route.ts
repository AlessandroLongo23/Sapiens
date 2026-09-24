import { getSession } from '@/lib/server/auth';
import { saveNotePaper } from '@/lib/server/zaino';
import { parsePaper } from '@/lib/zaino/paper';
import { fail, guarded, isUuid, json, readJson } from '@/lib/server/http';

/** The paper of a note: ruling, colour, spacing and text size, replaced as a whole. */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail('Nota non trovata.', 404);
	const paper = parsePaper((await readJson(request)).paper);
	if (typeof paper === 'string') return fail(paper, 400);
	return guarded('note paper save', async () => {
		await saveNotePaper(supabase, user.id, id, paper);
		return json({ paper });
	});
}
