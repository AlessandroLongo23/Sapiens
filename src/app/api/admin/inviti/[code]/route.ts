import { isStaff } from '@/lib/auth/entitlements';
import { currentUser } from '@/lib/server/auth';
import { setCreatorCodeActive } from '@/lib/server/referrals';
import { normalizeCode } from '@/lib/referrals/config';
import { fail, guarded, json, readJson } from '@/lib/server/http';

/** Staff switches a creator's code on or off: `{ active }`. */
export async function POST(request: Request, { params }: { params: Promise<{ code: string }> }) {
	const user = await currentUser();
	if (!user) return fail('Accedi per continuare.', 401);
	if (!isStaff(user)) return fail('Non autorizzato.', 403);
	const code = normalizeCode((await params).code);
	if (!code) return fail('Codice non trovato.', 404);
	const body = await readJson(request);
	if (typeof body.active !== 'boolean') return fail('Azione non valida.', 400);
	const active = body.active;
	return guarded('creator code action', async () => {
		await setCreatorCodeActive(code, active);
		return json({ ok: true });
	});
}
