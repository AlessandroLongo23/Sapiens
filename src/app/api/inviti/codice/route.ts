import { currentUser } from '@/lib/server/auth';
import { claimInvite, codeIsActive } from '@/lib/server/referrals';
import { fail, guarded, json, readJson } from '@/lib/server/http';

/** Whether the code of an invite link can be used (`?code=`): the invite offer shows itself only then. */
export async function GET(request: Request) {
	const code = new URL(request.url).searchParams.get('code');
	return guarded('invite check', async () => json({ valid: await codeIsActive(code) }));
}

/** A friend's or a creator's code entered by hand in the first days of the account: `{ code }`. */
export async function POST(request: Request) {
	const user = await currentUser();
	if (!user) return fail('Accedi per continuare.', 401);
	const body = await readJson(request);
	return guarded('invite claim', async () => {
		await claimInvite(user, body.code);
		return json({ ok: true });
	});
}
