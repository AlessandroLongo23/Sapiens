import { getSession } from '@/lib/server/auth';
import { createPlot, listPlots, parsePlotInput, plotQuota } from '@/lib/server/grafici';
import { fail, guarded, json, readJson } from '@/lib/server/http';

/** The student's saved graphs, the last saved first, with how many the plan allows. */
export async function GET() {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	return guarded('plot list', async () => {
		const [plots, quota] = await Promise.all([listPlots(supabase, user.id), plotQuota(supabase, user)]);
		return json({ plots, quota });
	});
}

/** "Salva con nome": a new graph. */
export async function POST(request: Request) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const input = parsePlotInput(await readJson(request), { title: true, state: true });
	if (typeof input === 'string') return fail(input, 400);
	return guarded('plot create', async () => json({ plot: await createPlot(supabase, user, input as { title: string; state: string; preview?: string | null }) }, 201));
}
