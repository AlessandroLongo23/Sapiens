import { signUp } from '@/lib/server/onboarding';
import { fail, guarded, json, readJson } from '@/lib/server/http';
import { callerOf, withinLimit } from '@/lib/server/rate-limit';

/**
 * Creates an account and answers `{ state: 'ready' }` (the browser signs in with the same email and password) or
 * `{ state: 'parent', parentEmail }` for a student under 14, whose account waits for the parent's confirmation.
 */
export async function POST(request: Request) {
	// A class signing up together shares the school's address: the limit stops a script, not a classroom.
	if (!withinLimit(`signup:${callerOf(request)}`, 60, 3_600_000)) return fail('Troppe iscrizioni da questa connessione. Riprova tra un’ora.', 429);
	const body = await readJson(request);
	return guarded('signup', async () => json(await signUp(body, new URL(request.url).origin)));
}
