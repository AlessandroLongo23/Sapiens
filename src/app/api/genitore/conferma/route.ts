import { confirmParent } from '@/lib/server/onboarding';
import { fail, guarded, json, readJson } from '@/lib/server/http';
import { callerOf, withinLimit } from '@/lib/server/rate-limit';

/** The parent's confirmation, `{ token }`. A POST, so opening the link (or a mail scanner following it) confirms nothing. */
export async function POST(request: Request) {
	if (!withinLimit(`parent-confirm:${callerOf(request)}`, 20, 3_600_000)) return fail('Troppi tentativi. Riprova più tardi.', 429);
	const body = await readJson(request);
	return guarded('parent confirm', async () => {
		await confirmParent(body.token, new URL(request.url).origin);
		return json({ ok: true });
	});
}
