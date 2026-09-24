import { getSession } from '@/lib/server/auth';
import { saveNoteStickers } from '@/lib/server/zaino';
import { parseStickers } from '@/lib/zaino/stickers';
import { fail, guarded, isUuid, json, readJson } from '@/lib/server/http';

/** The stickers on a note, replaced as a set: the editor always sends all of them. */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail('Nota non trovata.', 404);
	const stickers = parseStickers((await readJson(request)).stickers);
	if (typeof stickers === 'string') return fail(stickers, 400);
	return guarded('note stickers save', async () => {
		await saveNoteStickers(supabase, user.id, id, stickers);
		return json({ stickers });
	});
}
