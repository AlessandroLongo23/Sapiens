import { listTutorInbox } from '$lib/server/tutoring-admin';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { tutor } = await parent();
	const inbox = tutor ? await listTutorInbox(tutor.id) : [];
	return {
		counts: {
			pending: inbox.filter((r) => r.status === 'pending').length,
			accepted: inbox.filter((r) => r.status === 'accepted').length,
			total: inbox.length
		}
	};
};
