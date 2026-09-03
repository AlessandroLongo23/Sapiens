import { getContentTree, slimTree } from '$lib/server/content';
import { countByType } from '$lib/utils/tree';

/**
 * Public content pages are rendered once and served as static HTML from
 * Vercel's edge cache, regenerated in the background every 10 minutes so
 * edits made in the admin area appear without a redeploy.
 */
export const config = {
	isr: {
		expiration: 600
	}
};

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	const tree = await getContentTree();
	return {
		tree: slimTree(tree),
		counts: countByType(tree)
	};
}
