import { fail, guarded, json, readJson } from '@/lib/server/http';
import { callerOf, withinLimit } from '@/lib/server/rate-limit';

/** Written answers one caller may have checked in a minute: far more than a student sends, far fewer than a script. */
const PER_MINUTE = 20;

/**
 * A written answer to a stop of a guided exercise (lib/guidato/blocco.ts): `{ answer, grading, errors, latex }`,
 * returning `{ correct, message?, error? }`. Public, like the lesson it serves, and it writes nothing: the lesson
 * is free and its guided exercise is not part of anyone's progress. The page sends the expected answer along with
 * the student's, because a lesson shows it anyway; so the route needs no database and knows no lesson.
 *
 * It runs here and not in the browser because the grader reads LaTeX with the Compute Engine, a megabyte zipped
 * that a phone would download to check one number.
 */
export async function POST(request: Request) {
	return guarded('guidato', async () => {
		if (!withinLimit(`guidato:${callerOf(request)}`, PER_MINUTE, 60_000)) return fail('Troppe risposte in poco tempo. Riprova tra un minuto.', 429);
		const { gradeGuided, readGuidedRequest } = await import('@/lib/guidato/correzione');
		const asked = readGuidedRequest(await readJson(request));
		if (!asked) return fail('Risposta non valida.', 400);
		try {
			return json(gradeGuided(asked.stop, asked.latex));
		} catch {
			// an expected value the grader's reader refuses: not something a lesson that passed its check sends
			return fail('Risposta non valida.', 400);
		}
	});
}
