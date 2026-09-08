import { SITEMAP_CHUNK, XML_HEADERS, buildSitemapUrls, renderUrlset } from '@/lib/server/sitemap';

export const revalidate = 600;

/** Chunk N of the sitemap index, only used once the site has more than SITEMAP_CHUNK URLs. */
export async function GET(_request: Request, { params }: { params: Promise<{ page: string }> }) {
	const page = Number((await params).page);
	if (!Number.isInteger(page) || page < 1) return new Response('Not found', { status: 404 });
	const chunk = (await buildSitemapUrls()).slice((page - 1) * SITEMAP_CHUNK, page * SITEMAP_CHUNK);
	if (chunk.length === 0) return new Response('Not found', { status: 404 });
	return new Response(renderUrlset(chunk), { headers: XML_HEADERS });
}
