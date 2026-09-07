import { getPublishedTutors } from '$lib/server/tutoring';
import type { PageServerLoad } from './$types';

/**
 * The list is public and cached as static HTML, refreshed in the background;
 * filtering happens in the browser from the URL, so one cached page serves
 * every combination of filters.
 */
export const config = {
	isr: {
		expiration: 600
	}
};

export const load: PageServerLoad = async () => {
	return {
		tutors: await getPublishedTutors()
	};
};
