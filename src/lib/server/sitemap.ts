import 'server-only';
import { escapeHtml } from '@/lib/utils/escape';
import { getContentTree, latestUpdate } from '@/lib/server/content';
import { walkTree, type ContentNode } from '@/lib/utils/tree';
import { nodePath, subviewPath, dbPath } from '@/lib/seo/slug';
import { configs } from '@/lib/exercises/config';
import { absoluteUrl, CONTENT_ROOT, isPrivatePath, TUTORING_ROOT } from '@/lib/config/site';
import { getPublishedTutors, latestTutorUpdate } from '@/lib/server/tutoring';

export interface SitemapUrl {
	loc: string;
	lastmod?: string;
}

/** Above this many URLs the sitemap becomes an index of chunked sitemaps. */
export const SITEMAP_CHUNK = 10_000;

function descendants(node: ContentNode): ContentNode[] {
	const out: ContentNode[] = [node];
	for (const child of node.children) out.push(...descendants(child));
	return out;
}

function day(iso: string | null | undefined): string | undefined {
	return iso ? iso.slice(0, 10) : undefined;
}

/**
 * Every indexable public URL, generated from the same tree and slug utility
 * the router uses. Lessons without theory, placeholder sub-views and private
 * routes are left out on purpose.
 */
export async function buildSitemapUrls(): Promise<SitemapUrl[]> {
	const tree = await getContentTree();
	const all: ContentNode[] = [];
	walkTree(tree, (n) => all.push(n));

	const tutors = await getPublishedTutors();

	const urls: SitemapUrl[] = [
		{ loc: '/' },
		{ loc: CONTENT_ROOT, lastmod: day(latestUpdate(all)) },
		{ loc: TUTORING_ROOT, lastmod: day(latestTutorUpdate(tutors)) },
		{ loc: `${TUTORING_ROOT}/diventa-tutor` },
		{ loc: '/pricing' },
		{ loc: '/faq' },
		{ loc: '/contacts' },
		{ loc: '/terms' },
		{ loc: '/privacy' },
		{ loc: '/cookie' }
	];

	walkTree(tree, (node, ancestors) => {
		if (node.type === 'topic') {
			const lastmod = day(node.updated_at);
			if (node.has_theory) urls.push({ loc: nodePath(ancestors), lastmod });
			if (configs[dbPath(ancestors)]) urls.push({ loc: subviewPath(ancestors, 'exercises'), lastmod });
			if (node.has_formulary) urls.push({ loc: subviewPath(ancestors, 'formulary'), lastmod });
			if (node.has_flashcards) urls.push({ loc: subviewPath(ancestors, 'flashcards'), lastmod });
		} else {
			urls.push({ loc: nodePath(ancestors), lastmod: day(latestUpdate(descendants(node))) });
		}
	});

	for (const tutor of tutors) {
		urls.push({ loc: `${TUTORING_ROOT}/${tutor.slug}`, lastmod: day(tutor.updated_at) });
	}

	// Private areas (see PRIVATE_PATH_PREFIXES) never appear here, whatever gets
	// pushed above. Filtered before absoluteUrl, which takes a path.
	return urls.filter((u) => !isPrivatePath(u.loc)).map((u) => ({ ...u, loc: absoluteUrl(u.loc) }));
}

const escapeXml = escapeHtml;

export function renderUrlset(urls: SitemapUrl[]): string {
	const entries = urls
		.map((u) => `  <url>\n    <loc>${escapeXml(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}\n  </url>`)
		.join('\n');
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

export function renderSitemapIndex(chunks: number): string {
	const entries = Array.from({ length: chunks }, (_, i) => `  <sitemap>\n    <loc>${escapeXml(absoluteUrl(`/sitemap-${i + 1}.xml`))}</loc>\n  </sitemap>`).join('\n');
	return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>\n`;
}

export const XML_HEADERS = {
	'Content-Type': 'application/xml; charset=utf-8',
	'Cache-Control': 'public, max-age=600, s-maxage=600'
};
