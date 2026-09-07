import { listTutorInbox } from '$lib/server/tutoring-admin';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { tutor } = await parent();
	return { requests: tutor ? await listTutorInbox(tutor.id) : [] };
};
