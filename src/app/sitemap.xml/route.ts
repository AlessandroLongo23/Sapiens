import { SITEMAP_CHUNK, XML_HEADERS, buildSitemapUrls, renderSitemapIndex, renderUrlset } from '@/lib/server/sitemap';

// Refreshed when a publish calls /api/revalidate.
export const revalidate = false;

/** Every indexable URL; above SITEMAP_CHUNK entries it becomes an index of chunked sitemaps. */
export async function GET() {
	const urls = await buildSitemapUrls();
	const body = urls.length > SITEMAP_CHUNK ? renderSitemapIndex(Math.ceil(urls.length / SITEMAP_CHUNK)) : renderUrlset(urls);
	return new Response(body, { headers: XML_HEADERS });
}
