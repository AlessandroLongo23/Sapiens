import { isStaff } from '@/lib/auth/entitlements';
import { currentUser } from '@/lib/server/auth';
import { setTutorReview } from '@/lib/server/tutoring-admin';
import { fail, guarded, isUuid, json, readJson } from '@/lib/server/http';

/** Staff publishes, suspends or verifies a tutor profile. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const user = await currentUser();
	if (!user) return fail('Accedi per continuare.', 401);
	if (!isStaff(user)) return fail('Non autorizzato.', 403);
	const { id } = await params;
	if (!isUuid(id)) return fail('Tutor non trovato.', 404);
	const body = await readJson(request);
	return guarded('tutor review', async () => json({ tutor: await setTutorReview(id, { status: body.status, verified: body.verified }) }));
}
