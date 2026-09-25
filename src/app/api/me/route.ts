import { planOf, subscriptionOf } from '@/lib/auth/entitlements';
import { currentUser } from '@/lib/server/auth';

/** The signed-in user's plan and where it comes from (subscription, pass, trial, free), read fresh from Supabase Auth. Never cached. */
export async function GET() {
	const user = await currentUser();
	const headers = { 'Cache-Control': 'private, no-store' };
	if (!user) return Response.json({ user: null }, { headers });
	const { plan, source } = planOf(user);
	return Response.json({ user: { id: user.id, email: user.email }, subscription: subscriptionOf(user), plan: plan.id, source }, { headers });
}
