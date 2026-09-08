import { getFlatNodes } from '@/lib/server/content';

/** Flat list of content nodes without lesson text, for the search overlay on pages that did not load the tree themselves. */
export async function GET() {
	return Response.json(await getFlatNodes(), { headers: { 'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=3600' } });
}
