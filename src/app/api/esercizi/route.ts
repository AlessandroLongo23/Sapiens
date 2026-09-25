import { getSession } from '@/lib/server/auth';
import { hasFeature } from '@/lib/auth/entitlements';
import { Features } from '@/lib/stripe/config';
import { startSession } from '@/lib/server/exercises';
import { fail, guarded, json, readJson } from '@/lib/server/http';

/**
 * Starts a run on a lesson's path and returns it with its first exercise, saved as an attempt before it is
 * sent: `{ lesson, kind: 'level', level }` is a run at an open level, `{ lesson, kind: 'jump', level }` a jump
 * test to a locked one.
 */
export async function POST(request: Request) {
	const { user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const body = await readJson(request);
	if (typeof body.lesson !== 'string' || !body.lesson) return fail('Lezione mancante.', 400);
	if (body.kind !== 'level' && body.kind !== 'jump') return fail('Tipo di prova non valido.', 400);
	if (!Number.isInteger(body.level)) return fail('Livello non valido.', 400);
	const { lesson, kind } = body;
	const level = body.level as number;
	// Free accounts have one session a day; the service shortens the run to what is left of it.
	const limited = !hasFeature(user, Features.EXERCISES);
	return guarded('exercise session', async () => json(await startSession(user.id, lesson, kind, level, limited), 201));
}
