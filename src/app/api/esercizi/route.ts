import { getSession } from '@/lib/server/auth';
import { hasFeature } from '@/lib/auth/entitlements';
import { Features } from '@/lib/stripe/config';
import { issueExercise } from '@/lib/server/exercises';
import { fail, guarded, json, readJson } from '@/lib/server/http';

/**
 * A new exercise for a lesson, saved as an attempt before it is sent: `{ lesson }` starts at the first level
 * the student has not mastered, `{ lesson, level }` is the level picker.
 */
export async function POST(request: Request) {
	const { user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const body = await readJson(request);
	if (typeof body.lesson !== 'string' || !body.lesson) return fail('Lezione mancante.', 400);
	if (body.level !== undefined && !Number.isInteger(body.level)) return fail('Livello non valido.', 400);
	const lesson = body.lesson;
	const level = body.level as number | undefined;
	// Free accounts have one session a day; the service refuses the exercise past it.
	const limited = !hasFeature(user, Features.EXERCISES);
	return guarded('exercise issue', async () => json({ exercise: await issueExercise(user.id, lesson, level, undefined, limited) }, 201));
}
