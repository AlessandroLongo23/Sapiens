import { error } from '@sveltejs/kit';
import { getTutorBySlug } from '$lib/server/tutoring';
import type { PageServerLoad } from './$types';

export const config = {
	isr: {
		expiration: 600
	}
};

export const load: PageServerLoad = async ({ params }) => {
	const tutor = await getTutorBySlug(params.slug);
	if (!tutor) throw error(404, 'Tutor non trovato');
	return { tutor };
};
