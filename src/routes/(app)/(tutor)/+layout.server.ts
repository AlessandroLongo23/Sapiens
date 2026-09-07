import { getOwnTutor } from '$lib/server/tutoring-admin';
import type { LayoutServerLoad } from './$types';

/** The tutor area: the signed-in user's own profile, or null before it is created. */
export const load: LayoutServerLoad = async ({ locals }) => {
	const tutor = locals.user ? await getOwnTutor(locals.user.id) : null;
	return { tutor };
};
