import { buildNodePage } from '$lib/seo/node-page';

/** @type {import('./$types').PageLoad} */
export async function load({ data, parent }) {
	const { tree } = await parent();
	return buildNodePage(tree, data);
}
