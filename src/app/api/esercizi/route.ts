import { getSession } from '@/lib/server/auth';
import { hasFeature } from '@/lib/auth/entitlements';
import { Features } from '@/lib/stripe/config';
import { startPractice, startReview, startSession } from '@/lib/server/exercises';
import { fail, guarded, isUuid, json, readJson } from '@/lib/server/http';

/**
 * Starts a run and returns it with its first exercise, saved as an attempt before it is sent:
 * `{ lesson, kind: 'level', level }` is a run at an open level, `{ lesson, kind: 'jump', level }` a jump test to a
 * locked one, `{ kind: 'review', session? }` new exercises where the student erred, in that run or anywhere,
 * `{ kind: 'practice' }` today's practice, or the one already started today where it was left.
 */
export async function POST(request: Request) {
	const { user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const body = await readJson(request);
	// Free accounts have one session a day; the service shortens the run to what is left of it.
	const limited = !hasFeature(user, Features.EXERCISES);
	if (body.kind === 'practice') return guarded('exercise practice', async () => json(await startPractice(user.id, limited), 201));
	if (body.kind === 'review') {
		if (body.session !== undefined && !isUuid(body.session)) return fail('Prova non trovata.', 400);
		const from = (body.session as string | undefined) ?? null;
		return guarded('exercise review', async () => json(await startReview(user.id, from, limited), 201));
	}
	if (typeof body.lesson !== 'string' || !body.lesson) return fail('Lezione mancante.', 400);
	if (body.kind !== 'level' && body.kind !== 'jump') return fail('Tipo di prova non valido.', 400);
	if (!Number.isInteger(body.level)) return fail('Livello non valido.', 400);
	const { lesson, kind } = body;
	const level = body.level as number;
	return guarded('exercise session', async () => json(await startSession(user.id, lesson, kind, level, limited), 201));
}
