import { currentUser } from '@/lib/server/auth';
import { confirmEmailCode, sendEmailCode } from '@/lib/server/onboarding';
import { fail, guarded, json, readJson } from '@/lib/server/http';
import { withinLimit } from '@/lib/server/rate-limit';

/** The code that confirms the account's email: `{}` sends a new one, `{ code }` checks the one typed. */
export async function POST(request: Request) {
	const user = await currentUser();
	if (!user) return fail('Accedi per continuare.', 401);
	if (!withinLimit(`email-code:${user.id}`, 20, 3_600_000)) return fail('Troppi tentativi. Riprova tra un’ora.', 429);
	const body = await readJson(request);
	return guarded('email code', async () => {
		if (body.code === undefined) await sendEmailCode(user);
		else await confirmEmailCode(user, body.code);
		return json({ ok: true, verified: body.code !== undefined });
	});
}
