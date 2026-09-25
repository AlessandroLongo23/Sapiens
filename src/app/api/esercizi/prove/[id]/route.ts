import { getSession } from '@/lib/server/auth';
import { hasFeature } from '@/lib/auth/entitlements';
import { Features } from '@/lib/stripe/config';
import { sessionExercise } from '@/lib/server/exercises';
import { fail, guarded, isUuid, json, readJson } from '@/lib/server/http';

/**
 * The exercise at `{ position }` of a run, saved as an attempt before it is sent. The page asks for the next
 * one while the student answers the current one; asking for the same place twice returns the same exercise.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail('Prova non trovata.', 404);
	const body = await readJson(request);
	const position = body.position;
	if (!Number.isInteger(position) || (position as number) < 0) return fail('Domanda non valida.', 400);
	const limited = !hasFeature(user, Features.EXERCISES);
	return guarded('exercise next', async () => json({ exercise: await sessionExercise(user.id, id, position as number, limited) }, 201));
}
