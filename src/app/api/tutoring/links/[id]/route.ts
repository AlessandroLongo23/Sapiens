import { fail, isUuid, json, readJson } from '@/lib/server/http';
import { endLink, setConsent } from '@/lib/server/tutor-agenda';
import { withUser } from '@/lib/server/tutor-agenda-http';

type Params = { params: Promise<{ id: string }> };

/** The student lets the tutor see their exercises, or stops. */
export async function PATCH(request: Request, { params }: Params) {
	const { id } = await params;
	if (!isUuid(id)) return fail('Tutor non trovato.', 404);
	const body = await readJson(request);
	if (typeof body.share !== 'boolean') return fail('Richiesta non valida.', 400);
	const share = body.share;
	return withUser('consent', async (user) => {
		await setConsent(user.id, id, share);
		return json({ share });
	});
}

/** The student leaves a tutor. */
export async function DELETE(_request: Request, { params }: Params) {
	const { id } = await params;
	if (!isUuid(id)) return fail('Tutor non trovato.', 404);
	return withUser('link end', async (user) => {
		await endLink({ userId: user.id }, id);
		return json({ ok: true });
	});
}
