import { currentUser } from '@/lib/server/auth';
import { createFriendCode } from '@/lib/server/referrals';
import { fail, guarded, json, readJson } from '@/lib/server/http';

/** A code of one's own, after declaring to be an adult: `{ adult: true }`, returning `{ code }`. */
export async function POST(request: Request) {
	const user = await currentUser();
	if (!user) return fail('Accedi per continuare.', 401);
	const body = await readJson(request);
	return guarded('invite code', async () => json({ code: await createFriendCode(user.id, body.adult) }));
}
