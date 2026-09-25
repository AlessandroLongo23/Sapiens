import { getSession } from '@/lib/server/auth';
import { getCoverStickers, saveCoverStickers } from '@/lib/server/zaino';
import { COVER_BOUNDS, parseStickers } from '@/lib/zaino/stickers';
import { fail, guarded, json, readJson } from '@/lib/server/http';

/** A subject's content path, as the cover_stickers table checks it. */
const PAGE = /^[a-z0-9_-]+(\/[a-z0-9_-]+){0,4}$/;
const isPage = (value: unknown): value is string => typeof value === 'string' && value.length <= 200 && PAGE.test(value);

/** The student's stickers on the cover of one subject's page: `?pagina=high_school/math`. `null` until the student changes it. */
export async function GET(request: Request) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const page = new URL(request.url).searchParams.get('pagina');
	if (!isPage(page)) return fail('Pagina non valida.', 400);
	return guarded('cover stickers read', async () => json({ stickers: await getCoverStickers(supabase, user.id, page) }));
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
