import { getSession } from '@/lib/server/auth';
import { deletePlot, getPlot, parsePlotInput, updatePlot } from '@/lib/server/grafici';
import { fail, guarded, isUuid, json, readJson } from '@/lib/server/http';

type Params = { params: Promise<{ id: string }> };
const MISSING = 'Grafico non trovato.';

/** One saved graph with what it draws, to load it on the plane. */
export async function GET(_request: Request, { params }: Params) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail(MISSING, 404);
	return guarded('plot read', async () => json({ plot: await getPlot(supabase, user.id, id) }));
}

/** "Salva" over a graph already saved, or a new name for it. */
export async function PATCH(request: Request, { params }: Params) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail(MISSING, 404);
	const input = parsePlotInput(await readJson(request), { title: false, state: false });
	if (typeof input === 'string') return fail(input, 400);
	return guarded('plot save', async () => json({ plot: await updatePlot(supabase, user.id, id, input) }));
}

export async function DELETE(_request: Request, { params }: Params) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail(MISSING, 404);
	return guarded('plot delete', async () => {
		await deletePlot(supabase, user.id, id);
		return json({ status: 'deleted' });
	});
}
