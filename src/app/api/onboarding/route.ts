import { currentUser } from '@/lib/server/auth';
import { saveHeardFrom, saveWelcome, welcomeFigure } from '@/lib/server/onboarding';
import { fail, guarded, json, readJson } from '@/lib/server/http';

/**
 * The answers a student gives on the way in. `{ year?, topic? }` saves the welcome page (an empty body is a skip)
 * and returns `{ next }`, the page to open; `{ heardFrom }` saves "Come ci hai conosciuto?".
 */
export async function POST(request: Request) {
	const user = await currentUser();
	if (!user) return fail('Accedi per continuare.', 401);
	const body = await readJson(request);
	return guarded('onboarding', async () => {
		if (body.heardFrom !== undefined) {
			await saveHeardFrom(user, body.heardFrom);
			return json({ ok: true });
		}
		return json({ next: await saveWelcome(user, body) });
	});
}

/** `?lesson=<path>`: the drawing the notebook shows on its first page for that lesson, `{ figure }`, null without one. */
export async function GET(request: Request) {
	const lesson = new URL(request.url).searchParams.get('lesson');
	return guarded('onboarding figure', async () => json({ figure: await welcomeFigure(lesson) }));
}
