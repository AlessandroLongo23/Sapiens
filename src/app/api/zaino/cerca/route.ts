import { getSession } from '@/lib/server/auth';
import { searchNotes } from '@/lib/server/zaino';
import { fail, guarded, isUuid, json } from '@/lib/server/http';

/**
 * Search across the signed-in student's own notes, in title and text. Row level
 * security scopes it to them, so there is nothing to leak even if the filter
 * below were wrong. `quaderno` keeps it to one quaderno, for its own page.
 */
export async function GET(request: Request) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const params = new URL(request.url).searchParams;
	const q = params.get('q') ?? '';
	const notebook = params.get('quaderno');
	if (notebook !== null && !isUuid(notebook)) return fail('Quaderno non valido.', 400);
	if (q.trim().length < 2) return json({ notes: [] });
	return guarded('note search', async () =>
		json({ notes: await searchNotes(supabase, user.id, q, notebook ? 200 : 20, notebook ?? undefined) })
	);
}
