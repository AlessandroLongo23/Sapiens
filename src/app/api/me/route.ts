import { effectivePlan, subscriptionOf } from '@/lib/auth/entitlements';
import { currentUser } from '@/lib/server/auth';

/** The signed-in user's plan, read fresh from Supabase Auth. Never cached. */
export async function GET() {
	const user = await currentUser();
	const headers = { 'Cache-Control': 'private, no-store' };
	if (!user) return Response.json({ user: null }, { headers });
	return Response.json({ user: { id: user.id, email: user.email }, subscription: subscriptionOf(user), plan: effectivePlan(user).id }, { headers });
}
