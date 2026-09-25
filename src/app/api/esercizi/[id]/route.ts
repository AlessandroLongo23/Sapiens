import { getSession } from '@/lib/server/auth';
import { hasFeature } from '@/lib/auth/entitlements';
import { Features } from '@/lib/stripe/config';
import { answerExercise } from '@/lib/server/exercises';
import { fail, guarded, isUuid, json, readJson } from '@/lib/server/http';

/** An hour: anything longer is a tab left open, not time spent on the exercise. */
const MAX_ACTIVE_MS = 3_600_000;

/**
 * The answer to an exercise: `{ choice, activeMs, next }`. Returns the verdict and, when `next` is true,
 * the following exercise, so the page never waits between two questions.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail('Esercizio non trovato.', 404);
	const body = await readJson(request);
	const choice = body.choice;
	if (!Number.isInteger(choice) || (choice as number) < 0) return fail('Risposta non valida.', 400);
	const activeMs = Number.isFinite(body.activeMs) ? Math.min(MAX_ACTIVE_MS, Math.max(0, Math.round(body.activeMs as number))) : null;
	// An exercise already sent can always be answered; a Free account gets the next one while today's session lasts.
	const limited = !hasFeature(user, Features.EXERCISES);
	return guarded('exercise answer', async () => json(await answerExercise(user.id, id, choice as number, activeMs, body.next === true, limited)));
}
