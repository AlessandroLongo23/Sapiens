import { getSession } from '@/lib/server/auth';
import { getCoverStickers, saveCoverStickers } from '@/lib/server/zaino';
import { COVER_BOUNDS, parseStickers } from '@/lib/zaino/stickers';
import { fail, guarded, json, readJson } from '@/lib/server/http';

/** A subject's content path, as the cover_stickers table checks it. */
const PAGE = /^[a-z0-9_-]+(\/[a-z0-9_-]+){0,4}$/;
const isPage = (value: unknown): value is string => typeof value === 'string' && value.length <= 200 && PAGE.test(value);

/** Every cover the student has changed, by page path (`high_school/math`); the others still have what they come with. */
export async function GET() {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	return guarded('cover stickers read', async () => json({ covers: await getCoverStickers(supabase, user.id) }));
}

/** The stickers on one cover, replaced as a set: the page always sends all of them. */
export async function PUT(request: Request) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const body = await readJson(request);
	if (!isPage(body.pagina)) return fail('Pagina non valida.', 400);
	const stickers = parseStickers(body.stickers, COVER_BOUNDS);
	if (typeof stickers === 'string') return fail(stickers, 400);
	const page = body.pagina;
	return guarded('cover stickers save', async () => {
		await saveCoverStickers(supabase, user.id, page, stickers);
		return json({ stickers });
	});
}
