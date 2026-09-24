import { getSession } from '@/lib/server/auth';
import { searchNotes } from '@/lib/server/zaino';
import { fail, guarded, json } from '@/lib/server/http';

/**
 * Search across the signed-in student's own notes. Row level security scopes
 * it to them, so there is nothing to leak even if the filter below were wrong.
 */
export async function GET(request: Request) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const q = new URL(request.url).searchParams.get('q') ?? '';
	if (q.trim().length < 2) return json({ notes: [] });
	return guarded('note search', async () => json({ notes: await searchNotes(supabase, user.id, q) }));
}
