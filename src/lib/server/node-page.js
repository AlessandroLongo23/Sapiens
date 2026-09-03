import { error, redirect } from '@sveltejs/kit';
import { getTopicContent } from '$lib/server/content';
import { resolvePublicPath, nodePath, dbPath } from '$lib/seo/slug';

/**
 * Server half of a content page, shared by the index route (levels, subjects,
 * chapters under `[...slug]`) and the lesson route (`[level]/[subject]/[chapter]/[topic]`).
 *
 * Resolves the public segments to a node, sends every non-canonical spelling
 * (database slugs, upper case, encoded characters) to the canonical URL with a
 * 301, and loads the lesson text for topic nodes only. Everything derived from
 * the tree is computed in the universal load (see $lib/seo/node-page) so it
 * is not serialized twice.
 *
 * @param {object} options
 * @param {import('$lib/utils/tree').ContentNode[]} options.tree
 * @param {string[]} options.segments public URL segments after /materiale
 * @param {string} options.requestPath the path as requested, up to and including the node segments
 * @param {URL} options.url
 * @param {'index' | 'topic'} options.expect which node types this route renders
 */
export async function loadNodePage({ tree, segments, requestPath, url, expect }) {
	const { node, ancestors, canonical } = resolvePublicPath(tree, segments);

	if (!node) {
		throw error(404, 'Pagina non trovata.');
	}
	if (expect === 'topic' && node.type !== 'topic') {
		throw error(404, 'Pagina non trovata.');
	}
	if (expect === 'index' && node.type === 'topic') {
		throw error(404, 'Pagina non trovata.');
	}

	const canonicalPath = nodePath(ancestors);
	if (!canonical || decodeURIComponent(requestPath) !== canonicalPath) {
		const suffix = url.pathname.startsWith(requestPath) ? url.pathname.slice(requestPath.length) : '';
		throw redirect(301, canonicalPath + suffix + url.search);
	}

	const content = node.type === 'topic' ? await getTopicContent(node.id) : null;

	return {
		nodeId: node.id,
		ancestorIds: ancestors.map((n) => n.id),
		dbPath: dbPath(ancestors),
		theory: content?.theory ?? null,
		formulary: content?.formulary ?? null,
		updatedAt: content?.updated_at ?? null
	};
}
