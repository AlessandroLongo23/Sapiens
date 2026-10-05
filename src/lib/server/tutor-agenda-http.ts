import 'server-only';
import type { User } from '@supabase/supabase-js';
import { currentUser } from './auth';
import { fail, guarded } from './http';
import { getOwnTutor, type TutorRow } from './tutoring-admin';

/** Runs a handler of the agenda for a signed-in user. */
export async function withUser(context: string, run: (user: User) => Promise<Response>): Promise<Response> {
	const user = await currentUser();
	if (!user) return fail('Accedi per continuare.', 401);
	return guarded(context, () => run(user));
}

/** Runs a handler of the agenda for a signed-in tutor: 403 without a profile. */
export async function withTutor(context: string, run: (tutor: TutorRow, user: User) => Promise<Response>): Promise<Response> {
	return withUser(context, async (user) => {
		const tutor = await getOwnTutor(user.id);
		if (!tutor) return fail('Non hai un profilo tutor.', 403);
		return run(tutor, user);
	});
}
