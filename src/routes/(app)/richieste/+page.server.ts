import { redirect } from '@sveltejs/kit';
import { listStudentRequests } from '$lib/server/tutoring-admin';
import type { PageServerLoad } from './$types';

/** The signed-in student's requests to tutors. */
export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/');
	return { requests: await listStudentRequests(locals.user.id) };
};
