function safePath(value) {
	return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/materiale';
}

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ url }) => {
	return { next: safePath(url.searchParams.get('next')) };
};
