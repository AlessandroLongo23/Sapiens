import { loadNodePage } from '$lib/server/node-page';
import { CONTENT_ROOT } from '$lib/config/site';

/**
 * Level, subject and chapter index pages. Lessons have their own route
 * (`[level]/[subject]/[chapter]/[topic]`) so index pages ship none of the
 * lesson rendering code.
 */

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, parent, url }) {
	const { tree } = await parent();
	return loadNodePage({
		tree,
		segments: params.slug.split('/').filter(Boolean),
		requestPath: `${CONTENT_ROOT}/${params.slug}`,
		url,
		expect: 'index'
	});
}
