import { currentUser } from '@/lib/server/auth';
import { cancelRequest } from '@/lib/server/tutoring-admin';
import { fail, guarded, isUuid, json } from '@/lib/server/http';

/** The student withdraws a request the tutor has not answered yet. */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
	const user = await currentUser();
	if (!user) return fail('Accedi per continuare.', 401);
	const { id } = await params;
	if (!isUuid(id)) return fail('Richiesta non trovata.', 404);
	return guarded('request cancel', async () => {
		await cancelRequest(user.id, id);
		return json({ status: 'cancelled' });
	});
}
