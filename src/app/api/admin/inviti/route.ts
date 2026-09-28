import { isStaff } from '@/lib/auth/entitlements';
import { currentUser } from '@/lib/server/auth';
import { createCreatorCode } from '@/lib/server/referrals';
import { fail, guarded, json, readJson } from '@/lib/server/http';

/** Staff creates a creator's code: `{ code, label }`. */
export async function POST(request: Request) {
	const user = await currentUser();
	if (!user) return fail('Accedi per continuare.', 401);
	if (!isStaff(user)) return fail('Non autorizzato.', 403);
	const body = await readJson(request);
	return guarded('creator code', async () => {
		await createCreatorCode(body.code, body.label);
		return json({ ok: true });
	});
}
