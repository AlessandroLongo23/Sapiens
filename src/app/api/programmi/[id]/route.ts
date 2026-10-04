import { getSession } from '@/lib/server/auth';
import { deleteProgram, getProgram, parseProgramInput, updateProgram } from '@/lib/server/programmi';
import { fail, guarded, isUuid, json, readJson } from '@/lib/server/http';

type Params = { params: Promise<{ id: string }> };
const MISSING = 'Programma non trovato.';

/** One saved program with its files, to load it in the editor. */
export async function GET(_request: Request, { params }: Params) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail(MISSING, 404);
	return guarded('program read', async () => json({ program: await getProgram(supabase, user.id, id) }));
}

/** "Salva" over a program already saved, or a new name for it. */
export async function PATCH(request: Request, { params }: Params) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail(MISSING, 404);
	const input = parseProgramInput(await readJson(request), { title: false, program: false });
	if (typeof input === 'string') return fail(input, 400);
	return guarded('program save', async () => json({ program: await updateProgram(supabase, user.id, id, input) }));
}

export async function DELETE(_request: Request, { params }: Params) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail(MISSING, 404);
	return guarded('program delete', async () => {
		await deleteProgram(supabase, user.id, id);
		return json({ status: 'deleted' });
	});
}
