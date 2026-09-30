import { after } from 'next/server';
import { answerExercise } from '@/lib/server/exercises';
import { fail, guarded, isUuid, json, readJson } from '@/lib/server/http';

/** An hour: anything longer is a tab left open, not time spent on the exercise. */
const MAX_ACTIVE_MS = 3_600_000;

/** An open answer longer than this is not an answer to a school exercise. */
const MAX_LATEX = 2000;

/**
 * The answer to an exercise: `{ key, choice, activeMs }` for multiple choice, `{ key, latex, activeMs }` for an
 * open answer, returning `{ verdict }`. On the path of every click, so
 * it waits on nothing: the verdict comes from the sealed key the exercise was sent with, which only this server
 * can open and which names the user it was issued to; the answer is written to the attempt after the response.
 * The proxy leaves this route alone for the same reason (see `src/proxy.ts`).
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	if (!isUuid(id)) return fail('Esercizio non trovato.', 404);
	const body = await readJson(request);
	const choice = body.choice;
	const latex = body.latex;
	if (typeof body.key !== 'string' || !body.key) return fail('Esercizio non trovato.', 404);
	const open = typeof latex === 'string';
	if (open ? !(latex as string).trim() || (latex as string).length > MAX_LATEX : !Number.isInteger(choice) || (choice as number) < 0) return fail('Risposta non valida.', 400);
	const activeMs = Number.isFinite(body.activeMs) ? Math.min(MAX_ACTIVE_MS, Math.max(0, Math.round(body.activeMs as number))) : null;
	const key = body.key;
	return guarded('exercise answer', async () => {
		const { verdict, save } = await answerExercise(id, key, open ? { latex: latex as string } : { choice: choice as number }, activeMs);
		after(() => save().catch((err) => console.error('exercise answer save:', err)));
		return json({ verdict });
	});
}
