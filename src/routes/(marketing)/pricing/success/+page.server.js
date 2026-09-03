import { getPlanById } from '$lib/stripe/config.js';

function safePath(value) {
	return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/subscription';
}

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ url }) => {
	return {
		next: safePath(url.searchParams.get('next')),
		planName: getPlanById(url.searchParams.get('plan') ?? '').name
	};
};
