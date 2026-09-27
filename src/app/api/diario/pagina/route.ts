import { getSession } from '@/lib/server/auth';
import { savePage } from '@/lib/server/diary';
import { isDay } from '@/lib/diary/dates';
import { DIARY_BOUNDS, MAX_PAGE_TEXT, type DiaryPage } from '@/lib/diary/page';
import { parseStickers } from '@/lib/zaino/stickers';
import { fail, guarded, json, readJson } from '@/lib/server/http';

/** The student's own page of a day: the text, the stickers, or both. Each is replaced whole. */
export async function PUT(request: Request) {
	const { supabase, user } = await getSession();
	if (!user) return fail('Accedi per continuare.', 401);
	const body = await readJson(request);
	if (!isDay(body.day)) return fail('Giorno non valido.', 400);
	const page: Partial<DiaryPage> = {};
	if (body.text !== undefined) {
		if (typeof body.text !== 'string' || body.text.length > MAX_PAGE_TEXT) return fail(`Al massimo ${MAX_PAGE_TEXT} caratteri.`, 400);
		page.text = body.text;
	}
	if (body.stickers !== undefined) {
		const stickers = parseStickers(body.stickers, DIARY_BOUNDS);
		if (typeof stickers === 'string') return fail(stickers, 400);
		page.stickers = stickers;
	}
	if (Object.keys(page).length === 0) return fail('Niente da salvare.', 400);
	const day = body.day;
	return guarded('diary page save', async () => {
		await savePage(supabase, user.id, day, page);
		return json({ ok: true });
	});
}
