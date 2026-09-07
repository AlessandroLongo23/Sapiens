import { listAllTutors } from '$lib/server/tutoring-admin';
import type { PageServerLoad } from './$types';

/** Staff review of tutor profiles (the hook already requires the admin role). */
export const load: PageServerLoad = async () => {
	return { tutors: await listAllTutors() };
};
