import 'server-only';
import { cache } from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import { getContentTree, getTopicContent } from './content';
import { resolvePublicPath, nodePath, dbPath } from '@/lib/seo/slug';
import { buildNodePage, type NodePageData } from '@/lib/seo/node-page';
import { CONTENT_ROOT } from '@/lib/config/site';

/**
 * Server half of a content page, shared by the index route (levels, subjects,
 * chapters) and the lesson route. Resolves the public segments to a node,
 * sends every non-canonical spelling (database slugs, upper case, encoded
 * characters) to the canonical URL with a permanent redirect, and loads the
 * lesson text for topic nodes only.
 */
export const loadNodePage = cache(async (path: string, expect: 'index' | 'topic', suffix = ''): Promise<NodePageData> => {
	// Keyed on the joined path: `cache()` compares arguments with Object.is, so metadata and page share one lookup.
	const segments = path.split('/');
	const tree = await getContentTree();
	const { node, ancestors, canonical } = resolvePublicPath(tree, segments);

	if (!node || (expect === 'topic') !== (node.type === 'topic')) notFound();

	const canonicalPath = nodePath(ancestors);
	const requestPath = `${CONTENT_ROOT}/${segments.join('/')}`;
	if (!canonical || decodeURIComponent(requestPath) !== canonicalPath) permanentRedirect(canonicalPath + suffix);

	const content = node.type === 'topic' ? await getTopicContent(node.id) : null;
	const page = buildNodePage(tree, {
		nodeId: node.id,
		ancestorIds: ancestors.map((n) => n.id),
		dbPath: dbPath(ancestors),
		theory: content?.theory ?? null,
		formulary: content?.formulary ?? null,
		updatedAt: content?.updated_at ?? null
	});
	if (!page) notFound();
	return page;
});
