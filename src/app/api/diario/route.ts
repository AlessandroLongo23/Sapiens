import { getSession } from '@/lib/server/auth';
import { monthView } from '@/lib/server/diary';
import { daysBetween, isDay } from '@/lib/diary/dates';
import { fail, guarded, json } from '@/lib/server/http';

/** A calendar's worth of the diary: the entries and the days studied from `da` to `a`, at most six weeks. */
export async function GET(request: Request) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const params = new URL(request.url).searchParams;
	const from = params.get('da');
	const to = params.get('a');
	if (!isDay(from) || !isDay(to) || daysBetween(from, to) < 0 || daysBetween(from, to) > 45) return fail('Intervallo non valido.', 400);
	return guarded('diary month', async () => json(await monthView(supabase, user.id, from, to)));
}
