import { getSession } from '@/lib/server/auth';
import { emptyTrash, listTrash } from '@/lib/server/zaino';
import { fail, guarded, json } from '@/lib/server/http';

/** What is in the trash. */
export async function GET() {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	return guarded('trash read', async () => json({ trash: await listTrash(supabase, user.id) }));
}

/** Empties the trash: everything in it is deleted for good. */
export async function DELETE() {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	return guarded('trash empty', async () => {
		await emptyTrash(supabase, user.id);
		return json({ status: 'deleted' });
	});
}
